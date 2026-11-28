import { lazy, Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import {
    X,
    Clock,
    ListVideo,
    Server,
    Users,
    Keyboard,
    Maximize2,
    Minimize2,
    SkipForward,
    RefreshCw,
} from "lucide-react";
import { movieService } from "@/services/api";
import { queryKeys } from "@/lib/queryClient";
import { useWatchHistory } from "@context/WatchHistoryProvider";
import { useWatchPartyTrigger } from "@/hooks/useWatchPartyTrigger";
import { formatWatchDisplayTitle, localizeMovieMetaText, stripHtml } from "@lib/movieUtils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { AppTooltip } from "@/components/common";
import { cn } from "@/lib/utils";
import VideoPlayer from "@/components/VideoPlayer";
import EpisodeDrawer from "@/components/EpisodeDrawer";

const CreateRoomDialog = lazy(
    () => import("@features/watch-party/components/CreateRoomDialog")
);

const PROGRESS_SAVE_INTERVAL_MS = 12000;
const AUTO_NEXT_SECONDS = 5;

const Watch = () => {
    const { slug } = useParams();
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const { getMovieProgress, saveProgress } = useWatchHistory();

    const currentServer = Math.max(0, (Number(searchParams.get("srv")) || 1) - 1);
    const currentChap = Math.max(0, (Number(searchParams.get("ep")) || 1) - 1);

    const [showEpisodesPanel, setShowEpisodesPanel] = useState(false);
    const [cinemaMode, setCinemaMode] = useState(false);
    const [shortcutsOpen, setShortcutsOpen] = useState(false);
    const [autoNextCountdown, setAutoNextCountdown] = useState(null);

    const videoRef = useRef(null);
    const lastSavedAtRef = useRef(0);
    const resumedTargetKeyRef = useRef("");
    const latestSnapshotRef = useRef({ currentTime: 0, duration: 0 });

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
        (idx) => {
            setAutoNextCountdown(null);
            updatePlaybackTarget(idx, 0);
        },
        [updatePlaybackTarget]
    );

    const setCurrentChap = useCallback(
        (idx) => {
            setAutoNextCountdown(null);
            updatePlaybackTarget(currentServer, idx);
        },
        [updatePlaybackTarget, currentServer]
    );

    const { data, isLoading, isError, refetch } = useQuery({
        queryKey: queryKeys.detail(slug),
        queryFn: () => movieService.getMovieDetail(slug),
        enabled: Boolean(slug),
    });

    const movieInfo = useMemo(() => data?.movie || null, [data?.movie]);
    const servers = useMemo(() => data?.episodes || [], [data?.episodes]);

    const {
        canWatchParty,
        createRoomOpen,
        setCreateRoomOpen,
        openWatchParty,
    } = useWatchPartyTrigger(servers);

    const safeServerIndex = currentServer < servers.length ? currentServer : 0;
    const chapterList = servers[safeServerIndex]?.server_data || [];
    const safeChapIndex = currentChap < chapterList.length ? currentChap : 0;
    const currentEpisode = chapterList[safeChapIndex];
    const srcMovie = currentEpisode?.link_m3u8 || "";
    const currentEmbed = currentEpisode?.link_embed || "";
    const hasNextEpisode = safeChapIndex + 1 < chapterList.length;
    const nextEpisode = hasNextEpisode ? chapterList[safeChapIndex + 1] : null;

    const persistCurrentProgress = useCallback(
        (force = false) => {
            if (!movieInfo?.slug || !srcMovie) return;
            const video = videoRef.current;
            if (video) {
                latestSnapshotRef.current = {
                    currentTime: Number(video.currentTime) || 0,
                    duration: Number.isFinite(video.duration) ? video.duration : 0,
                };
            }
            const { currentTime, duration } = latestSnapshotRef.current;
            if (currentTime < 5) return;

            const now = Date.now();
            if (!force && now - lastSavedAtRef.current < PROGRESS_SAVE_INTERVAL_MS) {
                return;
            }
            lastSavedAtRef.current = now;

            const epLabel =
                chapterList.length > 1
                    ? currentEpisode?.name?.trim() || `${t("watch.episodePrefix")} ${safeChapIndex + 1}`
                    : "";

            void saveProgress({
                movie: movieInfo,
                serverIdx: safeServerIndex,
                episodeIndex: safeChapIndex,
                episodeName: epLabel,
                currentTime,
                duration,
            });
        },
        [
            movieInfo,
            srcMovie,
            chapterList.length,
            currentEpisode?.name,
            t,
            safeServerIndex,
            safeChapIndex,
            saveProgress,
        ]
    );

    const handleStreamReady = useCallback(() => {
        const video = videoRef.current;
        if (!video || !movieInfo?.slug) return;
        const targetKey = `${movieInfo.slug}:${safeServerIndex}:${safeChapIndex}`;
        if (resumedTargetKeyRef.current === targetKey) return;
        resumedTargetKeyRef.current = targetKey;

        const saved = getMovieProgress(movieInfo);
        if (
            saved &&
            saved.serverIdx === safeServerIndex &&
            saved.episodeIndex === safeChapIndex &&
            saved.currentTime > 10
        ) {
            const dur = Number.isFinite(video.duration) && video.duration > 0 ? video.duration : saved.duration;
            const isNearEnd = dur > 0 && saved.currentTime >= dur * 0.95;
            if (!isNearEnd) {
                video.currentTime = saved.currentTime;
            }
        }
    }, [movieInfo, safeServerIndex, safeChapIndex, getMovieProgress]);

    const goToNextEpisode = useCallback(() => {
        if (!hasNextEpisode) return;
        setAutoNextCountdown(null);
        updatePlaybackTarget(safeServerIndex, safeChapIndex + 1);
    }, [hasNextEpisode, updatePlaybackTarget, safeServerIndex, safeChapIndex]);

    useEffect(() => {
        setAutoNextCountdown(null);
    }, [slug, safeServerIndex, safeChapIndex]);

    useEffect(() => {
        if (autoNextCountdown === null) return;
        if (autoNextCountdown <= 0) {
            goToNextEpisode();
            return;
        }
        const timer = setTimeout(() => {
            setAutoNextCountdown((prev) => (prev === null ? null : prev - 1));
        }, 1000);
        return () => clearTimeout(timer);
    }, [autoNextCountdown, goToNextEpisode]);

    useEffect(() => {
        const handlePageHide = () => persistCurrentProgress(true);
        window.addEventListener("pagehide", handlePageHide);
        return () => {
            persistCurrentProgress(true);
            window.removeEventListener("pagehide", handlePageHide);
        };
    }, [persistCurrentProgress]);

    useEffect(() => {
        const eventsWithOpenOverlay = new WeakSet();

        const handleCaptureKeyDown = (e) => {
            if (e.key !== "Escape") return;
            const hasDomOverlay = Boolean(
                document.querySelector(
                    '[data-radix-popper-content-wrapper], [role="dialog"][data-state="open"], [role="menu"][data-state="open"]'
                )
            );
            if (hasDomOverlay || showEpisodesPanel || createRoomOpen || shortcutsOpen) {
                eventsWithOpenOverlay.add(e);
            }
        };

        const handleKeyDown = (e) => {
            const tag = e.target?.tagName;
            if (e.key === "?" && tag !== "INPUT" && tag !== "TEXTAREA") {
                e.preventDefault();
                setShortcutsOpen((v) => !v);
                return;
            }
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
    }, [navigate, slug, showEpisodesPanel, createRoomOpen, shortcutsOpen]);

    const handleClose = () => {
        persistCurrentProgress(true);
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

    const cleanContent = stripHtml(movieInfo?.content);
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

                    <AppTooltip label={t("watch.cinemaMode")}>
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => setCinemaMode((v) => !v)}
                            aria-label={t("watch.cinemaMode")}
                            className={cn(
                                "hidden lg:inline-flex h-9 w-9 rounded-full text-white hover:bg-white/15",
                                cinemaMode ? "bg-primary/25 text-primary" : "bg-white/10"
                            )}
                        >
                            {cinemaMode ? (
                                <Minimize2 className="h-4 w-4" />
                            ) : (
                                <Maximize2 className="h-4 w-4" />
                            )}
                        </Button>
                    </AppTooltip>

                    <AppTooltip label={t("watch.shortcutsTitle")}>
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => setShortcutsOpen(true)}
                            aria-label={t("watch.shortcutsTitle")}
                            className="hidden sm:inline-flex h-9 w-9 rounded-full bg-white/10 text-white hover:bg-white/15"
                        >
                            <Keyboard className="h-4 w-4" />
                        </Button>
                    </AppTooltip>

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

            <main
                className={cn(
                    "relative flex flex-1 flex-col lg:min-h-0 lg:items-center lg:justify-center gap-5 transition-all",
                    cinemaMode ? "bg-black p-0 sm:p-1" : "p-2.5 sm:p-4"
                )}
            >
                {isLoading ? (
                    <Skeleton className="aspect-video w-full max-w-[min(100%,calc((100dvh-6rem)*16/9))] lg:max-h-full rounded-xl bg-white/10" />
                ) : isError ? (
                    <div className="flex aspect-video w-full max-w-3xl flex-col items-center justify-center gap-3 rounded-xl border border-white/10 bg-black/80 p-6 text-center">
                        <p className="text-sm text-slate-200">{t("common.loadSectionError")}</p>
                        <Button type="button" size="sm" onClick={() => refetch()} className="gap-2">
                            <RefreshCw className="h-4 w-4" />
                            <span>{t("watch.player.retry")}</span>
                        </Button>
                    </div>
                ) : (
                    <div className="relative flex w-full items-center justify-center lg:h-full">
                        <VideoPlayer
                            ref={videoRef}
                            srcMovie={srcMovie}
                            embedUrl={currentEmbed}
                            title={displayTitle}
                            posterUrl={movieInfo?.posterUrl || movieInfo?.poster_url}
                            className={cn(
                                cinemaMode && "lg:max-w-[min(100%,calc((100dvh-4rem)*16/9))] lg:rounded-none"
                            )}
                            onStreamReady={handleStreamReady}
                            onTimeUpdate={() => persistCurrentProgress(false)}
                            onPause={() => persistCurrentProgress(true)}
                            onNextEpisode={hasNextEpisode ? goToNextEpisode : undefined}
                            onEnded={() => {
                                persistCurrentProgress(true);
                                if (hasNextEpisode) {
                                    setAutoNextCountdown(AUTO_NEXT_SECONDS);
                                }
                            }}
                        />

                        {autoNextCountdown !== null && nextEpisode && (
                            <div className="absolute bottom-20 right-4 z-30 w-72 rounded-xl border border-white/15 bg-[#0d1220]/95 p-4 text-white shadow-2xl backdrop-blur-md">
                                <p className="text-xs font-semibold uppercase tracking-wider text-primary">
                                    {t("watch.autoNextTitle", { seconds: autoNextCountdown })}
                                </p>
                                <p className="mt-1 truncate text-sm font-bold">
                                    {nextEpisode.name || `${t("watch.episodePrefix")} ${safeChapIndex + 2}`}
                                </p>
                                <div className="mt-3 flex items-center gap-2">
                                    <Button
                                        type="button"
                                        size="sm"
                                        onClick={goToNextEpisode}
                                        className="flex-1 gap-1.5 bg-primary text-white hover:bg-primary/90"
                                    >
                                        <SkipForward className="h-3.5 w-3.5" />
                                        <span>{t("watch.playNextNow")}</span>
                                    </Button>
                                    <Button
                                        type="button"
                                        size="sm"
                                        variant="outline"
                                        onClick={() => setAutoNextCountdown(null)}
                                        className="border-white/20 bg-white/5 text-white hover:bg-white/15"
                                    >
                                        {t("room.cancel")}
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
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

            <Dialog open={shortcutsOpen} onOpenChange={setShortcutsOpen}>
                <DialogContent className="max-w-md border-border bg-card text-foreground">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Keyboard className="h-5 w-5 text-primary dark:text-rose-400" />
                            <span>{t("watch.shortcutsTitle")}</span>
                        </DialogTitle>
                        <DialogDescription>{t("watch.shortcutsDesc")}</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-2 text-sm">
                        {[
                            ["Space / K", t("watch.shortcutPlayPause")],
                            ["J / ← · L / →", t("watch.shortcutSeek")],
                            ["↑ / ↓", t("watch.shortcutVolume")],
                            ["M", t("watch.shortcutMute")],
                            ["F", t("watch.shortcutFullscreen")],
                            ["P", t("watch.shortcutPip")],
                            ["0 – 9", t("watch.shortcutPercent")],
                        ].map(([keyLabel, actionLabel]) => (
                            <div
                                key={keyLabel}
                                className="flex items-center justify-between rounded-lg border border-border/60 bg-muted/30 px-3 py-2"
                            >
                                <span className="text-muted-foreground">{actionLabel}</span>
                                <kbd className="rounded bg-background px-2 py-0.5 font-mono text-xs font-semibold text-foreground shadow-sm border border-border">
                                    {keyLabel}
                                </kbd>
                            </div>
                        ))}
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default Watch;
