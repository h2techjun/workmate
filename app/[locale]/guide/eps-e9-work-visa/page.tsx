import type { Metadata } from "next";
import Link from "next/link";
import { buildLanguagesAlt } from "@/lib/seo/alternates";
import { locales } from "@/i18n";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import PostTags from "@/components/ui/PostTags";

interface PageProps {
  params: Promise<{ locale: string }>;
}

const TITLE: Record<"ko" | "en" | "zh" | "vi", string> = {
  ko: "고용허가제 E-9 비자 완전 가이드 (2026)",
  en: "Korea EPS (E-9) Work Visa: Full Guide for 2026",
  zh: "韩国雇佣许可制(E-9)工作签证完全指南(2026)",
  vi: "Visa lao động EPS (E-9) Hàn Quốc: Hướng dẫn đầy đủ 2026",
};

const OG_LOCALE: Record<string, string> = {
  ko: "ko_KR",
  en: "en_US",
  zh: "zh_CN",
  vi: "vi_VN",
};

const TAGS: Record<"ko" | "en" | "zh" | "vi", string[]> = {
  ko: ["E-9 비자", "고용허가제", "EPS", "외국인 취업", "비전문취업", "EPS-TOPIK"],
  en: [
    "E-9 visa",
    "EPS",
    "work visa Korea",
    "foreign worker",
    "EPS-TOPIK",
    "employment permit system",
  ],
  zh: ["E-9签证", "雇佣许可制", "EPS", "外国人就业", "非专业就业", "EPS-TOPIK"],
  vi: [
    "Visa E-9",
    "EPS",
    "visa lao động Hàn Quốc",
    "lao động nước ngoài",
    "EPS-TOPIK",
    "chế độ cấp phép lao động",
  ],
};

export function generateStaticParams(): { locale: string }[] {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const path = "/guide/eps-e9-work-visa";
  const url = `/${locale}${path}`;

  let title: string;
  let description: string;
  if (locale === "zh") {
    title = "韩国雇佣许可制(E-9)工作签证完全指南(2026) | Workmate";
    description =
      "E-9是韩国制造·农业·渔业·建筑现场的合法外国劳动力签证。详解17个派遣国、EPS-TOPIK选拔流程、4年10个月居留期(最长可延至9年8个月)、2026年8万人配额，以及印度为何不属EPS、如何转向E-7-4长期定居路径。";
  } else if (locale === "vi") {
    title =
      "Visa lao động EPS (E-9) Hàn Quốc: Hướng dẫn đầy đủ 2026 | Workmate";
    description =
      "E-9 là visa lao động nước ngoài hợp pháp cho ngành sản xuất, nông nghiệp, ngư nghiệp, xây dựng tại Hàn Quốc. 17 nước phái cử, tuyển chọn EPS-TOPIK, lưu trú 4 năm 10 tháng, hạn ngạch 80.000 năm 2026, và vì sao Ấn Độ không thuộc EPS.";
  } else if (locale !== "ko") {
    title = "Korea EPS (E-9) Work Visa: Full Guide for 2026 | Workmate";
    description =
      "E-9 is Korea's legal work visa for foreign labor in manufacturing, farming, fishing and construction. The 17 sending countries, EPS-TOPIK selection, 4 years 10 months stay, the 80,000 quota for 2026, and why India is not an EPS country.";
  } else {
    title = "고용허가제 E-9 비자 완전 가이드 (2026) | Workmate";
    description =
      "E-9은 제조·농축산·어업·건설 현장의 합법 외국 인력 비자입니다. 송출국 17개국, EPS-TOPIK 선발, 4년 10개월 체류, 2026년 8만 명 쿼터, 그리고 인도가 EPS 대상이 아닌 이유까지 한 번에 정리합니다.";
  }

  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: buildLanguagesAlt(path),
    },
    openGraph: {
      type: "article",
      url,
      title,
      description,
      locale: OG_LOCALE[locale] ?? "ko_KR",
    },
  };
}

export default async function EpsE9WorkVisaGuidePage({
  params,
}: PageProps): Promise<React.ReactElement> {
  const { locale } = await params;
  const localeKey: "ko" | "en" | "zh" | "vi" =
    locale === "ko" ? "ko" : locale === "zh" ? "zh" : locale === "vi" ? "vi" : "en";
  return (
    <main className="px-4 pb-16 pt-6 md:px-6 md:pt-12">
      <div className="mx-auto max-w-3xl">
        <Breadcrumbs
          path="/guide/eps-e9-work-visa"
          locale={localeKey}
          id="guide-eps-e9-work-visa"
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
      </div>
    </main>
  );
}

