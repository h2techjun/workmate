"use client";

import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  calculateStuds,
  studsInputSchema,
  type StudsInputResolved,
  type StudsResult,
  type StudsStep,
} from "@/lib/calculations/timber/studs";
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
  StepsBox,
} from "@/components/ui/calc-form";
import { NumberField } from "@/components/ui/NumberField";
import { formatNumber } from "@/lib/utils/format";

interface StudsFormProps {
  locale: "ko" | "en" | "zh" | "vi";
}

const TEXT = {
  ko: {
    sectionWall: "벽 정보",
    sectionLumber: "각목·기타",
    fieldWallLength: "벽 길이 (m)",
    fieldWallLengthHint: "한 벽 또는 여러 벽의 합계",
    fieldCeiling: "층고 (mm)",
    fieldCeilingHint: "보통 2400~3000mm",
    fieldSpacing: "스터드 간격",
    fieldOpenings: "개구부 (창문/문) 개수",
    fieldOpeningsHint: "개당 jack/king 스터드 4본 + 헤더 2본 추가",
    fieldWaste: "손실률 (%)",
    fieldWasteHint: "절단 손실·여유분, 기본 10%",
    calculate: "계산하기",
    reset: "초기화",
    resultHeading: "계산 결과",
    resultEmpty: "벽 길이를 입력하고 계산하세요.",
    error: "계산 중 오류가 발생했습니다.",
    studCount: "스터드 본수",
    studCountUnit: "본",
    studLength: "1본 길이",
    topPlate: "탑 플레이트 총 길이 (더블)",
    solePlate: "솔 플레이트 총 길이 (싱글)",
    headerCount: "헤더 본수 (개구부 위)",
    nailCount: "못 추정 개수",
    spacing16: "16인치 (406mm)",
    spacing24: "24인치 (610mm)",
    sourceTitle: "출처 · 가정",
    sourceLines: [
      "IRC 2018 Chapter 6 (Wall Construction) — 미국 표준, 한국 목조주택 시공 차용 일반적.",
      "각목 = 2×4 SPF (38×89mm). 탑 플레이트 더블 + 솔 플레이트 싱글 = 총 3장 38mm.",
      "헤더 = 개구부 1개당 2×10 더블 (2본) + 자크·킹 스터드 4본.",
      "못 추정 = 본당 8개 (양 끝 4개씩 토네일).",
    ],
  },
  en: {
    sectionWall: "Wall info",
    sectionLumber: "Framing & misc",
    fieldWallLength: "Wall length (m)",
    fieldWallLengthHint: "Sum of one or multiple walls",
    fieldCeiling: "Ceiling height (mm)",
    fieldCeilingHint: "Typically 2400~3000mm",
    fieldSpacing: "Stud spacing",
    fieldOpenings: "Openings (windows/doors)",
    fieldOpeningsHint: "Each adds 4 jack/king studs + 2 header studs",
    fieldWaste: "Waste factor (%)",
    fieldWasteHint: "Cut loss + buffer, default 10%",
    calculate: "Calculate",
    reset: "Reset",
    resultHeading: "Result",
    resultEmpty: "Enter wall length to calculate.",
    error: "Calculation failed.",
    studCount: "Stud count",
    studCountUnit: "pcs",
    studLength: "Stud length",
    topPlate: "Top plate total (double)",
    solePlate: "Sole plate total (single)",
    headerCount: "Header pieces (over openings)",
    nailCount: "Estimated nails",
    spacing16: "16\" (406mm)",
    spacing24: "24\" (610mm)",
    sourceTitle: "Sources · assumptions",
    sourceLines: [
      "IRC 2018 Chapter 6 (Wall Construction) — US standard, commonly applied in Korean timber framing.",
      "Studs = 2×4 SPF (38×89mm). Double top plate + single sole plate = 3 × 38mm thickness.",
      "Header = 2×10 double per opening (2 pieces) + 4 jack/king studs.",
      "Nails ≈ 8 per stud (4 toenails × 2 ends).",
    ],
  },
  zh: {
    sectionWall: "墙体信息",
    sectionLumber: "方木·其他",
    fieldWallLength: "墙长 (m)",
    fieldWallLengthHint: "单面墙或多面墙合计长度",
    fieldCeiling: "层高 (mm)",
    fieldCeilingHint: "通常为2400~3000mm",
    fieldSpacing: "墙骨柱间距",
    fieldOpenings: "洞口 (窗/门) 数量",
    fieldOpeningsHint: "每个洞口追加副柱·通长柱共4根 + 过梁2根",
    fieldWaste: "损耗率 (%)",
    fieldWasteHint: "裁切损耗·预留量，默认10%",
    calculate: "计算",
    reset: "重置",
    resultHeading: "计算结果",
    resultEmpty: "请输入墙长后计算。",
    error: "计算过程中发生错误。",
    studCount: "墙骨柱根数",
    studCountUnit: "根",
    studLength: "单根长度",
    topPlate: "顶梁板总长度 (双层)",
    solePlate: "底梁板总长度 (单层)",
    headerCount: "过梁根数 (洞口上方)",
    nailCount: "钉子估算数量",
    spacing16: "16英寸 (406mm)",
    spacing24: "24英寸 (610mm)",
    sourceTitle: "出处与假设",
    sourceLines: [
      "IRC 2018第6章(墙体施工) — 美国标准，韩国木结构住宅施工普遍沿用。",
      "方木 = 2×4 SPF (38×89mm)。双层顶梁板 + 单层底梁板 = 共3层38mm。",
      "过梁 = 每个洞口2×10双过梁(2根) + 副柱·通长柱共4根。",
      "钉子估算 = 每根8颗(两端各4颗斜钉)。",
    ],
  },
  vi: {
    sectionWall: "Thông tin tường",
    sectionLumber: "Khung gỗ & khác",
    fieldWallLength: "Chiều dài tường (m)",
    fieldWallLengthHint: "Tổng chiều dài một tường hoặc nhiều tường",
    fieldCeiling: "Chiều cao trần (mm)",
    fieldCeilingHint: "Thường 2400~3000mm",
    fieldSpacing: "Khoảng cách thanh đứng",
    fieldOpenings: "Số lượng lỗ mở (cửa sổ/cửa đi)",
    fieldOpeningsHint: "Mỗi lỗ mở cộng thêm 4 thanh jack/king + 2 thanh đà đỡ",
    fieldWaste: "Hệ số hao hụt (%)",
    fieldWasteHint: "Hao hụt cắt · dự phòng, mặc định 10%",
    calculate: "Tính toán",
    reset: "Đặt lại",
    resultHeading: "Kết quả",
    resultEmpty: "Nhập chiều dài tường và tính toán.",
    error: "Đã xảy ra lỗi khi tính toán.",
    studCount: "Số lượng thanh đứng",
    studCountUnit: "thanh",
    studLength: "Chiều dài một thanh",
    topPlate: "Tổng chiều dài tấm đế trên (đôi)",
    solePlate: "Tổng chiều dài tấm đế dưới (đơn)",
    headerCount: "Số lượng đà đỡ (trên lỗ mở)",
    nailCount: "Số lượng đinh ước tính",
    spacing16: "16 inch (406mm)",
    spacing24: "24 inch (610mm)",
    sourceTitle: "Nguồn · giả định",
    sourceLines: [
      "IRC 2018 Chương 6 (Kết cấu tường) — tiêu chuẩn Mỹ, thường được áp dụng trong thi công nhà gỗ tại Hàn Quốc.",
      "Thanh đứng = 2×4 SPF (38×89mm). Tấm đế trên đôi + tấm đế dưới đơn = tổng 3 lớp dày 38mm.",
      "Đà đỡ = 2×10 đôi (2 thanh) cho mỗi lỗ mở + 4 thanh jack/king.",
      "Ước tính đinh = 8 đinh mỗi thanh (4 đinh xiên mỗi đầu × 2 đầu).",
    ],
  },
} as const;

