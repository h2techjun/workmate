"use client";

import { useState } from "react";
import { useForm, Controller, type Control } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { NumberField } from "@/components/ui/NumberField";
import {
  calculateNhisForeign,
  nhisForeignInputSchema,
  type NhisForeignInputResolved,
  type NhisForeignResult,
} from "@/lib/calculations/insurance/nhisForeign";
import { formatKrw, formatKoreanMoney } from "@/lib/utils/format";
import {
  ActionRow,
  CalcLayout,
  EmptyResult,
  ErrorBox,
  Field,
  FieldGroup,
  FormShell,
  HeroResult,
  ResultShell,
  SourceBox,
  Stat,
} from "@/components/ui/calc-form";

interface ForeignHealthInsuranceFormProps {
  locale: "ko" | "en" | "vi";
}

const TEXT = {
  ko: {
    section: "가입 정보",
    fieldType: "가입 유형",
    typeEmployee: "직장가입자 (회사 재직)",
    typeRegional: "지역가입자 (프리랜서·무직·유학생)",
    fieldWage: "월 보수 (보수월액, 원)",
    fieldWageHint: "세전 월급 (직장가입자는 회사·본인 절반씩 부담)",
    fieldStudent: "유학생(D-2)·초중고(D-4) 50% 경감",
    fieldStudentHint: "연소득 360만원 이하 + 재산 1.35억 이하일 때 적용",
    calculate: "계산하기",
    reset: "초기화",
    resultHeading: "월 건강보험료 추정",
    resultEmpty: "가입 유형을 고르고 계산하세요.",
    error: "계산 중 오류가 발생했습니다.",
    monthly: "월 보험료 (본인부담)",
    won: "원",
    annual: "연 환산",
    health: "건강보험료",
    longTermCare: "장기요양보험료",
    employer: "회사 부담 (월, 참고)",
    avgPremium: "외국인 평균보험료",
    studentApplied: "유학생 50% 경감 적용",
    sourceTitle: "기준 · 가정 (2026)",
    sourceLines: [
      "직장가입자 = 보수월액 × 3.595%(근로자) + 장기요양(건보료 × 13.14%). 회사가 동일액 부담.",
      "지역가입자 외국인은 소득·재산 점수제와 평균보험료 중 큰 값. 대다수는 평균보험료(약 158,640원).",
      "유학생(D-2)·초중고(D-4)는 50% 경감(약 79,320원), 소득·재산 요건 충족 시.",
      "입국 6개월 경과 시 지역가입자 의무가입(유학생은 즉시). 미납 시 비자 연장 제한.",
      "지역가입자 소득·재산 점수제 미반영, 평균보험료는 매년 변동 — 참고용 추정. 공단(1577-1000) 확인 필요.",
    ],
  },
  en: {
    section: "Enrollment",
    fieldType: "Enrollment type",
    typeEmployee: "Employee (working at a company)",
    typeRegional: "Self-employed / no employer / student",
    fieldWage: "Monthly salary (₩)",
    fieldWageHint: "Pre-tax monthly pay (employee and employer split it in half)",
    fieldStudent: "Student (D-2) / D-4 — 50% reduction",
    fieldStudentHint: "Applies if annual income ≤ ₩3.6M and assets ≤ ₩135M",
    calculate: "Calculate",
    reset: "Reset",
    resultHeading: "Estimated monthly NHIS premium",
    resultEmpty: "Choose your enrollment type and calculate.",
    error: "Calculation failed.",
    monthly: "Monthly premium (your share)",
    won: "₩",
    annual: "Annual total",
    health: "Health insurance",
    longTermCare: "Long-term care",
    employer: "Employer share (monthly, ref.)",
    avgPremium: "Foreigner average premium",
    studentApplied: "Student 50% reduction applied",
    sourceTitle: "Basis · assumptions (2026)",
    sourceLines: [
      "Employee = monthly salary × 3.595% (your half) + long-term care (13.14% of health). Employer pays the same.",
      "Foreign self-employed pay the higher of income/asset scoring or the average premium. Most pay the average (~₩158,640).",
      "Students (D-2) and D-4 get a 50% reduction (~₩79,320) if income/asset conditions are met.",
      "Mandatory enrollment after 6 months in Korea (students immediately). Unpaid premiums can block visa extension.",
      "Income/asset scoring not modeled; the average premium changes yearly — reference estimate. Verify with NHIS (1577-1000).",
    ],
  },
  vi: {
    section: "Thông tin tham gia",
    fieldType: "Loại hình tham gia",
    typeEmployee: "Người lao động (làm việc tại công ty)",
    typeRegional: "Tự do / không có công ty / du học sinh",
    fieldWage: "Lương hàng tháng (보수월액, 원)",
    fieldWageHint: "Lương trước thuế hàng tháng (người lao động và công ty chia đôi mỗi bên một nửa)",
    fieldStudent: "Du học sinh (D-2) · học sinh phổ thông (D-4) — giảm 50%",
    fieldStudentHint: "Áp dụng khi thu nhập năm ≤ 3.6 triệu 원 và tài sản ≤ 135 triệu 원",
    calculate: "Tính toán",
    reset: "Đặt lại",
    resultHeading: "Ước tính phí bảo hiểm y tế hàng tháng",
    resultEmpty: "Chọn loại hình tham gia và tính toán.",
    error: "Đã xảy ra lỗi khi tính toán.",
    monthly: "Phí bảo hiểm hàng tháng (phần bạn đóng)",
    won: "원",
    annual: "Quy đổi năm",
    health: "Phí bảo hiểm y tế",
    longTermCare: "Phí bảo hiểm chăm sóc dài hạn",
    employer: "Phần công ty đóng (hàng tháng, tham khảo)",
    avgPremium: "Phí bảo hiểm bình quân người nước ngoài",
    studentApplied: "Đã áp dụng giảm 50% cho du học sinh",
    sourceTitle: "Cơ sở · giả định (2026)",
    sourceLines: [
      "Người lao động = lương hàng tháng × 3.595% (phần bạn đóng) + bảo hiểm chăm sóc dài hạn (13.14% phí bảo hiểm y tế). Công ty đóng số tiền tương đương.",
      "Người nước ngoài tự do đóng theo mức cao hơn giữa tính điểm thu nhập/tài sản và phí bình quân. Đa số đóng theo phí bình quân (khoảng 158,640원).",
      "Du học sinh (D-2) và học sinh phổ thông (D-4) được giảm 50% (khoảng 79,320원) nếu đáp ứng điều kiện thu nhập/tài sản.",
      "Bắt buộc tham gia sau 6 tháng cư trú tại Hàn Quốc (du học sinh phải tham gia ngay). Không đóng phí có thể khiến việc gia hạn visa bị hạn chế.",
      "Không mô phỏng tính điểm thu nhập/tài sản; phí bình quân thay đổi hàng năm — chỉ mang tính tham khảo. Xác nhận với NHIS (1577-1000).",
    ],
  },
} as const;

