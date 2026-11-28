import { describe, expect, it } from "vitest";
import {
    clampSeekTarget,
    getCorrection,
    getExpectedPosition,
    getServerNow,
} from "./sync";

describe("watch-party sync math", () => {
    it("calculates server time using offset safely", () => {
        expect(getServerNow(500, 10000)).toBe(10500);
        expect(getServerNow(NaN, 10000)).toBe(10000);
    });

    it("computes expected position for paused and playing states", () => {
        expect(
            getExpectedPosition({ state: "paused", position: 42, updatedAt: 1000 }, 6000, 120)
        ).toBe(42);
        expect(
            getExpectedPosition({ state: "playing", position: 10, updatedAt: 1000 }, 4000, 120)
        ).toBe(13);
        expect(
            getExpectedPosition({ state: "playing", position: 118, updatedAt: 1000 }, 10000, 120)
        ).toBe(120);
    });

    it("selects none, rate adjustment, or hard seek based on drift", () => {
        expect(getCorrection(0.2)).toEqual({ type: "none", rate: 1 });
        expect(getCorrection(1.0)).toEqual({ type: "rate", rate: 1.05 });
        expect(getCorrection(-1.0)).toEqual({ type: "rate", rate: 0.95 });
        expect(getCorrection(3.5)).toEqual({ type: "seek", rate: 1 });
    });

    it("clamps seek targets within media duration", () => {
        expect(clampSeekTarget(-5, 100)).toBe(0);
        expect(clampSeekTarget(150, 100)).toBe(100);
        expect(clampSeekTarget(45, 100)).toBe(45);
    });
});
