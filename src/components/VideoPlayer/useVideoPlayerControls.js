import { useCallback, useEffect, useReducer, useRef } from "react";
import { SEEK_STEP_SECONDS, clamp } from "./playerUtils";

const CONTROLS_HIDE_DELAY_MS = 3200;
const FEEDBACK_DURATION_MS = 550;
const SURFACE_CLICK_DELAY_MS = 200;
const TOUCH_DOUBLE_TAP_MS = 260;
const SKIP_COMBO_WINDOW_MS = 700;
const PENDING_SEEK_TIMEOUT_MS = 4000;
const VOLUME_STORAGE_KEY = "motphim-player-audio";

const loadSavedAudio = () => {
    try {
        const raw = localStorage.getItem(VOLUME_STORAGE_KEY);
        if (!raw) return { volume: 1, isMuted: false };
        const parsed = JSON.parse(raw);
        const volume = Number.isFinite(parsed?.volume) ? clamp(parsed.volume, 0, 1) : 1;
        const isMuted = Boolean(parsed?.isMuted) || volume === 0;
        return { volume, isMuted };
    } catch {
        return { volume: 1, isMuted: false };
    }
};

const saveAudio = (volume, isMuted) => {
    try {
        localStorage.setItem(VOLUME_STORAGE_KEY, JSON.stringify({ volume, isMuted }));
    } catch {
        // Ignore storage quota / private mode errors
    }
};

const savedAudio = loadSavedAudio();

const initialState = {
    hasStarted: false,
    isPlaying: false,
    isBuffering: false,
    pendingSeekTime: null,
    volume: savedAudio.volume,
    isMuted: savedAudio.isMuted,
    playbackRate: 1,
    isFullscreen: false,
    showControls: true,
    settingsOpen: false,
    feedbackBadge: null,
    useEmbedFallback: false,
};

const playerReducer = (state, action) => {
    switch (action.type) {
        case "RESET_SOURCE":
            return {
                ...state,
                hasStarted: false,
                isPlaying: false,
                isBuffering: false,
                pendingSeekTime: null,
                showControls: true,
                settingsOpen: false,
                feedbackBadge: null,
                useEmbedFallback: false,
            };
        case "PATCH": {
            const hasChange = Object.keys(action.payload).some(
                (key) => !Object.is(state[key], action.payload[key])
            );
            return hasChange ? { ...state, ...action.payload } : state;
        }
        default:
            return state;
    }
};