export function StudsForm({ locale }: StudsFormProps): React.ReactElement {
  const T = TEXT[locale];
  const [result, setResult] = useState<StudsResult | null>(null);
  const [calcError, setCalcError] = useState<string | null>(null);

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<StudsInputResolved>({
    resolver: zodResolver(studsInputSchema),
    defaultValues: {
      wallLengthM: 8,
      ceilingHeightMm: 2400,
      spacingMm: 406,
      openings: 0,
      wasteFactorPercent: 10,
    },
  });

  const onSubmit = (values: StudsInputResolved): void => {
    setCalcError(null);
    try {
      setResult(calculateStuds(values));
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

  const renderStep = (s: StudsStep): string => {
    switch (s.key) {
      case "studCount":
        return locale === "ko"
          ? `벽 길이 ${formatNumber(s.wallLength)}m ÷ 간격 ${formatNumber(s.spacing)}mm = 기본 ${formatNumber(s.result)}본 (양 끝 포함)`
          : locale === "zh"
            ? `墙长 ${formatNumber(s.wallLength)}m ÷ 间距 ${formatNumber(s.spacing)}mm = 基本 ${formatNumber(s.result)}根 (含两端)`
            : locale === "vi"
              ? `Chiều dài tường ${formatNumber(s.wallLength)}m ÷ khoảng cách ${formatNumber(s.spacing)}mm = cơ bản ${formatNumber(s.result)} thanh (gồm cả hai đầu)`
              : `${formatNumber(s.wallLength)}m ÷ ${formatNumber(s.spacing)}mm = ${formatNumber(s.result)} studs (incl. both ends)`;
      case "studLength":
        return locale === "ko"
          ? `층고 ${formatNumber(s.ceilingHeight)}mm − 플레이트 ${formatNumber(s.plates)}mm = 1본 길이 ${formatNumber(s.result)}mm`
          : locale === "zh"
            ? `层高 ${formatNumber(s.ceilingHeight)}mm − 梁板 ${formatNumber(s.plates)}mm = 单根长度 ${formatNumber(s.result)}mm`
            : locale === "vi"
              ? `Chiều cao trần ${formatNumber(s.ceilingHeight)}mm − tấm đế ${formatNumber(s.plates)}mm = chiều dài một thanh ${formatNumber(s.result)}mm`
              : `Ceiling ${formatNumber(s.ceilingHeight)}mm − plates ${formatNumber(s.plates)}mm = stud length ${formatNumber(s.result)}mm`;
      case "plateLength":
        return locale === "ko"
          ? `벽 길이 ${formatNumber(s.wallLength)}m × 3 (더블 탑 + 솔) = 총 ${formatNumber(s.result)}m`
          : locale === "zh"
            ? `墙长 ${formatNumber(s.wallLength)}m × 3 (双层顶梁板 + 底梁板) = 共 ${formatNumber(s.result)}m`
            : locale === "vi"
              ? `Chiều dài tường ${formatNumber(s.wallLength)}m × 3 (đôi trên + đơn dưới) = tổng ${formatNumber(s.result)}m`
              : `${formatNumber(s.wallLength)}m × 3 (double top + sole) = ${formatNumber(s.result)}m total`;
      case "headerCount":
        return locale === "ko"
          ? `개구부 ${formatNumber(s.openings)}개 × 2 (더블 헤더) = 헤더 ${formatNumber(s.result)}본`
          : locale === "zh"
            ? `洞口 ${formatNumber(s.openings)}个 × 2 (双过梁) = 过梁 ${formatNumber(s.result)}根`
            : locale === "vi"
              ? `Lỗ mở ${formatNumber(s.openings)} × 2 (đà đỡ đôi) = đà đỡ ${formatNumber(s.result)} thanh`
              : `${formatNumber(s.openings)} openings × 2 (double header) = ${formatNumber(s.result)} headers`;
      case "totalStuds":
        return locale === "ko"
          ? `기본 ${formatNumber(s.base)}본 × (1 + ${formatNumber(s.waste)}% 손실) = 총 ${formatNumber(s.result)}본`
          : locale === "zh"
            ? `基本 ${formatNumber(s.base)}根 × (1 + ${formatNumber(s.waste)}% 损耗) = 共 ${formatNumber(s.result)}根`
            : locale === "vi"
              ? `Cơ bản ${formatNumber(s.base)} thanh × (1 + ${formatNumber(s.waste)}% hao hụt) = tổng ${formatNumber(s.result)} thanh`
              : `Base ${formatNumber(s.base)} × (1 + ${formatNumber(s.waste)}% waste) = ${formatNumber(s.result)} total`;
      case "nails":
        return locale === "ko"
          ? `스터드 ${formatNumber(s.studs)}본 × 본당 ${formatNumber(s.nailsPerStud)}못 = 총 ${formatNumber(s.result)}개`
          : locale === "zh"
            ? `墙骨柱 ${formatNumber(s.studs)}根 × 每根 ${formatNumber(s.nailsPerStud)}颗钉 = 共 ${formatNumber(s.result)}颗`
            : locale === "vi"
              ? `Thanh đứng ${formatNumber(s.studs)} × ${formatNumber(s.nailsPerStud)} đinh/thanh = tổng ${formatNumber(s.result)} đinh`
              : `${formatNumber(s.studs)} studs × ${formatNumber(s.nailsPerStud)} nails/stud = ${formatNumber(s.result)} nails`;
    }
  };

  return (
    <CalcLayout>
      <FormShell onSubmit={handleSubmit(onSubmit)}>
        <FieldGroup title={T.sectionWall}>
          <Field label={T.fieldWallLength} hint={T.fieldWallLengthHint}>
            <Controller
              control={control}
              name="wallLengthM"
              render={({ field }) => (
                <NumberField
                  value={field.value}
                  onChange={field.onChange}
                  thousands={false}
                  decimals={1}
                  min={0}
                  suffix="m"
                  aria-label={T.fieldWallLength}
                />
              )}
            />
          </Field>
          <Field label={T.fieldCeiling} hint={T.fieldCeilingHint}>
            <Controller
              control={control}
              name="ceilingHeightMm"
              render={({ field }) => (
                <NumberField
                  value={field.value}
                  onChange={field.onChange}
                  thousands={false}
                  decimals={0}
                  min={0}
                  suffix="mm"
                  aria-label={T.fieldCeiling}
                />
              )}
            />
          </Field>
          <Field label={T.fieldSpacing}>
            <select
              className="input-base"
              {...register("spacingMm", { valueAsNumber: true })}
            >
              <option value={406}>{T.spacing16}</option>
              <option value={610}>{T.spacing24}</option>
            </select>
          </Field>
        </FieldGroup>

        <FieldGroup title={T.sectionLumber}>
          <Field label={T.fieldOpenings} hint={T.fieldOpeningsHint}>
            <Controller
              control={control}
              name="openings"
              render={({ field }) => (
                <NumberField
                  value={field.value}
                  onChange={field.onChange}
                  thousands={false}
                  decimals={0}
                  min={0}
                  suffix={locale === "ko" ? "개" : locale === "zh" ? "个" : locale === "vi" ? "cái" : "pcs"}
                  aria-label={T.fieldOpenings}
                />
              )}
            />
          </Field>
          <Field label={T.fieldWaste} hint={T.fieldWasteHint}>
            <Controller
              control={control}
              name="wasteFactorPercent"
              render={({ field }) => (
                <NumberField
                  value={field.value}
                  onChange={field.onChange}
                  thousands={false}
                  decimals={0}
                  min={0}
                  max={100}
                  suffix="%"
                  aria-label={T.fieldWaste}
                />
              )}
            />
          </Field>
        </FieldGroup>

        <ActionRow
          primary={
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary flex-1"
            >
              {T.calculate}
            </button>
          }
          secondary={
            <button
              type="button"
              onClick={onReset}
              className="btn-ghost sm:w-auto"
            >
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
            <HeroResult
              label={T.studCount}
              value={formatNumber(result.studCount)}
              unit={T.studCountUnit}
            />
            <dl className="grid grid-cols-2 gap-3">
              <Stat
                label={T.studLength}
                value={`${formatNumber(result.studLengthMm)} mm`}
              />
              <Stat
                label={T.headerCount}
                value={`${formatNumber(result.headerCount)} ${T.studCountUnit}`}
              />
              <Stat
                label={T.topPlate}
                value={`${formatNumber(result.topPlateTotalLengthM)} m`}
              />
              <Stat
                label={T.solePlate}
                value={`${formatNumber(result.solePlateTotalLengthM)} m`}
              />
              <Stat
                label={T.nailCount}
                value={`${formatNumber(result.nailCount)} ${locale === "ko" ? "개" : locale === "zh" ? "颗" : locale === "vi" ? "đinh" : "pcs"}`}
              />
            </dl>
            <StepsBox
              title={
                locale === "ko" ? "계산 과정" : locale === "zh" ? "计算过程" : locale === "vi" ? "Các bước tính toán" : "Steps"
              }
              items={result.steps.map((s) => renderStep(s))}
            />
            <SourceBox lines={[T.sourceTitle, ...T.sourceLines]} />
          </div>
        )}
      </ResultShell>
    </CalcLayout>
  );
}
