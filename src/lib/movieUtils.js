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
    let episodeLabel;
    if (epName && /^tập\s*/i.test(epName)) {
        const suffix = epName.replace(/^tập\s*/i, "").trim();
        episodeLabel = `${episodePrefix} ${suffix}`;
    } else if (epName) {
        episodeLabel = epName;
    } else {
        episodeLabel = `${episodePrefix} ${episodeIndex + 1}`;
    }

    return movieName ? `${movieName} — ${episodeLabel}` : episodeLabel;
};

const API_CATEGORY_EN_MAP = {
    "chinh kich": "Drama",
    "tam ly": "Psychological",
    "hanh dong": "Action",
    "hai huoc": "Comedy",
    "tinh cam": "Romance",
    "vien tuong": "Sci-Fi",
    "kinh di": "Horror",
    "co trang": "Historical",
    "phieu luu": "Adventure",
    "hinh su": "Crime",
    "bi an": "Mystery",
    "khoa hoc": "Science",
    "gia dinh": "Family",
    "chien tranh": "War",
    "hoat hinh": "Anime",
    "hoc duong": "School",
    "am nhac": "Music",
    "the thao": "Sports",
    "tai lieu": "Documentary",
    "than thoai": "Mythology",
    "tre em": "Kids",
    "vo thuat": "Martial Arts",
    "mien tay": "Western",
    "kinh dien": "Classic",
    "phim ngan": "Short",
};

const stripVietnameseAccents = (str) =>
    str
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/đ/g, "d")
        .replace(/Đ/g, "D")
        .toLowerCase()
        .trim();

export const localizeMovieMetaText = (value, language) => {
    if (!value || language !== "en") return value;
    const raw = String(value).trim();
    const normalized = stripVietnameseAccents(raw);

    if (API_CATEGORY_EN_MAP[normalized]) {
        return API_CATEGORY_EN_MAP[normalized];
    }

    return raw
        .replace(/Hoàn Tất/gi, "Completed")
        .replace(/^Tập\s+/i, "Ep ")
        .replace(/\bphút\/tập\b/gi, "min/ep")
        .replace(/\bphút\b/gi, "min")
        .replace(/Đang cập nhật/gi, "Updating");
};