function ContentKo(): React.ReactElement {
  return (
    <article className="space-y-8 leading-relaxed text-[color:var(--color-text-secondary)]">
      <header>
        <p className="text-xs font-medium uppercase tracking-wider text-[color:var(--color-text-tertiary)]">
          이민 · 취업비자
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-[color:var(--color-text-primary)] md:text-4xl">
          고용허가제 E-9 비자 완전 가이드 (2026)
        </h1>
        <p className="mt-4 text-sm text-[color:var(--color-text-tertiary)]">
          마지막 업데이트 2026-07-12.
        </p>
      </header>

      <section className="space-y-4">
        <p>
          고용허가제(Employment Permit System, EPS)는 내국인이 더 이상
          채우지 못하는 일자리에 외국 인력을 합법적으로 고용하는 한국의
          제도입니다. 이 제도로 발급되는 비자가 바로 E-9(비전문취업)입니다.
          한국의 공장 라인, 농장, 어선, 건설 현장에서 일하고 싶다면 거의
          대부분 이 EPS를 통해 들어오게 됩니다.
        </p>
        <p>
          이 글에서는 대상 요건, 송출국, 선발 방식, 체류기간, 2026년 도입
          규모, 그리고 E-9에서 장기 정착으로 이어지는 경로까지 한 번에
          정리합니다.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-[color:var(--color-text-primary)]">
          1. EPS란 무엇이고 누구를 위한 것인가
        </h2>
        <p>
          EPS는 2004년 도입돼 고용노동부와 한국산업인력공단(HRD Korea)이
          함께 운영합니다. 핵심 원칙은 <strong>정부 간 협약 방식</strong>
          입니다. 한국이 각 송출국과 양해각서(MOU)를 맺고, 양국 공공기관을
          통해서만 모집·선발이 이뤄집니다. 사설 브로커를 의도적으로 배제해
          수수료를 낮추고 착취 가능성을 줄이는 구조죠.
        </p>
        <p>
          E-9은 비전문취업 비자입니다. 다섯 개 업종의 단순·반숙련 직무가
          대상입니다 — 제조업, 농축산업, 어업, 건설업, 그리고 일부
          서비스업. 사무직·엔지니어·전문직은 대상이 아니며, 이들은 E-7 같은
          별도 비자를 씁니다. 특정 분야 학위를 가진 전문 인력이라면 E-9이
          아니라 E-7 경로가 맞는 경우가 대부분입니다.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-[color:var(--color-text-primary)]">
          2. 송출국 17개국
        </h2>
        <p>
          한국은 MOU를 체결한 국가에서만 EPS 근로자를 받습니다. 2025년
          타지키스탄이 17번째 송출국으로 합류하면서 현재 송출국은 17개국이며,
          타지키스탄 첫 근로자는 2025년 10월 22일 입국했습니다.
        </p>
        <div className="overflow-hidden rounded-xl border border-[color:var(--color-border-subtle)] bg-[color:var(--color-bg-elevated)]">
          <table className="w-full text-sm">
            <thead className="text-xs uppercase tracking-wider text-[color:var(--color-text-tertiary)]">
              <tr>
                <th className="px-4 py-2 text-left font-medium">지역</th>
                <th className="px-4 py-2 text-left font-medium">송출국</th>
              </tr>
            </thead>
            <tbody className="text-[color:var(--color-text-secondary)]">
              <tr className="border-t border-[color:var(--color-border-subtle)]">
                <td className="px-4 py-2 font-medium">동남아시아</td>
                <td className="px-4 py-2">
                  베트남, 태국, 필리핀, 인도네시아, 캄보디아, 라오스, 미얀마,
                  동티모르
                </td>
              </tr>
              <tr className="border-t border-[color:var(--color-border-subtle)]">
                <td className="px-4 py-2 font-medium">남아시아</td>
                <td className="px-4 py-2">네팔, 방글라데시, 스리랑카, 파키스탄</td>
              </tr>
              <tr className="border-t border-[color:var(--color-border-subtle)]">
                <td className="px-4 py-2 font-medium">중앙아시아</td>
                <td className="px-4 py-2">우즈베키스탄, 키르기스스탄, 타지키스탄</td>
              </tr>
              <tr className="border-t border-[color:var(--color-border-subtle)]">
                <td className="px-4 py-2 font-medium">동아시아</td>
                <td className="px-4 py-2">중국, 몽골</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="rounded-xl border border-[color:var(--color-border-subtle)] bg-[color:var(--color-bg-elevated)] p-4">
          <p className="font-semibold text-[color:var(--color-text-primary)]">
            인도는 EPS 송출국이 아닙니다
          </p>
          <p className="mt-2 text-sm">
            가장 흔한 오해입니다. 인도는 한국과 EPS MOU가 없기 때문에 인도
            국적자는 E-9 비자로 한국에 올 수 없습니다. 인도의 숙련 전문
            인력은 대신 전문직{" "}
            <Link
              href="/ko/guide/e7-professional-visa"
              className="text-indigo-300 underline-offset-2 hover:underline"
            >
              E-7 비자
            </Link>{" "}
            경로를 이용합니다.
          </p>
          <p className="mt-2 text-sm">
            카자흐스탄이 향후 추가 대상으로 거론되기도 하지만 아직 확정된
            것은 없습니다. 공식 MOU가 발표되기 전까지는 &ldquo;논의 중&rdquo;
            으로만 보는 것이 정확합니다.
          </p>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-[color:var(--color-text-primary)]">
          3. 선발 절차
        </h2>
        <p>
          선발은 선착순이 아닙니다. 두 가지가 당락을 가릅니다 —{" "}
          <strong>EPS-TOPIK</strong>(고용허가제 지원자를 위해 만들어진
          한국어능력시험)과 한국어능력·기능수준·직무능력을 점수화하는{" "}
          <strong>선발포인트제</strong>입니다.
        </p>
        <ol className="list-inside list-decimal space-y-1.5">
          <li>본국에서 EPS-TOPIK 응시</li>
          <li>합격 후 구직자명부 등록</li>
          <li>한국 사업주가 명부에서 후보 선정</li>
          <li>표준근로계약 체결</li>
          <li>사업주가 사증발급인정서 발급</li>
          <li>E-9 비자로 입국 후 취업교육 이수</li>
        </ol>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-[color:var(--color-text-primary)]">
          4. 체류기간과 재고용
        </h2>
        <p>
          E-9 근로자는 최초 <strong>최장 4년 10개월</strong> 체류할 수
          있습니다. 이 어중간해 보이는 기간은 의도된 것입니다 — 5년을 넘기면
          적용되는 다른 체류 규정을 피하려고 그 바로 아래에 맞춰 놓은 것이죠.
        </p>
        <p>
          그 이후에는 사업주가 재고용을 요청하거나 근로자가 &ldquo;성실근로자
          &rdquo;로 인정되면 재입국특례 등을 통해 총 근무 기간을{" "}
          <strong>최장 9년 8개월</strong>까지 연장할 수 있습니다. 실제로는
          성실한 근로자와 협조적인 사업주가 만나면 한국에서 10년 가까운 합법
          취업 경력을 쌓을 수 있다는 뜻입니다.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-[color:var(--color-text-primary)]">
          5. 2026 도입 규모와 업종
        </h2>
        <p>
          2026년 E-9 도입 규모는 <strong>8만 명</strong>으로 정해졌습니다.
          2025년 13만 명에서 크게 줄어든 수치인데, 제조·건설 구인 수요가
          둔화된 것이 반영됐습니다.
        </p>
        <p>
          쿼터는 업종별로 배분됩니다 — 예를 들어 제조업 약 5만 명, 농축산업
          약 1만 명 — 여기에 수요가 가장 큰 곳으로 옮겨 쓸 수 있는 유연배분
          약 1만 명이 더해집니다. 2026년 계획은 또한 비수도권 초과채용 한도를
          확대해, 인력난이 가장 심한 지역으로 더 많은 인원이 가도록 유도합니다.
          이 수치는 매년 개정되므로 계획 전에 반드시 최신 쿼터를 확인하세요.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-[color:var(--color-text-primary)]">
          6. E-9에서 E-7-4로 — 장기 정착 사다리
        </h2>
        <p>
          E-9이 반드시 막다른 길인 것은 아닙니다. E-9로 충분한 합법 취업
          경력(일반적으로 4년 이상)을 쌓고 요건을 충족하면 점수제로 운영되는
          숙련기능인력 <strong>E-7-4</strong>로 전환할 수 있습니다. E-7-4는
          진짜 장기 트랙입니다 — 더 긴 체류, 가족 동반, 나아가 영주(F-5)까지
          이어질 수 있습니다. 즉 EPS가 한국 정착으로 끝나는 사다리의 첫 계단이
          될 수 있는 것이죠. E-7-4 세부 요건은{" "}
          <Link
            href="/ko/guide/e7-professional-visa"
            className="text-indigo-300 underline-offset-2 hover:underline"
          >
            E-7 전문직 비자 가이드
          </Link>
          에서 다룹니다.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-[color:var(--color-text-primary)]">
          자주 묻는 질문
        </h2>
        <div className="space-y-4">
          <div>
            <p className="font-medium text-[color:var(--color-text-primary)]">
              Q. 인도 국적자도 EPS로 한국에 올 수 있나요?
            </p>
            <p>
              아니요. 인도는 EPS 송출국이 아니어서 인도 국적자에게는 E-9
              경로가 없습니다. 인도 전문 인력의 경로는 E-7 비자입니다.
            </p>
          </div>
          <div>
            <p className="font-medium text-[color:var(--color-text-primary)]">
              Q. EPS-TOPIK 없이 E-9을 받을 수 있나요?
            </p>
            <p>
              사실상 불가능합니다. EPS-TOPIK은 구직자명부 등록의 관문입니다.
              이 시험에 합격해야 한국 사업주가 선정할 수 있는 대상이 됩니다.
            </p>
          </div>
          <div>
            <p className="font-medium text-[color:var(--color-text-primary)]">
              Q. 입국 후 사업장을 바꿀 수 있나요?
            </p>
            <p>
              사업장 변경은 가능하지만 엄격히 제한됩니다 — 특정 요건 하에서,
              변경 횟수 한도 안에서만 허용됩니다. 규정이 까다롭고 수시로
              바뀌므로 정확한 상황은 관할 출입국(하이코리아)에 확인하세요.
            </p>
          </div>
          <div>
            <p className="font-medium text-[color:var(--color-text-primary)]">
              Q. E-9으로 가족을 데려올 수 있나요?
            </p>
            <p>
              아니요. E-9은 가족 동반을 허용하지 않습니다. 가족 동반은 E-7-4
              같은 이후 트랙에서 가능해집니다.
            </p>
          </div>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-2xl font-semibold text-[color:var(--color-text-primary)]">
          마무리
        </h2>
        <p>
          정리하면, EPS/E-9은 한국의 비전문 외국인 취업의 주된 합법 경로로,
          17개 협력국에 열려 있고, 2026년 상한은 8만 명, 최장 4년 10개월(최장
          9년 8개월까지 연장 가능) 체류가 가능하며, E-7-4와 영주로 이어지는
          실질적인 경로가 있습니다. 인도는 주목할 예외로, E-9이 아니라 E-7을
          거칩니다.
        </p>
        <p className="text-sm">
          이 글은 일반 정보이며 법률 자문이 아닙니다. 요율·쿼터·송출국 목록은
          매년 바뀌므로 신청 전 공식 사이트에서 확인하세요: EPS(eps.go.kr),
          한국산업인력공단(HRD Korea), 법무부 하이코리아(hikorea.go.kr).
        </p>
        <p>
          관련 도구:{" "}
          <Link
            href="/ko/visa-days"
            className="text-indigo-300 underline-offset-2 hover:underline"
          >
            체류일수 계산기
          </Link>
          {" · "}
          <Link
            href="/ko/pension-refund"
            className="text-indigo-300 underline-offset-2 hover:underline"
          >
            국민연금 환급
          </Link>
          {" · "}
          <Link
            href="/ko/guide/foreign-work-visa-korea"
            className="text-indigo-300 underline-offset-2 hover:underline"
          >
            국가별 취업비자 허브
          </Link>
        </p>
      </section>

      <PostTags tags={TAGS.ko} locale="ko" />
    </article>
  );
}

