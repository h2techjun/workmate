import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft, ArrowRight } from "lucide-react";
import { notFound } from "next/navigation";
import { calculateInsurance } from "@/lib/calculations/insurance/fourMajorInsurance";
import { CalculatorJsonLd } from "@/components/seo/StructuredData";
import { SITE_URL } from "@/lib/siteConfig";

interface PageProps {
  params: Promise<{ locale: string; amount: string }>;
}

/**
 * 사전에 빌드 타임에 생성할 월급 (만원). 전 범위가 아니라
 * 검색 빈도 높은 구간만 추려서 60여 개 페이지 생성.
 */
const STATIC_SALARY_PAGES_MAN = [
  150, 180, 200, 210, 220, 230, 240, 250, 260, 270, 280, 290, 300, 310, 320, 330,
  340, 350, 360, 370, 380, 390, 400, 410, 420, 430, 440, 450, 460, 470, 480, 490,
  500, 520, 550, 580, 600, 650, 700, 750, 800, 850, 900, 1000, 1200, 1500, 2000,
];

const formatKrw = (n: number): string =>
  new Intl.NumberFormat("ko-KR").format(Math.round(n));

const formatMan = (man: number): string => {
  if (man >= 10000) return `${(man / 10000).toFixed(0)}억원`;
  return `${formatKrw(man)}만원`;
};

const formatManZh = (man: number): string => {
  if (man >= 10000) return `${(man / 10000).toFixed(0)}亿韩元`;
  return `${formatKrw(man)}万韩元`;
};

const formatKrwVi = (n: number): string =>
  new Intl.NumberFormat("vi-VN").format(Math.round(n));

/** amountMan(만원 단위) → "X,X triệu KRW" 베트남어 표기. 10,000만(=1억) 이상은 방어적 fallback. */
const formatManVi = (man: number): string => {
  if (man >= 10000) return `${(man / 10000).toFixed(0)} trăm triệu KRW`;
  const million = man / 100;
  const rounded = Math.round(million * 100) / 100;
  const trimmed = rounded
    .toFixed(2)
    .replace(/0+$/, "")
    .replace(/\.$/, "")
    .replace(".", ",");
  return `${trimmed} triệu KRW`;
};

interface NeighborInfo {
  amountMan: number;
  url: string;
  label: string;
}

function getNeighbors(
  amountMan: number,
  locale: string,
): { prev?: NeighborInfo; next?: NeighborInfo } {
  const sorted = [...STATIC_SALARY_PAGES_MAN].sort((a, b) => a - b);
  const idx = sorted.indexOf(amountMan);
  if (idx === -1) return {};
  const prev = idx > 0 ? sorted[idx - 1] : undefined;
  const next = idx < sorted.length - 1 ? sorted[idx + 1] : undefined;
  return {
    prev: prev !== undefined
      ? {
          amountMan: prev,
          url: `/${locale}/salary/${prev}`,
          label: formatMan(prev),
        }
      : undefined,
    next: next !== undefined
      ? {
          amountMan: next,
          url: `/${locale}/salary/${next}`,
          label: formatMan(next),
        }
      : undefined,
  };
}

