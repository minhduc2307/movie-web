import { DEFAULT_CDN_IMAGE } from "./endpoints.js";

/**
 * Normalizes an image URL whether relative or absolute, falling back to a placeholder.
 *
 * @param {string} rawUrl - Relative or absolute image path
 * @param {string} [cdnDomain=DEFAULT_CDN_IMAGE] - CDN domain prefix for relative paths
 * @returns {string} Fully qualified URL or fallback path
 */
export const normalizeImageUrl = (rawUrl, cdnDomain = DEFAULT_CDN_IMAGE) => {
    if (!rawUrl || typeof rawUrl !== "string") {
        return "/NoImage.svg";
    }
    const trimmed = rawUrl.trim();
    if (
        !trimmed ||
        trimmed === "/NoImage.svg" ||
        trimmed === "NoImage.svg" ||
        trimmed.endsWith("/NoImage.svg")
    ) {
        return "/NoImage.svg";
    }
    if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
        return trimmed;
    }
    if (/^\/\/[^/]/.test(trimmed)) {
        return `https:${trimmed}`;
    }
    if (trimmed.startsWith("data:") || trimmed.startsWith("blob:")) {
        return trimmed;
    }
    const cleanPath = trimmed.replace(/^\/+/, "");
    const cleanDomain = (cdnDomain || DEFAULT_CDN_IMAGE).replace(/\/+$/, "");
    return `${cleanDomain}/${cleanPath}`;
};

/**
 * Normalizes image URLs for responsive rendering.
 * Note: wsrv.nl blocks phimimg.com by policy (HTTP 400 "Domain or TLD blocked by policy"),
 * so external URLs are returned directly to avoid an extra failed round-trip before fallback.
 *
 * @param {string} rawUrl - Relative or absolute image path
 * @param {object} [options]
 * @param {number} [options.width] - Target display width in pixels (reserved for future CDN support)
 * @param {number} [options.quality=80] - Output compression quality (reserved for future CDN support)
 * @param {string} [options.cdnDomain=DEFAULT_CDN_IMAGE] - CDN domain prefix for relative paths
 * @returns {string} Normalized image URL or fallback
 */
export const optimizeImageUrl = (
    rawUrl,
    { cdnDomain = DEFAULT_CDN_IMAGE } = {}
) => normalizeImageUrl(rawUrl, cdnDomain);

/**
 * Normalizes pagination information from either legacy or v1 format.
 *
 * @param {object} rawPagination
 * @returns {{totalItems: number, totalItemsPerPage: number, currentPage: number, pageRanges: number}}
 */
export const normalizePagination = (rawPagination = {}) => {
    return {
        totalItems: rawPagination?.totalItems ?? 0,
        totalItemsPerPage: rawPagination?.totalItemsPerPage ?? 10,
        currentPage: rawPagination?.currentPage ?? 1,
        pageRanges: rawPagination?.pageRanges ?? 5,
    };
};

/**
 * Normalizes a movie summary item from any list or search response.
 *
 * @param {object} rawItem - Raw movie item from API
 * @param {string} [cdnDomain=DEFAULT_CDN_IMAGE] - CDN domain to normalize relative URLs
 * @returns {object} Normalized movie object with both camelCase and legacy fields
 */
export const normalizeMovieItem = (rawItem, cdnDomain = DEFAULT_CDN_IMAGE) => {
    if (!rawItem) return null;

    const id = rawItem._id || rawItem.id || "";
    const posterUrl = normalizeImageUrl(rawItem.poster_url, cdnDomain);
    const thumbUrl = normalizeImageUrl(rawItem.thumb_url, cdnDomain);

    return {
        ...rawItem,
        id,
        _id: id,
        name: rawItem.name || "",
        originName: rawItem.origin_name || "",
        origin_name: rawItem.origin_name || "",
        slug: rawItem.slug || "",
        year: rawItem.year ? Number(rawItem.year) : null,
        time: rawItem.time || "",
        type: rawItem.type || "single",
        posterUrl,
        poster_url: posterUrl,
        thumbUrl,
        thumb_url: thumbUrl,
        episodeCurrent: rawItem.episode_current || "",
        episode_current: rawItem.episode_current || "",
        quality: rawItem.quality || "",
        lang: rawItem.lang || "",
        rating: rawItem.tmdb?.vote_average || rawItem.vote_average || 0,
    };
};

/**
 * Normalizes detailed movie data from either legacy (/phim/:slug) or v1 (/v1/api/phim/:slug).
 *
 * @param {object} rawResponse - Entire API response body
 * @returns {{status: any, movie: object, episodes: Array, breadCrumb: Array, seoOnPage: object}}
 */
export const normalizeMovieDetail = (rawResponse) => {
    if (!rawResponse) {
        return {
            status: false,
            movie: null,
            episodes: [],
            breadCrumb: [],
            seoOnPage: {},
        };
    }

    const isV1 = Boolean(rawResponse?.data?.item);
    const rawMovie = isV1
        ? rawResponse.data.item
        : rawResponse.movie;

    if (!rawMovie) {
        return {
            status: rawResponse.status || false,
            movie: null,
            episodes: [],
            breadCrumb: rawResponse?.data?.breadCrumb || [],
            seoOnPage: rawResponse?.data?.seoOnPage || {},
        };
    }

    const cdnDomain =
        rawResponse?.data?.APP_DOMAIN_CDN_IMAGE ||
        rawResponse?.APP_DOMAIN_CDN_IMAGE ||
        DEFAULT_CDN_IMAGE;

    const posterUrl = normalizeImageUrl(rawMovie.poster_url, cdnDomain);
    const thumbUrl = normalizeImageUrl(rawMovie.thumb_url, cdnDomain);
    const id = rawMovie._id || rawMovie.id || "";

    const normalizedMovie = {
        ...rawMovie,
        id,
        _id: id,
        name: rawMovie.name || "",
        originName: rawMovie.origin_name || "",
        origin_name: rawMovie.origin_name || "",
        slug: rawMovie.slug || "",
        year: rawMovie.year ? Number(rawMovie.year) : null,
        time: rawMovie.time || "",
        type: rawMovie.type || "single",
        content: rawMovie.content || "",
        posterUrl,
        poster_url: posterUrl,
        thumbUrl,
        thumb_url: thumbUrl,
        trailerUrl: rawMovie.trailer_url || "",
        trailer_url: rawMovie.trailer_url || "",
        episodeCurrent: rawMovie.episode_current || "",
        episode_current: rawMovie.episode_current || "",
        quality: rawMovie.quality || "",
        lang: rawMovie.lang || "",
        category: rawMovie.category || [],
        country: rawMovie.country || [],
        director: rawMovie.director || [],
        actor: rawMovie.actor || [],
        rating: rawMovie.tmdb?.vote_average || rawMovie.vote_average || 0,
        tmdb: rawMovie.tmdb || {},
    };

    const episodes =
        rawMovie.episodes ||
        rawResponse.episodes ||
        rawResponse?.data?.episodes ||
        [];

    return {
        status: rawResponse.status,
        movie: normalizedMovie,
        episodes,
        breadCrumb: rawResponse?.data?.breadCrumb || [],
        seoOnPage: rawResponse?.data?.seoOnPage || {},
    };
};
