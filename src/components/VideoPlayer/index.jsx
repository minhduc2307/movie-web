import { forwardRef, useCallback, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useHlsPlayer } from "@/hooks/useHlsPlayer";
import { isSafeHttpUrl } from "@lib/movieUtils";
import { cn } from "@/lib/utils";
import PlayerControlBar from "./PlayerControlBar";
import PlayerOverlays from "./PlayerOverlays";
import { useVideoPlayerControls } from "./useVideoPlayerControls";
import { SEEK_STEP_SECONDS } from "./playerUtils";

const FRAME_CLASS =
    "w-full max-w-[min(100%,calc((100dvh-6rem)*16/9))] aspect-video max-h-full overflow-hidden rounded-xl bg-black shadow-2xl ring-1 ring-white/10";

const VideoPlayer = forwardRef(
    (
        {
            srcMovie,
            embedUrl,
            title,
            posterUrl,
            autoPlay = true,
            controls = true,
            startWithControls = false,
            allowSpeedControl = true,
            className,
            onStreamReady,
            onStreamError,
            onUserPlay,
            onUserPause,
            onUserSeek,
            onPlay,
            onPause,
            onSeeked,
            onTimeUpdate,
            onNextEpisode,
            onWaiting,
            onCanPlay,
            onLoadedMetadata,
            onRateChange,
            onEnded,
        },
        forwardedRef
    ) => {
        const { t } = useTranslation();
        const containerRef = useRef(null);
        const videoRef = useRef(null);

        const setVideoElement = useCallback(
            (node) => {
                videoRef.current = node;
                if (typeof forwardedRef === "function") {
                    forwardedRef(node);
                } else if (forwardedRef) {
                    forwardedRef.current = node;
                }
            },
            [forwardedRef]
        );

        const player = useVideoPlayerControls({
            containerRef,
            videoRef,
            srcMovie,
            embedUrl,
            controls,
            onUserPlay,
            onUserPause,
            onUserSeek,
        });

        const { state } = player;
        const safeEmbedUrl = isSafeHttpUrl(embedUrl) ? embedUrl : "";
        const activeHlsSrc = state.useEmbedFallback ? "" : srcMovie;

        const {
            levels,
            currentLevel,
            setQualityLevel,
            isLoadingStream,
            errorType,
            errorDetail,
            retryLoad,
        } = useHlsPlayer(videoRef, activeHlsSrc, {
            autoPlay,
            onReady: onStreamReady,
            onFatalError: onStreamError,
        });

        useEffect(() => {
            if (!controls || typeof navigator === "undefined" || !("mediaSession" in navigator)) {
                return;
            }
            try {
                if (typeof MediaMetadata !== "undefined" && title) {
                    navigator.mediaSession.metadata = new MediaMetadata({
                        title,
                        artwork: posterUrl ? [{ src: posterUrl }] : [],
                    });
                }
                navigator.mediaSession.setActionHandler("play", () => {
                    if (videoRef.current?.paused) player.togglePlay();
                });
                navigator.mediaSession.setActionHandler("pause", () => {
                    if (videoRef.current && !videoRef.current.paused) player.togglePlay();
                });
                navigator.mediaSession.setActionHandler("seekbackward", () => {
                    player.skipBy(-SEEK_STEP_SECONDS);
                });
                navigator.mediaSession.setActionHandler("seekforward", () => {
                    player.skipBy(SEEK_STEP_SECONDS);
                });
                navigator.mediaSession.setActionHandler(
                    "nexttrack",
                    onNextEpisode ? () => onNextEpisode() : null
                );
            } catch {
                // Ignore unsupported MediaSession actions
            }

            return () => {
                try {
                    ["play", "pause", "seekbackward", "seekforward", "nexttrack"].forEach(
                        (action) => navigator.mediaSession.setActionHandler(action, null)
                    );
                } catch {
                    // Ignore cleanup errors
                }
            };
        }, [controls, title, posterUrl, onNextEpisode, player]);

        if (srcMovie && !state.useEmbedFallback) {
            const shouldHideCursor =
                controls &&
                state.isPlaying &&
                !state.showControls &&
                !state.settingsOpen &&
                state.pendingSeekTime === null;

            return (
                <div
                    ref={containerRef}
                    tabIndex={0}
                    onKeyDown={player.handleContainerKeyDown}
                    onPointerMove={player.handleContainerPointerMove}
                    onPointerLeave={player.handleContainerPointerLeave}
                    className={cn(
                        FRAME_CLASS,
                        "group/player relative select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                        state.isFullscreen && "max-w-none rounded-none ring-0",
                        shouldHideCursor && "cursor-none",
                        className
                    )}
                >
                    <video
                        ref={setVideoElement}
                        className="h-full w-full object-contain"
                        playsInline
                        preload="metadata"
                        onPointerDown={player.handleSurfacePointerDown}
                        onTouchStart={player.handleSurfaceTouchStart}
                        onClick={player.handleSurfaceClick}
                        onDoubleClick={player.handleSurfaceDoubleClick}
                        onPlay={(e) => {
                            player.patch({
                                hasStarted: true,
                                isPlaying: true,
                                isBuffering: false,
                            });
                            onPlay?.(e);
                        }}
                        onPause={(e) => {
                            player.patch({ isPlaying: false });
                            onPause?.(e);
                        }}
                        onSeeked={(e) => {
                            player.patch({ isBuffering: false });
                            player.handleVideoSeeked(e.currentTarget.currentTime);
                            onSeeked?.(e);
                        }}
                        onTimeUpdate={(e) => onTimeUpdate?.(e)}
                        onWaiting={(e) => {
                            player.patch({ isBuffering: true });
                            onWaiting?.(e);
                        }}
                        onCanPlay={(e) => {
                            player.patch({ isBuffering: false });
                            onCanPlay?.(e);
                        }}
                        onLoadedMetadata={(e) => {
                            player.patch({ playbackRate: e.currentTarget.playbackRate || 1 });
                            onLoadedMetadata?.(e);
                        }}
                        onRateChange={(e) => {
                            player.patch({ playbackRate: e.currentTarget.playbackRate || 1 });
                            onRateChange?.(e);
                        }}
                        onEnded={(e) => {
                            player.patch({ isPlaying: false, showControls: true });
                            onEnded?.(e);
                        }}
                    />

                    <PlayerOverlays
                        controls={controls}
                        title={title}
                        showControls={state.showControls}
                        isFullscreen={state.isFullscreen}
                        hasStarted={state.hasStarted}
                        isPlaying={state.isPlaying}
                        isBusy={isLoadingStream || state.isBuffering}
                        errorType={errorType}
                        errorDetail={errorDetail}
                        hasEmbedFallback={Boolean(safeEmbedUrl)}
                        feedbackBadge={state.feedbackBadge}
                        onInitialPlay={() => player.togglePlay()}
                        onRetry={retryLoad}
                        onUseBackupPlayer={() => player.patch({ useEmbedFallback: true })}
                    />

                    {controls && (state.hasStarted || startWithControls) && !errorType && (
                        <PlayerControlBar
                            videoRef={videoRef}
                            srcMovie={srcMovie}
                            showControls={state.showControls}
                            isPlaying={state.isPlaying}
                            pendingSeekTime={state.pendingSeekTime}
                            volume={state.volume}
                            isMuted={state.isMuted}
                            playbackRate={state.playbackRate}
                            isFullscreen={state.isFullscreen}
                            portalContainer={state.isFullscreen ? containerRef.current : undefined}
                            canUsePip={player.canUsePip}
                            levels={levels}
                            currentLevel={currentLevel}
                            allowSpeedControl={allowSpeedControl}
                            settingsOpen={state.settingsOpen}
                            onSettingsOpenChange={(open) => {
                                player.patch({ settingsOpen: open });
                                if (open) player.revealControls();
                            }}
                            onTogglePlay={() => player.togglePlay({ showFeedback: false })}
                            onSkipBy={player.skipBy}
                            onSeekCommit={(targetSeconds) => player.seekTo(targetSeconds)}
                            onToggleMute={player.toggleMute}
                            onVolumeChange={player.applyVolume}
                            onSelectLevel={setQualityLevel}
                            onSelectPlaybackRate={player.selectPlaybackRate}
                            onTogglePip={player.togglePictureInPicture}
                            onToggleFullscreen={player.toggleFullscreen}
                            onDragStateChange={player.handleDragStateChange}
                            onControlsPointerEnter={player.handleControlsPointerEnter}
                            onControlsPointerLeave={player.handleControlsPointerLeave}
                            onControlsFocus={player.handleControlsFocus}
                            onControlsBlur={player.handleControlsBlur}
                            onControlsTouchInteract={player.handleControlsTouchInteract}
                        />
                    )}
                </div>
            );
        }

        if (safeEmbedUrl) {
            return (
                <div className={cn(FRAME_CLASS, className)}>
                    <iframe
                        src={safeEmbedUrl}
                        className="h-full w-full"
                        title={title}
                        allowFullScreen
                    />
                </div>
            );
        }

        return (
            <div
                className={cn(
                    FRAME_CLASS,
                    "flex items-center justify-center bg-black/80 text-slate-400",
                    className
                )}
            >
                {t("detail.notFound")}
            </div>
        );
    }
);

VideoPlayer.displayName = "VideoPlayer";

export default VideoPlayer;
