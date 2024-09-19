export const TABS = [
    {
        title: "Phim lẻ đề cử",
        url: `${import.meta.env.VITE_API_HOST2}/v1/api/danh-sach/phim-le?limit=12`,
    },
    {
        title: "Phim bộ đề cử",
        url: `${import.meta.env.VITE_API_HOST2}/v1/api/danh-sach/phim-bo`,
    },
    {
        title: "Phim hoạt hình đề cử",
        url: `${import.meta.env.VITE_API_HOST2}/v1/api/danh-sach/hoat-hinh`,
    },
    {
        title: "TV Shows đề cử",
        url: `${import.meta.env.VITE_API_HOST2}/v1/api/danh-sach/tv-shows`,
    },
];
