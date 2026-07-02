"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  checkD8Eligibility,
  d8EligibilityInputSchema,
  type D8EligibilityInputResolved,
  type D8EligibilityResult,
  type D8Blocker,
  type D8VisaType,
} from "@/lib/calculations/visa/d8Eligibility";
import {
  ActionRow,
  CalcLayout,
  EmptyResult,
  ErrorBox,
  Field,
  FieldGroup,
  FormShell,
  ResultShell,
  SourceBox,
} from "@/components/ui/calc-form";
import { cn } from "@/lib/utils/cn";

interface D8EligibilityFormProps {
  locale: "ko" | "en" | "vi";
}

/** 유형별로 노출할 요건 체크박스 필드 */
const INVESTMENT_FIELDS = [
  "meetsInvestment",
  "meetsShares",
  "corpRegistered",
  "goodConduct",
] as const;
const STARTUP_FIELDS = [
  "hasDegree",
  "hasIP",
  "newCorp",
  "oasisMandatory",
  "goodConduct",
] as const;

type ReqField =
  | (typeof INVESTMENT_FIELDS)[number]
  | (typeof STARTUP_FIELDS)[number];

const TEXT = {
  ko: {
    sectionType: "신청 유형",
    fieldType: "어떤 D-8 비자인가요?",
    types: {
      none: "선택하세요 / 모름",
      corporateInvestment: "D-8-1 기업투자 — 한국 법인을 신설/투자",
      individualInvestment: "D-8-3 개인투자 — 한국인 운영 법인에 투자",
      techStartup: "D-8-4 기술창업 — 내 기술로 신규 법인 설립",
    },
    sectionReq: "요건 체크",
    req: {
      meetsInvestment: "외국인 투자금 1억원(₩100M) 이상",
      meetsShares: "의결권 주식 10% 이상 (D-8-3은 임원 계약 포함)",
      corpRegistered: "법인 설립 + 사업자등록 + 외국인투자기업 등록 완료",
      hasDegree: "국내 전문학사 또는 해외 학사 이상 (취득 완료)",
      hasIP: "특허·실용신안·디자인권 등록 또는 출원 중",
      newCorp: "신규 법인 설립 (기존 법인 인수 아님)",
      oasisMandatory: "OASIS 필수항목 1개 이상 충족 (IP·투자유치·정부지원 등)",
      goodConduct: "범죄경력 없음 · 출입국 위반 4회 미만 · 세금 미체납",
    },
    calculate: "자격 확인",
    reset: "초기화",
    resultHeading: "D-8 기본 자격 체크",
    resultEmpty: "유형과 요건을 선택하고 자격을 확인하세요.",
    error: "확인 중 오류가 발생했습니다.",
    eligibleTitle: "기본 신청 자격 요건 충족",
    notEligibleTitle: "아직 기본 요건 미충족",
    metLabel: "충족",
    blockerHeading: "먼저 충족해야 할 항목",
    blockers: {
      type: "D-8 신청 유형을 먼저 선택하세요",
      investment: "외국인 투자금 1억원 이상 필요",
      shares: "의결권 주식 10% 이상 필요",
      corp: "법인 설립 + 사업자등록(투자형은 외국인투자기업 등록) 완료 필요",
      degree: "국내 전문학사 또는 해외 학사 이상 필요",
      ip: "특허·실용신안·디자인권 등록 또는 출원 필요",
      newCorp: "신규 법인 설립 필요 (기존 법인 인수 불가)",
      oasis: "OASIS 필수항목 최소 1개 충족 필요",
      conduct: "범죄경력·출입국 위반·세금 체납 결격 없어야 함",
    },
    nextHeading: "다음 단계",
    nextNoteStartup:
      "기본 요건을 채워도 D-8-4는 OASIS 점수제를 통과해야 합니다. 공식 최소는 60점(총점 300)이지만 출처마다 80~120점으로 제각각이고, 항목별 배점표는 법무부 내부 지침(비공개)입니다 — 본 도구는 점수를 단정하지 않습니다. 정확한 점수·자격은 hikorea.go.kr 또는 글로벌창업이민센터(OASIS)로 확인하세요.",
    nextNoteInvest:
      "투자금·지분·법인 요건을 채웠어도 이민청은 사업 실질성(자금 출처·사무실 실주소·고용계획)을 별도로 심사합니다. 소액 투자자는 정밀심사 대상입니다. 정확한 자격·서류는 hikorea.go.kr 또는 KOTRA 외국인투자지원센터(02-3497-1741)로 확인하세요.",
    sourceTitle: "기준 · 한계",
    sourceLines: [
      "투자 1억원·지분 10%는 외국인투자촉진법 시행령 §2②, 학력·IP·신규법인·OASIS 필수항목은 HiKorea 기술창업이민 안내 기준.",
      "OASIS 점수·배점표는 비공개·수시 변동 — 본 도구는 점수를 계산하지 않습니다.",
      "요건을 채워도 승인 보장 아님. 사업 실질성·자금출처 등 개별 심사관 재량.",
      "참고용 체크리스트. 공식 확인은 hikorea.go.kr / 1345 / KOTRA.",
    ],
  },
  en: {
    sectionType: "Visa type",
    fieldType: "Which D-8 visa is this?",
    types: {
      none: "Select / not sure",
      corporateInvestment: "D-8-1 Corporate Investment — set up / invest in a Korean corp",
      individualInvestment: "D-8-3 Individual Investment — invest in a Korean-run company",
      techStartup: "D-8-4 Technology Startup — found a new company with your IP",
    },
    sectionReq: "Requirement check",
    req: {
      meetsInvestment: "Foreign investment of ₩100M (US$~73K) or more",
      meetsShares: "10%+ voting shares (D-8-3 also needs an executive contract)",
      corpRegistered: "Corp set up + business + foreign-investment-enterprise registration done",
      hasDegree: "Korean associate's or overseas bachelor's+ (already earned)",
      hasIP: "Patent / utility / design right registered or pending",
      newCorp: "A newly founded corporation (not acquiring an existing one)",
      oasisMandatory: "At least 1 OASIS mandatory item (IP, investment raised, gov't support, etc.)",
      goodConduct: "No criminal record · under 4 immigration violations · no unpaid taxes",
    },
    calculate: "Check eligibility",
    reset: "Reset",
    resultHeading: "D-8 basic eligibility",
    resultEmpty: "Select your type and requirements, then check.",
    error: "Check failed.",
    eligibleTitle: "Core requirements met",
    notEligibleTitle: "Core requirements not yet met",
    metLabel: "met",
    blockerHeading: "What to satisfy first",
    blockers: {
      type: "Pick a D-8 visa type first",
      investment: "Need foreign investment of ₩100M or more",
      shares: "Need 10%+ voting shares",
      corp: "Need corp + business registration (foreign-investment registration for investment types)",
      degree: "Need a Korean associate's or overseas bachelor's degree or higher",
      ip: "Need a registered or pending patent / utility / design right",
      newCorp: "Must be a newly founded corp (acquiring an existing one doesn't qualify)",
      oasis: "Need at least 1 OASIS mandatory item",
      conduct: "Must have no disqualifying criminal / immigration / tax record",
    },
    nextHeading: "Next step",
    nextNoteStartup:
      "Even with the core requirements, D-8-4 must pass the OASIS points test. The official minimum is 60 (of 300), but sources disagree (80–120), and the item-by-item table is an internal, unpublished MOJ manual — so this tool does NOT compute a score. Verify your real points and eligibility at hikorea.go.kr or the Global Startup Immigration Center (OASIS).",
    nextNoteInvest:
      "Even after meeting the investment, share, and corp requirements, immigration separately examines business substance (source of funds, a real office address, hiring plans). Small investors face closer scrutiny. Verify your exact eligibility and documents at hikorea.go.kr or the KOTRA Foreign Investment Support Center (+82-2-3497-1741).",
    sourceTitle: "Basis · limits",
    sourceLines: [
      "₩100M investment / 10% shares follow the Foreign Investment Promotion Act Enforcement Decree §2②; degree, IP, new-corp and OASIS-mandatory items follow the HiKorea technology-startup guide.",
      "OASIS scores and the point table are unpublished and change without notice — this tool does NOT calculate points.",
      "Meeting the requirements does not guarantee approval; business substance and source of funds are at officer discretion.",
      "Reference checklist only. Verify at hikorea.go.kr / 1345 / KOTRA.",
    ],
  },
  vi: {
    sectionType: "Loại visa",
    fieldType: "Đây là loại visa D-8 nào?",
    types: {
      none: "Vui lòng chọn / Không chắc chắn",
      corporateInvestment: "D-8-1 Đầu tư doanh nghiệp — thành lập/đầu tư vào pháp nhân Hàn Quốc",
      individualInvestment: "D-8-3 Đầu tư cá nhân — đầu tư vào pháp nhân do người Hàn Quốc điều hành",
      techStartup: "D-8-4 Khởi nghiệp công nghệ — thành lập pháp nhân mới bằng công nghệ của bạn",
    },
    sectionReq: "Kiểm tra yêu cầu",
    req: {
      meetsInvestment: "Vốn đầu tư nước ngoài từ 100 triệu won (₩100M) trở lên",
      meetsShares: "Cổ phần có quyền biểu quyết từ 10% trở lên (D-8-3 bao gồm cả hợp đồng điều hành)",
      corpRegistered: "Đã hoàn tất thành lập pháp nhân + đăng ký kinh doanh + đăng ký doanh nghiệp đầu tư nước ngoài",
      hasDegree: "Có bằng cao đẳng trong nước hoặc bằng cử nhân trở lên ở nước ngoài (đã hoàn tất)",
      hasIP: "Đã đăng ký hoặc đang nộp đơn xin bằng sáng chế · giải pháp hữu ích · quyền kiểu dáng",
      newCorp: "Thành lập pháp nhân mới (không phải mua lại pháp nhân đã có)",
      oasisMandatory: "Đáp ứng ít nhất 1 hạng mục bắt buộc của OASIS (sở hữu trí tuệ · thu hút đầu tư · hỗ trợ của chính phủ, v.v.)",
      goodConduct: "Không có tiền án · vi phạm xuất nhập cảnh dưới 4 lần · không nợ thuế",
    },
    calculate: "Kiểm tra điều kiện",
    reset: "Đặt lại",
    resultHeading: "Kiểm tra điều kiện cơ bản D-8",
    resultEmpty: "Hãy chọn loại visa và yêu cầu, sau đó kiểm tra điều kiện.",
    error: "Đã xảy ra lỗi trong quá trình kiểm tra.",
    eligibleTitle: "Đáp ứng yêu cầu điều kiện xin visa cơ bản",
    notEligibleTitle: "Chưa đáp ứng yêu cầu cơ bản",
    metLabel: "đã đáp ứng",
    blockerHeading: "Những mục cần đáp ứng trước",
    blockers: {
      type: "Hãy chọn loại visa D-8 trước",
      investment: "Cần vốn đầu tư nước ngoài từ 100 triệu won trở lên",
      shares: "Cần cổ phần có quyền biểu quyết từ 10% trở lên",
      corp: "Cần hoàn tất thành lập pháp nhân + đăng ký kinh doanh (loại đầu tư cần đăng ký doanh nghiệp đầu tư nước ngoài)",
      degree: "Cần bằng cao đẳng trong nước hoặc bằng cử nhân trở lên ở nước ngoài",
      ip: "Cần đã đăng ký hoặc đang nộp đơn xin bằng sáng chế · giải pháp hữu ích · quyền kiểu dáng",
      newCorp: "Cần thành lập pháp nhân mới (không thể mua lại pháp nhân đã có)",
      oasis: "Cần đáp ứng tối thiểu 1 hạng mục bắt buộc của OASIS",
      conduct: "Không được có tiền án · vi phạm xuất nhập cảnh · nợ thuế khiến bị loại",
    },
    nextHeading: "Bước tiếp theo",
    nextNoteStartup:
      "Ngay cả khi đáp ứng yêu cầu cơ bản, D-8-4 vẫn phải vượt qua chế độ tính điểm OASIS. Mức tối thiểu chính thức là 60 điểm (trên tổng 300), nhưng các nguồn khác nhau đưa ra mức 80–120 điểm, và bảng tính điểm theo từng hạng mục là hướng dẫn nội bộ của Bộ Tư pháp (không công bố) — công cụ này không khẳng định điểm số. Hãy xác minh điểm số và điều kiện chính xác tại hikorea.go.kr hoặc Trung tâm Nhập cư Khởi nghiệp Toàn cầu (OASIS).",
    nextNoteInvest:
      "Ngay cả khi đã đáp ứng yêu cầu về vốn đầu tư, cổ phần và pháp nhân, cơ quan xuất nhập cảnh vẫn xem xét riêng tính thực chất của hoạt động kinh doanh (nguồn vốn, địa chỉ văn phòng thực tế, kế hoạch tuyển dụng). Nhà đầu tư với số vốn nhỏ sẽ bị xét duyệt kỹ hơn. Hãy xác minh điều kiện và hồ sơ chính xác tại hikorea.go.kr hoặc Trung tâm Hỗ trợ Đầu tư Nước ngoài KOTRA (02-3497-1741).",
    sourceTitle: "Căn cứ · giới hạn",
    sourceLines: [
      "Vốn đầu tư 100 triệu won · cổ phần 10% theo Điều 2②, Nghị định thi hành Luật Xúc tiến Đầu tư Nước ngoài; trình độ học vấn, sở hữu trí tuệ, pháp nhân mới và hạng mục bắt buộc OASIS theo hướng dẫn nhập cư khởi nghiệp công nghệ của HiKorea.",
      "Điểm số và bảng tính điểm OASIS không được công bố và có thể thay đổi bất cứ lúc nào — công cụ này không tính điểm.",
      "Đáp ứng yêu cầu không đảm bảo được chấp thuận. Tính thực chất của hoạt động kinh doanh, nguồn vốn, v.v. tùy theo thẩm quyền của từng cán bộ xét duyệt.",
      "Chỉ mang tính tham khảo. Hãy xác minh chính thức tại hikorea.go.kr / 1345 / KOTRA.",
    ],
  },
} as const;

