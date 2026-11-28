import { describe, expect, it } from "vitest";
import {
    normalizeImageUrl,
    normalizeMovieDetail,
    normalizeMovieItem,
    normalizePagination,
} from "./dto";

describe("API DTO normalizers", () => {
    it("normalizes relative, protocol-relative, and missing image URLs", () => {
        expect(normalizeImageUrl("uploads/poster.webp", "https://phimimg.com")).toBe(
            "https://phimimg.com/uploads/poster.webp"
        );
        expect(normalizeImageUrl("//cdn.example.com/p.jpg")).toBe("https://cdn.example.com/p.jpg");
        expect(normalizeImageUrl("")).toBe("/NoImage.svg");
        expect(normalizeImageUrl("/NoImage.svg")).toBe("/NoImage.svg");
    });

    it("normalizes pagination fallback values safely", () => {
        expect(
            normalizePagination({ totalItems: 120, totalItemsPerPage: 24, currentPage: 2 })
        ).toEqual({
            totalItems: 120,
            totalItemsPerPage: 24,
            currentPage: 2,
            pageRanges: 5,
        });
        expect(normalizePagination(null)).toEqual({
            totalItems: 0,
            totalItemsPerPage: 10,
            currentPage: 1,
            pageRanges: 5,
        });
    });

    it("normalizes movie item across legacy/v1 field styles", () => {
        const item = normalizeMovieItem(
            {
                _id: "abc123",
                name: "Test Movie",
                origin_name: "Original Name",
                slug: "test-movie",
                year: "2025",
                poster_url: "poster.webp",
                thumb_url: "https://phimimg.com/thumb.webp",
                tmdb: { vote_average: 8.4 },
            },
            "https://phimimg.com"
        );
        expect(item.id).toBe("abc123");
        expect(item.originName).toBe("Original Name");
        expect(item.year).toBe(2025);
        expect(item.posterUrl).toBe("https://phimimg.com/poster.webp");
        expect(item.rating).toBe(8.4);
    });

    it("normalizes v1 movie detail payloads cleanly", () => {
        const detail = normalizeMovieDetail({
            status: true,
            data: {
                APP_DOMAIN_CDN_IMAGE: "https://phimimg.com",
                item: {
                    _id: "m1",
                    name: "Series One",
                    slug: "series-one",
                    poster_url: "p.webp",
                    episodes: [{ server_name: "Vietsub", server_data: [{ name: "1" }] }],
                },
            },
        });
        expect(detail.status).toBe(true);
        expect(detail.movie?.id).toBe("m1");
        expect(detail.movie?.posterUrl).toBe("https://phimimg.com/p.webp");
        expect(detail.episodes).toHaveLength(1);
    });
});
