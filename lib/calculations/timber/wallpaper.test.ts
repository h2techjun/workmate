import { describe, it, expect } from "vitest";
import { calculateWallpaper, wallpaperInputSchema } from "./wallpaper";

describe("calculateWallpaper", () => {
  it("실크(국산 광폭) 무늬없음 16.5㎡ — 2롤 필요", () => {
    const r = calculateWallpaper(
      wallpaperInputSchema.parse({
        wallArea: 16.5,
        wallpaperType: "silk",
        patternMatch: false,
      }),
    );
    expect(r.wastePercent).toBe(10);
    expect(r.areaWithWaste).toBeCloseTo(18.15, 2); // 16.5 × 1.1
    expect(r.coveragePerRoll).toBe(16.5);
    expect(r.rolls).toBe(2); // ceil(18.15 / 16.5)
    expect(r.glueKg).toBe(2); // 2롤 × 1kg
  });

  it("실크 무늬맞춤(리피트) 33㎡ — 로스율 20%로 3롤", () => {
    const r = calculateWallpaper(
      wallpaperInputSchema.parse({
        wallArea: 33,
        wallpaperType: "silk",
        patternMatch: true,
      }),
    );
    expect(r.wastePercent).toBe(20);
    expect(r.areaWithWaste).toBeCloseTo(39.6, 2); // 33 × 1.2
    expect(r.rolls).toBe(3); // ceil(39.6 / 16.5)
  });

  it("합지는 실크와 동일 국산 광폭 규격(16.5㎡ 커버)을 공유한다", () => {
    const r = calculateWallpaper(
      wallpaperInputSchema.parse({
        wallArea: 8,
        wallpaperType: "paper",
        patternMatch: false,
      }),
    );
    expect(r.coveragePerRoll).toBe(16.5);
    expect(r.rolls).toBe(1); // ceil(8.8 / 16.5)
  });

  it("수입 벽지 무늬없음 10.6㎡ — 롤당 5.3㎡ 커버로 3롤", () => {
    const r = calculateWallpaper(
      wallpaperInputSchema.parse({
        wallArea: 10.6,
        wallpaperType: "import",
        patternMatch: false,
      }),
    );
    expect(r.coveragePerRoll).toBe(5.3);
    expect(r.areaWithWaste).toBeCloseTo(11.66, 2); // 10.6 × 1.1
    expect(r.rolls).toBe(3); // ceil(11.66 / 5.3)
  });

  it("수입 벽지 무늬맞춤 5.3㎡ — 로스율 20%로 2롤", () => {
    const r = calculateWallpaper(
      wallpaperInputSchema.parse({
        wallArea: 5.3,
        wallpaperType: "import",
        patternMatch: true,
      }),
    );
    expect(r.areaWithWaste).toBeCloseTo(6.36, 2); // 5.3 × 1.2
    expect(r.rolls).toBe(2); // ceil(6.36 / 5.3)
  });

  it("면적 0이면 롤 수·풀 소요량 모두 0", () => {
    const r = calculateWallpaper(wallpaperInputSchema.parse({ wallArea: 0 }));
    expect(r.rolls).toBe(0);
    expect(r.glueKg).toBe(0);
  });
});