export function D8EligibilityForm({
  locale,
}: D8EligibilityFormProps): React.ReactElement {
  const T = TEXT[locale];
  const [result, setResult] = useState<D8EligibilityResult | null>(null);
  const [calcError, setCalcError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { isSubmitting },
  } = useForm<D8EligibilityInputResolved>({
    resolver: zodResolver(d8EligibilityInputSchema),
    defaultValues: {
      visaType: "none",
      meetsInvestment: false,
      meetsShares: false,
      corpRegistered: false,
      hasDegree: false,
      hasIP: false,
      newCorp: false,
      oasisMandatory: false,
      goodConduct: false,
    },
  });

  const visaType = watch("visaType") as D8VisaType;
  const isStartup = visaType === "techStartup";
  const isInvestment =
    visaType === "corporateInvestment" || visaType === "individualInvestment";
  const visibleFields: ReadonlyArray<ReqField> = isStartup
    ? STARTUP_FIELDS
    : isInvestment
      ? INVESTMENT_FIELDS
      : [];

  const onSubmit = (values: D8EligibilityInputResolved): void => {
    setCalcError(null);
    try {
      setResult(checkD8Eligibility(values));
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

  const eligible = result?.baseEligible ?? false;

  return (
    <CalcLayout>
      <FormShell onSubmit={handleSubmit(onSubmit)}>
        <FieldGroup title={T.sectionType}>
          <Field label={T.fieldType}>
            <select className="input-base" {...register("visaType")}>
              <option value="none">{T.types.none}</option>
              <option value="corporateInvestment">
                {T.types.corporateInvestment}
              </option>
              <option value="individualInvestment">
                {T.types.individualInvestment}
              </option>
              <option value="techStartup">{T.types.techStartup}</option>
            </select>
          </Field>
        </FieldGroup>

        {visibleFields.length > 0 && (
          <FieldGroup title={T.sectionReq}>
            {visibleFields.map((name) => (
              <label
                key={name}
                className="flex cursor-pointer items-center gap-2.5 rounded-lg border border-[color:var(--color-border-subtle)] bg-[color:var(--color-bg-elevated)] px-3.5 py-2.5"
              >
                <input
                  type="checkbox"
                  className="h-4 w-4 shrink-0 accent-indigo-500"
                  {...register(name)}
                />
                <span className="text-sm text-[color:var(--color-text-secondary)]">
                  {T.req[name]}
                </span>
              </label>
            ))}
          </FieldGroup>
        )}

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

      <ResultShell heading={T.resultHeading} locale={locale}>
        {calcError && <ErrorBox message={calcError} />}
        {!calcError && !result && <EmptyResult message={T.resultEmpty} />}
        {result && (
          <div className="animate-fade-up space-y-5">
            <div
              className={cn(
                "rounded-xl p-5 ring-1",
                eligible
                  ? "bg-gradient-to-br from-emerald-500/15 to-transparent ring-emerald-500/20"
                  : "bg-gradient-to-br from-amber-500/15 to-transparent ring-amber-500/20",
              )}
            >
              <p
                className={cn(
                  "text-lg font-bold tracking-tight",
                  eligible ? "text-emerald-300" : "text-amber-300",
                )}
              >
                {eligible ? T.eligibleTitle : T.notEligibleTitle}
              </p>
              {result.requiredCount > 0 && (
                <p className="mt-1 text-xs text-[color:var(--color-text-tertiary)]">
                  {result.metCount} / {result.requiredCount} {T.metLabel}
                </p>
              )}
            </div>

            {result.blockers.length > 0 && (
              <div>
                <h3 className="mb-2.5 text-xs font-semibold uppercase tracking-wider text-[color:var(--color-text-tertiary)]">
                  {T.blockerHeading}
                </h3>
                <ul className="space-y-1.5 rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 text-sm text-[color:var(--color-text-secondary)]">
                  {result.blockers.map((b: D8Blocker) => (
                    <li key={b} className="flex gap-2">
                      <span className="text-amber-400">•</span>
                      <span>{T.blockers[b]}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {visaType !== "none" && (
              <div>
                <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-[color:var(--color-text-tertiary)]">
                  {T.nextHeading}
                </h3>
                <p className="rounded-xl border border-[color:var(--color-border-subtle)] bg-[color:var(--color-bg-elevated)] p-4 text-sm leading-relaxed text-[color:var(--color-text-secondary)]">
                  {isStartup ? T.nextNoteStartup : T.nextNoteInvest}
                </p>
              </div>
            )}

            <SourceBox lines={[T.sourceTitle, ...T.sourceLines]} />
          </div>
        )}
      </ResultShell>
    </CalcLayout>
  );
}
