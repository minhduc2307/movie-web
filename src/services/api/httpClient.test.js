import { afterEach, describe, expect, it, vi } from "vitest";
import { buildQueryString, httpClient, HttpError } from "./httpClient";

describe("httpClient", () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    it("serializes query params while omitting empty values", () => {
        expect(
            buildQueryString({ page: 2, category: "hanh-dong", empty: "", missing: undefined, nil: null })
        ).toBe("?page=2&category=hanh-dong");
        expect(buildQueryString({})).toBe("");
    });

    it("deduplicates concurrent cached GET requests and serves from cache", async () => {
        const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue({
            ok: true,
            json: async () => ({ items: [1, 2, 3] }),
        });

        const url = "https://example.test/dedupe-check";
        const [a, b] = await Promise.all([
            httpClient.get(url, { cache: true }),
            httpClient.get(url, { cache: true }),
        ]);
        const c = await httpClient.get(url, { cache: true });

        expect(fetchMock).toHaveBeenCalledTimes(1);
        expect(a).toEqual({ items: [1, 2, 3] });
        expect(b).toEqual(a);
        expect(c).toEqual(a);
    });

    it("throws HttpError on non-OK HTTP status", async () => {
        vi.spyOn(globalThis, "fetch").mockResolvedValue({
            ok: false,
            status: 404,
            json: async () => ({ message: "Not Found" }),
        });

        await expect(httpClient.get("https://example.test/missing")).rejects.toThrow(HttpError);
    });
});
