"use client";

import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  calculateTile,
  tileInputSchema,
  TILE_PRESETS,
  type TileInputResolved,
  type TileResult,
  type TileStep,
} from "@/lib/calculations/timber/tile";
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

interface TileFormProps {
  locale: "ko" | "en" | "zh" | "vi";
}

import { formatNumber } from "@/lib/utils/format";

const fmt = (n: number, d = 2): string => formatNumber(n, d);

const TEXT = {
  ko: {
    sectionArea: "시공 면적",
    sectionTile: "타일·줄눈",
    fieldArea: "면적 (m²)",
    fieldAreaHint: "벽·바닥 시공 면적 (개구부 공제 후)",
    fieldPreset: "표준 크기 선택",
    fieldTileWidth: "타일 가로 (mm)",
    fieldTileHeight: "타일 세로 (mm)",
    fieldGrout: "줄눈 너비 (mm)",
    fieldGroutHint: "자기질 보통 2mm, 도기질·대형 3~5mm",
    fieldWaste: "손실률 (%)",
    fieldWasteHint: "절단·파손 여유, 기본 10%",
    calculate: "계산하기",
    reset: "초기화",
    resultHeading: "계산 결과",
    resultEmpty: "면적과 타일 크기를 입력하고 계산하세요.",
    error: "계산 중 오류가 발생했습니다.",
    tileCount: "타일 매수",
    tileCountUnit: "매",
    footprint: "1매 점유 면적 (줄눈 포함)",
    adjusted: "손실률 적용 면적",
    adhesive: "타일 접착제 추정",
    grout: "줄눈 충전재 추정",
    sourceTitle: "출처 · 가정",
    sourceLines: [
      "KS L 1001 (도자기질 타일) · KS F 4904 (시멘트). 1매 점유 = (가로+줄눈) × (세로+줄눈).",
      "접착제: 4 kg/㎡ 기준 (일반 시멘트계 본드 표준 사용량).",
      "줄눈 충전재: 작은 타일·넓은 줄눈일수록 ↑. 0.1~0.6 kg/㎡ 범위.",
      "결과는 자재 견적용 참고치 — 실제 시공은 패턴·줄눈 처리에 따라 ±15% 차이.",
    ],
  },
  en: {
    sectionArea: "Area",
    sectionTile: "Tile & grout",
    fieldArea: "Area (m²)",
    fieldAreaHint: "Wall/floor area after subtracting openings",
    fieldPreset: "Standard size",
    fieldTileWidth: "Tile width (mm)",
    fieldTileHeight: "Tile height (mm)",
    fieldGrout: "Grout width (mm)",
    fieldGroutHint: "Porcelain 2mm typical, ceramic/large 3~5mm",
    fieldWaste: "Waste factor (%)",
    fieldWasteHint: "Cut/break buffer, default 10%",
    calculate: "Calculate",
    reset: "Reset",
    resultHeading: "Result",
    resultEmpty: "Enter area and tile size to calculate.",
    error: "Calculation failed.",
    tileCount: "Tile count",
    tileCountUnit: "pcs",
    footprint: "1-tile footprint (with grout)",
    adjusted: "Adjusted area (waste applied)",
    adhesive: "Adhesive estimate",
    grout: "Grout estimate",
    sourceTitle: "Sources · assumptions",
    sourceLines: [
      "KS L 1001 (ceramic tile) · KS F 4904 (cement). Footprint = (w+grout) × (h+grout).",
      "Adhesive: 4 kg/m² (standard cement-based bond).",
      "Grout: smaller tiles + wider joints = more usage. Range 0.1~0.6 kg/m².",
      "Results are material estimates — actual ±15% depending on pattern and joint detailing.",
    ],
  },
  zh: {
    sectionArea: "施工面积",
    sectionTile: "瓷砖·缝隙",
    fieldArea: "面积 (m²)",
    fieldAreaHint: "墙面·地面施工面积 (已扣除洞口)",
    fieldPreset: "选择标准尺寸",
    fieldTileWidth: "瓷砖宽度 (mm)",
    fieldTileHeight: "瓷砖高度 (mm)",
    fieldGrout: "缝宽 (mm)",
    fieldGroutHint: "瓷质砖通常2mm，陶质砖·大规格3~5mm",
    fieldWaste: "损耗率 (%)",
    fieldWasteHint: "裁切·破损预留，默认10%",
    calculate: "计算",
    reset: "重置",
    resultHeading: "计算结果",
    resultEmpty: "请输入面积与瓷砖尺寸后计算。",
    error: "计算过程中发生错误。",
    tileCount: "瓷砖张数",
    tileCountUnit: "张",
    footprint: "每张占用面积 (含缝隙)",
    adjusted: "损耗率修正面积",
    adhesive: "瓷砖胶估算",
    grout: "填缝剂估算",
    sourceTitle: "出处与假设",
    sourceLines: [
      "KS L 1001(陶瓷砖)·KS F 4904(水泥)。每张占用面积 = (宽+缝宽) × (高+缝宽)。",
      "瓷砖胶：以4 kg/㎡为基准(一般水泥系粘合剂标准用量)。",
      "填缝剂：瓷砖越小·缝宽越大，用量越高。范围0.1~0.6 kg/㎡。",
      "结果仅供材料估算参考 — 实际施工会因铺贴图案·收边处理不同而有±15%差异。",
    ],
  },
  vi: {
    sectionArea: "Diện tích thi công",
    sectionTile: "Gạch · mạch vữa",
    fieldArea: "Diện tích (m²)",
    fieldAreaHint: "Diện tích thi công tường/sàn (sau khi trừ lỗ mở)",
    fieldPreset: "Chọn kích thước tiêu chuẩn",
    fieldTileWidth: "Chiều rộng gạch (mm)",
    fieldTileHeight: "Chiều cao gạch (mm)",
    fieldGrout: "Độ rộng mạch vữa (mm)",
    fieldGroutHint: "Gạch porcelain thường 2mm, gạch ceramic/khổ lớn 3~5mm",
    fieldWaste: "Hệ số hao hụt (%)",
    fieldWasteHint: "Dự phòng cắt · vỡ, mặc định 10%",
    calculate: "Tính toán",
    reset: "Đặt lại",
    resultHeading: "Kết quả",
    resultEmpty: "Nhập diện tích và kích thước gạch rồi tính toán.",
    error: "Đã xảy ra lỗi khi tính toán.",
    tileCount: "Số lượng gạch",
    tileCountUnit: "viên",
    footprint: "Diện tích chiếm chỗ 1 viên (gồm mạch vữa)",
    adjusted: "Diện tích đã áp dụng hao hụt",
    adhesive: "Keo dán ước tính",
    grout: "Vữa chít mạch ước tính",
    sourceTitle: "Nguồn · giả định",
    sourceLines: [
      "KS L 1001 (gạch gốm sứ) · KS F 4904 (xi măng). Diện tích chiếm chỗ 1 viên = (rộng+mạch vữa) × (cao+mạch vữa).",
      "Keo dán: tiêu chuẩn 4 kg/㎡ (định mức keo dán gốc xi măng thông thường).",
      "Vữa chít mạch: gạch càng nhỏ · mạch càng rộng thì lượng dùng càng tăng. Phạm vi 0.1~0.6 kg/㎡.",
      "Kết quả chỉ là giá trị tham khảo cho báo giá vật liệu — thi công thực tế có thể chênh lệch ±15% tùy theo kiểu lát và cách xử lý mạch vữa.",
    ],
  },
} as const;

