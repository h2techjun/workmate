import { describe, it, expect } from "vitest";
import { calculateNetSalary, netSalaryInputSchema } from "./netSalary";

const parse = (o: Record<string, unknown>) => netSalaryInputSchema.parse(o);

describe("연봉 실수령액", () => {
  it("연봉 3,600만 → 월 세전 300만", () => {
    const out = calculateNetSalary(parse({ annualSalary: 36_000_000 }));
    expect(out.monthlyGross).toBe(3_000_000);
  });

  it("4대보험이 세전의 약 9% 수준", () => {
    const out = calculateNetSalary(parse({ annualSalary: 36_000_000 }));
    // 국민연금 4.5 + 건강 3.545 + 장기요양(건강×12.95%) + 고용 0.9 ≈ 9.3%
    const insRate = out.totalInsurance / out.monthlyGross;
    expect(insRate).toBeGreaterThan(0.08);
    expect(insRate).toBeLessThan(0.1);
  });

  it("실수령액 < 세전, 공제율 10~20%", () => {
    const out = calculateNetSalary(parse({ annualSalary: 50_000_000 }));
    expect(out.monthlyNet).toBeLessThan(out.monthlyGross);
    expect(out.deductionRate).toBeGreaterThan(0.1);
    expect(out.deductionRate).toBeLessThan(0.25);
  });

  it("부양가족 많으면 세금 감소", () => {
    const single = calculateNetSalary(
      parse({ annualSalary: 60_000_000, dependents: 1 }),
    );
    const family = calculateNetSalary(
      parse({ annualSalary: 60_000_000, dependents: 4, childrenUnder20: 2 }),
    );
    expect(family.totalTax).toBeLessThan(single.totalTax);
    expect(family.monthlyNet).toBeGreaterThan(single.monthlyNet);
  });

  it("국민연금 상한: 고연봉이어도 기준소득월액 상한 적용", () => {
    const out = calculateNetSalary(parse({ annualSalary: 200_000_000 }));
    // 상한 617만 × 4.5% = 277,650 → 10원 절사
    expect(out.pension).toBeLessThanOrEqual(280_000);
  });

  it("연 실수령 = 월 실수령 × 12", () => {
    const out = calculateNetSalary(parse({ annualSalary: 48_000_000 }));
    expect(out.annualNet).toBe(out.monthlyNet * 12);
  });

  it("저연봉 비과세 차감으로 세금 0 또는 매우 적음", () => {
    const out = calculateNetSalary(parse({ annualSalary: 24_000_000 }));
    expect(out.incomeTax).toBeGreaterThanOrEqual(0);
    expect(out.monthlyNet).toBeGreaterThan(1_500_000);
  });
});
