import { lazy, Suspense, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { X, Clock, ListVideo, Server, Users } from "lucide-react";
import { movieService } from "@/services/api";
import { useWatchPartyTrigger } from "@/hooks/useWatchPartyTrigger";
import { formatWatchDisplayTitle } from "@lib/movieUtils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import VideoPlayer from "@/components/VideoPlayer";
import EpisodeDrawer from "@/components/EpisodeDrawer";

const CreateRoomDialog = lazy(
    () => import("@features/watch-party/components/CreateRoomDialog")
);

const Watch = () => {
    const { slug } = useParams();
    const { t } = useTranslation();
    const navigate = useNavigate();

    const [servers, setServers] = useState([]);
    const [currentServer, setCurrentServer] = useState(0);
    const [currentChap, setCurrentChap] = useState(0);
    const [movieInfo, setMovieInfo] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [showEpisodesPanel, setShowEpisodesPanel] = useState(false);

    const {
        canWatchParty,
        createRoomOpen,
        setCreateRoomOpen,
        openWatchParty,
    } = useWatchPartyTrigger(servers);

    useEffect(() => {
        let isMounted = true;
        setIsLoading(true);
        setCurrentServer(0);
        setCurrentChap(0);
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

    const chapterList = servers[currentServer]?.server_data || [];
    const safeChapIndex = currentChap < chapterList.length ? currentChap : 0;
    const currentEpisode = chapterList[safeChapIndex];
    const srcMovie = currentEpisode?.link_m3u8 || "";
    const currentEmbed = currentEpisode?.link_embed || "";

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "Escape") {
                if (document.fullscreenElement) return;
                if (showEpisodesPanel) {
                    setShowEpisodesPanel(false);
                } else {
                    navigate(`/movies/${slug}`);
                }
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [navigate, slug, showEpisodesPanel]);

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

    const cleanContent = movieInfo?.content
        ? movieInfo.content.replace(/<[^>]*>/g, "").trim()
        : "";

    return (
        <div className="relative flex min-h-[100dvh] md:h-[100dvh] w-full flex-col md:overflow-hidden bg-[#06080f] text-white select-none">
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
                                    <Badge className="bg-primary text-white text-[11px] font-bold px-2 py-0">
                                        {movieInfo.quality}
                                    </Badge>
                                )}
                                {movieInfo?.time && (
                                    <Badge
                                        variant="secondary"
                                        className="bg-white/10 text-slate-200 border-white/10 text-[11px] gap-1"
                                    >
                                        <Clock className="h-3 w-3" />
                                        {movieInfo.time}
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
                                <button
                                    key={srv.server_name || idx}
                                    type="button"
                                    onClick={() => setCurrentServer(idx)}
                                    className={cn(
                                        "rounded-full px-3 py-1 text-xs font-medium transition-colors",
                                        currentServer === idx
                                            ? "bg-primary text-white"
                                            : "text-slate-300 hover:text-white"
                                    )}
                                >
                                    {srv.server_name || `Server ${idx + 1}`}
                                </button>
                            ))}
                        </div>
                    )}

                    {!isLoading && (
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={openWatchParty}
                            title={!canWatchParty ? t("room.hlsOnlyHint") : undefined}
                            className={cn(
                                "h-9 gap-1.5 rounded-full border-white/15 bg-white/10 text-white hover:bg-white/20 hover:text-white",
                                !canWatchParty && "opacity-60"
                            )}
                        >
                            <Users className="h-4 w-4" />
                            <span className="hidden sm:inline">{t("room.watchWithFriends")}</span>
                        </Button>
                    )}

                    {hasMultipleEpisodes && (
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => setShowEpisodesPanel((v) => !v)}
                            className="h-9 gap-1.5 rounded-full border-white/15 bg-white/10 text-white hover:bg-white/20 hover:text-white"
                        >
                            <ListVideo className="h-4 w-4" />
                            <span className="hidden sm:inline">{t("watch.episodes")}</span>
                            <Badge className="bg-primary/90 text-white px-1.5 py-0 text-[11px]">
                                {chapterList.length}
                            </Badge>
                        </Button>
                    )}

                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={handleClose}
                        aria-label={t("watch.close")}
                        title={t("watch.close")}
                        className="h-9 w-9 rounded-full bg-white/10 text-white hover:bg-primary hover:text-white transition-colors"
                    >
                        <X className="h-5 w-5" />
                    </Button>
                </div>
            </header>

            <main className="relative flex flex-1 flex-col md:min-h-0 md:items-center md:justify-center p-2.5 sm:p-4 gap-5">
                {isLoading ? (
                    <Skeleton className="aspect-video w-full max-w-6xl 2xl:max-w-[1440px] md:max-h-full rounded-xl bg-white/10" />
                ) : (
                    <VideoPlayer
                        srcMovie={srcMovie}
                        embedUrl={currentEmbed}
                        title={displayTitle}
                    />
                )}

                {!isLoading && (
                    <div className="md:hidden w-full space-y-4 px-1 pb-6">
                        <div>
                            <h2 className="text-base font-bold text-white leading-snug">
                                {displayTitle}
                            </h2>
                            <div className="mt-2 flex flex-wrap items-center gap-2">
                                {movieInfo?.quality && (
                                    <Badge className="bg-primary text-white text-[11px] font-bold px-2 py-0">
                                        {movieInfo.quality}
                                    </Badge>
                                )}
                                {movieInfo?.time && (
                                    <Badge
                                        variant="secondary"
                                        className="bg-white/10 text-slate-200 border-white/10 text-[11px] gap-1"
                                    >
                                        <Clock className="h-3 w-3" />
                                        {movieInfo.time}
                                    </Badge>
                                )}
                            </div>
                        </div>

                        {hasMultipleEpisodes && (
                            <div className="space-y-2.5 rounded-xl border border-white/10 bg-white/5 p-3.5">
                                <p className="text-xs font-bold uppercase tracking-wider text-slate-300">
                                    {t("watch.episodes")} ({chapterList.length})
                                </p>
                                <div className="grid grid-cols-4 gap-2 max-h-48 overflow-y-auto">
                                    {chapterList.map((chap, index) => {
                                        const isActive = safeChapIndex === index;
                                        return (
                                            <Button
                                                key={chap.link_m3u8 || chap.slug || index}
                                                type="button"
                                                size="sm"
                                                variant={isActive ? "default" : "outline"}
                                                className={cn(
                                                    "h-9 text-xs font-medium",
                                                    isActive
                                                        ? "bg-primary text-white"
                                                        : "border-white/15 bg-white/5 text-slate-200 hover:bg-white/15"
                                                )}
                                                onClick={() => setCurrentChap(index)}
                                            >
                                                <span className="truncate">{chap.name || index + 1}</span>
                                            </Button>
                                        );
                                    })}
                                </div>
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
                    servers={servers}
                    currentServer={currentServer}
                    chapterList={chapterList}
                    currentChap={safeChapIndex}
                    onSelectServer={setCurrentServer}
                    onSelectChapter={setCurrentChap}
                    onClose={() => setShowEpisodesPanel(false)}
                />
            </main>

            {createRoomOpen && (
                <Suspense fallback={null}>
                    <CreateRoomDialog
                        open={createRoomOpen}
                        onOpenChange={setCreateRoomOpen}
                        movie={movieInfo}
                        episodes={servers}
                        initialServer={currentServer}
                        initialChapter={safeChapIndex}
                    />
                </Suspense>
            )}
        </div>
    );
};

export default Watch;
