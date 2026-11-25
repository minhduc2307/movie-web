export const PLAYBACK_RATES = [0.5, 0.75, 1, 1.25, 1.5, 2];

export const SEEK_STEP_SECONDS = 10;

export const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

export const formatMediaTime = (seconds) => {
    if (!Number.isFinite(seconds) || seconds < 0) return "00:00";

    const totalSeconds = Math.floor(seconds);
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;

    const pad = (n) => String(n).padStart(2, "0");
    if (hrs > 0) {
        return `${hrs}:${pad(mins)}:${pad(secs)}`;
    }
    return `${pad(mins)}:${pad(secs)}`;
};

export const getBufferedPercent = (video, duration) => {
    if (!video || !Number.isFinite(duration) || duration <= 0) return 0;
    try {
        const { buffered, currentTime } = video;
        for (let i = 0; i < buffered.length; i += 1) {
            if (buffered.start(i) <= currentTime && buffered.end(i) >= currentTime) {
                return clamp((buffered.end(i) / duration) * 100, 0, 100);
            }
        }
        if (buffered.length > 0) {
            return clamp((buffered.end(buffered.length - 1) / duration) * 100, 0, 100);
        }
    } catch {
        // Ignore Safari TimeRanges errors while metadata settles
    }
    return 0;
};
