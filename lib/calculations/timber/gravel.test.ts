import { describe, it, expect } from "vitest";
import { calculateGravel, gravelInputSchema } from "./gravel";
import {
  calculateDeck,
  calculateFence,
  deckInputSchema,
  fenceInputSchema,
} from "./deckFence";

const grv = (o: Record<string, unknown>) => gravelInputSchema.parse(o);
const dck = (o: Record<string, unknown>) => deckInputSchema.parse(o);
const fnc = (o: Record<string, unknown>) => fenceInputSchema.parse(o);

describe("자갈/골재", () => {
  it("10m² × 10cm 자갈 → 1m³, 다짐 20% → 1.2m³", () => {
    const out = calculateGravel(
      grv({ area: 10, depthCm: 10, material: "gravel", compaction: 20 }),
    );
    expect(out.volumeM3).toBe(1);
    expect(out.volumeWithCompaction).toBe(1.2);
  });

  it("무게 = 부피 × 밀도 (자갈 1.5)", () => {
    const out = calculateGravel(
      grv({ area: 10, depthCm: 10, material: "gravel", compaction: 0 }),
    );
    expect(out.density).toBe(1.5);
    expect(out.weightTon).toBe(1.5); // 1m³ × 1.5
  });

  it("모래 밀도 1.6", () => {
    const out = calculateGravel(grv({ area: 10, depthCm: 10, material: "sand", compaction: 0 }));
    expect(out.density).toBe(1.6);
  });

  it("25kg 포대·톤백 개수", () => {
    const out = calculateGravel(grv({ area: 10, depthCm: 10, material: "gravel", compaction: 0 }));
    // 1500kg / 25 = 60포대, 1.5톤 → 톤백 2개
    expect(out.bags25kg).toBe(60);
    expect(out.tonBags).toBe(2);
  });
});

describe("데크 보드", () => {
  it("20m² 데크, 140mm 보드, 5mm gap, 3.6m → 보드 장수", () => {
    const out = calculateDeck(
      dck({ area: 20, boardWidth: 140, boardLength: 3.6, gap: 5, waste: 10 }),
    );
    // 유효폭 145mm = 0.145m, 1장 면적 0.145×3.6 = 0.522m²
    expect(out.effectiveBoardArea).toBeCloseTo(0.522, 2);
    // 20/0.522 = 38.3장 × 1.1 = 42.1 → 43
    expect(out.boardCount).toBeGreaterThan(38);
  });

  it("장선: 데크길이 5m, 간격 400mm → 14개", () => {
    const out = calculateDeck(
      dck({ area: 20, deckLength: 5, joistSpacing: 400 }),
    );
    // 5/0.4 = 12.5 → 13 + 1 = 14
    expect(out.joistCount).toBe(14);
  });
});

describe("울타리", () => {
  it("20m 울타리, 기둥 간격 2m → 기둥 11개", () => {
    const out = calculateFence(fnc({ length: 20, postSpacing: 2 }));
    // 20/2 = 10칸 + 1 = 11기둥
    expect(out.postCount).toBe(11);
    expect(out.railCount).toBe(20); // 10칸 × 2단
  });

  it("세로살 간격 100mm → 살 개수", () => {
    const out = calculateFence(
      fnc({ length: 10, postSpacing: 2, picketSpacing: 100 }),
    );
    // 10000mm / 100 = 100개
    expect(out.picketCount).toBe(100);
  });
});
