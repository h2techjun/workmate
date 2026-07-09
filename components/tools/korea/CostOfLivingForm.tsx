"use client";

import { useMemo, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  calculateCostOfLiving,
  costOfLivingInputSchema,
  type CostOfLivingInputResolved,
} from "@/lib/calculations/korea/costOfLiving";
import {
  COST_LINE_KEYS,
  suggestDefaults,
  type CostLineKey,
  type Household,
  type Region,
} from "@/lib/constants/korea/costOfLiving";
import { formatKrw, formatKoreanMoney } from "@/lib/utils/format";
import {
  ActionRow,
  CalcLayout,
  Field,
  FieldGroup,
  FormShell,
  HeroResult,
  ResultShell,
  SourceBox,
  Stat,
} from "@/components/ui/calc-form";
import { NumberField } from "@/components/ui/NumberField";

interface CostOfLivingFormProps {
  locale: "ko" | "en" | "zh" | "vi";
}

const TEXT = {
  ko: {
    sectionProfile: "지역 · 가구",
    fieldRegion: "지역",
    fieldHousehold: "가구",
    sectionItems: "월 항목 (모두 편집 가능)",
    calculate: "다시 계산",
    reset: "기본값으로",
    heading: "월 생활비 추정",
    heroLabel: "월 합계 (추정)",
    won: "원",
    annual: "연간 환산",
    perPerson: "1인당 월",
    note: "각 항목은 지역·가구 기준의 일반적 추정 중앙값입니다. 본인 상황에 맞게 직접 수정하세요 — 합계는 입력한 값의 총합입니다.",
    regionOpt: {
      seoulCore: "서울 도심 (강남·마포 등)",
      seoulOuter: "서울 외곽",
      gyeonggi: "경기 (수도권)",
      metro: "광역시 (부산·대구 등)",
      other: "지방 중소도시",
    } as Record<Region, string>,
    householdOpt: {
      single: "1인",
      couple: "커플 (2인)",
      family: "가족 (3~4인)",
    } as Record<Household, string>,
    lineLabel: {
      rent: "월세",
      utilities: "공과금 (전기·가스·수도·관리비)",
      food: "식비",
      transport: "교통",
      mobile: "통신",
      healthInsurance: "건강보험",
      other: "기타 (여가·의류·잡비)",
    } as Record<CostLineKey, string>,
    sourceTitle: "기준 · 성격",
    sourceLines: [
      "합계 = 위 7개 항목의 단순 합 (입력값 그대로).",
      "지역·가구 선택은 편집 가능한 기본값을 채워줄 뿐, '한국은 얼마다'라는 단정이 아닙니다.",
      "월세는 지역·전용면적, 건강보험은 소득·재산·가입유형(직장/지역)에 따라 크게 다릅니다.",
      "USD 환산은 환율 변동으로 오해를 줄 수 있어 원화만 표시합니다.",
      "2026 기준 일반적 추정 범위의 대표값. 참고용 — 실제 계약·고지서로 확인하세요.",
    ],
  },
  en: {
    sectionProfile: "Region · household",
    fieldRegion: "Region",
    fieldHousehold: "Household",
    sectionItems: "Monthly items (all editable)",
    calculate: "Recalculate",
    reset: "Reset defaults",
    heading: "Monthly cost estimate",
    heroLabel: "Monthly total (estimate)",
    won: "₩",
    annual: "Annualized",
    perPerson: "Per person / month",
    note: "Each line is a typical mid-range estimate for the region and household. Edit them to your situation — the total is simply the sum of what you enter.",
    regionOpt: {
      seoulCore: "Central Seoul (Gangnam, Mapo…)",
      seoulOuter: "Outer Seoul",
      gyeonggi: "Gyeonggi (metro area)",
      metro: "Metro city (Busan, Daegu…)",
      other: "Smaller city",
    } as Record<Region, string>,
    householdOpt: {
      single: "Single",
      couple: "Couple (2)",
      family: "Family (3–4)",
    } as Record<Household, string>,
    lineLabel: {
      rent: "Rent",
      utilities: "Utilities (power, gas, water, fees)",
      food: "Food",
      transport: "Transport",
      mobile: "Mobile",
      healthInsurance: "Health insurance",
      other: "Other (leisure, clothes, misc.)",
    } as Record<CostLineKey, string>,
    sourceTitle: "Basis · nature",
    sourceLines: [
      "Total = plain sum of the 7 items above (your inputs).",
      "Region/household only prefill editable defaults — this is not a claim that 'Korea costs X'.",
      "Rent varies by area and size; health insurance varies by income, assets, and scheme (employer vs local).",
      "USD conversion is omitted — exchange rates move and would mislead. KRW only.",
      "Representative mid-range estimates for 2026. Reference only — confirm with real contracts and bills.",
    ],
  },
  zh: {
    sectionProfile: "地区 · 家庭",
    fieldRegion: "地区",
    fieldHousehold: "家庭",
    sectionItems: "月度项目（均可编辑）",
    calculate: "重新计算",
    reset: "恢复默认值",
    heading: "月生活费估算",
    heroLabel: "月总额（估算）",
    won: "₩",
    annual: "年度换算",
    perPerson: "人均月度",
    note: "各项目为按地区·家庭规模估算的一般中位数。请根据自身情况直接修改——总额即为你所输入数值的总和。",
    regionOpt: {
      seoulCore: "首尔市中心（江南·麻浦等）",
      seoulOuter: "首尔外围",
      gyeonggi: "京畿道（首都圈）",
      metro: "广域市（釜山·大邱等）",
      other: "地方中小城市",
    } as Record<Region, string>,
    householdOpt: {
      single: "单身",
      couple: "情侣（2人）",
      family: "家庭（3~4人）",
    } as Record<Household, string>,
    lineLabel: {
      rent: "房租",
      utilities: "水电燃气费（电·燃气·水·管理费）",
      food: "伙食费",
      transport: "交通",
      mobile: "通讯",
      healthInsurance: "健康保险",
      other: "其他（休闲·服装·杂费）",
    } as Record<CostLineKey, string>,
    sourceTitle: "依据 · 性质",
    sourceLines: [
      "总额 = 以上7个项目的简单加总（按输入值原样计算）。",
      "选择地区·家庭只是填入可编辑的默认值，并非断言'韩国生活费是多少'。",
      "房租因地区·专用面积而异，健康保险则因收入·财产·加入类型（职场/地区）而有很大差异。",
      "由于汇率波动可能造成误解，本工具不换算美元，仅显示韩元金额。",
      "以2026年为基准的一般估算区间代表值，仅供参考——请以实际合同·账单为准确认。",
    ],
  },
  vi: {
    sectionProfile: "Khu vực · hộ gia đình",
    fieldRegion: "Khu vực",
    fieldHousehold: "Hộ gia đình",
    sectionItems: "Mục chi hàng tháng (đều có thể chỉnh sửa)",
    calculate: "Tính lại",
    reset: "Về mặc định",
    heading: "Ước tính chi phí sinh hoạt hàng tháng",
    heroLabel: "Tổng hàng tháng (ước tính)",
    won: "원",
    annual: "Quy đổi năm",
    perPerson: "Mỗi người / tháng",
    note: "Mỗi mục là ước tính trung bình điển hình cho khu vực và hộ gia đình. Hãy chỉnh sửa theo tình huống của bạn — tổng số chỉ đơn giản là tổng các giá trị bạn nhập.",
    regionOpt: {
      seoulCore: "Trung tâm Seoul (Gangnam, Mapo…)",
      seoulOuter: "Ngoại ô Seoul",
      gyeonggi: "Gyeonggi (vùng thủ đô)",
      metro: "Thành phố lớn (Busan, Daegu…)",
      other: "Thành phố nhỏ hơn",
    } as Record<Region, string>,
    householdOpt: {
      single: "Độc thân",
      couple: "Cặp đôi (2 người)",
      family: "Gia đình (3–4 người)",
    } as Record<Household, string>,
    lineLabel: {
      rent: "Tiền thuê nhà",
      utilities: "Tiện ích (điện, gas, nước, phí quản lý)",
      food: "Ăn uống",
      transport: "Di chuyển",
      mobile: "Điện thoại",
      healthInsurance: "Bảo hiểm y tế",
      other: "Khác (giải trí, quần áo, chi phí lặt vặt)",
    } as Record<CostLineKey, string>,
    sourceTitle: "Cơ sở · tính chất",
    sourceLines: [
      "Tổng = tổng đơn giản của 7 mục trên (giá trị bạn nhập).",
      "Khu vực/hộ gia đình chỉ điền sẵn giá trị mặc định có thể chỉnh sửa — đây không phải là khẳng định rằng 'Hàn Quốc tốn X'.",
      "Tiền thuê nhà thay đổi theo khu vực và diện tích; bảo hiểm y tế thay đổi theo thu nhập, tài sản và loại hình (công ty hay tự do).",
      "Không quy đổi USD — tỷ giá biến động và có thể gây hiểu nhầm. Chỉ hiển thị KRW.",
      "Ước tính trung bình đại diện cho năm 2026. Chỉ mang tính tham khảo — xác nhận bằng hợp đồng và hóa đơn thực tế.",
    ],
  },
} as const;

