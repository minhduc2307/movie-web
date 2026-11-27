import { useCallback, useEffect, useRef } from "react";
import { createClientId } from "@lib/userUtils";
import {
    DRIFT_CHECK_INTERVAL_MS,
    DRIFT_IGNORE_SECONDS,
    PLAYBACK_SEEK_DEBOUNCE_MS,
    PROGRAMMATIC_SUPPRESS_MS,
    USER_COMMAND_DEDUPE_MS,
} from "@/features/watch-party/lib/constants";
import {
    clampSeekTarget,
    getCorrection,
    getExpectedPosition,
    getServerNow,
} from "@/features/watch-party/lib/sync";
import { writeRoomPlayback } from "@/services/firebase/roomService";

const PROGRAMMATIC_SEEK_WINDOW_MS = 8000;
const PROGRAMMATIC_SEEK_TOLERANCE_SEC = 2.5;
const MEDIA_SWITCH_SAFETY_MS = 5000;
const NATIVE_PLAY_DEDUPE_DELAY_MS = 25;

export const usePlaybackSync = ({
    roomId,
    user,
    videoRef,
    playback,
    media,
    srcMovie,
    serverOffsetRef,
    isMember,
    isJoined,
}) => {
    const clientIdRef = useRef(createClientId());
    const isJoinedRef = useRef(isJoined);
    isJoinedRef.current = isJoined;

    const isApplyingRemoteRef = useRef(false);
    const isSwitchingMediaRef = useRef(false);
    const switchSafetyTimerRef = useRef(null);
    const suppressNativeUntilRef = useRef(0);
    const programmaticSeekRef = useRef(null);
    const lastUserActionRef = useRef({ type: "", at: 0 });
    const seekDebounceRef = useRef(null);
    const nativePlayTimerRef = useRef(null);
    const latestPlaybackRef = useRef(playback);
    latestPlaybackRef.current = playback;

    const mediaKey = `${media?.serverIdx ?? 0}:${media?.episodeIndex ?? 0}`;
    const prevMediaKeyRef = useRef(mediaKey);
    const prevSrcMovieRef = useRef(srcMovie);

    const markProgrammaticSeek = useCallback((targetSeconds) => {
        programmaticSeekRef.current = {
            target: targetSeconds,
            expiresAt: performance.now() + PROGRAMMATIC_SEEK_WINDOW_MS,
        };
    }, []);

    const markProgrammaticWindow = useCallback((durationMs = PROGRAMMATIC_SUPPRESS_MS) => {
        isApplyingRemoteRef.current = true;
        suppressNativeUntilRef.current = performance.now() + durationMs;
        queueMicrotask(() => {
            isApplyingRemoteRef.current = false;
        });
    }, []);

    const clearSwitchSafetyTimer = useCallback(() => {
        if (switchSafetyTimerRef.current) {
            clearTimeout(switchSafetyTimerRef.current);
            switchSafetyTimerRef.current = null;
        }
    }, []);

    const applyRemotePlayback = useCallback(
        (remotePlayback, { force = false } = {}) => {
            const video = videoRef.current;
            if (!video || !remotePlayback) return;
            if (!force && !isJoinedRef.current) return;
            if (!force && remotePlayback.clientId === clientIdRef.current) return;

            const expectedPos = clampSeekTarget(
                getExpectedPosition(
                    remotePlayback,
                    getServerNow(serverOffsetRef.current),
                    video.duration
                ),
                video.duration
            );

            markProgrammaticWindow();
            if (video.playbackRate !== 1) {
                video.playbackRate = 1;
            }

            const currentPos = Number.isFinite(video.currentTime) ? video.currentTime : 0;
            if (Math.abs(currentPos - expectedPos) >= DRIFT_IGNORE_SECONDS) {
                markProgrammaticSeek(expectedPos);
                video.currentTime = expectedPos;
            }

            if (remotePlayback.state === "playing") {
                if (video.paused) {
                    video.play().catch(() => {});
                }
            } else if (!video.paused) {
                video.pause();
            }
        },
        [videoRef, serverOffsetRef, markProgrammaticWindow, markProgrammaticSeek]
    );

    // Pause sync writes briefly only when mediaKey actually changes to a different playable stream
    useEffect(() => {
        const mediaChanged = prevMediaKeyRef.current !== mediaKey;
        const srcChanged = prevSrcMovieRef.current !== srcMovie;
        prevMediaKeyRef.current = mediaKey;
        prevSrcMovieRef.current = srcMovie;

        if (!mediaChanged) return;

        if (seekDebounceRef.current) {
            clearTimeout(seekDebounceRef.current);
            seekDebounceRef.current = null;
        }

        if (srcChanged && srcMovie) {
            isSwitchingMediaRef.current = true;
            clearSwitchSafetyTimer();
            switchSafetyTimerRef.current = setTimeout(() => {
                isSwitchingMediaRef.current = false;
            }, MEDIA_SWITCH_SAFETY_MS);
        } else {
            isSwitchingMediaRef.current = false;
        }
    }, [mediaKey, srcMovie, clearSwitchSafetyTimer]);

    useEffect(() => {
        if (!isJoined || !playback || isSwitchingMediaRef.current) return;
        applyRemotePlayback(playback);
    }, [playback, isJoined, applyRemotePlayback]);

    useEffect(() => {
        if (!isJoined || playback?.state !== "playing") return;

        const timer = setInterval(() => {
            const video = videoRef.current;
            const currentPlayback = latestPlaybackRef.current;
            if (
                !video ||
                !currentPlayback ||
                currentPlayback.state !== "playing" ||
                video.paused ||
                video.seeking ||
                video.readyState < 2 ||
                isSwitchingMediaRef.current
            ) {
                return;
            }

            const expectedPos = clampSeekTarget(
                getExpectedPosition(
                    currentPlayback,
                    getServerNow(serverOffsetRef.current),
                    video.duration
                ),
                video.duration
            );
            const drift = expectedPos - video.currentTime;
            const correction = getCorrection(drift);

            if (correction.type === "none") {
                if (video.playbackRate !== 1) video.playbackRate = 1;
            } else if (correction.type === "rate") {
                if (video.playbackRate !== correction.rate) {
                    video.playbackRate = correction.rate;
                }
            } else if (correction.type === "seek") {
                markProgrammaticWindow();
                markProgrammaticSeek(expectedPos);
                video.playbackRate = 1;
                video.currentTime = expectedPos;
            }
        }, DRIFT_CHECK_INTERVAL_MS);

        return () => clearInterval(timer);
    }, [
        isJoined,
        playback?.state,
        videoRef,
        serverOffsetRef,
        markProgrammaticWindow,
        markProgrammaticSeek,
    ]);

    useEffect(() => {
        return () => {
            if (seekDebounceRef.current) clearTimeout(seekDebounceRef.current);
            if (nativePlayTimerRef.current) clearTimeout(nativePlayTimerRef.current);
            clearSwitchSafetyTimer();
        };
    }, [clearSwitchSafetyTimer]);

    const publishPlayback = useCallback(
        (state, position) => {
            if (!roomId || !user?.uid || !isMember || !isJoinedRef.current) return;
            writeRoomPlayback({
                roomId,
                state,
                position: clampSeekTarget(position, videoRef.current?.duration),
                user,
                clientId: clientIdRef.current,
            }).catch((err) => {
                if (import.meta.env.DEV) {
                    console.error("[usePlaybackSync] Write playback failed:", err);
                }
            });
        },
        [roomId, user, isMember, videoRef]
    );

    const handleStreamReady = useCallback(() => {
        clearSwitchSafetyTimer();
        isSwitchingMediaRef.current = false;
        if (isJoinedRef.current && latestPlaybackRef.current) {
            applyRemotePlayback(latestPlaybackRef.current, { force: true });
        }
    }, [clearSwitchSafetyTimer, applyRemotePlayback]);

    const handleStreamError = useCallback(() => {
        clearSwitchSafetyTimer();
        isSwitchingMediaRef.current = false;
    }, [clearSwitchSafetyTimer]);

    const handleUserPlay = useCallback(() => {
        if (!isJoinedRef.current || !isMember) return;
        const video = videoRef.current;
        if (!video) return;
        if (seekDebounceRef.current) {
            clearTimeout(seekDebounceRef.current);
            seekDebounceRef.current = null;
        }
        lastUserActionRef.current = { type: "play", at: performance.now() };
        publishPlayback("playing", video.currentTime);
    }, [isMember, videoRef, publishPlayback]);

    const handleUserPause = useCallback(() => {
        if (!isJoinedRef.current || !isMember) return;
        const video = videoRef.current;
        if (!video) return;
        if (seekDebounceRef.current) {
            clearTimeout(seekDebounceRef.current);
            seekDebounceRef.current = null;
        }
        lastUserActionRef.current = { type: "pause", at: performance.now() };
        publishPlayback("paused", video.currentTime);
    }, [isMember, videoRef, publishPlayback]);

    const handleUserSeek = useCallback(
        (targetSeconds) => {
            if (!isJoinedRef.current || !isMember) return;
            programmaticSeekRef.current = null;
            lastUserActionRef.current = { type: "seek", at: performance.now() };
            if (seekDebounceRef.current) clearTimeout(seekDebounceRef.current);

            seekDebounceRef.current = setTimeout(() => {
                seekDebounceRef.current = null;
                const video = videoRef.current;
                if (!video) return;
                const state = video.paused ? "paused" : "playing";
                publishPlayback(state, targetSeconds);
            }, PLAYBACK_SEEK_DEBOUNCE_MS);
        },
        [isMember, videoRef, publishPlayback]
    );

    const canEmitNativeFallback = useCallback(() => {
        if (!isJoinedRef.current || !isMember) return false;
        if (isApplyingRemoteRef.current || isSwitchingMediaRef.current) return false;
        if (performance.now() < suppressNativeUntilRef.current) return false;
        if (performance.now() - lastUserActionRef.current.at < USER_COMMAND_DEDUPE_MS) {
            return false;
        }
        return true;
    }, [isMember]);

    // Defer slightly so React player playPromise.then(onUserPlay) runs first and avoids duplicate write
    const handleNativePlay = useCallback(() => {
        if (nativePlayTimerRef.current) clearTimeout(nativePlayTimerRef.current);
        nativePlayTimerRef.current = setTimeout(() => {
            nativePlayTimerRef.current = null;
            const video = videoRef.current;
            if (!video || video.paused || !canEmitNativeFallback()) return;
            if (latestPlaybackRef.current?.state === "playing") return;
            publishPlayback("playing", video.currentTime);
        }, NATIVE_PLAY_DEDUPE_DELAY_MS);
    }, [videoRef, canEmitNativeFallback, publishPlayback]);

    const handleNativePause = useCallback(() => {
        const video = videoRef.current;
        if (!video || video.ended || !canEmitNativeFallback()) return;
        if (latestPlaybackRef.current?.state === "paused") return;
        publishPlayback("paused", video.currentTime);
    }, [canEmitNativeFallback, videoRef, publishPlayback]);

    const handleNativeSeeked = useCallback(() => {
        const video = videoRef.current;
        if (!video) return;

        const progSeek = programmaticSeekRef.current;
        if (progSeek) {
            const withinTarget =
                Math.abs(video.currentTime - progSeek.target) <=
                PROGRAMMATIC_SEEK_TOLERANCE_SEC;
            if (performance.now() < progSeek.expiresAt && withinTarget) {
                programmaticSeekRef.current = null;
                return;
            }
            if (performance.now() >= progSeek.expiresAt) {
                programmaticSeekRef.current = null;
            }
        }

        if (!canEmitNativeFallback()) return;
        publishPlayback(video.paused ? "paused" : "playing", video.currentTime);
    }, [canEmitNativeFallback, videoRef, publishPlayback]);

    return {
        clientId: clientIdRef.current,
        applyRemotePlayback,
        handleStreamReady,
        handleStreamError,
        handleUserPlay,
        handleUserPause,
        handleUserSeek,
        handleNativePlay,
        handleNativePause,
        handleNativeSeeked,
    };
};
