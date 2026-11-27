export const isSafeHttpUrl = (url) => {
    if (!url || typeof url !== "string") return false;
    try {
        const parsed = new URL(url.trim());
        return parsed.protocol === "https:" || parsed.protocol === "http:";
    } catch {
        return false;
    }
};

export const extractYoutubeId = (url) => {
    if (!url || typeof url !== "string") return "";
    const match = url.match(
        /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
    );
    return match?.[1] || "";
};

export const hasPlayableHls = (servers = []) =>
    servers.some((srv) =>
        (srv?.server_data || []).some((ep) => Boolean(ep?.link_m3u8?.trim()))
    );

export const findBestHlsTarget = (servers = [], preferredServer = 0, preferredChap = 0) => {
    const preferredEp = servers[preferredServer]?.server_data?.[preferredChap];
    if (preferredEp?.link_m3u8?.trim()) {
        return { serverIdx: preferredServer, episodeIndex: preferredChap };
    }

    for (let sIdx = 0; sIdx < servers.length; sIdx += 1) {
        const list = servers[sIdx]?.server_data || [];
        const foundIdx = list.findIndex((ep) => Boolean(ep?.link_m3u8?.trim()));
        if (foundIdx !== -1) {
            return { serverIdx: sIdx, episodeIndex: foundIdx };
        }
    }

    return null;
};

export const formatWatchDisplayTitle = ({
    movieName = "",
    currentEpisode,
    episodeIndex = 0,
    totalChapters = 1,
    episodePrefix = "Tập",
}) => {
    if (totalChapters <= 1) return movieName;

    const epName = currentEpisode?.name?.trim();
    const episodeLabel = epName
        ? epName.toLowerCase().includes("tập")
            ? epName
            : `${episodePrefix} ${epName}`
        : `${episodePrefix} ${episodeIndex + 1}`;

    return movieName ? `${movieName} — ${episodeLabel}` : episodeLabel;
};