const INITIAL_REGION: Region = "seoulCore";
const INITIAL_HOUSEHOLD: Household = "single";

function buildDefaults(
  region: Region,
  household: Household,
): CostOfLivingInputResolved {
  return { household, ...suggestDefaults(region, household) };
}

export function CostOfLivingForm({
  locale,
}: CostOfLivingFormProps): React.ReactElement {
  const T = TEXT[locale];
  const won = locale === "ko" ? "원" : "₩";
  const [region, setRegion] = useState<Region>(INITIAL_REGION);

  const { control, watch, setValue, reset } =
    useForm<CostOfLivingInputResolved>({
      resolver: zodResolver(costOfLivingInputSchema),
      defaultValues: buildDefaults(INITIAL_REGION, INITIAL_HOUSEHOLD),
      mode: "onChange",
    });

  const values = watch();
  const result = useMemo(() => {
    try {
      return calculateCostOfLiving(costOfLivingInputSchema.parse(values));
    } catch {
      return null;
    }
  }, [values]);

  // 지역·가구 변경 시 편집 가능한 기본값을 다시 채움
  const applyDefaults = (nextRegion: Region, nextHousehold: Household): void => {
    const d = suggestDefaults(nextRegion, nextHousehold);
    for (const key of COST_LINE_KEYS) {
      setValue(key, d[key], { shouldValidate: true });
    }
  };

  const onRegionChange = (next: Region): void => {
    setRegion(next);
    applyDefaults(next, values.household);
  };
  const onHouseholdChange = (next: Household): void => {
    setValue("household", next);
    applyDefaults(region, next);
  };
  const onReset = (): void => {
    setRegion(INITIAL_REGION);
    reset(buildDefaults(INITIAL_REGION, INITIAL_HOUSEHOLD));
  };

  return (
    <CalcLayout>
      <FormShell onSubmit={(e) => e.preventDefault()}>
        <FieldGroup title={T.sectionProfile}>
          <Field label={T.fieldRegion}>
            <select
              className="input-base"
              value={region}
              onChange={(e) => onRegionChange(e.target.value as Region)}
            >
              {(Object.keys(T.regionOpt) as Region[]).map((r) => (
                <option key={r} value={r}>
                  {T.regionOpt[r]}
                </option>
              ))}
            </select>
          </Field>
          <Controller
            control={control}
            name="household"
            render={({ field }) => (
              <Field label={T.fieldHousehold}>
                <select
                  className="input-base"
                  value={field.value}
                  onChange={(e) =>
                    onHouseholdChange(e.target.value as Household)
                  }
                >
                  {(Object.keys(T.householdOpt) as Household[]).map((h) => (
                    <option key={h} value={h}>
                      {T.householdOpt[h]}
                    </option>
                  ))}
                </select>
              </Field>
            )}
          />
        </FieldGroup>

        <FieldGroup title={T.sectionItems}>
          {COST_LINE_KEYS.map((key) => (
            <Controller
              key={key}
              control={control}
              name={key}
              render={({ field }) => (
                <Field label={T.lineLabel[key]}>
                  <NumberField
                    value={field.value}
                    onChange={field.onChange}
                    thousands
                    decimals={0}
                    suffix={won}
                    aria-label={T.lineLabel[key]}
                  />
                </Field>
              )}
            />
          ))}
        </FieldGroup>

        <ActionRow
          primary={
            <button type="button" onClick={onReset} className="btn-primary flex-1">
              {T.reset}
            </button>
          }
        />
      </FormShell>

      <ResultShell heading={T.heading} locale={locale}>
        {result && (
          <div className="animate-fade-up space-y-5">
            <div>
              <HeroResult
                label={T.heroLabel}
                value={formatKrw(result.monthlyTotal)}
                unit={T.won}
              />
              {locale === "ko" && result.monthlyTotal > 0 && (
                <p className="mt-2 text-sm font-medium text-[color:var(--color-text-secondary)]">
                  = {formatKoreanMoney(result.monthlyTotal)}/월
                </p>
              )}
            </div>

            <dl className="grid grid-cols-2 gap-3">
              <Stat
                label={T.annual}
                value={`${formatKrw(result.annualTotal)} ${T.won}`}
              />
              <Stat
                label={T.perPerson}
                value={`${formatKrw(Math.round(result.perPersonMonthly))} ${T.won}`}
              />
            </dl>

            <p className={`rounded-xl border border-[color:var(--color-border-subtle)] bg-[color:var(--color-bg-elevated)] p-4 text-xs leading-relaxed text-[color:var(--color-text-tertiary)]`}>
              {T.note}
            </p>

            <SourceBox lines={[T.sourceTitle, ...T.sourceLines]} />
          </div>
        )}
      </ResultShell>
    </CalcLayout>
  );
}
