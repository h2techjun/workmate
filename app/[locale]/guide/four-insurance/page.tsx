import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import PostTags from "@/components/ui/PostTags";

interface PageProps {
  params: Promise<{ locale: string }>;
}

const TITLE: Record<"ko" | "en" | "zh" | "vi", string> = {
  ko: "월급 300만원이면 실수령 얼마? 4대보험 완전 분해",
  en: "Korean 4-major insurance demystified (2026)",
  zh: "月薪300万韩元实领多少？四大保险完全拆解",
  vi: "Lương 3 triệu won thực nhận bao nhiêu? Giải mã đầy đủ 4 bảo hiểm bắt buộc",
};

const TAGS: Record<"ko" | "en" | "zh" | "vi", string[]> = {
  ko: ["4대보험", "국민연금", "건강보험", "고용보험", "산재보험", "실수령액"],
  en: [
    "4 major insurances",
    "national pension",
    "health insurance",
    "employment insurance",
    "industrial accident insurance",
    "take-home pay",
  ],
  zh: ["四大保险", "国民年金", "健康保险", "雇佣保险", "工伤保险", "实领工资"],
  vi: [
    "4 bảo hiểm bắt buộc",
    "lương hưu quốc gia",
    "bảo hiểm y tế",
    "bảo hiểm việc làm",
    "bảo hiểm tai nạn lao động",
    "lương thực nhận",
  ],
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  if (locale === "zh") {
    return {
      title: "韩国四大保险完全解析(2026年费率) | Workmate",
      description:
        "实领比例其实是9.5%,不是表面的7.19%。韩国工资保险2026年费率完全拆解。",
    };
  }
  if (locale === "vi") {
    return {
      title: "Giải mã 4 bảo hiểm bắt buộc Hàn Quốc (Tỷ lệ 2026) | Workmate",
      description:
        "Lương thực nhận thực tế chỉ còn 9.5%, không phải con số 7.19% như tiêu đề. Phân tích đầy đủ bảo hiểm lương Hàn Quốc, tỷ lệ áp dụng năm 2026.",
    };
  }
  if (locale !== "ko") {
    return {
      title: "Korean 4-major insurance demystified (2026 rates) | Workmate",
      description:
        "Why your take-home is 9.5%, not the headline 7.19% number. Korean payroll insurance breakdown for 2026.",
    };
  }
  return {
    title: "월급 300만원이면 실수령 얼마? 4대보험 완전 분해 (2026)",
    description:
      "표면 요율과 실제 차감액이 다른 이유. 국민연금부터 산재까지 한 줄 한 줄 따져봤습니다. 2026년 적용 요율.",
  };
}

export default async function FourInsuranceGuidePage({
  params,
}: PageProps): Promise<React.ReactElement> {
  const { locale } = await params;
  const localeKey: "ko" | "en" | "zh" | "vi" =
    locale === "ko" ? "ko" : locale === "zh" ? "zh" : locale === "vi" ? "vi" : "en";
  return (
    <main className="px-4 pb-16 pt-6 md:px-6 md:pt-12">
      <div className="mx-auto max-w-3xl">
        <Breadcrumbs
          path="/guide/four-insurance"
          locale={localeKey}
          id="guide-four-insurance"
          currentName={TITLE[localeKey]}
        />
        {locale === "ko" ? (
          <ContentKo />
        ) : locale === "zh" ? (
          <ContentZh />
        ) : locale === "vi" ? (
          <ContentVi />
        ) : (
          <ContentEn />
        )}

        <PostTags tags={TAGS[localeKey]} locale={localeKey} />
      </div>
    </main>
  );
}