function MoneyField({
  control,
  name,
  label,
  hint,
  locale,
}: {
  control: Control<NhisForeignInputResolved>;
  name: "monthlyWage";
  label: string;
  hint: string;
  locale: "ko" | "en" | "vi";
}): React.ReactElement {
  const won = locale === "ko" ? "원" : "₩";
  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <Field label={label} hint={hint}>
          <NumberField
            value={field.value}
            onChange={field.onChange}
            thousands
            decimals={0}
            min={0}
            suffix={won}
            aria-label={label}
          />
          {locale === "ko" && field.value > 0 && (
            <p className="mt-1 text-xs text-[color:var(--color-text-tertiary)]">
              {formatKoreanMoney(field.value)}
            </p>
          )}
        </Field>
      )}
    />
  );
}

export function ForeignHealthInsuranceForm({
  locale,
}: ForeignHealthInsuranceFormProps): React.ReactElement {
  const T = TEXT[locale];
  const [result, setResult] = useState<NhisForeignResult | null>(null);
  const [calcError, setCalcError] = useState<string | null>(null);

  const {
    register,
    control,
    watch,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<NhisForeignInputResolved>({
    resolver: zodResolver(nhisForeignInputSchema),
    defaultValues: {
      enrollmentType: "employee",
      monthlyWage: 3_000_000,
      isStudent: false,
    },
  });

  const enrollmentType = watch("enrollmentType");

  const onSubmit = (values: NhisForeignInputResolved): void => {
    setCalcError(null);
    try {
      setResult(calculateNhisForeign(values));
    } catch {
      setResult(null);
      setCalcError(T.error);
    }
  };
  const onReset = (): void => {
    reset();
    setResult(null);
    setCalcError(null);
  };

  return (
    <CalcLayout>
      <FormShell onSubmit={handleSubmit(onSubmit)}>
        <FieldGroup title={T.section}>
          <Field label={T.fieldType}>
            <select className="input-base" {...register("enrollmentType")}>
              <option value="employee">{T.typeEmployee}</option>
              <option value="regional">{T.typeRegional}</option>
            </select>
          </Field>

          {enrollmentType === "employee" ? (
            <MoneyField
              control={control}
              name="monthlyWage"
              label={T.fieldWage}
              hint={T.fieldWageHint}
              locale={locale}
            />
          ) : (
            <Field label={T.fieldStudent} hint={T.fieldStudentHint}>
              <label className="flex cursor-pointer items-center gap-2.5 rounded-lg border border-[color:var(--color-border-subtle)] bg-[color:var(--color-bg-elevated)] px-3.5 py-2.5">
                <input
                  type="checkbox"
                  className="h-4 w-4 accent-indigo-500"
                  {...register("isStudent")}
                />
                <span className="text-sm text-[color:var(--color-text-secondary)]">
                  {T.fieldStudent}
                </span>
              </label>
            </Field>
          )}
        </FieldGroup>

        <ActionRow
          primary={
            <button type="submit" disabled={isSubmitting} className="btn-primary flex-1">
              {T.calculate}
            </button>
          }
          secondary={
            <button type="button" onClick={onReset} className="btn-ghost sm:w-auto">
              {T.reset}
            </button>
          }
        />
      </FormShell>

      <ResultShell heading={T.resultHeading}>
        {calcError && <ErrorBox message={calcError} />}
        {!calcError && !result && <EmptyResult message={T.resultEmpty} />}
        {result && (
          <div className="animate-fade-up space-y-5">
            <div>
              <HeroResult
                label={T.monthly}
                value={formatKrw(result.monthlyTotal)}
                unit={T.won}
              />
              {locale === "ko" && (
                <p className="mt-2 text-sm font-medium text-[color:var(--color-text-secondary)]">
                  = {formatKoreanMoney(result.monthlyTotal)}
                </p>
              )}
            </div>
            <dl className="grid grid-cols-2 gap-3">
              <Stat label={T.annual} value={`${formatKrw(result.annualTotal)} ${T.won}`} />
              {result.enrollmentType === "employee" ? (
                <>
                  <Stat label={T.health} value={`${formatKrw(result.monthlyHealth)} ${T.won}`} />
                  <Stat label={T.longTermCare} value={`${formatKrw(result.monthlyLongTermCare)} ${T.won}`} />
                  <Stat label={T.employer} value={`${formatKrw(result.employerMonthly)} ${T.won}`} />
                </>
              ) : (
                <Stat
                  label={result.studentReductionApplied ? T.studentApplied : T.avgPremium}
                  value={`${formatKrw(result.monthlyTotal)} ${T.won}`}
                  tone={result.studentReductionApplied ? "success" : "default"}
                />
              )}
            </dl>

            <SourceBox lines={[T.sourceTitle, ...T.sourceLines]} />
          </div>
        )}
      </ResultShell>
    </CalcLayout>
  );
}
