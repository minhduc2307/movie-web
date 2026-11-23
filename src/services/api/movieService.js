import { ENDPOINTS, DEFAULT_CDN_IMAGE } from "./endpoints.js";
import { httpClient } from "./httpClient.js";
import {
    normalizeImageUrl,
    normalizeMovieDetail,
    normalizeMovieItem,
    normalizePagination,
} from "./dto.js";

export const movieService = {
    /**
     * Lấy danh sách phim mới cập nhật (hỗ trợ các phiên bản: legacy, v1, v3)
     */
    async getNewUpdatedMovies(page = 1, version = "v3") {
        let endpoint;
        if (version === "legacy") {
            endpoint = ENDPOINTS.NEW_UPDATED_LEGACY;
        } else if (version === "v1") {
            endpoint = ENDPOINTS.NEW_UPDATED_V1;
        } else {
            endpoint = ENDPOINTS.NEW_UPDATED_V3;
        }

        const res = await httpClient.get(endpoint, { params: { page }, cache: true });

        if (version === "v1") {
            const cdn = res.data?.APP_DOMAIN_CDN_IMAGE || DEFAULT_CDN_IMAGE;
            const rawItems = res.data?.items || [];
            return {
                status: res.status,
                items: rawItems.map((item) => normalizeMovieItem(item, cdn)),
                pagination: normalizePagination(res.data?.params?.pagination),
                params: res.data?.params,
            };
        }

        const rawItems = res.items || [];
        return {
            status: res.status,
            items: rawItems.map((item) =>
                normalizeMovieItem(item, DEFAULT_CDN_IMAGE)
            ),
            pagination: normalizePagination(res.pagination),
        };
    },

    /**
     * Lấy danh sách phim theo loại và bộ lọc (phim-le, phim-bo, hoat-hinh, tv-shows)
     */
    async getMoviesByType(typeSlug = "phim-moi-cap-nhat", params = {}, signal) {
        const effectiveSignal = signal || params?.signal;
        const cleanParams = { ...params };
        delete cleanParams.signal;

        const endpoint = ENDPOINTS.LIST_BY_TYPE(typeSlug);
        const res = await httpClient.get(endpoint, {
            params: cleanParams,
            signal: effectiveSignal,
            cache: !effectiveSignal,
        });
        const cdn = res.data?.APP_DOMAIN_CDN_IMAGE || DEFAULT_CDN_IMAGE;
        const rawItems = res.data?.items || [];

        return {
            status: res.status,
            items: rawItems.map((item) => normalizeMovieItem(item, cdn)),
            pagination: normalizePagination(res.data?.params?.pagination),
            breadCrumb: res.data?.breadCrumb || [],
            params: res.data?.params,
        };
    },

    /**
     * Lấy chi tiết phim theo slug (legacy endpoint)
     */
    async getMovieDetail(slug) {
        const endpoint = ENDPOINTS.MOVIE_DETAIL(slug);
        const res = await httpClient.get(endpoint, { cache: true });
        return normalizeMovieDetail(res);
    },

    /**
     * Lấy chi tiết phim theo slug (v1 RESTful endpoint)
     */
    async getMovieDetailV1(slug) {
        const endpoint = ENDPOINTS.MOVIE_DETAIL_V1(slug);
        const res = await httpClient.get(endpoint);
        return normalizeMovieDetail(res);
    },

    /**
     * Lấy chi tiết phim theo MongoDB ID
     */
    async getMovieById(id) {
        const endpoint = ENDPOINTS.MOVIE_BY_ID(id);
        const res = await httpClient.get(endpoint);
        return normalizeMovieDetail(res);
    },

    /**
     * Tìm phim theo TMDB ID
     */
    async getMovieByTmdb(tmdbId) {
        const res = await httpClient.get(ENDPOINTS.SEARCH_TMDB, {
            params: { tmdb: tmdbId },
        });
        const cdn = res.data?.APP_DOMAIN_CDN_IMAGE || DEFAULT_CDN_IMAGE;
        const rawItems = res.data?.items || [];
        return {
            status: res.status,
            items: rawItems.map((item) => normalizeMovieItem(item, cdn)),
            params: res.data?.params,
        };
    },

    /**
     * Tìm phim theo IMDb ID
     */
    async getMovieByImdb(imdbId) {
        const res = await httpClient.get(ENDPOINTS.SEARCH_IMDB, {
            params: { imdb: imdbId },
        });
        const cdn = res.data?.APP_DOMAIN_CDN_IMAGE || DEFAULT_CDN_IMAGE;
        const rawItems = res.data?.items || [];
        return {
            status: res.status,
            items: rawItems.map((item) => normalizeMovieItem(item, cdn)),
            params: res.data?.params,
        };
    },

    /**
     * Lấy danh sách hình ảnh (backdrops, posters) của phim
     */
    async getMovieImages(slug) {
        return await httpClient.get(ENDPOINTS.MOVIE_IMAGES(slug));
    },

    /**
     * Lấy danh sách diễn viên, đạo diễn của phim
     */
    async getMoviePeoples(slug) {
        return await httpClient.get(ENDPOINTS.MOVIE_PEOPLES(slug));
    },

    /**
     * Lấy từ khóa / tags của phim
     */
    async getMovieKeywords(slug) {
        return await httpClient.get(ENDPOINTS.MOVIE_KEYWORDS(slug));
    },

    /**
     * Lấy toàn bộ danh sách thể loại
     */
    async getCategories() {
        return await httpClient.get(ENDPOINTS.GENRES, { cache: true });
    },

    /**
     * Lấy danh sách phim theo thể loại
     */
    async getMoviesByCategory(slug, params = {}) {
        const endpoint = ENDPOINTS.MOVIES_BY_GENRE(slug);
        const res = await httpClient.get(endpoint, { params });
        const cdn = res.data?.APP_DOMAIN_CDN_IMAGE || DEFAULT_CDN_IMAGE;
        const rawItems = res.data?.items || [];

        return {
            status: res.status,
            items: rawItems.map((item) => normalizeMovieItem(item, cdn)),
            pagination: normalizePagination(res.data?.params?.pagination),
            breadCrumb: res.data?.breadCrumb || [],
            params: res.data?.params,
        };
    },

    /**
     * Lấy toàn bộ danh sách quốc gia
     */
    async getCountries() {
        return await httpClient.get(ENDPOINTS.COUNTRIES, { cache: true });
    },

    /**
     * Lấy danh sách phim theo quốc gia
     */
    async getMoviesByCountry(slug, params = {}) {
        const endpoint = ENDPOINTS.MOVIES_BY_COUNTRY(slug);
        const res = await httpClient.get(endpoint, { params });
        const cdn = res.data?.APP_DOMAIN_CDN_IMAGE || DEFAULT_CDN_IMAGE;
        const rawItems = res.data?.items || [];

        return {
            status: res.status,
            items: rawItems.map((item) => normalizeMovieItem(item, cdn)),
            pagination: normalizePagination(res.data?.params?.pagination),
            breadCrumb: res.data?.breadCrumb || [],
            params: res.data?.params,
        };
    },

    /**
     * Lấy danh sách năm phát hành
     */
    async getYears() {
        return await httpClient.get(ENDPOINTS.YEARS, { cache: true });
    },

    /**
     * Lấy danh sách phim theo năm phát hành
     */
    async getMoviesByYear(year, params = {}) {
        const endpoint = ENDPOINTS.MOVIES_BY_YEAR(year);
        const res = await httpClient.get(endpoint, { params });
        const cdn = res.data?.APP_DOMAIN_CDN_IMAGE || DEFAULT_CDN_IMAGE;
        const rawItems = res.data?.items || [];

        return {
            status: res.status,
            items: rawItems.map((item) => normalizeMovieItem(item, cdn)),
            pagination: normalizePagination(res.data?.params?.pagination),
            breadCrumb: res.data?.breadCrumb || [],
            params: res.data?.params,
        };
    },

    /**
     * Tìm kiếm phim theo từ khóa
     */
    async searchMovies(keyword, params = {}, signal) {
        const effectiveSignal = signal || params?.signal;
        const cleanParams = { ...params };
        delete cleanParams.signal;

        const res = await httpClient.get(ENDPOINTS.SEARCH, {
            params: { keyword, ...cleanParams },
            signal: effectiveSignal,
        });
        const cdn = res.data?.APP_DOMAIN_CDN_IMAGE || DEFAULT_CDN_IMAGE;
        const rawItems = res.data?.items || [];

        return {
            status: res.status,
            items: rawItems.map((item) => normalizeMovieItem(item, cdn)),
            pagination: normalizePagination(res.data?.params?.pagination),
            params: res.data?.params,
        };
    },
};

export { normalizeImageUrl };