function ContentKo(): React.ReactElement {
  return (
    <article className="space-y-8 leading-relaxed text-[color:var(--color-text-secondary)]">
      <header>
        <p className="text-xs font-medium uppercase tracking-wider text-[color:var(--color-text-tertiary)]">
          재무 · 급여
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-[color:var(--color-text-primary)] md:text-4xl">
          월급 300만원이면 실수령 얼마? 4대보험 완전 분해
        </h1>
        <p className="mt-4 text-sm text-[color:var(--color-text-tertiary)]">
          2026년 적용 요율. 마지막 업데이트 2026-06-15.
        </p>
      </header>

      <section className="space-y-4">
        <p>
          뉴스나 회사 소개 자료에서 &ldquo;건강보험 7.19%&rdquo; 같은
          숫자를 보고 4대보험을 7%로 생각하는 분들이 많은데, 실제 차감
          비율은 그보다 훨씬 높습니다. 월급 300만원의 경우 근로자가
          실제로 차감 받는 금액은 284,020원, 비율로는 9.47%입니다.
        </p>
        <p>
          왜 이렇게 차이가 나는지 한 줄씩 따져봅니다.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-[color:var(--color-text-primary)]">
          1. 국민연금 — 4.5%
        </h2>
        <p>
          국민연금 총 요율은 9%인데, 이걸 근로자와 사용자가 절반씩
          나눠 부담합니다. 근로자 부담분이 4.5%죠. 월 300만원이면
          135,000원. 여기까지는 직관적입니다.
        </p>
        <p>
          한 가지 알아둘 점. 월급이 617만원을 넘으면 그 이상은 부과
          대상이 안 됩니다. <strong>기준소득월액 상한</strong>이라고
          하는데 매년 바뀝니다. 2026년은 617만원이 상한, 39만원이
          하한입니다. 즉 월급 1,000만원 받는 사람도 국민연금은 617만원
          기준으로 277,650원만 떼입니다.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-[color:var(--color-text-primary)]">
          2. 건강보험 — 3.595%
        </h2>
        <p>
          건강보험 총 요율 7.19%를 절반씩. 근로자 부담 3.595%. 월
          300만원이면 107,850원입니다.
        </p>
        <p>
          국민연금과 달리 <strong>상한이 없습니다</strong>. 월급이
          높을수록 비례해서 더 떼입니다. 그래서 고소득자일수록 국민연금
          비중이 줄고 건강보험 비중이 커집니다.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-[color:var(--color-text-primary)]">
          3. 장기요양보험 — 건강보험료의 13.14%
        </h2>
        <p>
          이게 헷갈리는 부분입니다. 월급 기준이 아니라{" "}
          <strong>건강보험료의 13.14%</strong>가 장기요양 보험료입니다.
          이를 근로자·사용자가 절반씩.
        </p>
        <p>
          월 300만원의 경우 건강보험 총액이 215,700원(107,850 × 2),
          여기에 13.14% 곱하면 28,343원. 근로자 부담은 절반인 14,170원
          (10원 단위 절사). 작은 금액이지만 30년 누적되면 무시 못
          합니다.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-[color:var(--color-text-primary)]">
          4. 고용보험 — 0.9% + 0.25%
        </h2>
        <p>
          고용보험은 두 부분으로 나뉩니다.
        </p>
        <ul className="list-inside list-disc space-y-1.5">
          <li>
            <strong>실업급여</strong>: 0.9% 근로자 + 0.9% 사용자 = 1.8%.
            실직 시 받는 그 실업급여 재원입니다.
          </li>
          <li>
            <strong>고용안정·직업능력개발</strong>: 사용자만 0.25%
            (150인 미만 사업장 기준). 근로자 부담 없음. 직업훈련비
            지원 등에 쓰입니다.
          </li>
        </ul>
        <p>월 300만원 근로자 부담은 27,000원입니다.</p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-[color:var(--color-text-primary)]">
          5. 산재보험 — 사용자만 부담 (평균 0.86%)
        </h2>
        <p>
          산재보험은 <strong>근로자 부담이 없습니다</strong>. 사용자가
          100% 부담. 그래서 근로자 명세표에는 안 나옵니다.
        </p>
        <p>
          요율은 업종별로 다릅니다. 사무직 같은 저위험은 0.6% 정도,
          건설업·제조업은 1~3%까지 가고, 광업이나 어업 같은 고위험
          업종은 30%까지도 갑니다. 평균 0.86%로 잡습니다. 본 사이트
          계산기는 사용자가 업종 요율을 직접 입력할 수 있습니다.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-[color:var(--color-text-primary)]">
          정리: 월급별 실수령액
        </h2>
        <div className="overflow-hidden rounded-xl border border-[color:var(--color-border-subtle)] bg-[color:var(--color-bg-elevated)]">
          <table className="w-full text-sm">
            <thead className="text-xs uppercase tracking-wider text-[color:var(--color-text-tertiary)]">
              <tr>
                <th className="px-4 py-2 text-left font-medium">월급</th>
                <th className="px-4 py-2 text-right font-medium">근로자 차감</th>
                <th className="px-4 py-2 text-right font-medium">실수령</th>
                <th className="px-4 py-2 text-right font-medium">차감율</th>
              </tr>
            </thead>
            <tbody className="text-[color:var(--color-text-secondary)] tabular-nums">
              <tr className="border-t border-[color:var(--color-border-subtle)]">
                <td className="px-4 py-2">200만원</td>
                <td className="px-4 py-2 text-right">189,340</td>
                <td className="px-4 py-2 text-right">1,810,660</td>
                <td className="px-4 py-2 text-right">9.47%</td>
              </tr>
              <tr className="border-t border-[color:var(--color-border-subtle)]">
                <td className="px-4 py-2">300만원</td>
                <td className="px-4 py-2 text-right">284,020</td>
                <td className="px-4 py-2 text-right">2,715,980</td>
                <td className="px-4 py-2 text-right">9.47%</td>
              </tr>
              <tr className="border-t border-[color:var(--color-border-subtle)]">
                <td className="px-4 py-2">400만원</td>
                <td className="px-4 py-2 text-right">378,690</td>
                <td className="px-4 py-2 text-right">3,621,310</td>
                <td className="px-4 py-2 text-right">9.47%</td>
              </tr>
              <tr className="border-t border-[color:var(--color-border-subtle)]">
                <td className="px-4 py-2">500만원</td>
                <td className="px-4 py-2 text-right">473,360</td>
                <td className="px-4 py-2 text-right">4,526,640</td>
                <td className="px-4 py-2 text-right">9.47%</td>
              </tr>
              <tr className="border-t border-[color:var(--color-border-subtle)]">
                <td className="px-4 py-2">700만원</td>
                <td className="px-4 py-2 text-right">625,360</td>
                <td className="px-4 py-2 text-right">6,374,640</td>
                <td className="px-4 py-2 text-right">8.93%</td>
              </tr>
              <tr className="border-t border-[color:var(--color-border-subtle)]">
                <td className="px-4 py-2">1,000만원</td>
                <td className="px-4 py-2 text-right">774,380</td>
                <td className="px-4 py-2 text-right">9,225,620</td>
                <td className="px-4 py-2 text-right">7.74%</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-sm">
          소득세·지방세 차감 전 기준입니다. 실제 통장에 들어오는
          금액은 여기서 소득세·지방세를 더 떼야 합니다. 700만원 이상
          차감율이 떨어지는 이유는 국민연금 상한(617만원) 적용 때문.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-[color:var(--color-text-primary)]">
          사용자 입장 — 진짜 인건비는 따로 있습니다
        </h2>
        <p>
          월급 300만원 직원을 채용한다면 회사가 실제로 부담하는 비용은
          317,320원이 추가됩니다. 즉 <strong>총 인건비 3,317,320원</strong>이
          나가는 셈이죠.
        </p>
        <p>
          작은 회사라면 한 명 채용에 매월 약 32만원이 추가로 나가는
          느낌일 텐데, 1년이면 약 380만원, 5년이면 1,900만원입니다.
          채용 의사결정 시 표면 월급만 보면 안 되는 이유입니다.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-2xl font-semibold text-[color:var(--color-text-primary)]">
          마무리
        </h2>
        <p>
          요약. 4대보험 근로자 부담은 월급의 약 9.5%(고소득자는 7~8%로
          내려감). 사용자 부담은 약 10.6%(산재 평균 적용 시). 합치면
          월급의 약 20%가 사회보험 명목으로 나갑니다. 본 사이트의{" "}
          <Link
            href="/ko/insurance-calc"
            className="text-indigo-300 underline-offset-2 hover:underline"
          >
            4대보험 계산기
          </Link>
          는 월급만 입력하면 위 수치를 자동으로 산출합니다. 채용 시,
          이직 시, 연봉 협상 전에 한 번씩 돌려보면 도움이 됩니다.
        </p>
      </section>
    </article>
  );
}

