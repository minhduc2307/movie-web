import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { AlertTriangle, Film, Home, Users } from "lucide-react";
import i18n from "@/i18n";
import { useAuth } from "@context/AuthProvider";
import { movieService } from "@/services/api";
import { formatWatchDisplayTitle } from "@lib/movieUtils";
import {
    cleanupStaleHostRooms,
    closeRoom,
    leaveOrCleanupRoom,
    switchRoomMedia,
} from "@/services/firebase/roomService";
import VideoPlayer from "@/components/VideoPlayer";
import Spinner from "@/components/Spinner";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
    InviteDialog,
    JoinOverlay,
    RoomHeader,
    RoomSidebar,
    usePlaybackSync,
    useRoom,
    useRoomChat,
    useRoomSlot,
} from "@features/watch-party";

const RoomStatusCard = ({ icon: Icon, title, description, movieSlug, onGoHome }) => {
    const { t } = useTranslation();

    return (
        <div className="flex min-h-[100dvh] items-center justify-center bg-[#06080f] px-4 text-white">
            <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#0d1220] p-6 text-center shadow-2xl space-y-4">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/15 text-primary">
                    <Icon className="h-7 w-7" />
                </div>
                <div className="space-y-1.5">
                    <h1 className="text-xl font-bold">{title}</h1>
                    <p className="text-sm text-slate-300">{description}</p>
                </div>
                <div className="flex flex-col sm:flex-row justify-center gap-2.5 pt-2">
                    {movieSlug && (
                        <Button asChild className="gap-2 bg-primary text-white hover:bg-primary/90">
                            <Link to={`/watch/${movieSlug}`}>
                                <Film className="h-4 w-4" />
                                <span>{t("room.watchSolo")}</span>
                            </Link>
                        </Button>
                    )}
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onGoHome}
                        className="gap-2 border-white/15 bg-white/5 text-white hover:bg-white/15"
                    >
                        <Home className="h-4 w-4" />
                        <span>{t("common.backHome")}</span>
                    </Button>
                </div>
            </div>
        </div>
    );
};

