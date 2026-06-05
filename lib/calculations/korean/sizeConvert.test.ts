import { describe, it, expect } from "vitest";
import { findByKorean, SIZE_TABLES } from "./sizeConvert";

describe("사이즈 변환", () => {
  it("남성 신발 260 → US 8 / EU 41", () => {
    const row = findByKorean("shoeMen", "260");
    expect(row?.us).toBe("8");
    expect(row?.eu).toBe("41");
    expect(row?.uk).toBe("7.5");
  });

  it("여성 신발 240 → US 7", () => {
    const row = findByKorean("shoeWomen", "240");
    expect(row?.us).toBe("7");
  });

  it("남성 의류 95 → M / EU 48", () => {
    const row = findByKorean("clothingMen", "95");
    expect(row?.us).toBe("M");
    expect(row?.eu).toBe("48");
  });

  it("여성 의류 55 → US 4 / S", () => {
    const row = findByKorean("clothingWomen", "55");
    expect(row?.us).toBe("4");
    expect(row?.kr).toContain("55");
  });

  it("prefix 매칭: '95' → '95 (M)'", () => {
    const row = findByKorean("clothingMen", "95");
    expect(row?.kr).toBe("95 (M)");
  });

  it("없는 사이즈 → null", () => {
    expect(findByKorean("shoeMen", "999")).toBeNull();
  });

  it("모든 테이블 비어있지 않음", () => {
    for (const cat of Object.keys(SIZE_TABLES) as Array<keyof typeof SIZE_TABLES>) {
      expect(SIZE_TABLES[cat].length).toBeGreaterThan(0);
    }
  });
});
