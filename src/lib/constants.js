export const HOME_SECTION_LIMIT = 12;

export const TABS = [
    {
        titleKey: "movie.featuredSingle",
        typeSlug: "phim-le",
        url: `${import.meta.env.VITE_API_HOST}/v1/api/danh-sach/phim-le?limit=${HOME_SECTION_LIMIT}`,
    },
    {
        titleKey: "movie.featuredSeries",
        typeSlug: "phim-bo",
        url: `${import.meta.env.VITE_API_HOST}/v1/api/danh-sach/phim-bo?limit=${HOME_SECTION_LIMIT}`,
    },
    {
        titleKey: "movie.featuredAnime",
        typeSlug: "hoat-hinh",
        url: `${import.meta.env.VITE_API_HOST}/v1/api/danh-sach/hoat-hinh?limit=${HOME_SECTION_LIMIT}`,
    },
    {
        titleKey: "movie.featuredTvShows",
        typeSlug: "tv-shows",
        url: `${import.meta.env.VITE_API_HOST}/v1/api/danh-sach/tv-shows?limit=${HOME_SECTION_LIMIT}`,
    },
];