function ContentZh(): React.ReactElement {
  return (
    <article className="space-y-8 leading-relaxed text-[color:var(--color-text-secondary)]">
      <header>
        <p className="text-xs font-medium uppercase tracking-wider text-[color:var(--color-text-tertiary)]">
          财务 · 薪资
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-[color:var(--color-text-primary)] md:text-4xl">
          月薪300万韩元实领多少？四大保险完全拆解
        </h1>
        <p className="mt-4 text-sm text-[color:var(--color-text-tertiary)]">
          2026年适用费率。最后更新 2026-06-15。
        </p>
      </header>

      <section className="space-y-4">
        <p>
          在新闻或公司介绍资料中看到&quot;健康保险7.19%&quot;这样的数字，很多人就以为四大保险的扣除比例是7%左右，但实际扣除比例要高得多。以月薪300万韩元为例，员工实际被扣除的金额是284,020韩元，折合比例为9.47%。
        </p>
        <p>为什么会有这样的差异，下面逐项拆解。</p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-[color:var(--color-text-primary)]">
          1. 国民年金 — 4.5%
        </h2>
        <p>
          国民年金总费率为9%，由员工和雇主各承担一半。员工负担部分为4.5%。月薪300万韩元的话就是135,000韩元。到这里为止都很直观。
        </p>
        <p>
          有一点需要注意。月薪超过617万韩元的部分不再计入扣缴对象。这叫做
          <strong>标准月收入上限</strong>
          ，每年都会变动。2026年上限为617万韩元，下限为39万韩元。也就是说，即使月薪1,000万韩元的人，国民年金也只按617万韩元的基准扣缴277,650韩元。
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-[color:var(--color-text-primary)]">
          2. 健康保险 — 3.595%
        </h2>
        <p>
          健康保险总费率7.19%由双方各半承担。员工负担3.595%。月薪300万韩元的话是107,850韩元。
        </p>
        <p>
          与国民年金不同，健康保险<strong>没有上限</strong>。月薪越高，按比例扣缴的金额就越多。因此收入越高，国民年金占比越小，健康保险占比越大。
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-[color:var(--color-text-primary)]">
          3. 长期疗养保险 — 健康保险费的13.14%
        </h2>
        <p>
          这是容易混淆的部分。不是按月薪计算，而是
          <strong>健康保险费的13.14%</strong>作为长期疗养保险费。由员工·雇主各承担一半。
        </p>
        <p>
          月薪300万韩元的情况下，健康保险总额为215,700韩元(107,850 ×
          2)，乘以13.14%后为28,343韩元。员工负担的一半是14,170韩元(以10韩元为单位舍去尾数)。金额虽小，但累积30年后就不容小觑。
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-[color:var(--color-text-primary)]">
          4. 雇佣保险 — 0.9% + 0.25%
        </h2>
        <p>雇佣保险分为两部分。</p>
        <ul className="list-inside list-disc space-y-1.5">
          <li>
            <strong>失业补助金</strong>：员工0.9% + 雇主0.9% =
            1.8%。这是失业时领取的失业补助金的财源。
          </li>
          <li>
            <strong>雇佣稳定·职业能力开发</strong>
            ：仅雇主承担0.25%(以150人以下企业为基准)。员工无需负担。用于职业培训费用支持等。
          </li>
        </ul>
        <p>月薪300万韩元的员工负担为27,000韩元。</p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-[color:var(--color-text-primary)]">
          5. 工伤保险 — 仅由雇主承担(平均0.86%)
        </h2>
        <p>
          工伤保险<strong>不需要员工负担</strong>。由雇主100%承担。因此不会出现在员工的工资单上。
        </p>
        <p>
          费率因行业而异。办公室工作等低风险行业约为0.6%，建筑业·制造业可达1~3%，矿业或渔业等高风险行业甚至可达30%。一般按平均0.86%计算。本网站的计算器可以让用户直接输入所属行业的费率。
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-[color:var(--color-text-primary)]">
          汇总：各月薪实领金额
        </h2>
        <div className="overflow-hidden rounded-xl border border-[color:var(--color-border-subtle)] bg-[color:var(--color-bg-elevated)]">
          <table className="w-full text-sm">
            <thead className="text-xs uppercase tracking-wider text-[color:var(--color-text-tertiary)]">
              <tr>
                <th className="px-4 py-2 text-left font-medium">月薪</th>
                <th className="px-4 py-2 text-right font-medium">员工扣除</th>
                <th className="px-4 py-2 text-right font-medium">实领</th>
                <th className="px-4 py-2 text-right font-medium">扣除比例</th>
              </tr>
            </thead>
            <tbody className="text-[color:var(--color-text-secondary)] tabular-nums">
              <tr className="border-t border-[color:var(--color-border-subtle)]">
                <td className="px-4 py-2">200万韩元</td>
                <td className="px-4 py-2 text-right">189,340</td>
                <td className="px-4 py-2 text-right">1,810,660</td>
                <td className="px-4 py-2 text-right">9.47%</td>
              </tr>
              <tr className="border-t border-[color:var(--color-border-subtle)]">
                <td className="px-4 py-2">300万韩元</td>
                <td className="px-4 py-2 text-right">284,020</td>
                <td className="px-4 py-2 text-right">2,715,980</td>
                <td className="px-4 py-2 text-right">9.47%</td>
              </tr>
              <tr className="border-t border-[color:var(--color-border-subtle)]">
                <td className="px-4 py-2">400万韩元</td>
                <td className="px-4 py-2 text-right">378,690</td>
                <td className="px-4 py-2 text-right">3,621,310</td>
                <td className="px-4 py-2 text-right">9.47%</td>
              </tr>
              <tr className="border-t border-[color:var(--color-border-subtle)]">
                <td className="px-4 py-2">500万韩元</td>
                <td className="px-4 py-2 text-right">473,360</td>
                <td className="px-4 py-2 text-right">4,526,640</td>
                <td className="px-4 py-2 text-right">9.47%</td>
              </tr>
              <tr className="border-t border-[color:var(--color-border-subtle)]">
                <td className="px-4 py-2">700万韩元</td>
                <td className="px-4 py-2 text-right">625,360</td>
                <td className="px-4 py-2 text-right">6,374,640</td>
                <td className="px-4 py-2 text-right">8.93%</td>
              </tr>
              <tr className="border-t border-[color:var(--color-border-subtle)]">
                <td className="px-4 py-2">1,000万韩元</td>
                <td className="px-4 py-2 text-right">774,380</td>
                <td className="px-4 py-2 text-right">9,225,620</td>
                <td className="px-4 py-2 text-right">7.74%</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-sm">
          以上金额为扣除所得税·地方税之前的基准。实际存入账户的金额还需再扣除所得税和地方税。700万韩元以上扣除比例下降的原因是国民年金上限(617万韩元)的适用。
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-[color:var(--color-text-primary)]">
          雇主视角 — 真正的人工成本另有其数
        </h2>
        <p>
          如果雇用一名月薪300万韩元的员工，公司实际承担的费用会额外增加317,320韩元。也就是说，
          <strong>总人工成本达到3,317,320韩元</strong>。
        </p>
        <p>
          对小公司来说，雇用一人每月大约要多支出32万韩元，一年下来大约380万韩元，五年则是1,900万韩元。这就是招聘决策时不能只看表面月薪的原因。
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-2xl font-semibold text-[color:var(--color-text-primary)]">
          结语
        </h2>
        <p>
          总结。四大保险员工负担约为月薪的9.5%(高收入者降至7~8%)。雇主负担约为10.6%(按工伤保险平均费率计算时)。合计约为月薪的20%用于社会保险。本网站的
          <Link
            href="/zh/insurance-calc"
            className="text-indigo-300 underline-offset-2 hover:underline"
          >
            四大保险计算器
          </Link>
          只需输入月薪，即可自动算出以上数值。建议在招聘、跳槽、年薪谈判前各运行一次。
        </p>
      </section>
    </article>
  );
}