const RoomPage = () => {
    const { roomId } = useParams();
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { user } = useAuth();

    const videoRef = useRef(null);
    const [movieInfo, setMovieInfo] = useState(null);
    const [servers, setServers] = useState([]);
    const [isLoadingMovie, setIsLoadingMovie] = useState(true);
    const [isJoined, setIsJoined] = useState(false);
    const [inviteOpen, setInviteOpen] = useState(false);
    const [activeTab, setActiveTab] = useState("chat");

    useEffect(() => {
        setMovieInfo(null);
        setServers([]);
        setIsLoadingMovie(true);
        setIsJoined(false);
        setInviteOpen(false);
        setActiveTab("chat");
    }, [roomId]);

    const {
        meta,
        media,
        playback,
        slots,
        memberSlots,
        memberCount,
        roomStatus,
        isConnected,
        serverOffsetRef,
    } = useRoom(roomId);

    const { slotStatus, isMember, releaseSlot, cancelDisconnectOnly } = useRoomSlot({
        roomId,
        user,
        roomStatus,
        slots,
        isConnected,
    });

    const movieSlug = meta?.movieSlug || "";

    useEffect(() => {
        if (!movieSlug) return;
        let active = true;
        setIsLoadingMovie(true);

        movieService
            .getMovieDetail(movieSlug)
            .then((data) => {
                if (!active) return;
                const movie = data?.movie || null;
                setMovieInfo(movie);
                setServers(data?.episodes || []);
                if (movie?.name) {
                    document.title = `${movie.name} — ${i18n.t("room.defaultTitle")}`;
                }
            })
            .catch(() => {
                if (active) {
                    toast.error(i18n.t("detail.notFound"), { id: "room-movie-err" });
                }
            })
            .finally(() => {
                if (active) setIsLoadingMovie(false);
            });

        return () => {
            active = false;
        };
    }, [movieSlug]);

    const currentServerIdx = Number(media?.serverIdx) || 0;
    const chapterList = servers[currentServerIdx]?.server_data || [];
    const rawEpisodeIdx = Number(media?.episodeIndex) || 0;
    const safeChapIdx = rawEpisodeIdx < chapterList.length ? rawEpisodeIdx : 0;
    const currentEpisode = chapterList[safeChapIdx];
    const srcMovie = currentEpisode?.link_m3u8 || "";

    const {
        clientId,
        applyRemotePlayback,
        handleStreamReady,
        handleStreamError,
        handleUserPlay,
        handleUserPause,
        handleUserSeek,
        handleNativePlay,
        handleNativePause,
        handleNativeSeeked,
    } = usePlaybackSync({
        roomId,
        user,
        videoRef,
        playback,
        media,
        srcMovie,
        serverOffsetRef,
        isMember,
        isJoined,
    });

    const { messages, unreadCount, isSending, sendMessage } = useRoomChat({
        roomId,
        user,
        isMember,
        isActiveTab: activeTab === "chat",
        enabled: roomStatus === "active" && slotStatus !== "full",
    });

    const isHost = Boolean(user?.uid && meta?.hostUid === user.uid);

    useEffect(() => {
        if (!isHost || roomStatus !== "active" || !user?.uid) return;
        void cleanupStaleHostRooms(user.uid, { excludeRoomId: roomId });
    }, [isHost, roomStatus, user?.uid, roomId]);

    const displayTitle = formatWatchDisplayTitle({
        movieName: meta?.movieName || movieInfo?.name || "",
        currentEpisode,
        episodeIndex: safeChapIdx,
        totalChapters: chapterList.length,
        episodePrefix: t("watch.episodePrefix"),
    });

    const handleJoinRoom = useCallback(() => {
        setIsJoined(true);
        if (playback) {
            applyRemotePlayback(playback, { force: true });
        }
    }, [playback, applyRemotePlayback]);

    const handleSelectEpisode = useCallback(
        async (serverIdx, episodeIndex) => {
            if (!isMember || !user) return;
            try {
                await switchRoomMedia({
                    roomId,
                    serverIdx,
                    episodeIndex,
                    user,
                    clientId,
                });
            } catch {
                toast.error(t("room.switchEpisodeError"), { id: "room-ep-err" });
            }
        },
        [isMember, user, roomId, clientId, t]
    );

    const handleLeaveRoom = useCallback(async () => {
        await leaveOrCleanupRoom({
            roomId,
            user,
            slots,
            releaseSlot,
            cancelDisconnectOnly,
        });
        navigate(movieSlug ? `/movies/${movieSlug}` : "/", { replace: true });
    }, [roomId, user, slots, releaseSlot, cancelDisconnectOnly, navigate, movieSlug]);

    const handleCloseRoom = useCallback(async () => {
        try {
            await closeRoom(roomId);
            await cancelDisconnectOnly();
            toast.info(t("room.roomClosedToast"), { id: "room-closed" });
            navigate(movieSlug ? `/movies/${movieSlug}` : "/", { replace: true });
        } catch {
            toast.error(t("room.closeError"), { id: "room-close-err" });
        }
    }, [cancelDisconnectOnly, roomId, movieSlug, navigate, t]);

    if (roomStatus === "loading") {
        return <Spinner fullScreen />;
    }

    if (roomStatus === "not_found") {
        return (
            <RoomStatusCard
                icon={AlertTriangle}
                title={t("room.notFoundTitle")}
                description={t("room.notFoundDesc")}
                onGoHome={() => navigate("/")}
            />
        );
    }

    if (roomStatus === "closed") {
        return (
            <RoomStatusCard
                icon={AlertTriangle}
                title={t("room.closedTitle")}
                description={t("room.closedDesc")}
                movieSlug={movieSlug}
                onGoHome={() => navigate("/")}
            />
        );
    }

    if (roomStatus === "error" || slotStatus === "error") {
        return (
            <RoomStatusCard
                icon={AlertTriangle}
                title={t("room.errorTitle")}
                description={t("room.errorDesc")}
                movieSlug={movieSlug}
                onGoHome={() => navigate("/")}
            />
        );
    }

    if (slotStatus === "full") {
        return (
            <RoomStatusCard
                icon={Users}
                title={t("room.fullTitle")}
                description={t("room.fullDesc")}
                movieSlug={movieSlug}
                onGoHome={() => navigate("/")}
            />
        );
    }

    return (
        <div className="flex h-[100dvh] w-full flex-col overflow-hidden bg-[#06080f] text-white">
            <RoomHeader
                title={displayTitle}
                memberCount={memberCount}
                isHost={isHost}
                isConnected={isConnected}
                playback={playback}
                onOpenInvite={() => setInviteOpen(true)}
                onLeaveRoom={handleLeaveRoom}
                onCloseRoom={handleCloseRoom}
            />

            <div className="flex flex-1 min-h-0 flex-col lg:grid lg:grid-cols-[1fr_360px] xl:grid-cols-[1fr_400px]">
                <main className="relative flex shrink-0 items-center justify-center bg-black p-2 sm:p-3 lg:min-h-0 lg:p-5">
                    {isLoadingMovie ? (
                        <Skeleton className="aspect-video w-full max-w-[min(100%,calc((100dvh-6rem)*16/9))] rounded-xl bg-white/10" />
                    ) : (
                        <div className="relative w-full max-w-[min(100%,calc((100dvh-6rem)*16/9))]">
                            <VideoPlayer
                                ref={videoRef}
                                srcMovie={srcMovie}
                                title={displayTitle}
                                autoPlay={false}
                                controls={isJoined}
                                startWithControls={isJoined}
                                allowSpeedControl={false}
                                onStreamReady={handleStreamReady}
                                onStreamError={handleStreamError}
                                onUserPlay={handleUserPlay}
                                onUserPause={handleUserPause}
                                onUserSeek={handleUserSeek}
                                onPlay={handleNativePlay}
                                onPause={handleNativePause}
                                onSeeked={handleNativeSeeked}
                            />

                            {!isJoined && isMember && (
                                <JoinOverlay
                                    movieTitle={displayTitle}
                                    memberCount={memberCount}
                                    onJoin={handleJoinRoom}
                                />
                            )}
                        </div>
                    )}
                </main>

                <div className="flex-1 min-h-0 lg:h-full">
                    <RoomSidebar
                        activeTab={activeTab}
                        onTabChange={setActiveTab}
                        messages={messages}
                        unreadCount={unreadCount}
                        isSending={isSending}
                        onSendMessage={sendMessage}
                        memberSlots={memberSlots}
                        memberCount={memberCount}
                        hostUid={meta?.hostUid}
                        currentUid={user?.uid}
                        isMember={isMember}
                        servers={servers}
                        currentServer={currentServerIdx}
                        currentEpisode={safeChapIdx}
                        onSelectEpisode={handleSelectEpisode}
                    />
                </div>
            </div>

            <InviteDialog
                open={inviteOpen}
                onOpenChange={setInviteOpen}
                roomId={roomId}
                memberCount={memberCount}
            />
        </div>
    );
};

export default RoomPage;
