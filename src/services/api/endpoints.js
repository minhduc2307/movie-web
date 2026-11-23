export const API_BASE_URL =
    (typeof import.meta !== "undefined" &&
        import.meta.env &&
        import.meta.env.VITE_API_HOST) ||
    "https://phimapi.com";
export const DEFAULT_CDN_IMAGE = "https://phimimg.com";

export const ENDPOINTS = {
    // 1. Phim mới / Trang chủ
    NEW_UPDATED_LEGACY: "/danh-sach/phim-moi-cap-nhat",
    NEW_UPDATED_V3: "/danh-sach/phim-moi-cap-nhat-v3",
    NEW_UPDATED_V1: "/v1/api/danh-sach/phim-moi-cap-nhat",

    // 2. Danh sách theo loại (phim-le, phim-bo, hoat-hinh, tv-shows)
    LIST_BY_TYPE: (typeSlug) => `/v1/api/danh-sach/${typeSlug}`,

    // 3. Chi tiết phim
    MOVIE_DETAIL: (slug) => `/phim/${slug}`,
    MOVIE_DETAIL_V1: (slug) => `/v1/api/phim/${slug}`,
    MOVIE_BY_ID: (id) => `/phim/id/${id}`,
    SEARCH_TMDB: "/v1/api/tim-kiem",
    SEARCH_IMDB: "/v1/api/tim-kiem",
    MOVIE_IMAGES: (slug) => `/v1/api/phim/${slug}/images`,
    MOVIE_PEOPLES: (slug) => `/v1/api/phim/${slug}/peoples`,
    MOVIE_KEYWORDS: (slug) => `/v1/api/phim/${slug}/keywords`,

    // 4. Thể loại
    GENRES: "/the-loai",
    MOVIES_BY_GENRE: (slug) => `/v1/api/the-loai/${slug}`,

    // 5. Quốc gia
    COUNTRIES: "/quoc-gia",
    MOVIES_BY_COUNTRY: (slug) => `/v1/api/quoc-gia/${slug}`,

    // 6. Năm phát hành
    YEARS: "/nam-phat-hanh",
    MOVIES_BY_YEAR: (year) => `/v1/api/nam/${year}`,

    // 7. Tìm kiếm
    SEARCH: "/v1/api/tim-kiem",
};
