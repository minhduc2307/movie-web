import { useCallback, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { clamp, formatMediaTime } from "./playerUtils";

const PlayerSeekBar = ({
    currentTime,
    duration,
    bufferedPercent,
    onSeekPreview,
    onSeekCommit,
    onDragChange,
}) => {
    const { t } = useTranslation();
    const trackRef = useRef(null);
    const draggingRef = useRef(false);

    const [isDragging, setIsDragging] = useState(false);
    const [hoverState, setHoverState] = useState(null);

    const getTimeFromClientX = useCallback(
        (clientX) => {
            const rect = trackRef.current?.getBoundingClientRect();
            if (!rect || rect.width <= 0 || !Number.isFinite(duration) || duration <= 0) {
                return { ratio: 0, time: 0 };
            }
            const ratio = clamp((clientX - rect.left) / rect.width, 0, 1);
            return { ratio, time: ratio * duration };
        },
        [duration]
    );

    const handlePointerDown = (e) => {
        if (!Number.isFinite(duration) || duration <= 0) return;
        e.preventDefault();
        e.stopPropagation();
        e.currentTarget.setPointerCapture?.(e.pointerId);

        draggingRef.current = true;
        setIsDragging(true);
        onDragChange?.(true);

        const { ratio, time } = getTimeFromClientX(e.clientX);
        setHoverState({ ratio, time });
        onSeekPreview?.(time);
    };

    const handlePointerMove = (e) => {
        if (!Number.isFinite(duration) || duration <= 0) return;
        const { ratio, time } = getTimeFromClientX(e.clientX);
        setHoverState({ ratio, time });

        if (draggingRef.current) {
            onSeekPreview?.(time);
        }
    };

    const finishDrag = (e) => {
        if (!draggingRef.current) return;
        draggingRef.current = false;
        setIsDragging(false);

        if (e.currentTarget.hasPointerCapture?.(e.pointerId)) {
            e.currentTarget.releasePointerCapture?.(e.pointerId);
        }

        const { time } = getTimeFromClientX(e.clientX);
        if (e.pointerType === "touch") {
            setHoverState(null);
        }

        // Commit seek before clearing drag state so pendingSeek locks immediately
        onSeekCommit?.(time);
        onDragChange?.(false);
    };

    const handleKeyDown = (e) => {
        if (!Number.isFinite(duration) || duration <= 0) return;
        if (e.key === "ArrowLeft") {
            e.preventDefault();
            e.stopPropagation();
            onSeekCommit?.(clamp(currentTime - 5, 0, duration));
        } else if (e.key === "ArrowRight") {
            e.preventDefault();
            e.stopPropagation();
            onSeekCommit?.(clamp(currentTime + 5, 0, duration));
        } else if (e.key === "Home") {
            e.preventDefault();
            e.stopPropagation();
            onSeekCommit?.(0);
        } else if (e.key === "End") {
            e.preventDefault();
            e.stopPropagation();
            onSeekCommit?.(duration);
        }
    };

    const progressPercent =
        Number.isFinite(duration) && duration > 0
            ? clamp((currentTime / duration) * 100, 0, 100)
            : 0;

    return (
        <div
            ref={trackRef}
            role="slider"
            tabIndex={0}
            aria-label={t("watch.player.seek")}
            aria-valuemin={0}
            aria-valuemax={Math.floor(duration || 0)}
            aria-valuenow={Math.floor(currentTime || 0)}
            aria-valuetext={formatMediaTime(currentTime)}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={finishDrag}
            onPointerCancel={finishDrag}
            onPointerLeave={() => {
                if (!draggingRef.current) setHoverState(null);
            }}
            onClick={(e) => e.stopPropagation()}
            onKeyDown={handleKeyDown}
            className="group/seek relative flex h-6 w-full cursor-pointer touch-none items-center rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/80"
        >
            {/* Hover Time Preview Tooltip */}
            {hoverState && Number.isFinite(duration) && duration > 0 && (
                <div
                    style={{ left: `${clamp(hoverState.ratio * 100, 4, 96)}%` }}
                    className="pointer-events-none absolute -top-7 -translate-x-1/2 rounded-md border border-white/15 bg-black/90 px-2 py-0.5 text-[11px] font-semibold tabular-nums text-white shadow-lg"
                >
                    {formatMediaTime(hoverState.time)}
                </div>
            )}

            {/* Track Background */}
            <div
                className={cn(
                    "relative w-full overflow-hidden rounded-full bg-white/25 transition-[height] duration-150",
                    isDragging ? "h-2" : "h-1 group-hover/seek:h-1.5"
                )}
            >
                {/* Buffered Track */}
                <div
                    style={{ width: `${bufferedPercent}%` }}
                    className="absolute inset-y-0 left-0 rounded-full bg-white/35 transition-[width] duration-200"
                />

                {/* Hover Ghost Track */}
                {hoverState && (
                    <div
                        style={{ width: `${hoverState.ratio * 100}%` }}
                        className="absolute inset-y-0 left-0 rounded-full bg-white/25"
                    />
                )}

                {/* Played Progress */}
                <div
                    style={{ width: `${progressPercent}%` }}
                    className="absolute inset-y-0 left-0 rounded-full bg-primary"
                />
            </div>

            {/* Thumb Knob */}
            <div
                style={{ left: `${progressPercent}%` }}
                className={cn(
                    "pointer-events-none absolute top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary shadow-md shadow-black/50 ring-2 ring-white transition-transform duration-150",
                    isDragging
                        ? "h-4 w-4 scale-100"
                        : "h-3.5 w-3.5 scale-0 group-hover/seek:scale-100 group-focus-visible/seek:scale-100"
                )}
            />
        </div>
    );
};

export default PlayerSeekBar;
