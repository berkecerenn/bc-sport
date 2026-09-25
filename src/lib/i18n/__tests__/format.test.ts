import { describe, expect, it } from "vitest";
import { formatNewsDate } from "../format";

describe("formatNewsDate", () => {
  // 2026-09-25T14:00:00Z -> Europe/Istanbul'da (UTC+3) 17:00, 25 Eylül.
  const iso = "2026-09-25T14:00:00Z";

  it("formats a TR date with day, short month and Istanbul-local time", () => {
    const result = formatNewsDate(iso, "tr");
    expect(result).toContain("25");
    expect(result).toContain("17:00");
  });

  it("formats an EN date with day, short month and Istanbul-local time", () => {
    const result = formatNewsDate(iso, "en");
    expect(result).toContain("25");
    expect(result).toContain("17:00");
  });
});