export function TileForm({ locale }: TileFormProps): React.ReactElement {
  const T = TEXT[locale];
  const [result, setResult] = useState<TileResult | null>(null);
  const [calcError, setCalcError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { isSubmitting },
  } = useForm<TileInputResolved>({
    resolver: zodResolver(tileInputSchema),
    defaultValues: {
      areaM2: 10,
      tileWidthMm: 300,
      tileHeightMm: 300,
      groutMm: 2,
      wasteFactorPercent: 10,
    },
  });

  const onSubmit = (values: TileInputResolved): void => {
    setCalcError(null);
    try {
      setResult(calculateTile(values));
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
  const applyPreset = (size: number) => {
    setValue("tileWidthMm", size);
    setValue("tileHeightMm", size);
  };

  const renderStep = (s: TileStep): string => {
    switch (s.key) {
      case "footprint":
        return locale === "ko"
          ? `타일 ${fmt(s.w)}×${fmt(s.h)}mm + 줄눈 ${s.grout}mm × 2 = 1매 점유 ${fmt(s.result, 4)} m²`
          : locale === "zh"
            ? `瓷砖 ${fmt(s.w)}×${fmt(s.h)}mm + 缝宽 ${s.grout}mm × 2 = 每张占用 ${fmt(s.result, 4)} m²`
            : locale === "vi"
              ? `Gạch ${fmt(s.w)}×${fmt(s.h)}mm + mạch vữa ${s.grout}mm × 2 = diện tích chiếm chỗ 1 viên ${fmt(s.result, 4)} m²`
              : `Tile ${fmt(s.w)}×${fmt(s.h)}mm + grout ${s.grout}mm × 2 = footprint ${fmt(s.result, 4)} m²`;
      case "wasteArea":
        return locale === "ko"
          ? `면적 ${fmt(s.area)}m² × (1 + ${s.waste}% 손실) = ${fmt(s.result, 1)} m²`
          : locale === "zh"
            ? `面积 ${fmt(s.area)}m² × (1 + ${s.waste}% 损耗) = ${fmt(s.result, 1)} m²`
            : locale === "vi"
              ? `Diện tích ${fmt(s.area)}m² × (1 + ${s.waste}% hao hụt) = ${fmt(s.result, 1)} m²`
              : `Area ${fmt(s.area)}m² × (1 + ${s.waste}% waste) = ${fmt(s.result, 1)} m²`;
      case "count":
        return locale === "ko"
          ? `손실 적용 면적 ${fmt(s.wasteArea, 1)}m² ÷ 1매 ${fmt(s.footprint, 4)}m² = ${fmt(s.result, 0)}매`
          : locale === "zh"
            ? `修正面积 ${fmt(s.wasteArea, 1)}m² ÷ 每张 ${fmt(s.footprint, 4)}m² = ${fmt(s.result, 0)}张`
            : locale === "vi"
              ? `Diện tích đã áp dụng hao hụt ${fmt(s.wasteArea, 1)}m² ÷ 1 viên ${fmt(s.footprint, 4)}m² = ${fmt(s.result, 0)} viên`
              : `Adjusted ${fmt(s.wasteArea, 1)}m² ÷ ${fmt(s.footprint, 4)}m²/tile = ${fmt(s.result, 0)} tiles`;
      case "adhesive":
        return locale === "ko"
          ? `면적 ${fmt(s.area)}m² × ${s.rate}kg/㎡ = 접착제 ${fmt(s.result, 1)}kg`
          : locale === "zh"
            ? `面积 ${fmt(s.area)}m² × ${s.rate}kg/㎡ = 瓷砖胶 ${fmt(s.result, 1)}kg`
            : locale === "vi"
              ? `Diện tích ${fmt(s.area)}m² × ${s.rate}kg/㎡ = keo dán ${fmt(s.result, 1)}kg`
              : `Area ${fmt(s.area)}m² × ${s.rate}kg/m² = ${fmt(s.result, 1)}kg adhesive`;
      case "grout":
        return locale === "ko"
          ? `면적 ${fmt(s.area)}m² × ${fmt(s.rate, 2)}kg/㎡ (타일/줄눈 비례) = 줄눈재 ${fmt(s.result, 2)}kg`
          : locale === "zh"
            ? `面积 ${fmt(s.area)}m² × ${fmt(s.rate, 2)}kg/㎡ (依瓷砖·缝宽比例) = 填缝剂 ${fmt(s.result, 2)}kg`
            : locale === "vi"
              ? `Diện tích ${fmt(s.area)}m² × ${fmt(s.rate, 2)}kg/㎡ (tỷ lệ theo gạch/mạch vữa) = vữa chít mạch ${fmt(s.result, 2)}kg`
              : `Area ${fmt(s.area)}m² × ${fmt(s.rate, 2)}kg/m² (size-dependent) = ${fmt(s.result, 2)}kg grout`;
    }
  };

  return (
    <CalcLayout>
      <FormShell onSubmit={handleSubmit(onSubmit)}>
        <FieldGroup title={T.sectionArea}>
          <Field label={T.fieldArea} hint={T.fieldAreaHint}>
            <Controller
              control={control}
              name="areaM2"
              render={({ field }) => (
                <NumberField
                  value={field.value}
                  onChange={field.onChange}
                  thousands={false}
                  decimals={2}
                  min={0}
                  suffix="㎡"
                  aria-label={T.fieldArea}
                />
              )}
            />
          </Field>
        </FieldGroup>

        <FieldGroup title={T.sectionTile}>
          <Field label={T.fieldPreset}>
            <div className="flex flex-wrap gap-1.5">
              {TILE_PRESETS.map((p) => (
                <button
                  key={p.sizeMm}
                  type="button"
                  onClick={() => applyPreset(p.sizeMm)}
                  className="rounded-md border border-[color:var(--color-border-default)] bg-[color:var(--color-bg-elevated)] px-2.5 py-1 text-xs font-medium text-[color:var(--color-text-secondary)] transition-colors hover:border-indigo-500 hover:text-[color:var(--color-text-primary)]"
                >
                  {p.label}
                </button>
              ))}
            </div>
          </Field>
          <Field label={T.fieldTileWidth}>
            <Controller
              control={control}
              name="tileWidthMm"
              render={({ field }) => (
                <NumberField
                  value={field.value}
                  onChange={field.onChange}
                  thousands={false}
                  decimals={0}
                  min={0}
                  suffix="mm"
                  aria-label={T.fieldTileWidth}
                />
              )}
            />
          </Field>
          <Field label={T.fieldTileHeight}>
            <Controller
              control={control}
              name="tileHeightMm"
              render={({ field }) => (
                <NumberField
                  value={field.value}
                  onChange={field.onChange}
                  thousands={false}
                  decimals={0}
                  min={0}
                  suffix="mm"
                  aria-label={T.fieldTileHeight}
                />
              )}
            />
          </Field>
          <Field label={T.fieldGrout} hint={T.fieldGroutHint}>
            <Controller
              control={control}
              name="groutMm"
              render={({ field }) => (
                <NumberField
                  value={field.value}
                  onChange={field.onChange}
                  thousands={false}
                  decimals={1}
                  min={0}
                  suffix="mm"
                  aria-label={T.fieldGrout}
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
              label={T.tileCount}
              value={fmt(result.tileCount, 0)}
              unit={T.tileCountUnit}
            />
            <dl className="grid grid-cols-2 gap-3">
              <Stat label={T.footprint} value={`${fmt(result.tileFootprintM2, 4)} m²`} />
              <Stat label={T.adjusted} value={`${fmt(result.adjustedAreaM2, 1)} m²`} />
              <Stat label={T.adhesive} value={`${fmt(result.adhesiveKg, 1)} kg`} />
              <Stat label={T.grout} value={`${fmt(result.groutKg, 2)} kg`} />
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