export function generateStaticParams(): Array<{ amount: string }> {
  return STATIC_SALARY_PAGES_MAN.map((man) => ({ amount: man.toString() }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale, amount } = await params;
  const amountMan = Number(amount);
  if (!Number.isFinite(amountMan) || amountMan < 100) return {};
  const monthlyKrw = amountMan * 10000;
  const isKo = locale === "ko";
  const isZh = locale === "zh";
  const isVi = locale === "vi";

  const title = isKo
    ? `월급 ${formatMan(amountMan)} 실수령액 (4대보험 2026 적용)`
    : isZh
      ? `月薪${formatManZh(amountMan)}实领金额 (四大保险2026年适用)`
      : isVi
        ? `Lương tháng ${formatManVi(amountMan)} thực nhận (4 bảo hiểm xã hội, 2026)`
        : `Monthly KRW ${formatKrw(monthlyKrw)} take-home (Korean 2026 payroll insurance)`;

  const description = isKo
    ? `세전 월급 ${formatMan(amountMan)} 받으면 4대보험 차감 후 실수령액은 얼마? 국민연금·건강보험·고용보험을 항목별로 분해해 드립니다. 2026년 요율 기준.`
    : isZh
      ? `税前月薪${formatManZh(amountMan)}，扣除四大保险后实领金额是多少？按项目分解国民年金、健康保险、雇佣保险。以2026年费率为准。`
      : isVi
        ? `Nếu lương gộp hàng tháng là ${formatManVi(amountMan)}, đây là mức lương thực nhận sau khi khấu trừ 4 loại bảo hiểm xã hội Hàn Quốc — phân tích theo từng khoản Lương hưu Quốc dân, Bảo hiểm Y tế, Bảo hiểm việc làm. Theo mức phí năm 2026.`
        : `If your gross monthly salary is KRW ${formatKrw(monthlyKrw)}, here's the breakdown of Korean 4-major insurance deductions and your take-home pay (2026 rates).`;

  return {
    title,
    description,
    // 급여별 자동생성 페이지는 near-duplicate → 색인 제외(AdSense low-value 방지),
    // 링크는 따라가 4대보험 계산기로 가치 전달. 계산기(insurance-calc)가 색인 본체.
    robots: { index: false, follow: true },
    alternates: {
      canonical: `${SITE_URL}/${locale}/salary/${amount}`,
      languages: {
        ko: `/ko/salary/${amount}`,
        en: `/en/salary/${amount}`,
        zh: `/zh/salary/${amount}`,
        vi: `/vi/salary/${amount}`,
      },
    },
    openGraph: {
      title,
      description,
      type: "website",
      url: `${SITE_URL}/${locale}/salary/${amount}`,
      locale: isKo ? "ko_KR" : isZh ? "zh_CN" : isVi ? "vi_VN" : "en_US",
    },
  };
}

/** 변수 기반 commentary — 동일 템플릿 반복 회피용. locale 받아 ko/zh/vi 6구간 번역 반환(en은 별도 동적 문장 사용). */
function getSalaryCommentary(amountMan: number, locale: string): string {
  const isZh = locale === "zh";
  const isVi = locale === "vi";
  if (amountMan <= 200) {
    if (isZh) {
      return `${formatManZh(amountMan)}接近2026年最低工资标准(时薪9,860韩元，月薪209万韩元)。在这个薪资区间，四大保险负担在主观感受上会比较重，但实际扣除比例约为9.4%，与其他区间相同。只是因为绝对金额较小，比例相同也会让人感觉负担更大。`;
    }
    if (isVi) {
      return `${formatManVi(amountMan)} gần với mức lương tối thiểu năm 2026 (lương giờ 9.860 KRW, lương tháng 2,09 triệu KRW). Ở mức lương này, gánh nặng 4 loại bảo hiểm xã hội thường được cảm nhận là khá lớn, nhưng tỷ lệ khấu trừ thực tế vẫn khoảng 9,4%, giống như các mức lương khác. Chỉ vì số tiền tuyệt đối nhỏ nên dù tỷ lệ như nhau, gánh nặng vẫn có cảm giác lớn hơn.`;
    }
    return `${formatMan(amountMan)}은 2026년 최저임금(시급 9,860원, 월 209만원)에 가까운 구간입니다. 이 정도 급여대에서는 4대보험 부담이 체감상 크게 느껴지는데, 차감율은 약 9.4%로 다른 구간과 동일합니다. 절대 금액이 작다 보니 비율이 같아도 부담이 큰 거죠.`;
  }
  if (amountMan <= 300) {
    if (isZh) {
      return `${formatManZh(amountMan)}接近韩国30多岁上班族的平均工资水平。四大保险扣除比例约为9.4%，属于标准水平，也是年末结算时不会产生大额退税或补缴的稳定区间。`;
    }
    if (isVi) {
      return `${formatManVi(amountMan)} gần với mức lương trung bình của người đi làm ở độ tuổi 30 tại Hàn Quốc. Tỷ lệ khấu trừ 4 loại bảo hiểm xã hội khoảng 9,4%, ở mức tiêu chuẩn, và đây cũng là mức lương ổn định — không phát sinh khoản hoàn thuế hay truy thu lớn khi quyết toán thuế cuối năm.`;
    }
    return `${formatMan(amountMan)}은 한국 30대 직장인의 평균 임금에 근접한 구간입니다. 4대보험 차감율은 약 9.4%로 표준적이며, 연말정산에서 큰 환급이나 추가 납부가 발생하지 않는 안정적인 구간입니다.`;
  }
  if (amountMan <= 500) {
    if (isZh) {
      return `${formatManZh(amountMan)}区间尚未达到国民年金标准收入月额上限(617万韩元)，因此所有保险均按比例计算。扣除比例仍维持在约9.4%。`;
    }
    if (isVi) {
      return `Ở mức ${formatManVi(amountMan)}, vẫn chưa đạt mức trần thu nhập tháng chuẩn của Lương hưu Quốc dân (6,17 triệu KRW), nên tất cả các loại bảo hiểm đều được áp dụng theo tỷ lệ. Tỷ lệ khấu trừ vẫn giữ nguyên ở mức khoảng 9,4%.`;
    }
    return `${formatMan(amountMan)} 구간은 국민연금 기준소득월액 상한(617만원)에 아직 도달하지 않아 모든 보험이 비례 적용됩니다. 차감율 약 9.4%가 그대로 유지됩니다.`;
  }
  if (amountMan <= 700) {
    if (isZh) {
      return `${formatManZh(amountMan)}接近或略微超过国民年金标准收入月额上限(617万韩元)。超过上限的部分不再计入国民年金征收对象，因此扣除比例会从9.4%逐渐降至约8.6%。`;
    }
    if (isVi) {
      return `${formatManVi(amountMan)} gần đạt hoặc vượt nhẹ mức trần thu nhập tháng chuẩn của Lương hưu Quốc dân (6,17 triệu KRW). Phần lương vượt quá mức trần không còn bị tính phí Lương hưu Quốc dân, nên tỷ lệ khấu trừ sẽ giảm dần từ 9,4% xuống còn khoảng 8,6%.`;
    }
    return `${formatMan(amountMan)}은 국민연금 상한(617만원)에 근접하거나 약간 넘어서는 구간입니다. 상한 이상의 급여에 대해서는 국민연금이 더 이상 부과되지 않아, 차감율이 9.4%에서 약 8.6%로 점진적으로 떨어집니다.`;
  }
  if (amountMan <= 1000) {
    if (isZh) {
      return `达到${formatManZh(amountMan)}左右时，受国民年金上限效应影响，扣除比例会降至7~8%左右。不过健康保险没有上限，比例负担会持续增加。`;
    }
    if (isVi) {
      return `Ở mức khoảng ${formatManVi(amountMan)}, do hiệu ứng mức trần của Lương hưu Quốc dân, tỷ lệ khấu trừ sẽ giảm xuống còn khoảng 7-8%. Tuy nhiên Bảo hiểm Y tế không có mức trần, nên gánh nặng theo tỷ lệ vẫn tiếp tục tăng.`;
    }
    return `${formatMan(amountMan)} 정도가 되면 국민연금 상한 효과로 차감율이 7~8% 수준으로 떨어집니다. 다만 건강보험은 상한이 없어서 비례 부담이 계속 커지는 구간입니다.`;
  }
  if (isZh) {
    return `${formatManZh(amountMan)}以上的高收入者，国民年金扣除额固定为277,650韩元(上限)。健康保险按比例计算，因此扣除的绝对金额会持续增加，但占比会降至7%以下。`;
  }
  if (isVi) {
    return `Đối với người thu nhập cao từ ${formatManVi(amountMan)} trở lên, khoản khấu trừ Lương hưu Quốc dân sẽ cố định ở mức 277.650 KRW (mức trần). Vì Bảo hiểm Y tế áp dụng theo tỷ lệ, số tiền khấu trừ tuyệt đối vẫn tiếp tục tăng, nhưng tính theo tỷ lệ sẽ giảm xuống dưới 7%.`;
  }
  return `${formatMan(amountMan)} 이상의 고소득자는 국민연금 차감액이 277,650원에서 고정됩니다(상한). 건강보험은 비례 적용되므로 차감 절대액은 계속 늘지만, 비율로는 7% 아래로 떨어집니다.`;
}

export default async function SalaryPage({
  params,
}: PageProps): Promise<React.ReactElement> {
  const { locale, amount } = await params;
  const amountMan = Number(amount);

  if (!Number.isFinite(amountMan) || amountMan < 100 || amountMan > 5000) {
    notFound();
  }
  const monthlyKrw = amountMan * 10000;

  const result = calculateInsurance({ monthlySalary: monthlyKrw });
  const { prev, next } = getNeighbors(amountMan, locale);
  const isKo = locale === "ko";
  const isZh = locale === "zh";
  const isVi = locale === "vi";

  return (
    <main className="px-4 pb-16 pt-6 md:px-6 md:pt-12">
      <CalculatorJsonLd
        name={
          isKo
            ? `월급 ${formatMan(amountMan)} 실수령액 (4대보험 2026)`
            : isZh
              ? `月薪${formatManZh(amountMan)}实领金额 (四大保险2026)`
              : isVi
                ? `Lương tháng ${formatManVi(amountMan)} thực nhận (4 bảo hiểm 2026)`
                : `Monthly KRW ${formatKrw(monthlyKrw)} take-home`
        }
        description={
          isKo
            ? `세전 월급 ${formatMan(amountMan)} 기준 4대보험 차감 후 실수령액 분석.`
            : isZh
              ? `税前月薪${formatManZh(amountMan)}，扣除四大保险后的实领金额分析。`
              : isVi
                ? `Phân tích lương thực nhận sau khi khấu trừ 4 loại bảo hiểm xã hội, với lương gộp hàng tháng ${formatManVi(amountMan)}.`
                : `Korean payroll insurance breakdown for monthly KRW ${formatKrw(monthlyKrw)}.`
        }
        url={`${SITE_URL}/${locale}/salary/${amount}`}
      />
      <div className="mx-auto max-w-3xl">
        <nav className="mb-5 flex items-center gap-2 text-sm text-[color:var(--color-text-tertiary)]">
          <Link
            href={`/${locale}/insurance-calc`}
            className="inline-flex items-center gap-1 transition-colors hover:text-[color:var(--color-text-primary)]"
          >
            <ChevronLeft className="h-4 w-4" />
            {isKo
              ? "4대보험 계산기"
              : isZh
                ? "四大保险计算器"
                : isVi
                  ? "Máy tính 4 Bảo hiểm Bắt buộc"
                  : "4-Major Insurance Calculator"}
          </Link>
        </nav>

        <header className="mb-6">
          <p className="text-xs font-medium uppercase tracking-wider text-[color:var(--color-text-tertiary)]">
            {isKo
              ? "급여별 시뮬레이션"
              : isZh
                ? "薪资模拟"
                : isVi
                  ? "Mô phỏng lương"
                  : "Salary Simulation"}
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-[color:var(--color-text-primary)] md:text-4xl">
            {isKo
              ? `월급 ${formatMan(amountMan)} 실수령액`
              : isZh
                ? `月薪${formatManZh(amountMan)}实领金额`
                : isVi
                  ? `Lương tháng ${formatManVi(amountMan)} thực nhận`
                  : `Monthly KRW ${formatKrw(monthlyKrw)} take-home`}
          </h1>
          <p className="mt-2 text-sm text-[color:var(--color-text-tertiary)]">
            {isKo
              ? "2026년 4대보험 요율 적용 · 세전 기준"
              : isZh
                ? "2026年四大保险费率适用 · 税前基准"
                : isVi
                  ? "Áp dụng mức phí 4 loại bảo hiểm xã hội 2026 · Trước thuế"
                  : "2026 Korean payroll insurance · before income tax"}
          </p>
        </header>

        {/* Hero */}
        <section className="mb-6 rounded-xl bg-gradient-to-br from-indigo-500/15 via-indigo-500/5 to-transparent p-6 ring-1 ring-indigo-500/20">
          <p className="text-xs font-medium uppercase tracking-wider text-[color:var(--color-text-tertiary)]">
            {isKo
              ? "근로자 실수령액"
              : isZh
                ? "劳动者实领金额"
                : isVi
                  ? "Lương thực nhận"
                  : "Take-home"}
          </p>
          <p className="mt-2 flex items-baseline gap-2">
            <span className="text-4xl font-bold tracking-tight text-white tabular-nums md:text-5xl">
              {formatKrw(result.netSalary)}
            </span>
            <span className="text-xl font-semibold text-[color:var(--color-text-secondary)]">
              {isKo ? "원" : isZh ? "韩元" : "KRW"}
            </span>
          </p>
          <p className="mt-2 text-sm text-[color:var(--color-text-secondary)]">
            {isKo
              ? `세전 ${formatKrw(monthlyKrw)}원에서 4대보험 ${formatKrw(result.totalEmployee)}원 차감.`
              : isZh
                ? `税前${formatKrw(monthlyKrw)}韩元中扣除四大保险${formatKrw(result.totalEmployee)}韩元。`
                : isVi
                  ? `Trước thuế ${formatKrwVi(monthlyKrw)} KRW − bảo hiểm xã hội ${formatKrwVi(result.totalEmployee)} KRW = lương thực nhận.`
                  : `Pre-tax KRW ${formatKrw(monthlyKrw)} − insurance KRW ${formatKrw(result.totalEmployee)} = take-home.`}
          </p>
        </section>

        {/* Breakdown table */}
        <section className="mb-8">
          <h2 className="mb-3 text-xl font-semibold text-[color:var(--color-text-primary)]">
            {isKo
              ? "보험별 분해"
              : isZh
                ? "各险种明细"
                : isVi
                  ? "Phân tích theo từng loại bảo hiểm"
                  : "By insurance"}
          </h2>
          <div className="overflow-hidden rounded-xl border border-[color:var(--color-border-subtle)] bg-[color:var(--color-bg-elevated)]">
            <table className="w-full text-sm">
              <thead className="text-xs uppercase tracking-wider text-[color:var(--color-text-tertiary)]">
                <tr>
                  <th className="px-4 py-2 text-left font-medium">
                    {isKo ? "보험" : isZh ? "险种" : isVi ? "Bảo hiểm" : "Insurance"}
                  </th>
                  <th className="px-4 py-2 text-right font-medium">
                    {isKo
                      ? "근로자"
                      : isZh
                        ? "劳动者"
                        : isVi
                          ? "Người lao động"
                          : "Employee"}
                  </th>
                  <th className="px-4 py-2 text-right font-medium">
                    {isKo
                      ? "사용자"
                      : isZh
                        ? "雇主"
                        : isVi
                          ? "Người sử dụng lao động"
                          : "Employer"}
                  </th>
                </tr>
              </thead>
              <tbody className="text-[color:var(--color-text-secondary)] tabular-nums">
                {result.lines.map((l) => (
                  <tr key={l.key} className="border-t border-[color:var(--color-border-subtle)]">
                    <td className="px-4 py-2 text-left">
                      {l.key === "nationalPension" &&
                        (isKo
                          ? "국민연금"
                          : isZh
                            ? "国民年金"
                            : isVi
                              ? "Lương hưu Quốc dân"
                              : "National Pension")}
                      {l.key === "healthInsurance" &&
                        (isKo
                          ? "건강보험"
                          : isZh
                            ? "健康保险"
                            : isVi
                              ? "Bảo hiểm Y tế"
                              : "Health")}
                      {l.key === "longTermCare" &&
                        (isKo
                          ? "장기요양"
                          : isZh
                            ? "长期疗养保险"
                            : isVi
                              ? "Chăm sóc dài hạn"
                              : "Long-term Care")}
                      {l.key === "employmentUnemployment" &&
                        (isKo
                          ? "고용보험 (실업급여)"
                          : isZh
                            ? "雇佣保险 (失业津贴)"
                            : isVi
                              ? "Bảo hiểm việc làm (Thất nghiệp)"
                              : "Employment (UI)")}
                      {l.key === "employmentExtra" &&
                        (isKo
                          ? "고용보험 (안정·능력개발)"
                          : isZh
                            ? "雇佣保险 (稳定·能力开发)"
                            : isVi
                              ? "Bảo hiểm việc làm (Ổn định việc làm/Phát triển kỹ năng)"
                              : "Employment (Stability)")}
                      {l.key === "industrialAccident" &&
                        (isKo
                          ? "산재보험"
                          : isZh
                            ? "工伤保险"
                            : isVi
                              ? "Bảo hiểm tai nạn lao động"
                              : "Industrial Accident")}
                    </td>
                    <td className="px-4 py-2 text-right">
                      {l.employee > 0 ? formatKrw(l.employee) : "—"}
                    </td>
                    <td className="px-4 py-2 text-right">
                      {l.employer > 0 ? formatKrw(l.employer) : "—"}
                    </td>
                  </tr>
                ))}
                <tr className="border-t border-[color:var(--color-border-default)] bg-[color:var(--color-bg-card-hover)] font-semibold text-[color:var(--color-text-primary)]">
                  <td className="px-4 py-2">
                    {isKo ? "합계" : isZh ? "合计" : isVi ? "Tổng" : "Total"}
                  </td>
                  <td className="px-4 py-2 text-right">
                    {formatKrw(result.totalEmployee)}
                  </td>
                  <td className="px-4 py-2 text-right">
                    {formatKrw(result.totalEmployer)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Variable commentary */}
        <section className="mb-8 space-y-3 leading-relaxed text-[color:var(--color-text-secondary)]">
          <h2 className="text-xl font-semibold text-[color:var(--color-text-primary)]">
            {isKo
              ? "이 구간의 특징"
              : isZh
                ? "这一区间的特点"
                : isVi
                  ? "Đặc điểm của mức lương này"
                  : "What stands out at this salary"}
          </h2>
          <p>
            {isKo || isZh || isVi
              ? getSalaryCommentary(amountMan, locale)
              : `For a monthly salary of KRW ${formatKrw(monthlyKrw)}, the 4-major insurance deduction is approximately ${((result.totalEmployee / monthlyKrw) * 100).toFixed(2)}% of gross. Employer additionally contributes ${((result.totalEmployer / monthlyKrw) * 100).toFixed(2)}%.`}
          </p>
        </section>

        {/* Employer cost */}
        <section className="mb-8">
          <h2 className="mb-3 text-xl font-semibold text-[color:var(--color-text-primary)]">
            {isKo
              ? "사용자 입장"
              : isZh
                ? "雇主视角"
                : isVi
                  ? "Góc nhìn của người sử dụng lao động"
                  : "Employer perspective"}
          </h2>
          <p className="leading-relaxed text-[color:var(--color-text-secondary)]">
            {isKo ? (
              <>
                {formatMan(amountMan)} 직원을 채용한다면 회사가 실제로
                매월 부담하는 총 인건비는{" "}
                <strong className="text-white">
                  {formatKrw(result.totalCost)}원
                </strong>
                . 즉 사용자 입장에서는 표면 월급보다{" "}
                {formatKrw(result.totalEmployer)}원이 추가로 나가는
                구조입니다.
              </>
            ) : isZh ? (
              <>
                雇用{formatManZh(amountMan)}的员工，公司每月实际
                承担的总人工成本为{" "}
                <strong className="text-white">
                  {formatKrw(result.totalCost)}韩元
                </strong>
                。也就是说，从雇主的角度看，比表面月薪要多支出{" "}
                {formatKrw(result.totalEmployer)}韩元。
              </>
            ) : isVi ? (
              <>
                Nếu tuyển một nhân viên lương {formatManVi(amountMan)}, chi
                phí nhân sự thực tế công ty phải gánh mỗi tháng là{" "}
                <strong className="text-white">
                  {formatKrwVi(result.totalCost)} KRW
                </strong>
                . Nghĩa là, đứng từ góc độ người sử dụng lao động, số tiền
                chi thêm so với mức lương bề ngoài là{" "}
                {formatKrwVi(result.totalEmployer)} KRW.
              </>
            ) : (
              <>
                Employer&apos;s actual monthly cost for an employee on
                KRW {formatKrw(monthlyKrw)} salary is{" "}
                <strong className="text-white">
                  KRW {formatKrw(result.totalCost)}
                </strong>
                {" "}— that&apos;s KRW {formatKrw(result.totalEmployer)}{" "}
                on top of the headline pay.
              </>
            )}
          </p>
        </section>

        {/* Neighbors navigation */}
        {(prev || next) && (
          <nav className="mb-8 grid grid-cols-2 gap-3">
            {prev ? (
              <Link
                href={prev.url}
                className="surface-card group flex flex-col gap-1 p-4 transition-colors hover:bg-[color:var(--color-bg-card-hover)]"
              >
                <span className="text-xs text-[color:var(--color-text-tertiary)]">
                  ←{" "}
                  {isKo
                    ? "낮은 월급"
                    : isZh
                      ? "更低月薪"
                      : isVi
                        ? "Lương thấp hơn"
                        : "Lower salary"}
                </span>
                <span className="font-semibold text-[color:var(--color-text-primary)]">
                  {prev.label}
                </span>
              </Link>
            ) : (
              <div />
            )}
            {next ? (
              <Link
                href={next.url}
                className="surface-card group flex flex-col items-end gap-1 p-4 transition-colors hover:bg-[color:var(--color-bg-card-hover)]"
              >
                <span className="text-xs text-[color:var(--color-text-tertiary)]">
                  {isKo
                    ? "높은 월급"
                    : isZh
                      ? "更高月薪"
                      : isVi
                        ? "Lương cao hơn"
                        : "Higher salary"}{" "}
                  →
                </span>
                <span className="font-semibold text-[color:var(--color-text-primary)]">
                  {next.label}
                </span>
              </Link>
            ) : (
              <div />
            )}
          </nav>
        )}

        <section className="rounded-xl border border-[color:var(--color-border-subtle)] bg-[color:var(--color-bg-elevated)] p-4 text-sm leading-relaxed text-[color:var(--color-text-secondary)]">
          <p>
            {isKo ? (
              <>
                다른 월급으로 시뮬레이션하려면{" "}
                <Link
                  href={`/${locale}/insurance-calc`}
                  className="text-indigo-300 underline-offset-2 hover:underline"
                >
                  4대보험 계산기
                </Link>
                를 열어 직접 입력하세요. 산재보험 요율은 업종에 따라
                다르므로 자세한 분석은 계산기에서 가능합니다.
              </>
            ) : isZh ? (
              <>
                如需模拟其他月薪，请打开{" "}
                <Link
                  href={`/${locale}/insurance-calc`}
                  className="text-indigo-300 underline-offset-2 hover:underline"
                >
                  四大保险计算器
                </Link>{" "}
                直接输入查看。工伤保险费率因行业而异，详细分析请在计算器中确认。
              </>
            ) : isVi ? (
              <>
                Để mô phỏng với mức lương khác, hãy mở{" "}
                <Link
                  href={`/${locale}/insurance-calc`}
                  className="text-indigo-300 underline-offset-2 hover:underline"
                >
                  Máy tính 4 Bảo hiểm Bắt buộc
                </Link>{" "}
                và nhập trực tiếp. Tỷ lệ bảo hiểm tai nạn lao động khác
                nhau tùy theo ngành nghề — bạn có thể xem phân tích chi
                tiết hơn trong máy tính.
              </>
            ) : (
              <>
                For other salaries, use the{" "}
                <Link
                  href={`/${locale}/insurance-calc`}
                  className="text-indigo-300 underline-offset-2 hover:underline"
                >
                  insurance calculator
                </Link>{" "}
                directly. Industrial-accident rate varies by industry —
                adjust it there.
              </>
            )}
          </p>
          <Link
            href={`/${locale}/guide/four-insurance`}
            className="mt-3 inline-flex items-center gap-1.5 text-indigo-300 hover:underline"
          >
            {isKo
              ? "4대보험 완전 분해 가이드"
              : isZh
                ? "四大保险完全拆解指南"
                : isVi
                  ? "Hướng dẫn giải mã đầy đủ 4 bảo hiểm bắt buộc"
                  : "Full guide"}
            <ArrowRight className="h-3 w-3" />
          </Link>
        </section>
      </div>
    </main>
  );
}
