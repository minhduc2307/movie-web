import { describe, expect, it } from "vitest";
import {
    extractYoutubeId,
    findBestHlsTarget,
    formatWatchDisplayTitle,
    isSafeHttpUrl,
    localizeMovieMetaText,
    stripHtml,
} from "./movieUtils";

describe("movieUtils", () => {
    it("strips HTML tags cleanly", () => {
        expect(stripHtml("<p>Hello <strong>World</strong></p>")).toBe("Hello World");
        expect(stripHtml(null)).toBe("");
        expect(stripHtml("   Plain text   ")).toBe("Plain text");
    });

    it("validates http and https URLs only", () => {
        expect(isSafeHttpUrl("https://phimapi.com/embed/1")).toBe(true);
        expect(isSafeHttpUrl("http://example.com/a")).toBe(true);
        expect(isSafeHttpUrl("javascript:alert(1)")).toBe(false);
        expect(isSafeHttpUrl("data:text/html,hi")).toBe(false);
    });

    it("extracts YouTube video IDs from common URL formats", () => {
        expect(extractYoutubeId("https://www.youtube.com/watch?v=dQw4w9WgXcQ")).toBe("dQw4w9WgXcQ");
        expect(extractYoutubeId("https://youtu.be/dQw4w9WgXcQ?t=10")).toBe("dQw4w9WgXcQ");
        expect(extractYoutubeId("https://www.youtube.com/embed/dQw4w9WgXcQ")).toBe("dQw4w9WgXcQ");
        expect(extractYoutubeId("https://example.com")).toBe("");
    });

    it("picks preferred or first playable HLS target", () => {
        const servers = [
            { server_data: [{ link_m3u8: "" }, { link_m3u8: "https://cdn/ep2.m3u8" }] },
            { server_data: [{ link_m3u8: "https://cdn/s2-ep1.m3u8" }] },
        ];
        expect(findBestHlsTarget(servers, 0, 1)).toEqual({ serverIdx: 0, episodeIndex: 1 });
        expect(findBestHlsTarget(servers, 0, 0)).toEqual({ serverIdx: 0, episodeIndex: 1 });
        expect(findBestHlsTarget([{ server_data: [{ link_m3u8: "" }] }], 0, 0)).toBeNull();
    });

    it("formats watch title cleanly for single and series", () => {
        expect(
            formatWatchDisplayTitle({
                movieName: "Avatar",
                currentEpisode: { name: "Full" },
                totalChapters: 1,
            })
        ).toBe("Avatar");

        expect(
            formatWatchDisplayTitle({
                movieName: "One Piece",
                currentEpisode: { name: "Tập 12" },
                episodeIndex: 11,
                totalChapters: 100,
                episodePrefix: "Ep",
            })
        ).toBe("One Piece — Ep 12");
    });

    it("localizes categories and status strings when language is en", () => {
        expect(localizeMovieMetaText("Hành Động", "en")).toBe("Action");
        expect(localizeMovieMetaText("Hoàn Tất (12/12)", "en")).toBe("Completed (12/12)");
        expect(localizeMovieMetaText("Hành Động", "vi")).toBe("Hành Động");
    });
});
