import { lazy, Suspense, useCallback, useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { X, Clock, ListVideo, Server, Users } from "lucide-react";
import { movieService } from "@/services/api";
import { useWatchPartyTrigger } from "@/hooks/useWatchPartyTrigger";
import { formatWatchDisplayTitle, localizeMovieMetaText } from "@lib/movieUtils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { AppTooltip } from "@/components/common";
import { cn } from "@/lib/utils";
import VideoPlayer from "@/components/VideoPlayer";
import EpisodeDrawer from "@/components/EpisodeDrawer";

const CreateRoomDialog = lazy(
    () => import("@features/watch-party/components/CreateRoomDialog")
);

const Watch = () => {
    const { slug } = useParams();
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();

    const currentServer = Math.max(0, (Number(searchParams.get("srv")) || 1) - 1);
    const currentChap = Math.max(0, (Number(searchParams.get("ep")) || 1) - 1);

    const [servers, setServers] = useState([]);
    const [movieInfo, setMovieInfo] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [showEpisodesPanel, setShowEpisodesPanel] = useState(false);

    const updatePlaybackTarget = useCallback(
        (srvIdx, chapIdx) => {
            const next = new URLSearchParams(searchParams);
            if (srvIdx > 0) next.set("srv", String(srvIdx + 1));
            else next.delete("srv");
            if (chapIdx > 0) next.set("ep", String(chapIdx + 1));
            else next.delete("ep");
            setSearchParams(next, { replace: true });
        },
        [searchParams, setSearchParams]
    );

    const setCurrentServer = useCallback(
        (idx) => updatePlaybackTarget(idx, 0),
        [updatePlaybackTarget]
    );

    const setCurrentChap = useCallback(
        (idx) => updatePlaybackTarget(currentServer, idx),
        [updatePlaybackTarget, currentServer]
    );

    const {
        canWatchParty,
        createRoomOpen,
        setCreateRoomOpen,
        openWatchParty,
    } = useWatchPartyTrigger(servers);

    useEffect(() => {
        let isMounted = true;
        setIsLoading(true);
        setServers([]);
        setMovieInfo({});

        movieService
            .getMovieDetail(slug)
            .then((data) => {
                if (!isMounted) return;
                const movie = data?.movie || {};
                document.title = movie.name || "Watch";
                setMovieInfo(movie);
                setServers(data?.episodes || []);
            })
            .catch((err) => console.error("Error loading movie:", err))
            .finally(() => {
                if (isMounted) setIsLoading(false);
            });

        return () => {
            isMounted = false;
        };
    }, [slug]);

    const safeServerIndex = currentServer < servers.length ? currentServer : 0;
    const chapterList = servers[safeServerIndex]?.server_data || [];
    const safeChapIndex = currentChap < chapterList.length ? currentChap : 0;
    const currentEpisode = chapterList[safeChapIndex];
    const srcMovie = currentEpisode?.link_m3u8 || "";
    const currentEmbed = currentEpisode?.link_embed || "";

    useEffect(() => {
        const eventsWithOpenOverlay = new WeakSet();

        const handleCaptureKeyDown = (e) => {
            if (e.key !== "Escape") return;
            const hasDomOverlay = Boolean(
                document.querySelector(
                    '[data-radix-popper-content-wrapper], [role="dialog"][data-state="open"], [role="menu"][data-state="open"]'
                )
            );
            if (hasDomOverlay || showEpisodesPanel || createRoomOpen) {
                eventsWithOpenOverlay.add(e);
            }
        };

        const handleKeyDown = (e) => {
            if (e.key === "Escape") {
                if (document.fullscreenElement || e.defaultPrevented || eventsWithOpenOverlay.has(e)) {
                    return;
                }
                if (showEpisodesPanel) {
                    setShowEpisodesPanel(false);
                } else {
                    navigate(`/movies/${slug}`);
                }
            }
        };

        window.addEventListener("keydown", handleCaptureKeyDown, true);
        window.addEventListener("keydown", handleKeyDown);
        return () => {
            window.removeEventListener("keydown", handleCaptureKeyDown, true);
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [navigate, slug, showEpisodesPanel, createRoomOpen]);

    const handleClose = () => {
        if (window.history.length > 1) {
            navigate(-1);
        } else {
            navigate(`/movies/${slug}`);
        }
    };

    const hasMultipleEpisodes = chapterList.length > 1;
    const displayTitle = formatWatchDisplayTitle({
        movieName: movieInfo?.name || "",
        currentEpisode,
        episodeIndex: safeChapIndex,
        totalChapters: chapterList.length,
        episodePrefix: t("watch.episodePrefix"),
    });

    useEffect(() => {
        if (displayTitle) {
            document.title = `${displayTitle} — ${t("brand.name")}`;
        }
    }, [displayTitle, t]);

    const cleanContent = movieInfo?.content
        ? movieInfo.content.replace(/<[^>]*>/g, "").trim()
        : "";
    const formattedDuration = localizeMovieMetaText(movieInfo?.time, i18n.language);

    return (
        <div className="relative flex min-h-[100dvh] lg:h-[100dvh] w-full flex-col lg:overflow-hidden bg-[#06080f] text-white select-none">
            <header className="z-20 flex h-14 shrink-0 items-center justify-between gap-3 border-b border-white/10 bg-black/75 px-4 backdrop-blur-md sm:px-6">
                <div className="flex min-w-0 items-center gap-3">
                    {isLoading ? (
                        <Skeleton className="h-6 w-52 bg-white/10" />
                    ) : (
                        <>
                            <h1 className="truncate text-sm font-bold tracking-tight text-white sm:text-base lg:text-lg">
                                {displayTitle}
                            </h1>
                            <div className="hidden sm:flex items-center gap-1.5 shrink-0">
                                {movieInfo?.quality && (
                                    <Badge className="bg-primary text-primary-foreground text-[11px] font-bold px-2 py-0">
                                        {movieInfo.quality}
                                    </Badge>
                                )}
                                {formattedDuration && (
                                    <Badge
                                        variant="secondary"
                                        className="bg-white/10 text-slate-200 border-white/10 text-[11px] gap-1"
                                    >
                                        <Clock className="h-3 w-3" />
                                        {formattedDuration}
                                    </Badge>
                                )}
                            </div>
                        </>
                    )}
                </div>

                <div className="flex items-center gap-2 shrink-0">
                    {servers.length > 1 && (
                        <div className="hidden md:flex items-center gap-1 rounded-full bg-white/10 p-1">
                            <Server className="h-3.5 w-3.5 text-slate-300 ml-2 mr-1" />
                            {servers.map((srv, idx) => (
                                <Button
                                    key={srv.server_name || idx}
                                    type="button"
                                    size="sm"
                                    variant={safeServerIndex === idx ? "default" : "ghost"}
                                    onClick={() => setCurrentServer(idx)}
                                    className={cn(
                                        "h-7 rounded-full px-3 text-xs font-medium",
                                        safeServerIndex === idx
                                            ? "bg-primary text-primary-foreground"
                                            : "text-slate-300 hover:bg-white/10 hover:text-white"
                                    )}
                                >
                                    {srv.server_name || `Server ${idx + 1}`}
                                </Button>
                            ))}
                        </div>
                    )}

                    {!isLoading && (
                        <AppTooltip label={!canWatchParty ? t("room.hlsOnlyHint") : t("room.watchWithFriends")}>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={openWatchParty}
                                aria-label={t("room.watchWithFriends")}
                                className={cn(
                                    "h-10 min-w-[40px] sm:h-9 gap-1.5 rounded-full border-white/15 bg-white/10 text-white hover:bg-white/20 hover:text-white",
                                    !canWatchParty && "opacity-60"
                                )}
                            >
                                <Users className="h-4 w-4" />
                                <span className="hidden sm:inline">{t("room.watchWithFriends")}</span>
                            </Button>
                        </AppTooltip>
                    )}

                    {hasMultipleEpisodes && (
                        <AppTooltip label={t("watch.episodes")}>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => setShowEpisodesPanel((v) => !v)}
                                aria-label={`${t("watch.episodes")} (${chapterList.length})`}
                                className="hidden lg:inline-flex h-9 gap-1.5 rounded-full border-white/15 bg-white/10 text-white hover:bg-white/20 hover:text-white"
                            >
                                <ListVideo className="h-4 w-4" />
                                <span>{t("watch.episodes")}</span>
                                <Badge className="bg-primary text-primary-foreground px-1.5 py-0 text-[11px]">
                                    {chapterList.length}
                                </Badge>
                            </Button>
                        </AppTooltip>
                    )}

                    <AppTooltip label={t("watch.close")}>
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={handleClose}
                            aria-label={t("watch.close")}
                            className="h-10 w-10 sm:h-9 sm:w-9 rounded-full bg-white/10 text-white hover:bg-primary hover:text-white transition-colors"
                        >
                            <X className="h-5 w-5" />
                        </Button>
                    </AppTooltip>
                </div>
            </header>

            <main className="relative flex flex-1 flex-col lg:min-h-0 lg:items-center lg:justify-center p-2.5 sm:p-4 gap-5">
                {isLoading ? (
                    <Skeleton className="aspect-video w-full max-w-[min(100%,calc((100dvh-6rem)*16/9))] lg:max-h-full rounded-xl bg-white/10" />
                ) : (
                    <VideoPlayer
                        srcMovie={srcMovie}
                        embedUrl={currentEmbed}
                        title={displayTitle}
                    />
                )}

                {!isLoading && (
                    <div className="lg:hidden w-full space-y-4 px-1 pb-6">
                        <div className="sm:hidden">
                            <h2 className="text-base font-bold text-white leading-snug">
                                {displayTitle}
                            </h2>
                            <div className="mt-2 flex flex-wrap items-center gap-2">
                                {movieInfo?.quality && (
                                    <Badge className="bg-primary text-primary-foreground text-[11px] font-bold px-2 py-0">
                                        {movieInfo.quality}
                                    </Badge>
                                )}
                                {formattedDuration && (
                                    <Badge
                                        variant="secondary"
                                        className="bg-white/10 text-slate-200 border-white/10 text-[11px] gap-1"
                                    >
                                        <Clock className="h-3 w-3" />
                                        {formattedDuration}
                                    </Badge>
                                )}
                            </div>
                        </div>

                        {servers.length > 1 && (
                            <div className="flex flex-wrap gap-1.5">
                                {servers.map((srv, idx) => (
                                    <Button
                                        key={srv.server_name || idx}
                                        type="button"
                                        size="sm"
                                        variant={safeServerIndex === idx ? "default" : "outline"}
                                        onClick={() => setCurrentServer(idx)}
                                        className={cn(
                                            "h-9 text-xs",
                                            safeServerIndex !== idx &&
                                                "border-white/15 bg-white/5 text-slate-200 hover:bg-white/15 hover:text-white"
                                        )}
                                    >
                                        {srv.server_name || `Server ${idx + 1}`}
                                    </Button>
                                ))}
                            </div>
                        )}

                        {hasMultipleEpisodes && (
                            <div className="space-y-2.5 rounded-xl border border-white/10 bg-white/5 p-3.5 sm:p-4">
                                <p className="text-xs font-bold uppercase tracking-wider text-slate-300">
                                    {t("watch.episodes")} ({chapterList.length})
                                </p>
                                <ScrollArea
                                    type="always"
                                    className="max-h-60 sm:max-h-72 pr-3"
                                    viewportClassName="pr-1"
                                    scrollbarClassName="[&>div]:bg-white/35 hover:[&>div]:bg-white/55"
                                >
                                    <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                                        {chapterList.map((chap, index) => {
                                            const isActive = safeChapIndex === index;
                                            return (
                                                <Button
                                                    key={chap.link_m3u8 || chap.slug || index}
                                                    type="button"
                                                    size="sm"
                                                    variant={isActive ? "default" : "outline"}
                                                    className={cn(
                                                        "h-11 sm:h-10 text-xs font-medium",
                                                        isActive
                                                            ? "bg-primary text-primary-foreground"
                                                            : "border-white/15 bg-white/5 text-slate-200 hover:bg-white/15"
                                                    )}
                                                    onClick={() => setCurrentChap(index)}
                                                >
                                                    <span className="truncate">{chap.name || index + 1}</span>
                                                </Button>
                                            );
                                        })}
                                    </div>
                                </ScrollArea>
                            </div>
                        )}

                        {cleanContent && (
                            <p className="text-sm leading-relaxed text-slate-300 line-clamp-5">
                                {cleanContent}
                            </p>
                        )}
                    </div>
                )}

                <EpisodeDrawer
                    open={showEpisodesPanel}
                    onOpenChange={setShowEpisodesPanel}
                    servers={servers}
                    currentServer={safeServerIndex}
                    chapterList={chapterList}
                    currentChap={safeChapIndex}
                    onSelectServer={setCurrentServer}
                    onSelectChapter={setCurrentChap}
                />
            </main>

            {createRoomOpen && (
                <Suspense fallback={null}>
                    <CreateRoomDialog
                        open={createRoomOpen}
                        onOpenChange={setCreateRoomOpen}
                        movie={movieInfo}
                        episodes={servers}
                        initialServer={safeServerIndex}
                        initialChapter={safeChapIndex}
                    />
                </Suspense>
            )}
        </div>
    );
};

export default Watch;
