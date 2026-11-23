export const TABS = [
    {
        titleKey: "movie.featuredSingle",
        typeSlug: "phim-le",
        url: `${import.meta.env.VITE_API_HOST}/v1/api/danh-sach/phim-le?limit=6`,
    },
    {
        titleKey: "movie.featuredSeries",
        typeSlug: "phim-bo",
        url: `${import.meta.env.VITE_API_HOST}/v1/api/danh-sach/phim-bo?limit=6`,
    },
    {
        titleKey: "movie.featuredAnime",
        typeSlug: "hoat-hinh",
        url: `${import.meta.env.VITE_API_HOST}/v1/api/danh-sach/hoat-hinh?limit=6`,
    },
    {
        titleKey: "movie.featuredTvShows",
        typeSlug: "tv-shows",
        url: `${import.meta.env.VITE_API_HOST}/v1/api/danh-sach/tv-shows?limit=6`,
    },
];