function ContentZh(): React.ReactElement {
  return (
    <article className="space-y-8 leading-relaxed text-[color:var(--color-text-secondary)]">
      <header>
        <p className="text-xs font-medium uppercase tracking-wider text-[color:var(--color-text-tertiary)]">
          移民 · 工作签证
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-[color:var(--color-text-primary)] md:text-4xl">
          韩国雇佣许可制(E-9)工作签证完全指南(2026)
        </h1>
        <p className="mt-4 text-sm text-[color:var(--color-text-tertiary)]">
          最后更新 2026-07-12。
        </p>
      </header>

      <section className="space-y-4">
        <p>
          雇佣许可制(Employment Permit System，EPS)是韩国为国内劳动力不再愿意从事的岗位合法引进外国劳动力的制度。该制度所发放的签证就是E-9(非专业就业)。如果你想在韩国的工厂生产线、农场、渔船或建筑工地工作，几乎都要通过EPS进入。
        </p>
        <p>
          本文将一次性梳理申请对象、派遣国、选拔方式、居留期限、2026年引进规模，以及从E-9走向长期定居的路径。
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-[color:var(--color-text-primary)]">
          1. EPS是什么，为谁而设
        </h2>
        <p>
          EPS于2004年推行，由韩国雇佣劳动部与韩国产业人力公团(HRD
          Korea)共同运营。其核心原则是<strong>政府间协议方式</strong>
          ：韩国与各派遣国签订谅解备忘录(MOU)，招募和选拔只通过两国的公共机构进行。制度刻意排除了私人中介，以此压低手续费并减少被剥削的可能。
        </p>
        <p>
          E-9是非专业就业签证。适用对象是五大行业的简单及半熟练岗位——制造业、农畜产业、渔业、建筑业以及部分服务业。办公室文职、工程师、专业人员不在此列，他们使用E-7等其他签证。如果你持有特定领域的学位属于专业人才，那么大多数情况下应走E-7而非E-9路径。
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-[color:var(--color-text-primary)]">
          2. 17个派遣国
        </h2>
        <p>
          韩国只接收与其签订MOU的国家的EPS劳动者。2025年塔吉克斯坦作为第17个派遣国加入后，目前派遣国共有17个，塔吉克斯坦的首批劳动者已于2025年10月22日入境。
        </p>
        <div className="overflow-hidden rounded-xl border border-[color:var(--color-border-subtle)] bg-[color:var(--color-bg-elevated)]">
          <table className="w-full text-sm">
            <thead className="text-xs uppercase tracking-wider text-[color:var(--color-text-tertiary)]">
              <tr>
                <th className="px-4 py-2 text-left font-medium">地区</th>
                <th className="px-4 py-2 text-left font-medium">派遣国</th>
              </tr>
            </thead>
            <tbody className="text-[color:var(--color-text-secondary)]">
              <tr className="border-t border-[color:var(--color-border-subtle)]">
                <td className="px-4 py-2 font-medium">东南亚</td>
                <td className="px-4 py-2">
                  越南、泰国、菲律宾、印度尼西亚、柬埔寨、老挝、缅甸、东帝汶
                </td>
              </tr>
              <tr className="border-t border-[color:var(--color-border-subtle)]">
                <td className="px-4 py-2 font-medium">南亚</td>
                <td className="px-4 py-2">尼泊尔、孟加拉国、斯里兰卡、巴基斯坦</td>
              </tr>
              <tr className="border-t border-[color:var(--color-border-subtle)]">
                <td className="px-4 py-2 font-medium">中亚</td>
                <td className="px-4 py-2">乌兹别克斯坦、吉尔吉斯斯坦、塔吉克斯坦</td>
              </tr>
              <tr className="border-t border-[color:var(--color-border-subtle)]">
                <td className="px-4 py-2 font-medium">东亚</td>
                <td className="px-4 py-2">中国、蒙古</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="rounded-xl border border-[color:var(--color-border-subtle)] bg-[color:var(--color-bg-elevated)] p-4">
          <p className="font-semibold text-[color:var(--color-text-primary)]">
            印度不是EPS派遣国
          </p>
          <p className="mt-2 text-sm">
            这是最常见的误解。由于印度与韩国没有EPS
            MOU，印度国籍者无法持E-9签证来韩国。印度的熟练专业人才应改走专业类{" "}
            <Link
              href="/zh/guide/e7-professional-visa"
              className="text-indigo-300 underline-offset-2 hover:underline"
            >
              E-7签证
            </Link>{" "}
            路径。
          </p>
          <p className="mt-2 text-sm">
            哈萨克斯坦有时被提及为未来可能新增的对象，但尚无任何确定结论。在正式MOU公布之前，只能视为&ldquo;讨论中&rdquo;。
          </p>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-[color:var(--color-text-primary)]">
          3. 选拔流程
        </h2>
        <p>
          选拔并非先到先得。决定录取与否的有两点——<strong>EPS-TOPIK</strong>
          (专为雇佣许可制申请者设计的韩国语能力考试)以及将韩国语能力、技能水平、职务能力量化打分的
          <strong>选拔积分制</strong>。
        </p>
        <ol className="list-inside list-decimal space-y-1.5">
          <li>在本国参加EPS-TOPIK考试</li>
          <li>合格后登记求职者名册</li>
          <li>韩国雇主从名册中挑选候选人</li>
          <li>签订标准劳动合同</li>
          <li>雇主办理签证发放认定书</li>
          <li>持E-9签证入境后完成就业培训</li>
        </ol>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-[color:var(--color-text-primary)]">
          4. 居留期限与再雇佣
        </h2>
        <p>
          E-9劳动者最初<strong>最长可居留4年10个月</strong>
          。这个看似不上不下的期限是刻意设计的——它正好卡在会触发其他居留规定的5年门槛之下。
        </p>
        <p>
          在此之后，如果雇主申请再雇佣，或劳动者被认定为&ldquo;诚实劳动者&rdquo;，可通过再入境特例等方式将总工作期限延长至
          <strong>最长9年8个月</strong>
          。实际上这意味着，一名勤恳的劳动者遇到支持他的雇主，可以在韩国积累近十年的合法工作经历。
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-[color:var(--color-text-primary)]">
          5. 2026年引进规模与行业
        </h2>
        <p>
          2026年E-9引进规模定为<strong>8万人</strong>
          。相比2025年的13万人大幅缩减，这反映了制造业和建筑业招聘需求的放缓。
        </p>
        <p>
          配额按行业分配——例如制造业约5万人、农畜产业约1万人——此外还有约1万人的弹性分配额度，可调配到需求最旺盛的地方。2026年方案还扩大了非首都圈(地方)超额招聘的上限，以引导更多劳动者流向劳动力短缺最严重的地区。由于这些数字每年都会修订，制定计划前请务必确认最新配额。
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-[color:var(--color-text-primary)]">
          6. 从E-9到E-7-4——长期定居的阶梯
        </h2>
        <p>
          E-9未必是死胡同。以E-9积累足够的合法工作经历(一般为4年以上)并满足条件者，可转为按积分制运营的熟练技能人力
          <strong>E-7-4</strong>。E-7-4是真正的长期通道——可带来更长的居留、家属随行，乃至最终的永久居留(F-5)。换句话说，EPS可以是通往在韩定居这架梯子的第一级。E-7-4的具体条件在{" "}
          <Link
            href="/zh/guide/e7-professional-visa"
            className="text-indigo-300 underline-offset-2 hover:underline"
          >
            E-7专业类签证指南
          </Link>
          中介绍。
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-[color:var(--color-text-primary)]">
          常见问题
        </h2>
        <div className="space-y-4">
          <div>
            <p className="font-medium text-[color:var(--color-text-primary)]">
              Q. 印度国籍者也能通过EPS来韩国吗？
            </p>
            <p>
              不能。印度不是EPS派遣国，因此印度国籍者没有E-9路径。印度专业人才的路径是E-7签证。
            </p>
          </div>
          <div>
            <p className="font-medium text-[color:var(--color-text-primary)]">
              Q. 不参加EPS-TOPIK能拿到E-9吗？
            </p>
            <p>
              实际上不能。EPS-TOPIK是登记求职者名册的门槛。只有考试合格，才能成为韩国雇主可挑选的对象。
            </p>
          </div>
          <div>
            <p className="font-medium text-[color:var(--color-text-primary)]">
              Q. 入境后可以更换工作单位吗？
            </p>
            <p>
              更换工作单位是可以的，但受到严格限制——只在特定条件下、且在更换次数上限内才被允许。由于规定严格且时常变动，请就具体情况向管辖出入境(HiKorea)确认。
            </p>
          </div>
          <div>
            <p className="font-medium text-[color:var(--color-text-primary)]">
              Q. E-9可以带家属吗？
            </p>
            <p>
              不可以。E-9不允许家属随行。家属随行要到E-7-4等后续通道才有可能。
            </p>
          </div>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-2xl font-semibold text-[color:var(--color-text-primary)]">
          结语
        </h2>
        <p>
          总结：EPS/E-9是韩国非专业外国人就业的主要合法渠道，向17个合作国开放，2026年上限为8万人，最长可居留4年10个月(最长可延长至9年8个月)，并有通往E-7-4和永久居留的实质性路径。印度是值得注意的例外——它走的是E-7而非E-9。
        </p>
        <p className="text-sm">
          本文为一般信息，并非法律咨询。费率、配额、派遣国名单每年都会变动，申请前请在官方网站确认：EPS(eps.go.kr)、韩国产业人力公团(HRD
          Korea)、法务部HiKorea(hikorea.go.kr)。
        </p>
        <p>
          相关工具：{" "}
          <Link
            href="/zh/visa-days"
            className="text-indigo-300 underline-offset-2 hover:underline"
          >
            居留天数计算器
          </Link>
          {" · "}
          <Link
            href="/zh/pension-refund"
            className="text-indigo-300 underline-offset-2 hover:underline"
          >
            国民年金退还
          </Link>
          {" · "}
          <Link
            href="/zh/guide/foreign-work-visa-korea"
            className="text-indigo-300 underline-offset-2 hover:underline"
          >
            各国工作签证中心
          </Link>
        </p>
      </section>

      <PostTags tags={TAGS.zh} locale="zh" />
    </article>
  );
}