function ContentVi(): React.ReactElement {
  return (
    <article className="space-y-8 leading-relaxed text-[color:var(--color-text-secondary)]">
      <header>
        <p className="text-xs font-medium uppercase tracking-wider text-[color:var(--color-text-tertiary)]">
          Tài chính · Tiền lương
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-[color:var(--color-text-primary)] md:text-4xl">
          Lương 3 triệu won thực nhận bao nhiêu? Giải mã đầy đủ 4 bảo hiểm bắt
          buộc
        </h1>
        <p className="mt-4 text-sm text-[color:var(--color-text-tertiary)]">
          Tỷ lệ áp dụng năm 2026. Cập nhật lần cuối 2026-06-15.
        </p>
      </header>

      <section className="space-y-4">
        <p>
          Nhiều người nhìn thấy con số như &quot;bảo hiểm y tế 7.19%&quot;
          trên tin tức hay tài liệu giới thiệu công ty rồi nghĩ rằng 4 bảo
          hiểm bắt buộc chỉ khấu trừ khoảng 7%, nhưng tỷ lệ khấu trừ thực tế
          cao hơn nhiều. Với mức lương 3 triệu won, số tiền người lao động
          thực sự bị khấu trừ là 284.020 won, tương đương 9.47%.
        </p>
        <p>Vì sao lại có sự chênh lệch như vậy, hãy cùng xem xét từng khoản một.</p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-[color:var(--color-text-primary)]">
          1. Lương hưu quốc gia — 4.5%
        </h2>
        <p>
          Tổng tỷ lệ lương hưu quốc gia là 9%, được người lao động và người
          sử dụng lao động chia đều mỗi bên một nửa. Phần người lao động
          gánh chịu là 4.5%. Với lương tháng 3 triệu won thì là 135.000 won.
          Đến đây thì khá dễ hiểu.
        </p>
        <p>
          Có một điều cần lưu ý. Nếu lương tháng vượt quá 6,17 triệu won thì
          phần vượt quá đó không bị tính phí. Đây gọi là{" "}
          <strong>mức trần thu nhập tháng chuẩn</strong>, thay đổi mỗi năm.
          Năm 2026, mức trần là 6,17 triệu won, mức sàn là 390 nghìn won.
          Nghĩa là ngay cả người nhận lương 10 triệu won mỗi tháng cũng chỉ
          bị khấu trừ lương hưu quốc gia 277.650 won theo mức 6,17 triệu
          won.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-[color:var(--color-text-primary)]">
          2. Bảo hiểm y tế — 3.595%
        </h2>
        <p>
          Tổng tỷ lệ bảo hiểm y tế 7.19% được chia đều hai bên. Phần người
          lao động gánh chịu là 3.595%. Với lương tháng 3 triệu won thì là
          107.850 won.
        </p>
        <p>
          Khác với lương hưu quốc gia, bảo hiểm y tế{" "}
          <strong>không có mức trần</strong>. Lương càng cao thì bị khấu trừ
          theo tỷ lệ càng nhiều. Vì vậy thu nhập càng cao thì tỷ trọng lương
          hưu quốc gia càng giảm, còn tỷ trọng bảo hiểm y tế càng tăng.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-[color:var(--color-text-primary)]">
          3. Bảo hiểm chăm sóc dài hạn — 13.14% phí bảo hiểm y tế
        </h2>
        <p>
          Đây là phần dễ gây nhầm lẫn. Phí bảo hiểm chăm sóc dài hạn không
          tính theo lương tháng, mà tính bằng{" "}
          <strong>13.14% phí bảo hiểm y tế</strong>. Khoản này do người lao
          động và người sử dụng lao động chia đều mỗi bên một nửa.
        </p>
        <p>
          Với lương tháng 3 triệu won, tổng phí bảo hiểm y tế là 215.700 won
          (107.850 × 2), nhân với 13.14% ra 28.343 won. Phần người lao động
          gánh chịu là một nửa, tức 14.170 won (làm tròn bỏ đơn vị 10 won).
          Số tiền tuy nhỏ nhưng tích lũy trong 30 năm thì không thể xem
          thường.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-[color:var(--color-text-primary)]">
          4. Bảo hiểm việc làm — 0.9% + 0.25%
        </h2>
        <p>Bảo hiểm việc làm được chia thành hai phần.</p>
        <ul className="list-inside list-disc space-y-1.5">
          <li>
            <strong>Trợ cấp thất nghiệp</strong>: 0.9% người lao động + 0.9%
            người sử dụng lao động = 1.8%. Đây là nguồn quỹ chi trả trợ cấp
            thất nghiệp khi mất việc.
          </li>
          <li>
            <strong>
              Ổn định việc làm · Phát triển năng lực nghề nghiệp
            </strong>
            : chỉ người sử dụng lao động đóng 0.25% (áp dụng cho doanh
            nghiệp dưới 150 lao động). Người lao động không phải đóng khoản
            này. Dùng để hỗ trợ chi phí đào tạo nghề, v.v.
          </li>
        </ul>
        <p>Với lương tháng 3 triệu won, phần người lao động gánh chịu là 27.000 won.</p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-[color:var(--color-text-primary)]">
          5. Bảo hiểm tai nạn lao động — chỉ người sử dụng lao động đóng
          (bình quân 0.86%)
        </h2>
        <p>
          Bảo hiểm tai nạn lao động{" "}
          <strong>không yêu cầu người lao động đóng góp</strong>. Người sử
          dụng lao động chịu 100%. Vì vậy khoản này không xuất hiện trên
          bảng lương của người lao động.
        </p>
        <p>
          Tỷ lệ khác nhau tùy theo ngành nghề. Ngành rủi ro thấp như văn
          phòng khoảng 0.6%, ngành xây dựng · sản xuất lên đến 1~3%, còn
          ngành rủi ro cao như khai khoáng hay ngư nghiệp có thể lên tới
          30%. Mức bình quân được lấy là 0.86%. Máy tính của trang này cho
          phép người dùng tự nhập tỷ lệ theo ngành nghề của mình.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-[color:var(--color-text-primary)]">
          Tổng kết: Lương thực nhận theo mức lương
        </h2>
        <div className="overflow-hidden rounded-xl border border-[color:var(--color-border-subtle)] bg-[color:var(--color-bg-elevated)]">
          <table className="w-full text-sm">
            <thead className="text-xs uppercase tracking-wider text-[color:var(--color-text-tertiary)]">
              <tr>
                <th className="px-4 py-2 text-left font-medium">Lương</th>
                <th className="px-4 py-2 text-right font-medium">
                  Khấu trừ
                </th>
                <th className="px-4 py-2 text-right font-medium">
                  Thực nhận
                </th>
                <th className="px-4 py-2 text-right font-medium">
                  Tỷ lệ khấu trừ
                </th>
              </tr>
            </thead>
            <tbody className="text-[color:var(--color-text-secondary)] tabular-nums">
              <tr className="border-t border-[color:var(--color-border-subtle)]">
                <td className="px-4 py-2">2 triệu won</td>
                <td className="px-4 py-2 text-right">189.340</td>
                <td className="px-4 py-2 text-right">1.810.660</td>
                <td className="px-4 py-2 text-right">9.47%</td>
              </tr>
              <tr className="border-t border-[color:var(--color-border-subtle)]">
                <td className="px-4 py-2">3 triệu won</td>
                <td className="px-4 py-2 text-right">284.020</td>
                <td className="px-4 py-2 text-right">2.715.980</td>
                <td className="px-4 py-2 text-right">9.47%</td>
              </tr>
              <tr className="border-t border-[color:var(--color-border-subtle)]">
                <td className="px-4 py-2">4 triệu won</td>
                <td className="px-4 py-2 text-right">378.690</td>
                <td className="px-4 py-2 text-right">3.621.310</td>
                <td className="px-4 py-2 text-right">9.47%</td>
              </tr>
              <tr className="border-t border-[color:var(--color-border-subtle)]">
                <td className="px-4 py-2">5 triệu won</td>
                <td className="px-4 py-2 text-right">473.360</td>
                <td className="px-4 py-2 text-right">4.526.640</td>
                <td className="px-4 py-2 text-right">9.47%</td>
              </tr>
              <tr className="border-t border-[color:var(--color-border-subtle)]">
                <td className="px-4 py-2">7 triệu won</td>
                <td className="px-4 py-2 text-right">625.360</td>
                <td className="px-4 py-2 text-right">6.374.640</td>
                <td className="px-4 py-2 text-right">8.93%</td>
              </tr>
              <tr className="border-t border-[color:var(--color-border-subtle)]">
                <td className="px-4 py-2">10 triệu won</td>
                <td className="px-4 py-2 text-right">774.380</td>
                <td className="px-4 py-2 text-right">9.225.620</td>
                <td className="px-4 py-2 text-right">7.74%</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-sm">
          Đây là số liệu trước khi khấu trừ thuế thu nhập và thuế địa
          phương. Số tiền thực nhận vào tài khoản sẽ còn bị khấu trừ thêm
          thuế thu nhập và thuế địa phương. Lý do tỷ lệ khấu trừ giảm từ
          mức lương 7 triệu won trở lên là do áp dụng mức trần lương hưu
          quốc gia (6,17 triệu won).
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-[color:var(--color-text-primary)]">
          Góc nhìn của người sử dụng lao động — Chi phí nhân sự thực tế còn
          cao hơn
        </h2>
        <p>
          Nếu tuyển một nhân viên lương tháng 3 triệu won, chi phí thực tế
          mà công ty phải gánh thêm là 317.320 won. Nghĩa là{" "}
          <strong>tổng chi phí nhân sự sẽ là 3.317.320 won</strong>.
        </p>
        <p>
          Với một công ty nhỏ, việc tuyển một người sẽ cảm thấy như mỗi
          tháng phải chi thêm khoảng 320 nghìn won, một năm khoảng 3,8 triệu
          won, và năm năm là 19 triệu won. Đây là lý do vì sao khi ra quyết
          định tuyển dụng không thể chỉ nhìn vào mức lương bề ngoài.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-2xl font-semibold text-[color:var(--color-text-primary)]">
          Kết luận
        </h2>
        <p>
          Tóm lại. Phần người lao động gánh chịu trong 4 bảo hiểm bắt buộc
          chiếm khoảng 9.5% lương tháng (giảm còn 7~8% với người thu nhập
          cao). Phần người sử dụng lao động gánh chịu khoảng 10.6% (khi áp
          dụng tỷ lệ bình quân bảo hiểm tai nạn lao động). Tổng cộng khoảng
          20% lương tháng được dùng cho bảo hiểm xã hội.{" "}
          <Link
            href="/vi/insurance-calc"
            className="text-indigo-300 underline-offset-2 hover:underline"
          >
            Máy tính 4 bảo hiểm bắt buộc
          </Link>{" "}
          trên trang này chỉ cần nhập lương tháng là tự động tính ra các con
          số trên. Hãy thử tính trước khi tuyển dụng, chuyển việc, hoặc đàm
          phán lương.
        </p>
      </section>
    </article>
  );
}

