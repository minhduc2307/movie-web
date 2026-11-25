import { useTranslation } from "react-i18next";
import {
    Play,
    Pause,
    RotateCcw,
    RotateCw,
    Volume2,
    VolumeX,
    Loader2,
    AlertTriangle,
    RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const FEEDBACK_POSITION_CLASSES = {
    rewind: "left-[20%] top-1/2 -translate-x-1/2 -translate-y-1/2 gap-1.5 rounded-full border border-white/15 bg-black/60 px-3.5 py-2 text-xs font-semibold shadow-xl sm:text-sm",
    forward:
        "right-[20%] top-1/2 translate-x-1/2 -translate-y-1/2 gap-1.5 rounded-full border border-white/15 bg-black/60 px-3.5 py-2 text-xs font-semibold shadow-xl sm:text-sm",
    mute: "left-1/2 top-5 -translate-x-1/2 gap-1.5 rounded-full border border-white/15 bg-black/65 px-3.5 py-1.5 text-xs font-semibold shadow-xl",
    volume: "left-1/2 top-5 -translate-x-1/2 gap-1.5 rounded-full border border-white/15 bg-black/65 px-3.5 py-1.5 text-xs font-semibold shadow-xl",
    play: "left-1/2 top-1/2 h-14 w-14 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/20 bg-black/55 shadow-2xl",
    pause: "left-1/2 top-1/2 h-14 w-14 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/20 bg-black/55 shadow-2xl",
};

const FeedbackContent = ({ badge }) => {
    switch (badge.type) {
        case "rewind":
            return (
                <>
                    <RotateCcw className="h-4 w-4 sm:h-5 sm:w-5" />
                    <span className="tabular-nums">{badge.label || "-10s"}</span>
                </>
            );
        case "forward":
            return (
                <>
                    <span className="tabular-nums">{badge.label || "+10s"}</span>
                    <RotateCw className="h-4 w-4 sm:h-5 sm:w-5" />
                </>
            );
        case "mute":
            return <VolumeX className="h-4 w-4" />;
        case "volume":
            return (
                <>
                    <Volume2 className="h-4 w-4" />
                    <span className="tabular-nums">{badge.label}</span>
                </>
            );
        case "play":
            return <Play className="ml-0.5 h-6 w-6 fill-current" />;
        case "pause":
            return <Pause className="h-6 w-6 fill-current" />;
        default:
            return null;
    }
};

const PlayerOverlays = ({
    controls,
    title,
    showControls,
    isFullscreen,
    hasStarted,
    isPlaying,
    isBusy,
    errorType,
    errorDetail,
    hasEmbedFallback,
    feedbackBadge,
    onInitialPlay,
    onRetry,
    onUseBackupPlayer,
}) => {
    const { t } = useTranslation();

    return (
        <>
            {controls && title && (
                <div
                    className={cn(
                        "pointer-events-none absolute inset-x-0 top-0 z-10 bg-gradient-to-b from-black/75 via-black/30 to-transparent px-4 pt-3 pb-10 transition-opacity duration-300 sm:px-5",
                        showControls ? "opacity-100" : "opacity-0"
                    )}
                >
                    <p
                        className={cn(
                            "truncate text-sm font-semibold text-white/95 drop-shadow sm:text-base",
                            !isFullscreen && "sm:hidden"
                        )}
                    >
                        {title}
                    </p>
                </div>
            )}

            {isBusy && !errorType && (
                <div
                    className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center"
                    aria-label={t("watch.player.buffering")}
                >
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-black/60 backdrop-blur-md ring-1 ring-white/15">
                        <Loader2 className="h-7 w-7 animate-spin text-primary" />
                    </div>
                </div>
            )}

            {controls && !hasStarted && !isPlaying && !isBusy && !errorType && (
                <button
                    type="button"
                    onClick={(e) => {
                        e.stopPropagation();
                        onInitialPlay();
                    }}
                    aria-label={t("watch.player.play")}
                    className="group/cta absolute left-1/2 top-1/2 z-10 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/25 bg-black/55 text-white shadow-2xl backdrop-blur-md transition-all duration-200 hover:scale-105 hover:border-primary hover:bg-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-white sm:h-20 sm:w-20"
                >
                    <Play className="ml-1 h-7 w-7 fill-current transition-transform duration-200 group-hover/cta:scale-110 sm:h-9 sm:w-9" />
                </button>
            )}

            {feedbackBadge && (
                <div
                    key={feedbackBadge.key}
                    className={cn(
                        "pointer-events-none absolute z-20 flex items-center justify-center text-white backdrop-blur-md animate-in fade-in zoom-in-90 duration-150",
                        FEEDBACK_POSITION_CLASSES[feedbackBadge.type]
                    )}
                >
                    <FeedbackContent badge={feedbackBadge} />
                </div>
            )}

            {errorType && (
                <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-3 bg-black/85 p-6 text-center backdrop-blur-sm">
                    <AlertTriangle className="h-10 w-10 text-amber-400" />
                    <p className="max-w-md text-sm text-slate-200">
                        {t("watch.player.loadError")}
                    </p>
                    {errorDetail && (
                        <p className="font-mono text-xs text-slate-400">{errorDetail}</p>
                    )}
                    <div className="flex flex-wrap items-center justify-center gap-2.5">
                        <Button
                            type="button"
                            size="sm"
                            onClick={onRetry}
                            className="gap-2 bg-primary text-white hover:bg-primary/90"
                        >
                            <RefreshCw className="h-4 w-4" />
                            <span>{t("watch.player.retry")}</span>
                        </Button>
                        {hasEmbedFallback && (
                            <Button
                                type="button"
                                size="sm"
                                variant="outline"
                                onClick={onUseBackupPlayer}
                                className="border-white/20 bg-white/10 text-white hover:bg-white/20"
                            >
                                {t("watch.player.useBackupPlayer")}
                            </Button>
                        )}
                    </div>
                </div>
            )}
        </>
    );
};

export default PlayerOverlays;