export const useVideoPlayerControls = ({
    containerRef,
    videoRef,
    srcMovie,
    embedUrl,
    controls,
    onUserPlay,
    onUserPause,
    onUserSeek,
}) => {
    const [state, dispatch] = useReducer(playerReducer, initialState);
    const hideTimerRef = useRef(null);
    const feedbackTimerRef = useRef(null);
    const clickTimerRef = useRef(null);
    const touchTapTimerRef = useRef(null);
    const pendingSeekTimerRef = useRef(null);
    const pendingSeekRef = useRef(null);
    const skipComboRef = useRef({ delta: 0, expiresAt: 0 });
    const lastTouchTapRef = useRef({ time: 0, zone: null });
    const lastVolumeRef = useRef(savedAudio.volume > 0 ? savedAudio.volume : 1);
    const isDraggingSeekRef = useRef(false);
    const isHoveringControlsRef = useRef(false);

    const canUsePip =
        typeof document !== "undefined" && Boolean(document.pictureInPictureEnabled);

    const patch = useCallback((payload) => {
        dispatch({ type: "PATCH", payload });
    }, []);

    const clearHideTimer = useCallback(() => {
        if (hideTimerRef.current) {
            clearTimeout(hideTimerRef.current);
            hideTimerRef.current = null;
        }
    }, []);

    const clearPendingSeek = useCallback(() => {
        if (pendingSeekTimerRef.current) {
            clearTimeout(pendingSeekTimerRef.current);
            pendingSeekTimerRef.current = null;
        }
        pendingSeekRef.current = null;
        patch({ pendingSeekTime: null });
    }, [patch]);

    const scheduleHideControls = useCallback(
        (playing = state.isPlaying) => {
            clearHideTimer();
            if (
                !playing ||
                state.settingsOpen ||
                isDraggingSeekRef.current ||
                isHoveringControlsRef.current ||
                pendingSeekRef.current !== null
            ) {
                return;
            }
            hideTimerRef.current = setTimeout(() => {
                patch({ showControls: false });
            }, CONTROLS_HIDE_DELAY_MS);
        },
        [clearHideTimer, patch, state.isPlaying, state.settingsOpen]
    );

    const revealControls = useCallback(() => {
        patch({ showControls: true });
        scheduleHideControls();
    }, [patch, scheduleHideControls]);

    const triggerFeedback = useCallback(
        (type, label) => {
            if (feedbackTimerRef.current) clearTimeout(feedbackTimerRef.current);
            patch({ feedbackBadge: { type, label, key: Date.now() } });
            feedbackTimerRef.current = setTimeout(() => {
                patch({ feedbackBadge: null });
            }, FEEDBACK_DURATION_MS);
        },
        [patch]
    );

    useEffect(() => {
        if (pendingSeekTimerRef.current) {
            clearTimeout(pendingSeekTimerRef.current);
            pendingSeekTimerRef.current = null;
        }
        pendingSeekRef.current = null;
        skipComboRef.current = { delta: 0, expiresAt: 0 };
        dispatch({ type: "RESET_SOURCE" });
    }, [srcMovie, embedUrl]);

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;
        video.volume = state.volume;
        video.muted = state.isMuted;
    }, [videoRef, srcMovie, state.volume, state.isMuted]);

    useEffect(() => {
        if (state.isPlaying && !state.settingsOpen && state.pendingSeekTime === null) {
            scheduleHideControls(true);
        } else {
            clearHideTimer();
            patch({ showControls: true });
        }
        return clearHideTimer;
    }, [
        state.isPlaying,
        state.settingsOpen,
        state.pendingSeekTime,
        scheduleHideControls,
        clearHideTimer,
        patch,
    ]);

    useEffect(() => {
        const handleFsChange = () => {
            const fsEl = document.fullscreenElement || document.webkitFullscreenElement;
            patch({ isFullscreen: Boolean(fsEl) });
        };

        document.addEventListener("fullscreenchange", handleFsChange);
        document.addEventListener("webkitfullscreenchange", handleFsChange);
        return () => {
            document.removeEventListener("fullscreenchange", handleFsChange);
            document.removeEventListener("webkitfullscreenchange", handleFsChange);
            clearHideTimer();
            if (feedbackTimerRef.current) clearTimeout(feedbackTimerRef.current);
            if (clickTimerRef.current) clearTimeout(clickTimerRef.current);
            if (touchTapTimerRef.current) clearTimeout(touchTapTimerRef.current);
            if (pendingSeekTimerRef.current) clearTimeout(pendingSeekTimerRef.current);
        };
    }, [clearHideTimer, patch]);

    const togglePlay = useCallback(
        ({ showFeedback = false } = {}) => {
            const video = videoRef.current;
            if (!video) return;

            if (video.paused || video.ended) {
                const playPromise = video.play();
                if (playPromise && typeof playPromise.then === "function") {
                    playPromise.then(() => onUserPlay?.()).catch(() => {});
                } else {
                    onUserPlay?.();
                }
                if (showFeedback && state.hasStarted) {
                    triggerFeedback("play");
                }
            } else {
                video.pause();
                onUserPause?.();
                if (showFeedback) triggerFeedback("pause");
            }
            revealControls();
        },
        [videoRef, state.hasStarted, onUserPlay, onUserPause, triggerFeedback, revealControls]
    );

    const seekTo = useCallback(
        (targetSeconds, feedback = null) => {
            const video = videoRef.current;
            if (!video || !Number.isFinite(video.duration) || video.duration <= 0) return;

            const clamped = clamp(targetSeconds, 0, video.duration);

            if (pendingSeekTimerRef.current) {
                clearTimeout(pendingSeekTimerRef.current);
            }
            pendingSeekRef.current = clamped;
            patch({ pendingSeekTime: clamped });

            pendingSeekTimerRef.current = setTimeout(() => {
                clearPendingSeek();
            }, PENDING_SEEK_TIMEOUT_MS);

            video.currentTime = clamped;
            onUserSeek?.(clamped);

            if (feedback) {
                triggerFeedback(feedback.type, feedback.label);
            }
            revealControls();
        },
        [videoRef, patch, clearPendingSeek, onUserSeek, triggerFeedback, revealControls]
    );

    const skipBy = useCallback(
        (deltaSeconds) => {
            const video = videoRef.current;
            if (!video || !Number.isFinite(video.duration) || video.duration <= 0) return;

            const now = Date.now();
            const isSameDirection =
                now < skipComboRef.current.expiresAt &&
                Math.sign(skipComboRef.current.delta) === Math.sign(deltaSeconds);

            const nextComboDelta = isSameDirection
                ? skipComboRef.current.delta + deltaSeconds
                : deltaSeconds;
            skipComboRef.current = {
                delta: nextComboDelta,
                expiresAt: now + SKIP_COMBO_WINDOW_MS,
            };

            // Accumulate skips from pending seek target so rapid presses never stall on unbuffered currentTime
            const baseTime = pendingSeekRef.current ?? video.currentTime;
            const sign = nextComboDelta < 0 ? "-" : "+";
            const label = `${sign}${Math.abs(nextComboDelta)}s`;

            seekTo(baseTime + deltaSeconds, {
                type: deltaSeconds < 0 ? "rewind" : "forward",
                label,
            });
        },
        [videoRef, seekTo]
    );

    const applyVolume = useCallback(
        (nextVolume) => {
            const video = videoRef.current;
            const safeVol = clamp(nextVolume, 0, 1);
            const muted = safeVol === 0;
            if (safeVol > 0) lastVolumeRef.current = safeVol;

            if (video) {
                video.volume = safeVol;
                video.muted = muted;
            }
            saveAudio(safeVol, muted);
            patch({ volume: safeVol, isMuted: muted });
        },
        [videoRef, patch]
    );

    const toggleMute = useCallback(() => {
        const video = videoRef.current;
        if (!video) return;

        if (video.muted || video.volume === 0) {
            const restored = lastVolumeRef.current > 0 ? lastVolumeRef.current : 1;
            applyVolume(restored);
            triggerFeedback("volume", `${Math.round(restored * 100)}%`);
        } else {
            lastVolumeRef.current = video.volume || 1;
            video.muted = true;
            saveAudio(video.volume, true);
            patch({ isMuted: true });
            triggerFeedback("mute");
        }
        revealControls();
    }, [videoRef, applyVolume, triggerFeedback, patch, revealControls]);

    const toggleFullscreen = useCallback(async () => {
        const container = containerRef.current;
        const video = videoRef.current;
        if (!container) return;

        try {
            if (document.fullscreenElement || document.webkitFullscreenElement) {
                await (document.exitFullscreen?.() || document.webkitExitFullscreen?.());
            } else if (container.requestFullscreen) {
                await container.requestFullscreen();
            } else if (container.webkitRequestFullscreen) {
                container.webkitRequestFullscreen();
            } else if (video?.webkitEnterFullscreen) {
                video.webkitEnterFullscreen();
            }
        } catch {
            // Ignore browser fullscreen rejection
        }
        revealControls();
    }, [containerRef, videoRef, revealControls]);

    const togglePictureInPicture = useCallback(async () => {
        const video = videoRef.current;
        if (!video || !canUsePip) return;
        try {
            if (document.pictureInPictureElement) {
                await document.exitPictureInPicture();
            } else {
                await video.requestPictureInPicture();
            }
        } catch {
            // Ignore PiP rejection
        }
    }, [videoRef, canUsePip]);

    const selectPlaybackRate = useCallback(
        (rate) => {
            const video = videoRef.current;
            if (video) video.playbackRate = rate;
            patch({ playbackRate: rate });
        },
        [videoRef, patch]
    );

    const handleContainerKeyDown = useCallback(
        (e) => {
            if (!controls) return;
            const tag = e.target?.tagName;
            if (tag === "INPUT" || tag === "TEXTAREA" || e.target?.isContentEditable) return;

            // Number keys 0..9 jump to 0%..90% (YouTube convention)
            if (/^[0-9]$/.test(e.key) && !e.ctrlKey && !e.metaKey && !e.altKey) {
                const video = videoRef.current;
                if (video && Number.isFinite(video.duration) && video.duration > 0) {
                    e.preventDefault();
                    seekTo((Number(e.key) / 10) * video.duration);
                }
                return;
            }

            switch (e.key) {
                case " ":
                case "k":
                case "K":
                    e.preventDefault();
                    togglePlay({ showFeedback: true });
                    break;
                case "ArrowLeft":
                case "j":
                case "J":
                    e.preventDefault();
                    skipBy(-SEEK_STEP_SECONDS);
                    break;
                case "ArrowRight":
                case "l":
                case "L":
                    e.preventDefault();
                    skipBy(SEEK_STEP_SECONDS);
                    break;
                case "ArrowUp":
                    e.preventDefault();
                    applyVolume(state.volume + 0.1);
                    triggerFeedback("volume", `${Math.round(clamp(state.volume + 0.1, 0, 1) * 100)}%`);
                    revealControls();
                    break;
                case "ArrowDown":
                    e.preventDefault();
                    applyVolume(state.volume - 0.1);
                    triggerFeedback("volume", `${Math.round(clamp(state.volume - 0.1, 0, 1) * 100)}%`);
                    revealControls();
                    break;
                case "m":
                case "M":
                    e.preventDefault();
                    toggleMute();
                    break;
                case "f":
                case "F":
                    e.preventDefault();
                    toggleFullscreen();
                    break;
                case "p":
                case "P":
                    if (canUsePip) {
                        e.preventDefault();
                        togglePictureInPicture();
                    }
                    break;
                default:
                    break;
            }
        },
        [
            controls,
            videoRef,
            seekTo,
            togglePlay,
            skipBy,
            applyVolume,
            state.volume,
            triggerFeedback,
            revealControls,
            toggleMute,
            toggleFullscreen,
            canUsePip,
            togglePictureInPicture,
        ]
    );

    const handleSurfaceClick = useCallback(
        (e) => {
            if (!controls) return;
            if (state.settingsOpen) {
                patch({ settingsOpen: false });
                return;
            }

            if (e.nativeEvent?.pointerType === "touch") {
                const rect = containerRef.current?.getBoundingClientRect();
                const ratio = rect && rect.width > 0 ? (e.clientX - rect.left) / rect.width : 0.5;
                const zone = ratio < 0.32 ? "left" : ratio > 0.68 ? "right" : "center";
                const now = Date.now();

                if (
                    now - lastTouchTapRef.current.time < TOUCH_DOUBLE_TAP_MS &&
                    lastTouchTapRef.current.zone === zone
                ) {
                    if (touchTapTimerRef.current) {
                        clearTimeout(touchTapTimerRef.current);
                        touchTapTimerRef.current = null;
                    }
                    lastTouchTapRef.current = { time: 0, zone: null };

                    if (zone === "left") skipBy(-SEEK_STEP_SECONDS);
                    else if (zone === "right") skipBy(SEEK_STEP_SECONDS);
                    else togglePlay({ showFeedback: true });
                    return;
                }

                lastTouchTapRef.current = { time: now, zone };
                if (touchTapTimerRef.current) clearTimeout(touchTapTimerRef.current);
                touchTapTimerRef.current = setTimeout(() => {
                    touchTapTimerRef.current = null;
                    const next = !state.showControls;
                    patch({ showControls: next });
                    if (next) scheduleHideControls();
                }, TOUCH_DOUBLE_TAP_MS);
                return;
            }

            if (clickTimerRef.current) clearTimeout(clickTimerRef.current);
            clickTimerRef.current = setTimeout(() => {
                clickTimerRef.current = null;
                togglePlay({ showFeedback: true });
            }, SURFACE_CLICK_DELAY_MS);
        },
        [
            controls,
            containerRef,
            state.settingsOpen,
            state.showControls,
            patch,
            skipBy,
            togglePlay,
            scheduleHideControls,
        ]
    );

    const handleSurfaceDoubleClick = useCallback(
        (e) => {
            if (!controls || e.nativeEvent?.pointerType === "touch") return;
            if (clickTimerRef.current) {
                clearTimeout(clickTimerRef.current);
                clickTimerRef.current = null;
            }
            toggleFullscreen();
        },
        [controls, toggleFullscreen]
    );

    const handleVideoSeeked = useCallback(
        (currentTime) => {
            if (
                pendingSeekRef.current === null ||
                Math.abs(currentTime - pendingSeekRef.current) < 2
            ) {
                clearPendingSeek();
            }
        },
        [clearPendingSeek]
    );

    const handleDragStateChange = useCallback(
        (dragging) => {
            isDraggingSeekRef.current = dragging;
            if (dragging) clearHideTimer();
            else scheduleHideControls();
        },
        [clearHideTimer, scheduleHideControls]
    );

    const handleControlsEnter = useCallback(() => {
        isHoveringControlsRef.current = true;
        clearHideTimer();
        patch({ showControls: true });
    }, [clearHideTimer, patch]);

    const handleControlsLeave = useCallback(
        (e) => {
            // Keep locked if focus/pointer moves between child controls inside the bar
            if (e?.currentTarget && e?.relatedTarget && e.currentTarget.contains(e.relatedTarget)) {
                return;
            }
            isHoveringControlsRef.current = false;
            scheduleHideControls();
        },
        [scheduleHideControls]
    );

    const handleControlsBlur = useCallback(
        (e) => {
            if (e?.currentTarget && e?.relatedTarget && e.currentTarget.contains(e.relatedTarget)) {
                return;
            }
            if (e?.currentTarget?.matches?.(":hover")) {
                return;
            }
            isHoveringControlsRef.current = false;
            scheduleHideControls();
        },
        [scheduleHideControls]
    );

    const handleMouseLeave = useCallback(() => {
        isHoveringControlsRef.current = false;
        if (
            state.isPlaying &&
            !state.settingsOpen &&
            !isDraggingSeekRef.current &&
            pendingSeekRef.current === null
        ) {
            patch({ showControls: false });
        }
    }, [state.isPlaying, state.settingsOpen, patch]);

    return {
        state,
        canUsePip,
        patch,
        revealControls,
        togglePlay,
        seekTo,
        skipBy,
        applyVolume,
        toggleMute,
        toggleFullscreen,
        togglePictureInPicture,
        selectPlaybackRate,
        handleContainerKeyDown,
        handleSurfaceClick,
        handleSurfaceDoubleClick,
        handleVideoSeeked,
        handleDragStateChange,
        handleControlsEnter,
        handleControlsBlur,
        handleControlsLeave,
        handleMouseLeave,
    };
};
