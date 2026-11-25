import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
    Play,
    Pause,
    RotateCcw,
    RotateCw,
    Volume2,
    Volume1,
    VolumeX,
    Maximize,
    Minimize,
    PictureInPicture2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import PlayerIconButton from "./PlayerIconButton";
import PlayerSeekBar from "./PlayerSeekBar";
import PlayerSettingsMenu from "./PlayerSettingsMenu";
import {
    SEEK_STEP_SECONDS,
    formatMediaTime,
    getBufferedPercent,
} from "./playerUtils";

const INITIAL_PROGRESS = { currentTime: 0, duration: 0, bufferedPercent: 0 };

const PlayerControlBar = ({
    videoRef,
    srcMovie,
    showControls,
    isPlaying,
    pendingSeekTime,
    volume,
    isMuted,
    playbackRate,
    isFullscreen,
    canUsePip,
    levels,
    currentLevel,
    allowSpeedControl,
    settingsOpen,
    onSettingsOpenChange,
    onTogglePlay,
    onSkipBy,
    onSeekCommit,
    onToggleMute,
    onVolumeChange,
    onSelectLevel,
    onSelectPlaybackRate,
    onTogglePip,
    onToggleFullscreen,
    onDragStateChange,
    onControlsEnter,
    onControlsLeave,
}) => {
    const { t } = useTranslation();
    const isDraggingRef = useRef(false);
    const pendingSeekRef = useRef(pendingSeekTime);
    pendingSeekRef.current = pendingSeekTime;

    const [progress, setProgress] = useState(INITIAL_PROGRESS);
    const [previewTime, setPreviewTime] = useState(null);

    useEffect(() => {
        setProgress(INITIAL_PROGRESS);
        setPreviewTime(null);
    }, [srcMovie]);

    // Isolate high-frequency timeupdate/progress re-renders inside the control bar
    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        const syncFromVideo = () => {
            const dur = Number.isFinite(video.duration) ? video.duration : 0;
            const lockSeekPosition =
                isDraggingRef.current || pendingSeekRef.current !== null || video.seeking;
            setProgress((prev) => ({
                currentTime: lockSeekPosition ? prev.currentTime : video.currentTime || 0,
                duration: dur,
                bufferedPercent: getBufferedPercent(video, dur),
            }));
        };

        const handleSeeked = () => {
            const dur = Number.isFinite(video.duration) ? video.duration : 0;
            setProgress({
                currentTime: video.currentTime || 0,
                duration: dur,
                bufferedPercent: getBufferedPercent(video, dur),
            });
        };

        const handleEmptied = () => setProgress(INITIAL_PROGRESS);

        syncFromVideo();
        const events = ["timeupdate", "progress", "loadedmetadata", "durationchange"];
        events.forEach((evt) => video.addEventListener(evt, syncFromVideo));
        video.addEventListener("seeked", handleSeeked);
        video.addEventListener("emptied", handleEmptied);

        return () => {
            events.forEach((evt) => video.removeEventListener(evt, syncFromVideo));
            video.removeEventListener("seeked", handleSeeked);
            video.removeEventListener("emptied", handleEmptied);
        };
    }, [videoRef, srcMovie]);

    const VolumeIcon =
        isMuted || volume === 0 ? VolumeX : volume < 0.5 ? Volume1 : Volume2;

    const displayedTime = previewTime ?? pendingSeekTime ?? progress.currentTime;

    return (
        <div
            onClick={(e) => e.stopPropagation()}
            onMouseEnter={onControlsEnter}
            onMouseLeave={onControlsLeave}
            onFocusCapture={onControlsEnter}
            onBlurCapture={onControlsLeave}
            className={cn(
                "absolute inset-x-0 bottom-0 z-20 bg-gradient-to-t from-black/95 via-black/60 to-transparent px-3 pt-10 pb-2.5 transition-opacity duration-300 sm:px-4 sm:pb-3",
                showControls ? "opacity-100" : "pointer-events-none opacity-0"
            )}
        >
            <PlayerSeekBar
                currentTime={displayedTime}
                duration={progress.duration}
                bufferedPercent={progress.bufferedPercent}
                onDragChange={(dragging) => {
                    isDraggingRef.current = dragging;
                    if (!dragging) setPreviewTime(null);
                    onDragStateChange(dragging);
                }}
                onSeekPreview={setPreviewTime}
                onSeekCommit={(targetSeconds) => {
                    setPreviewTime(null);
                    onSeekCommit(targetSeconds);
                }}
            />

            <div className="mt-1 flex items-center justify-between gap-2">
                <div className="flex items-center gap-0.5 sm:gap-1.5">
                    <PlayerIconButton
                        label={isPlaying ? t("watch.player.pause") : t("watch.player.play")}
                        onClick={onTogglePlay}
                        className="text-white hover:text-primary"
                    >
                        {isPlaying ? (
                            <Pause className="h-5 w-5 fill-current" />
                        ) : (
                            <Play className="ml-0.5 h-5 w-5 fill-current" />
                        )}
                    </PlayerIconButton>

                    <PlayerIconButton
                        label={t("watch.player.rewind")}
                        onClick={() => onSkipBy(-SEEK_STEP_SECONDS)}
                    >
                        <RotateCcw className="h-[18px] w-[18px]" />
                    </PlayerIconButton>

                    <PlayerIconButton
                        label={t("watch.player.forward")}
                        onClick={() => onSkipBy(SEEK_STEP_SECONDS)}
                    >
                        <RotateCw className="h-[18px] w-[18px]" />
                    </PlayerIconButton>

                    <div className="group/vol flex items-center">
                        <PlayerIconButton
                            label={
                                isMuted || volume === 0
                                    ? t("watch.player.unmute")
                                    : t("watch.player.mute")
                            }
                            onClick={onToggleMute}
                        >
                            <VolumeIcon className="h-[18px] w-[18px]" />
                        </PlayerIconButton>
                        <div className="hidden w-0 overflow-hidden transition-all duration-200 sm:flex sm:items-center group-hover/vol:w-20 group-focus-within/vol:w-20">
                            <input
                                type="range"
                                min={0}
                                max={1}
                                step={0.05}
                                value={isMuted ? 0 : volume}
                                onChange={(e) => onVolumeChange(Number(e.target.value))}
                                aria-label={t("watch.player.volume")}
                                className="ml-1 h-1 w-16 cursor-pointer accent-primary"
                            />
                        </div>
                    </div>

                    <div className="ml-1.5 flex items-center gap-1 text-xs font-medium tabular-nums text-slate-200 sm:text-[13px]">
                        <span className="text-white">{formatMediaTime(displayedTime)}</span>
                        <span className="text-slate-400">/</span>
                        <span className="text-slate-300">{formatMediaTime(progress.duration)}</span>
                    </div>
                </div>

                <div className="flex items-center gap-0.5 sm:gap-1">
                    <PlayerSettingsMenu
                        levels={levels}
                        currentLevel={currentLevel}
                        onSelectLevel={onSelectLevel}
                        playbackRate={playbackRate}
                        onSelectPlaybackRate={onSelectPlaybackRate}
                        allowSpeedControl={allowSpeedControl}
                        isOpen={settingsOpen}
                        onOpenChange={onSettingsOpenChange}
                    />

                    {canUsePip && (
                        <PlayerIconButton
                            label={t("watch.player.pip")}
                            onClick={onTogglePip}
                            className="hidden sm:flex"
                        >
                            <PictureInPicture2 className="h-[18px] w-[18px]" />
                        </PlayerIconButton>
                    )}

                    <PlayerIconButton
                        label={
                            isFullscreen
                                ? t("watch.player.exitFullscreen")
                                : t("watch.player.fullscreen")
                        }
                        onClick={onToggleFullscreen}
                    >
                        {isFullscreen ? (
                            <Minimize className="h-[18px] w-[18px]" />
                        ) : (
                            <Maximize className="h-[18px] w-[18px]" />
                        )}
                    </PlayerIconButton>
                </div>
            </div>
        </div>
    );
};

export default PlayerControlBar;