function ContentVi(): React.ReactElement {
  return (
    <article className="space-y-8 leading-relaxed text-[color:var(--color-text-secondary)]">
      <header>
        <p className="text-xs font-medium uppercase tracking-wider text-[color:var(--color-text-tertiary)]">
          Nhập cư · Visa lao động
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-[color:var(--color-text-primary)] md:text-4xl">
          Visa lao động EPS (E-9) Hàn Quốc: Hướng dẫn đầy đủ 2026
        </h1>
        <p className="mt-4 text-sm text-[color:var(--color-text-tertiary)]">
          Cập nhật lần cuối 2026-07-12.
        </p>
      </header>

      <section className="space-y-4">
        <p>
          Chế độ cấp phép tuyển dụng (Employment Permit System, EPS) là cách
          Hàn Quốc hợp pháp tuyển dụng lao động nước ngoài cho những công việc
          mà người trong nước không còn muốn làm. Loại visa mà chế độ này cấp
          chính là E-9 (lao động phổ thông, phi chuyên môn). Nếu bạn muốn làm
          việc tại dây chuyền nhà máy, trang trại, tàu cá hay công trường xây
          dựng ở Hàn Quốc, thì gần như chắc chắn bạn sẽ vào qua con đường EPS.
        </p>
        <p>
          Bài viết này sẽ tổng hợp một lần tất cả: đối tượng đủ điều kiện, các
          nước phái cử, cách tuyển chọn, thời gian lưu trú, quy mô tiếp nhận
          năm 2026, và con đường từ E-9 đến định cư lâu dài.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-[color:var(--color-text-primary)]">
          1. EPS là gì và dành cho ai
        </h2>
        <p>
          EPS được triển khai từ năm 2004, do Bộ Lao động và Việc làm cùng Cơ
          quan Phát triển Nguồn nhân lực Hàn Quốc (HRD Korea) đồng vận hành.
          Nguyên tắc cốt lõi là{" "}
          <strong>phương thức thỏa thuận giữa hai chính phủ</strong>: Hàn Quốc
          ký biên bản ghi nhớ (MOU) với từng nước phái cử, và việc tuyển mộ,
          tuyển chọn chỉ diễn ra thông qua các cơ quan công của cả hai bên.
          Môi giới tư nhân bị loại bỏ một cách có chủ ý, nhằm giữ phí thấp và
          giảm nguy cơ bị bóc lột.
        </p>
        <p>
          E-9 là visa lao động phi chuyên môn. Đối tượng là các công việc giản
          đơn và bán lành nghề trong năm nhóm ngành — sản xuất, nông nghiệp và
          chăn nuôi, ngư nghiệp, xây dựng, và một số ngành dịch vụ. Nhân viên
          văn phòng, kỹ sư, người làm chuyên môn không thuộc diện này; họ dùng
          các loại visa khác như E-7. Nếu bạn có bằng đại học trong một lĩnh
          vực chuyên môn, thì trong đa số trường hợp con đường đúng là E-7 chứ
          không phải E-9.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-[color:var(--color-text-primary)]">
          2. 17 nước phái cử
        </h2>
        <p>
          Hàn Quốc chỉ tiếp nhận lao động EPS từ các nước đã ký MOU. Năm 2025,
          sau khi Tajikistan gia nhập với tư cách nước phái cử thứ 17, hiện có
          17 nước phái cử; những lao động đầu tiên của Tajikistan đã nhập cảnh
          vào ngày 22 tháng 10 năm 2025.
        </p>
        <div className="overflow-hidden rounded-xl border border-[color:var(--color-border-subtle)] bg-[color:var(--color-bg-elevated)]">
          <table className="w-full text-sm">
            <thead className="text-xs uppercase tracking-wider text-[color:var(--color-text-tertiary)]">
              <tr>
                <th className="px-4 py-2 text-left font-medium">Khu vực</th>
                <th className="px-4 py-2 text-left font-medium">
                  Nước phái cử
                </th>
              </tr>
            </thead>
            <tbody className="text-[color:var(--color-text-secondary)]">
              <tr className="border-t border-[color:var(--color-border-subtle)]">
                <td className="px-4 py-2 font-medium">Đông Nam Á</td>
                <td className="px-4 py-2">
                  Việt Nam, Thái Lan, Philippines, Indonesia, Campuchia, Lào,
                  Myanmar, Timor-Leste
                </td>
              </tr>
              <tr className="border-t border-[color:var(--color-border-subtle)]">
                <td className="px-4 py-2 font-medium">Nam Á</td>
                <td className="px-4 py-2">
                  Nepal, Bangladesh, Sri Lanka, Pakistan
                </td>
              </tr>
              <tr className="border-t border-[color:var(--color-border-subtle)]">
                <td className="px-4 py-2 font-medium">Trung Á</td>
                <td className="px-4 py-2">
                  Uzbekistan, Kyrgyzstan, Tajikistan
                </td>
              </tr>
              <tr className="border-t border-[color:var(--color-border-subtle)]">
                <td className="px-4 py-2 font-medium">Đông Á</td>
                <td className="px-4 py-2">Trung Quốc, Mông Cổ</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="rounded-xl border border-[color:var(--color-border-subtle)] bg-[color:var(--color-bg-elevated)] p-4">
          <p className="font-semibold text-[color:var(--color-text-primary)]">
            Ấn Độ không phải là nước phái cử EPS
          </p>
          <p className="mt-2 text-sm">
            Đây là hiểu lầm phổ biến nhất. Vì Ấn Độ không có MOU EPS với Hàn
            Quốc nên công dân Ấn Độ không thể sang Hàn Quốc bằng visa E-9. Lao
            động chuyên môn lành nghề người Ấn Độ thay vào đó đi theo con đường
            chuyên môn{" "}
            <Link
              href="/vi/guide/e7-professional-visa"
              className="text-indigo-300 underline-offset-2 hover:underline"
            >
              visa E-7
            </Link>
            .
          </p>
          <p className="mt-2 text-sm">
            Kazakhstan đôi khi được nhắc đến như một đối tượng có thể bổ sung
            trong tương lai, nhưng chưa có gì được xác định. Cho đến khi MOU
            chính thức được công bố, chỉ nên xem đây là &ldquo;đang thảo
            luận&rdquo;.
          </p>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-[color:var(--color-text-primary)]">
          3. Quy trình tuyển chọn
        </h2>
        <p>
          Việc tuyển chọn không theo nguyên tắc ai đến trước được trước. Có hai
          yếu tố quyết định — <strong>EPS-TOPIK</strong> (kỳ thi năng lực tiếng
          Hàn được thiết kế riêng cho ứng viên EPS) và{" "}
          <strong>hệ thống tuyển chọn theo điểm</strong>, chấm điểm năng lực
          tiếng Hàn, trình độ tay nghề và năng lực công việc.
        </p>
        <ol className="list-inside list-decimal space-y-1.5">
          <li>Thi EPS-TOPIK tại nước sở tại</li>
          <li>Đăng ký vào danh sách người tìm việc sau khi đỗ</li>
          <li>Chủ sử dụng lao động Hàn Quốc chọn ứng viên từ danh sách</li>
          <li>Ký hợp đồng lao động tiêu chuẩn</li>
          <li>Chủ sử dụng lao động xin Giấy xác nhận cấp visa</li>
          <li>Nhập cảnh bằng visa E-9 và hoàn thành khóa đào tạo việc làm</li>
        </ol>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-[color:var(--color-text-primary)]">
          4. Thời gian lưu trú và tái tuyển dụng
        </h2>
        <p>
          Lao động E-9 được lưu trú{" "}
          <strong>tối đa 4 năm 10 tháng</strong> cho lần đầu. Khoảng thời gian
          có vẻ lưng chừng này là có chủ ý — nó nằm ngay dưới mốc 5 năm, mốc sẽ
          kích hoạt các quy định lưu trú khác.
        </p>
        <p>
          Sau đó, nếu chủ sử dụng lao động đề nghị tái tuyển dụng, hoặc người
          lao động được công nhận là &ldquo;lao động chăm chỉ / mẫu mực&rdquo;,
          thì thông qua đặc lệ tái nhập cảnh, tổng thời gian làm việc có thể
          kéo dài <strong>tối đa đến 9 năm 8 tháng</strong>. Trên thực tế, điều
          này có nghĩa là một người lao động tận tâm gặp được chủ sử dụng lao
          động ủng hộ có thể tích lũy gần một thập kỷ làm việc hợp pháp tại Hàn
          Quốc.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-[color:var(--color-text-primary)]">
          5. Quy mô tiếp nhận và ngành nghề năm 2026
        </h2>
        <p>
          Đối với năm 2026, Hàn Quốc ấn định quy mô tiếp nhận E-9 là{" "}
          <strong>80.000 người</strong>. Đây là mức cắt giảm mạnh so với hạn
          ngạch 130.000 người của năm 2025, phản ánh nhu cầu tuyển dụng chững
          lại trong ngành sản xuất và xây dựng.
        </p>
        <p>
          Hạn ngạch được phân bổ theo ngành — ví dụ khoảng 50.000 cho sản xuất
          và 10.000 cho nông nghiệp, chăn nuôi — cộng thêm khoảng 10.000 thuộc
          quỹ phân bổ linh hoạt, có thể điều chuyển đến nơi có nhu cầu lớn nhất.
          Kế hoạch năm 2026 cũng nới rộng trần tuyển dụng vượt mức ở khu vực
          ngoài thủ đô (địa phương), nhằm hướng thêm lao động về những vùng
          thiếu hụt nghiêm trọng nhất. Vì các con số này được sửa đổi hằng năm,
          hãy luôn xác nhận hạn ngạch hiện hành trước khi lên kế hoạch.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-[color:var(--color-text-primary)]">
          6. Từ E-9 đến E-7-4 — chiếc thang định cư lâu dài
        </h2>
        <p>
          E-9 không nhất thiết là ngõ cụt. Người lao động tích lũy đủ thời gian
          làm việc hợp pháp bằng E-9 (thường là từ bốn năm trở lên) và đáp ứng
          các điều kiện có thể chuyển sang visa lao động lành nghề{" "}
          <strong>E-7-4</strong>, vận hành theo hệ thống điểm. E-7-4 là một lộ
          trình dài hạn thực sự — có thể dẫn đến thời gian lưu trú dài hơn,
          quyền bảo lãnh gia đình, và cuối cùng là thường trú (F-5). Nói cách
          khác, EPS có thể là bậc thang đầu tiên của một chiếc thang dẫn đến
          định cư tại Hàn Quốc. Các điều kiện chi tiết của E-7-4 được trình bày
          trong{" "}
          <Link
            href="/vi/guide/e7-professional-visa"
            className="text-indigo-300 underline-offset-2 hover:underline"
          >
            hướng dẫn visa chuyên môn E-7
          </Link>
          .
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-[color:var(--color-text-primary)]">
          Câu hỏi thường gặp
        </h2>
        <div className="space-y-4">
          <div>
            <p className="font-medium text-[color:var(--color-text-primary)]">
              Q. Công dân Ấn Độ có thể sang Hàn Quốc bằng EPS không?
            </p>
            <p>
              Không. Ấn Độ không phải là nước phái cử EPS, nên không có con
              đường E-9 cho công dân Ấn Độ. Con đường cho lao động chuyên môn
              Ấn Độ là visa E-7.
            </p>
          </div>
          <div>
            <p className="font-medium text-[color:var(--color-text-primary)]">
              Q. Không thi EPS-TOPIK có lấy được E-9 không?
            </p>
            <p>
              Trên thực tế là không. EPS-TOPIK là cửa vào danh sách người tìm
              việc. Chỉ khi đỗ kỳ thi này bạn mới trở thành đối tượng để chủ sử
              dụng lao động Hàn Quốc lựa chọn.
            </p>
          </div>
          <div>
            <p className="font-medium text-[color:var(--color-text-primary)]">
              Q. Sau khi nhập cảnh có thể đổi nơi làm việc không?
            </p>
            <p>
              Việc đổi nơi làm việc là có thể nhưng bị quản lý chặt chẽ — chỉ
              trong những điều kiện nhất định và trong giới hạn số lần thay đổi.
              Vì quy định nghiêm ngặt và thường thay đổi, hãy xác nhận tình
              huống cụ thể của bạn với cơ quan xuất nhập cảnh có thẩm quyền
              (HiKorea).
            </p>
          </div>
          <div>
            <p className="font-medium text-[color:var(--color-text-primary)]">
              Q. E-9 có cho phép bảo lãnh gia đình không?
            </p>
            <p>
              Không. E-9 không cho phép gia đình đi cùng. Việc bảo lãnh gia
              đình chỉ khả thi ở các lộ trình sau như E-7-4.
            </p>
          </div>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-2xl font-semibold text-[color:var(--color-text-primary)]">
          Kết luận
        </h2>
        <p>
          Tóm lại: EPS/E-9 là kênh hợp pháp chính cho lao động nước ngoài phi
          chuyên môn tại Hàn Quốc, mở cho 17 nước đối tác, giới hạn 80.000
          người cho năm 2026, cho phép lưu trú tối đa 4 năm 10 tháng (có thể
          kéo dài đến 9 năm 8 tháng), với con đường thực sự tiếp nối đến E-7-4
          và thường trú. Ấn Độ là ngoại lệ đáng chú ý — nước này đi qua E-7
          thay vì E-9.
        </p>
        <p className="text-sm">
          Đây là thông tin chung, không phải tư vấn pháp lý. Tỷ lệ, hạn ngạch
          và danh sách nước phái cử thay đổi hằng năm, vì vậy hãy xác nhận chi
          tiết trên các trang chính thức trước khi nộp hồ sơ: EPS (eps.go.kr),
          HRD Korea, và HiKorea của Bộ Tư pháp (hikorea.go.kr).
        </p>
        <p>
          Công cụ liên quan:{" "}
          <Link
            href="/vi/visa-days"
            className="text-indigo-300 underline-offset-2 hover:underline"
          >
            Máy tính số ngày lưu trú
          </Link>
          {" · "}
          <Link
            href="/vi/pension-refund"
            className="text-indigo-300 underline-offset-2 hover:underline"
          >
            Hoàn thuế lương hưu quốc gia
          </Link>
          {" · "}
          <Link
            href="/vi/guide/foreign-work-visa-korea"
            className="text-indigo-300 underline-offset-2 hover:underline"
          >
            Trung tâm visa lao động theo quốc gia
          </Link>
        </p>
      </section>

      <PostTags tags={TAGS.vi} locale="vi" />
    </article>
  );
}

