import { describe, expect, it } from "vitest";
import { percent, percentOf, percentParts } from "./format";

describe("percent", () => {
  it("rounds ordinary shares to whole percents", () => {
    expect(percent(0.564)).toBe("56%");
    expect(percent(0.125)).toBe("13%");
    expect(percentOf(1, 3)).toBe("33%");
  });
  it("never shows 0% for a share that isn't zero", () => {
    expect(percentOf(12, 3718)).toBe("0.3%");
    expect(percentOf(37, 3718)).toBe("0.9%"); // 0.995%: rounded down, not up to 1.0%
    expect(percentOf(1, 3718)).toBe("<0.1%");
    expect(percentOf(0, 3718)).toBe("0%");
  });
  it("never shows 100% for a share that isn't everyone", () => {
    expect(percentOf(3706, 3718)).toBe("99.6%");
    expect(percentOf(3717, 3718)).toBe(">99.9%");
    expect(percentOf(3718, 3718)).toBe("100%");
  });
  it("is 0% when there's no one to count", () => {
    expect(percentOf(0, 0)).toBe("0%");
    expect(percent(Number.NaN)).toBe("0%");
  });
  it("gives the parts for an animated number", () => {
    expect(percentParts(12 / 3718)).toEqual({ value: 0.3, decimals: 1, prefix: "" });
    expect(percentParts(0.0001)).toEqual({ value: 0.1, decimals: 1, prefix: "<" });
    expect(percentParts(0.5)).toEqual({ value: 50, decimals: 0, prefix: "" });
  });
});
