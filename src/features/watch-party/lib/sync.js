import {
    DRIFT_IGNORE_SECONDS,
    DRIFT_SEEK_SECONDS,
} from "./constants.js";

/**
 * Estimates current server epoch ms using Firebase `.info/serverTimeOffset`.
 */
export const getServerNow = (offsetMs = 0, clientNow = Date.now()) => {
    const safeOffset = Number.isFinite(offsetMs) ? offsetMs : 0;
    return clientNow + safeOffset;
};

/**
 * Computes expected playback position (seconds) from a room's playback snapshot.
 */
export const getExpectedPosition = (playback, serverNow, maxDuration = Infinity) => {
    if (!playback || typeof playback.position !== "number") return 0;

    const base = Math.max(0, playback.position);
    let expected = base;

    if (playback.state === "playing" && Number.isFinite(playback.updatedAt)) {
        const elapsedSec = Math.max(0, serverNow - playback.updatedAt) / 1000;
        expected = base + elapsedSec;
    }

    if (Number.isFinite(maxDuration) && maxDuration > 0) {
        return Math.min(expected, maxDuration);
    }
    return expected;
};

/**
 * Determines how a client should correct playback drift relative to server expected time.
 */
export const getCorrection = (driftSeconds) => {
    if (!Number.isFinite(driftSeconds)) {
        return { type: "none", rate: 1 };
    }

    const abs = Math.abs(driftSeconds);
    if (abs < DRIFT_IGNORE_SECONDS) {
        return { type: "none", rate: 1 };
    }
    if (abs < DRIFT_SEEK_SECONDS) {
        return {
            type: "rate",
            rate: driftSeconds > 0 ? 1.05 : 0.95,
        };
    }
    return { type: "seek", rate: 1 };
};

/**
 * Clamps a seek position safely to finite non-negative media bounds.
 */
export const clampSeekTarget = (seconds, maxDuration = Infinity) => {
    if (!Number.isFinite(seconds) || seconds < 0) return 0;
    if (Number.isFinite(maxDuration) && maxDuration > 0) {
        return Math.min(seconds, maxDuration);
    }
    return seconds;
};