function ContentEn(): React.ReactElement {
  return (
    <article className="space-y-8 leading-relaxed text-[color:var(--color-text-secondary)]">
      <header>
        <p className="text-xs font-medium uppercase tracking-wider text-[color:var(--color-text-tertiary)]">
          Finance · Payroll
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-[color:var(--color-text-primary)] md:text-4xl">
          Korean 4-major insurance demystified (2026)
        </h1>
        <p className="mt-4 text-sm text-[color:var(--color-text-tertiary)]">
          Last updated 2026-06-15.
        </p>
      </header>

      <section className="space-y-4">
        <p>
          People often see the headline rate (e.g., &ldquo;health 7.19%&rdquo;)
          and assume Korean payroll insurance is around 7%. The actual
          deduction is closer to 9.5% of monthly salary. Here&apos;s
          why, line by line.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-[color:var(--color-text-primary)]">
          National Pension — 4.5%
        </h2>
        <p>
          Total rate 9%, split equally. Employee pays 4.5%. KRW 135,000
          on a 3M salary. Note the cap: salary above KRW 6.17M is not
          subject. Even a 10M earner pays only 277,650 KRW for pension.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-[color:var(--color-text-primary)]">
          Health Insurance — 3.595%
        </h2>
        <p>
          Total 7.19%, split equally. <strong>No cap.</strong> Higher
          earners pay proportionally more.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-[color:var(--color-text-primary)]">
          Long-term Care — 13.14% of health insurance
        </h2>
        <p>
          Calculated against the health premium, not salary. Tiny per
          month but compounds.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-[color:var(--color-text-primary)]">
          Employment Insurance — 0.9% + 0.25%
        </h2>
        <p>
          0.9% from employee + 0.9% from employer for unemployment
          benefits. Employer additionally pays 0.25% for vocational
          training (companies under 150).
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-[color:var(--color-text-primary)]">
          Industrial Accident — employer only
        </h2>
        <p>
          0% from employee. Employer pays 0.6%–30% depending on
          industry. Average 0.86%. Doesn&apos;t appear on the employee
          payslip.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-2xl font-semibold text-[color:var(--color-text-primary)]">
          Bottom line
        </h2>
        <p>
          Employee deduction ≈ 9.5% of salary (drops to ~7% above the
          pension cap). Employer burden ≈ 10.6%. Combined ≈ 20% of
          monthly salary going to social insurance. Try the{" "}
          <Link
            href="/en/insurance-calc"
            className="text-indigo-300 underline-offset-2 hover:underline"
          >
            calculator
          </Link>{" "}
          before negotiating a salary or making a hire.
        </p>
      </section>
    </article>
  );
}
