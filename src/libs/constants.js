export const TABS = [
    {
        title: "Phim lẻ đề cử",
        url: `${import.meta.env.VITE_API_HOST}/v1/api/danh-sach/phim-le?limit=6`,
    },
    {
        title: "Phim bộ đề cử",
        url: `${import.meta.env.VITE_API_HOST}/v1/api/danh-sach/phim-bo?limit=6`,
    },
    {
        title: "Phim hoạt hình đề cử",
        url: `${import.meta.env.VITE_API_HOST}/v1/api/danh-sach/hoat-hinh?limit=6`,
    },
    {
        title: "TV Shows đề cử",
        url: `${import.meta.env.VITE_API_HOST}/v1/api/danh-sach/tv-shows?limit=6`,
    },
];
