import { describe, expect, it } from "vitest";

import { safeRedirectPath } from "../safeRedirect";

describe("safeRedirectPath", () => {
  it.each(["/saved", "/visualizer/sorting/bubble-sort?saved=abc", "/"])(
    "keeps the local path %s",
    (path) => {
      expect(safeRedirectPath(path)).toBe(path);
    }
  );

  it.each([
    null,
    undefined,
    "",
    "saved",
    "https://example.com",
    "//example.com",
    "/\\example.com",
    "/\t/example.com",
    "javascript:alert(1)",
  ])("falls back for %s", (path) => {
    expect(safeRedirectPath(path)).toBe("/saved");
  });

  it("uses the provided fallback", () => {
    expect(safeRedirectPath("https://example.com", "/")).toBe("/");
  });
});