function ContentEn(): React.ReactElement {
  return (
    <article className="space-y-8 leading-relaxed text-[color:var(--color-text-secondary)]">
      <header>
        <p className="text-xs font-medium uppercase tracking-wider text-[color:var(--color-text-tertiary)]">
          Immigration · Work Visa
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-[color:var(--color-text-primary)] md:text-4xl">
          Korea EPS (E-9) Work Visa: Full Guide for 2026
        </h1>
        <p className="mt-4 text-sm text-[color:var(--color-text-tertiary)]">
          Last updated 2026-07-12.
        </p>
      </header>

      <section className="space-y-4">
        <p>
          The Employment Permit System (EPS) is how Korea legally hires foreign
          workers for jobs that domestic workers no longer fill. The visa it
          grants is the E-9 (non-professional employment). If you want to work
          on a Korean factory line, farm, fishing boat, or construction site,
          EPS is almost certainly the door you go through.
        </p>
        <p>
          This guide walks through who qualifies, which countries can send
          workers, how selection works, how long you can stay, the 2026 intake,
          and the path from E-9 to long-term settlement.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-[color:var(--color-text-primary)]">
          1. What EPS is and who it is for
        </h2>
        <p>
          EPS launched in 2004 and is run jointly by Korea&apos;s Ministry of
          Employment and Labor and HRD Korea (the Human Resources Development
          Service of Korea). Its core principle is a{" "}
          <strong>government-to-government arrangement</strong>: Korea signs a
          memorandum of understanding (MOU) with each sending country, and
          recruitment runs through public agencies on both sides. Private
          brokers are deliberately cut out, which keeps fees low and reduces the
          chance of exploitation.
        </p>
        <p>
          E-9 is for non-professional employment — manual and semi-skilled roles
          in five broad sectors: manufacturing, agriculture and livestock,
          fishing, construction, and a limited set of service industries. It is
          not for office jobs, engineers, or professionals; those fall under
          separate visas such as the E-7. If you hold a university degree in a
          specialized field, the E-7 route is usually the right one, not E-9.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-[color:var(--color-text-primary)]">
          2. The 17 sending countries
        </h2>
        <p>
          Korea only accepts EPS workers from countries it has signed an MOU
          with. As of 2025 there are 17 sending countries, after Tajikistan
          joined as the 17th — its first workers entered Korea on 22 October
          2025.
        </p>
        <div className="overflow-hidden rounded-xl border border-[color:var(--color-border-subtle)] bg-[color:var(--color-bg-elevated)]">
          <table className="w-full text-sm">
            <thead className="text-xs uppercase tracking-wider text-[color:var(--color-text-tertiary)]">
              <tr>
                <th className="px-4 py-2 text-left font-medium">Region</th>
                <th className="px-4 py-2 text-left font-medium">Countries</th>
              </tr>
            </thead>
            <tbody className="text-[color:var(--color-text-secondary)]">
              <tr className="border-t border-[color:var(--color-border-subtle)]">
                <td className="px-4 py-2 font-medium">Southeast Asia</td>
                <td className="px-4 py-2">
                  Vietnam, Thailand, the Philippines, Indonesia, Cambodia, Laos,
                  Myanmar, Timor-Leste
                </td>
              </tr>
              <tr className="border-t border-[color:var(--color-border-subtle)]">
                <td className="px-4 py-2 font-medium">South Asia</td>
                <td className="px-4 py-2">
                  Nepal, Bangladesh, Sri Lanka, Pakistan
                </td>
              </tr>
              <tr className="border-t border-[color:var(--color-border-subtle)]">
                <td className="px-4 py-2 font-medium">Central Asia</td>
                <td className="px-4 py-2">
                  Uzbekistan, Kyrgyzstan, Tajikistan
                </td>
              </tr>
              <tr className="border-t border-[color:var(--color-border-subtle)]">
                <td className="px-4 py-2 font-medium">East Asia</td>
                <td className="px-4 py-2">China, Mongolia</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="rounded-xl border border-[color:var(--color-border-subtle)] bg-[color:var(--color-bg-elevated)] p-4">
          <p className="font-semibold text-[color:var(--color-text-primary)]">
            India is not an EPS country
          </p>
          <p className="mt-2 text-sm">
            This is the single most common misunderstanding. Indian nationals
            cannot come to Korea on an E-9 visa, because India has no EPS MOU
            with Korea. Skilled Indian professionals instead use the
            professional{" "}
            <Link
              href="/en/guide/e7-professional-visa"
              className="text-indigo-300 underline-offset-2 hover:underline"
            >
              E-7 visa
            </Link>{" "}
            route.
          </p>
          <p className="mt-2 text-sm">
            Kazakhstan has occasionally been mentioned as a possible future
            addition, but nothing is confirmed. Treat it as &ldquo;under
            discussion&rdquo; only until an official MOU is announced.
          </p>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-[color:var(--color-text-primary)]">
          3. The selection process
        </h2>
        <p>
          Selection is not first-come, first-served. Two things decide it: the{" "}
          <strong>EPS-TOPIK</strong> (a Korean-language proficiency test built
          specifically for EPS applicants) and a{" "}
          <strong>point-based selection system</strong> that scores
          Korean-language ability, skill level, and job competency.
        </p>
        <ol className="list-inside list-decimal space-y-1.5">
          <li>Sit the EPS-TOPIK in your home country.</li>
          <li>Register on the jobseeker roster once you pass.</li>
          <li>A Korean employer selects candidates from that roster.</li>
          <li>Sign a standard labor contract.</li>
          <li>The employer obtains a Certificate of Confirmation of Visa Issuance.</li>
          <li>Enter Korea on the E-9 visa and complete onboarding training.</li>
        </ol>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-[color:var(--color-text-primary)]">
          4. Stay duration and re-employment
        </h2>
        <p>
          An E-9 worker can stay for an initial{" "}
          <strong>maximum of 4 years and 10 months</strong>. That specific
          length is deliberate — it sits just under the 5-year mark that would
          otherwise trigger different residency rules.
        </p>
        <p>
          Beyond that, if the employer requests re-employment, or the worker is
          recognized as a &ldquo;sincere / diligent worker&rdquo;, re-entry
          special measures can extend total employment{" "}
          <strong>up to 9 years and 8 months</strong>. In practice this means a
          committed worker with a supportive employer can build most of a decade
          of legal work in Korea.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-[color:var(--color-text-primary)]">
          5. The 2026 intake and sectors
        </h2>
        <p>
          For 2026, Korea set the E-9 intake at{" "}
          <strong>80,000 people</strong>. That is a sharp cut from the 130,000
          quota in 2025, reflecting softer hiring demand in manufacturing and
          construction.
        </p>
        <p>
          The quota is split by sector — for example, roughly 50,000 for
          manufacturing and 10,000 for agriculture and livestock — plus a
          flexible-allocation pool of around 10,000 that can be moved to
          wherever demand is strongest. The 2026 plan also widens the ceiling on
          over-hiring in non-capital (regional) areas, to push more workers
          toward the regions facing the worst shortages. Because these numbers
          are revised every year, always confirm the current quota before you
          plan.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-[color:var(--color-text-primary)]">
          6. From E-9 to E-7-4 — the settlement ladder
        </h2>
        <p>
          E-9 is not necessarily a dead end. Workers who accumulate enough legal
          employment on E-9 (generally four years or more) and meet the
          requirements can convert to the skilled-worker visa{" "}
          <strong>E-7-4</strong>, which runs on a point system. E-7-4 is a
          genuine long-term track: it can lead to longer stays, the right to
          bring family, and eventually permanent residence (F-5). In other
          words, EPS can be the first rung of a ladder that ends in settling in
          Korea. The detailed E-7-4 criteria are covered in our{" "}
          <Link
            href="/en/guide/e7-professional-visa"
            className="text-indigo-300 underline-offset-2 hover:underline"
          >
            E-7 professional visa guide
          </Link>
          .
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-[color:var(--color-text-primary)]">
          Frequently asked questions
        </h2>
        <div className="space-y-4">
          <div>
            <p className="font-medium text-[color:var(--color-text-primary)]">
              Q. Can Indian nationals come to Korea on EPS?
            </p>
            <p>
              No. India is not an EPS sending country, so there is no E-9 route
              for Indian nationals. The path for Indian professionals is the E-7
              visa.
            </p>
          </div>
          <div>
            <p className="font-medium text-[color:var(--color-text-primary)]">
              Q. Can I get an E-9 without taking the EPS-TOPIK?
            </p>
            <p>
              In practice, no. The EPS-TOPIK is the entry gate for the jobseeker
              roster. Passing it is what makes you selectable by Korean
              employers.
            </p>
          </div>
          <div>
            <p className="font-medium text-[color:var(--color-text-primary)]">
              Q. Can I change workplaces after arriving?
            </p>
            <p>
              Workplace changes are possible but tightly regulated — only under
              specific conditions and within limits on the number of changes.
              Because the rules are strict and change over time, confirm your
              exact situation with the relevant immigration office (HiKorea).
            </p>
          </div>
          <div>
            <p className="font-medium text-[color:var(--color-text-primary)]">
              Q. Does E-9 let me bring my family?
            </p>
            <p>
              No. E-9 does not grant family accompaniment. Family accompaniment
              becomes possible on later tracks such as E-7-4.
            </p>
          </div>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-2xl font-semibold text-[color:var(--color-text-primary)]">
          Bottom line
        </h2>
        <p>
          EPS/E-9 is the main legal channel for non-professional foreign work in
          Korea, open to 17 partner countries, capped at 80,000 for 2026, good
          for up to 4 years 10 months (extendable toward 9 years 8 months), with
          a real path onward to E-7-4 and permanent residence. India is the
          notable exception — it goes through E-7 instead.
        </p>
        <p className="text-sm">
          This is general information, not legal advice. Rates, quotas, and the
          country list change every year, so confirm the details on the official
          sites before you apply: EPS (eps.go.kr), HRD Korea, and the Ministry
          of Justice&apos;s HiKorea (hikorea.go.kr).
        </p>
        <p>
          Related tools:{" "}
          <Link
            href="/en/visa-days"
            className="text-indigo-300 underline-offset-2 hover:underline"
          >
            stay-days calculator
          </Link>
          {" · "}
          <Link
            href="/en/pension-refund"
            className="text-indigo-300 underline-offset-2 hover:underline"
          >
            National Pension refund
          </Link>
          {" · "}
          <Link
            href="/en/guide/foreign-work-visa-korea"
            className="text-indigo-300 underline-offset-2 hover:underline"
          >
            country-by-country visa hub
          </Link>
        </p>
      </section>

      <PostTags tags={TAGS.en} locale="en" />
    </article>
  );
}
