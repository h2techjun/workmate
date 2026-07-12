import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { locales } from "@/i18n";
import { buildLanguagesAlt } from "@/lib/seo/alternates";
import { SITE_URL } from "@/lib/siteConfig";

interface PageProps {
  params: Promise<{ locale: string }>;
}

const PATH = "/guide/e7-professional-visa";

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;

  let title: string;
  let description: string;
  let ogLocale: string;

  if (locale === "zh") {
    title = "韩国E-7专业工作签证完全指南2026(薪资标准·类型·积分制) | Workmate";
    description =
      "E-7分为专业·准专业·一般技能·熟练技能四类。2026年薪资标准、雇主担保、CSR、20%规则、Top-Tier快速通道到F-5,以及印度IT人才为何主要走E-7。";
    ogLocale = "zh_CN";
  } else if (locale === "vi") {
    title =
      "Visa lao động chuyên môn E-7 Hàn Quốc: Hướng dẫn 2026 (Lương, Loại, Điểm) | Workmate";
    description =
      "E-7 gồm 4 loại: chuyên môn, bán chuyên môn, kỹ năng thường và kỹ năng lành nghề. Mức lương 2026, bảo lãnh của chủ, CSR, quy tắc 20%, tuyến nhanh Top-Tier lên F-5.";
    ogLocale = "vi_VN";
  } else if (locale !== "ko") {
    title =
      "Korea E-7 Professional Work Visa: 2026 Guide (Salary, Types, Points) | Workmate";
    description =
      "E-7 covers professionals, semi-professionals, general and skilled workers. 2026 salary floor, employer sponsorship, CSR, the 20% rule, the Top-Tier fast track to F-5, and why Indian IT talent mostly uses E-7.";
    ogLocale = "en_US";
  } else {
    title = "E-7 전문직 비자 완전 가이드 2026 (임금기준·유형·점수제) | Workmate";
    description =
      "E-7은 전문·준전문·일반기능·숙련기능 4개 유형. 2026 임금기준, 고용주 스폰서, 사증발급인정서(CSR), 20% 룰, F-5로 가는 Top-Tier 패스트트랙까지 정리했습니다.";
    ogLocale = "ko_KR";
  }

  return {
    title,
    description,
    alternates: {
      canonical: `/${locale}${PATH}`,
      languages: buildLanguagesAlt(PATH),
    },
    openGraph: {
      title,
      description,
      type: "article",
      url: `${SITE_URL}/${locale}${PATH}`,
      locale: ogLocale,
    },
  };
}

export function generateStaticParams(): Array<{ locale: string }> {
  return locales.map((locale) => ({ locale }));
}

export default async function E7ProfessionalVisaGuidePage({
  params,
}: PageProps): Promise<React.ReactElement> {
  const { locale } = await params;
  return (
    <main className="px-4 pb-16 pt-6 md:px-6 md:pt-12">
      <div className="mx-auto max-w-3xl">
        <nav className="mb-5 flex items-center gap-2 text-sm text-[color:var(--color-text-tertiary)]">
          <Link
            href={`/${locale}/f2-residence-visa`}
            className="inline-flex items-center gap-1 transition-colors hover:text-[color:var(--color-text-primary)]"
          >
            <ChevronLeft className="h-4 w-4" />
            {locale === "ko"
              ? "F-2-7 거주비자 점수제로"
              : locale === "zh"
                ? "前往F-2-7居住签证积分制"
                : locale === "vi"
                  ? "Đến điểm số visa cư trú F-2-7"
                  : "To the F-2-7 residence points"}
          </Link>
        </nav>
        {locale === "ko" ? (
          <ContentKo locale={locale} />
        ) : locale === "zh" ? (
          <ContentZh locale={locale} />
        ) : locale === "vi" ? (
          <ContentVi locale={locale} />
        ) : (
          <ContentEn locale={locale} />
        )}
      </div>
    </main>
  );
}

function ContentKo({ locale }: { locale: string }): React.ReactElement {
  return (
    <article className="space-y-8 leading-relaxed text-[color:var(--color-text-secondary)]">
      <header>
        <p className="text-xs font-medium uppercase tracking-wider text-[color:var(--color-text-tertiary)]">
          외국인 · 취업비자
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-[color:var(--color-text-primary)] md:text-4xl">
          E-7 전문직 비자 완전 가이드 2026 (임금기준·유형·점수제)
        </h1>
        <p className="mt-4 text-sm text-[color:var(--color-text-tertiary)]">
          2026년 임금기준 적용 (2026-02-01~12-31). 마지막 업데이트 2026-07-12.
        </p>
      </header>

      <section className="space-y-4">
        <p>
          E-7은 법무부가 지정한 전문·숙련 직종에 한국 고용주와 계약한
          외국인을 위한 취업비자입니다. 정식 명칭은{" "}
          <strong>특정활동(E-7, Foreign National of Special Ability)</strong>.
          석사 이상 또는 학사+경력을 갖춘 엔지니어·IT 개발자·디자이너·연구원부터,
          E-9 같은 비전문 비자로 국내에서 여러 해 일한 뒤 숙련기능인력으로
          전환하는 사람까지 폭넓게 아우릅니다. 1회 최장 체류 기간은 3년이며
          연장할 수 있습니다.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-[color:var(--color-text-primary)]">
          1. E-7이란 — 누가 대상인가
        </h2>
        <p>
          핵심은 두 가지입니다. 첫째, 직종이 법무부가 지정한 목록 안에 있어야
          합니다. 아무 일자리나 되는 게 아니라 지정 직종에 한합니다. 둘째,
          한국 고용주가 스폰서가 되어야 합니다. 프리랜서처럼 스스로를 스폰서로
          세우는 <strong>자기 스폰서는 불가</strong>합니다.
        </p>
        <p>
          그래서 E-7은 &ldquo;한국 회사가 고용하고 싶은 전문·숙련 외국인력&rdquo;을
          위한 통로입니다. 대학원 유학 후 국내 취업으로 전환하는 경우, 해외
          본사에서 한국 법인으로 파견되는 경우, 오래 현장에서 일한 기능인력이
          숙련 등급으로 올라서는 경우가 대표적입니다.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-[color:var(--color-text-primary)]">
          2. 4개 서브카테고리 (E-7-1 ~ E-7-4)
        </h2>
        <p>
          E-7은 숙련도와 대상에 따라 네 갈래로 나뉩니다. 특히 E-7-4는 점수제
          (K-Point)로 운영되어, E-9·E-10·H-2 소지자가 국내에서 4년 넘게 합법
          취업한 뒤 전환하는 정착형 경로입니다.
        </p>
        <div className="overflow-hidden rounded-xl border border-[color:var(--color-border-subtle)] bg-[color:var(--color-bg-elevated)]">
          <table className="w-full text-sm">
            <thead className="text-xs uppercase tracking-wider text-[color:var(--color-text-tertiary)]">
              <tr>
                <th className="px-4 py-2 text-left font-medium">유형</th>
                <th className="px-4 py-2 text-left font-medium">분류</th>
                <th className="px-4 py-2 text-left font-medium">직종 수 · 특징</th>
              </tr>
            </thead>
            <tbody className="text-[color:var(--color-text-secondary)]">
              <tr className="border-t border-[color:var(--color-border-subtle)]">
                <td className="px-4 py-2 font-medium">E-7-1</td>
                <td className="px-4 py-2">전문인력</td>
                <td className="px-4 py-2">
                  67개 직종 (관리자·엔지니어·IT 전문가·디자이너·연구원 등)
                </td>
              </tr>
              <tr className="border-t border-[color:var(--color-border-subtle)]">
                <td className="px-4 py-2 font-medium">E-7-2</td>
                <td className="px-4 py-2">준전문인력</td>
                <td className="px-4 py-2">10개 직종</td>
              </tr>
              <tr className="border-t border-[color:var(--color-border-subtle)]">
                <td className="px-4 py-2 font-medium">E-7-3</td>
                <td className="px-4 py-2">일반기능인력</td>
                <td className="px-4 py-2">10개 직종</td>
              </tr>
              <tr className="border-t border-[color:var(--color-border-subtle)]">
                <td className="px-4 py-2 font-medium">E-7-4</td>
                <td className="px-4 py-2">숙련기능인력</td>
                <td className="px-4 py-2">
                  점수제(K-Point) · E-9/E-10/H-2 국내 4년+ 후 전환 · 2026 쿼터
                  3.3만 명
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-[color:var(--color-text-primary)]">
          3. 2026 임금기준 — 세전 연봉
        </h2>
        <p>
          법무부는 2025년 12월 29일 2026년 임금기준을 발표했고, 2026-02-01부터
          12-31까지 적용됩니다. 아래는 세전 연봉 기준입니다.
        </p>
        <div className="overflow-hidden rounded-xl border border-[color:var(--color-border-subtle)] bg-[color:var(--color-bg-elevated)]">
          <table className="w-full text-sm">
            <thead className="text-xs uppercase tracking-wider text-[color:var(--color-text-tertiary)]">
              <tr>
                <th className="px-4 py-2 text-left font-medium">유형</th>
                <th className="px-4 py-2 text-right font-medium">
                  2026 최소 연봉 (세전)
                </th>
                <th className="px-4 py-2 text-right font-medium">전년 대비</th>
              </tr>
            </thead>
            <tbody className="text-[color:var(--color-text-secondary)] tabular-nums">
              <tr className="border-t border-[color:var(--color-border-subtle)]">
                <td className="px-4 py-2">E-7-1 전문인력</td>
                <td className="px-4 py-2 text-right">약 3,112만 원 이상</td>
                <td className="px-4 py-2 text-right">+약 245만</td>
              </tr>
              <tr className="border-t border-[color:var(--color-border-subtle)]">
                <td className="px-4 py-2">E-7-2 / E-7-3</td>
                <td className="px-4 py-2 text-right">각 약 2,589만 원 이상</td>
                <td className="px-4 py-2 text-right">+약 74만</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          중요한 점. 임금기준에는 <strong>기본급과 고정수당만</strong> 인정됩니다.
          식대·교통비 같은 실비성 항목은 제외됩니다. 미달하면 발급·연장이
          거부되므로 계약서 구성을 미리 확인해야 합니다.
        </p>
        <p>
          <strong>GNI 규정</strong>도 알아둘 만합니다. 2025년 4월부터 회사 규모와
          무관하게 동일한 임금기준이 적용됩니다. 다만 대기업 등은 전년도 1인당
          GNI의 80%(대략 3,900만 원 안팎)를 기준으로 쓸 수 있고, 중소·비수도권·
          벤처는 70%까지 완화될 수 있습니다. 급여가 GNI의 1.5배 이상이고 부처
          추천이 있거나 3배 이상인 고소득 예외에 해당하면 학력·경력 요건이
          면제됩니다. (GNI 금액은 매년 바뀌므로 대략적인 값입니다.)
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-[color:var(--color-text-primary)]">
          4. 일반 자격요건
        </h2>
        <ul className="list-inside list-disc space-y-1.5">
          <li>
            <strong>학위·경력</strong>: 석사 이상 학위, 또는 학사 학위 + 관련
            1년 경력, 또는 관련 5년 경력 중 하나.
          </li>
          <li>
            <strong>고용주 스폰서</strong>: 필수. 자기 스폰서 불가. 고용주가
            사증발급인정서(CSR, Certificate for Confirmation of Visa Issuance)를
            받은 뒤 재외공관에 신청합니다. CSR 유효기간은 3개월입니다.
          </li>
          <li>
            <strong>20% 룰</strong>: 원칙적으로 외국인은 내국인 고용보험
            피보험자의 20% 이내로 고용해야 합니다. 즉 외국인 1명을 고용하려면
            내국인 5명이 필요한 셈입니다.
          </li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-[color:var(--color-text-primary)]">
          5. Top-Tier 비자 — 첨단분야 패스트트랙
        </h2>
        <p>
          2025년 4월 2일 도입된 Top-Tier 비자는 반도체·바이오·2차전지·디스플레이·
          로봇·방위산업 등 첨단분야 우수인재를 위한 트랙입니다. 단계별로
          <strong> D-10-T(구직) → E-7-T(취업) → F-2-T(거주)</strong> 구조로
          이어집니다.
        </p>
        <p>
          가장 큰 이점은 영주권입니다. Top-Tier는 F-5 영주를 통상 6년이 아니라{" "}
          <strong>3년 만에</strong> 신청할 수 있습니다. 첨단분야 인재를 빠르게
          정착시키려는 취지입니다.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-[color:var(--color-text-primary)]">
          6. E-7에서 F-2-7 · F-5로 — 장기 정착
        </h2>
        <p>
          E-7은 그 자체로 종착점이 아니라 정착으로 가는 발판입니다. E-7으로
          1년 이상 체류하고 점수제에서 80점을 채우면{" "}
          <Link
            href={`/${locale}/f2-residence-visa`}
            className="text-indigo-300 underline-offset-2 hover:underline"
          >
            F-2-7 거주비자
          </Link>
          로 전환할 수 있고, 이후 F-5 영주로 이어집니다. 학력·소득·연령·한국어
          능력 등이 점수로 환산되므로, F-2-7 점수 계산기로 미리 자신의 점수를
          가늠해 보는 편이 좋습니다.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-[color:var(--color-text-primary)]">
          7. 흔한 거절 사유와 대비
        </h2>
        <p>
          가장 많은 거절 사유는 <strong>직종-학위 불일치</strong>입니다. 신청
          직종코드와 본인의 직무·학력 배경이 정합해야 합니다. 예컨대 전공과
          동떨어진 직종을 신청하면 &ldquo;해당 직종 수행에 필요한 전문성을
          입증하지 못했다&rdquo;는 이유로 거부될 수 있습니다. 직무기술서·학위·
          경력증명이 신청 직종과 한 줄로 이어지도록 준비하세요.
        </p>
        <p>
          그다음으로 임금기준 미달, 20% 룰 위반(내국인 대비 외국인 비율 초과)이
          흔합니다. 계약서상 기본급이 그해 기준을 넘는지, 회사의 내국인 피보험자
          수가 충분한지 신청 전에 점검하는 것이 안전합니다.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-[color:var(--color-text-primary)]">
          앞으로 바뀔 부분 (계획 단계)
        </h2>
        <p>
          2026년 3월 3일 법무부는 &ldquo;2030 이민정책 미래전략&rdquo;을
          발표했습니다. E-7-M(제조) 신설, 39개 취업비자를 3개 숙련등급으로
          단순화하는 방향 등이 담겼습니다. 다만 이는 발표된 계획으로, 시행
          세부는 확정되지 않았습니다. 신청 시점에는 반드시 공식 공지를 다시
          확인하세요.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-[color:var(--color-text-primary)]">
          자주 묻는 질문
        </h2>
        <div className="space-y-3">
          <p>
            <strong>Q. 인도 IT 개발자는 어떤 비자를 쓰나요?</strong>
            <br />
            인도는 고용허가제(EPS, E-9) 비대상국이라 IT·엔지니어링 전문직은
            사실상 E-7이 주 경로입니다(판교·강남 IT 업계 다수). 한-인도 CEPA로
            163개 직종에서 취업이 가능합니다.
          </p>
          <p>
            <strong>Q. 임금기준에 못 미치면 어떻게 되나요?</strong>
            <br />
            발급·연장이 거부됩니다. 기준에는 기본급과 고정수당만 인정되고
            식대·교통비 같은 실비성 항목은 제외되므로, 계약서 구성을 미리
            확인하세요.
          </p>
          <p>
            <strong>Q. 자기 스폰서로 신청할 수 있나요?</strong>
            <br />
            불가합니다. 반드시 한국 고용주가 스폰서가 되어 CSR을 받은 뒤
            재외공관에 신청합니다(CSR 3개월 유효).
          </p>
          <p>
            <strong>Q. E-7으로 영주까지 갈 수 있나요?</strong>
            <br />
            네. E-7 1년 이상 + 80점이면 F-2-7 거주비자, 이후 F-5 영주로
            이어집니다. Top-Tier라면 F-5를 3년 만에 신청할 수 있습니다.
          </p>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-2xl font-semibold text-[color:var(--color-text-primary)]">
          마무리 · 관련 링크
        </h2>
        <p>
          정리하면, E-7은 전문·숙련 외국인력이 한국에 자리 잡는 가장 넓은
          취업 통로입니다. 유형(E-7-1~4)에 따라 대상과 요건이 다르고, 2026
          임금기준·고용주 스폰서·20% 룰·직종 정합이 핵심 관문입니다. 장기
          정착을 노린다면 F-2-7·F-5, 첨단분야라면 Top-Tier 트랙을 함께
          고려하세요.
        </p>
        <ul className="list-inside list-disc space-y-1.5">
          <li>
            <Link
              href={`/${locale}/f2-residence-visa`}
              className="text-indigo-300 underline-offset-2 hover:underline"
            >
              F-2-7 거주비자 점수제
            </Link>{" "}
            — E-7 다음 단계 점수 계산
          </li>
          <li>
            <Link
              href={`/${locale}/guide/foreign-work-visa-korea`}
              className="text-indigo-300 underline-offset-2 hover:underline"
            >
              국가별 한국 취업비자 허브
            </Link>{" "}
            — 출신 국가별 경로 안내
          </li>
          <li>
            <Link
              href={`/${locale}/guide/eps-e9-work-visa`}
              className="text-indigo-300 underline-offset-2 hover:underline"
            >
              E-9 고용허가제 가이드
            </Link>{" "}
            — 비전문 취업 후 E-7-4 전환 경로
          </li>
        </ul>
        <p className="text-sm text-[color:var(--color-text-tertiary)]">
          출처: 법무부 하이코리아(hikorea.go.kr), 법무부. 임금기준·직종·쿼터는
          매년 갱신되며, 신청 전 반드시 공식 채널에서 확인하세요. 본 글은
          일반 정보이며 법률 자문이 아닙니다.
        </p>
      </section>
    </article>
  );
}

function ContentEn({ locale }: { locale: string }): React.ReactElement {
  return (
    <article className="space-y-8 leading-relaxed text-[color:var(--color-text-secondary)]">
      <header>
        <p className="text-xs font-medium uppercase tracking-wider text-[color:var(--color-text-tertiary)]">
          Foreigners · Work Visa
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-[color:var(--color-text-primary)] md:text-4xl">
          Korea E-7 Professional Work Visa: 2026 Guide (Salary, Types, Points)
        </h1>
        <p className="mt-4 text-sm text-[color:var(--color-text-tertiary)]">
          2026 salary standard applies (2026-02-01 to 12-31). Last updated
          2026-07-12.
        </p>
      </header>

      <section className="space-y-4">
        <p>
          The E-7 is a work visa for foreign nationals who sign a contract with
          a Korean employer for a professional or skilled occupation designated
          by the Ministry of Justice (MOJ). Its formal name is{" "}
          <strong>Foreign National of Special Ability (E-7)</strong>. It covers
          a wide range of people, from engineers, IT developers, designers, and
          researchers with a master&apos;s degree or a bachelor&apos;s plus
          experience, to workers who first came on a non-professional visa such
          as E-9 and later convert to a skilled category after several years of
          legal employment. The maximum single stay is 3 years, and it is
          renewable.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-[color:var(--color-text-primary)]">
          1. What the E-7 is — who qualifies
        </h2>
        <p>
          Two things matter most. First, the occupation must be on the list the
          MOJ designates; not just any job qualifies. Second, a Korean employer
          must sponsor you. <strong>Self-sponsorship is not allowed</strong>, so
          a freelancer cannot sponsor themselves.
        </p>
        <p>
          In practice the E-7 is the route for the professional or skilled
          foreign talent a Korean company wants to hire. Typical paths are
          converting from graduate study to local employment, transferring from
          an overseas headquarters to a Korean entity, or a long-serving skilled
          worker moving up to a skilled grade.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-[color:var(--color-text-primary)]">
          2. The four subcategories (E-7-1 to E-7-4)
        </h2>
        <p>
          The E-7 splits into four tracks by skill level and target group. In
          particular, E-7-4 runs on a points system (K-Point) and is a
          settlement path for E-9, E-10, or H-2 holders who convert after 4+
          years of legal employment in Korea.
        </p>
        <div className="overflow-hidden rounded-xl border border-[color:var(--color-border-subtle)] bg-[color:var(--color-bg-elevated)]">
          <table className="w-full text-sm">
            <thead className="text-xs uppercase tracking-wider text-[color:var(--color-text-tertiary)]">
              <tr>
                <th className="px-4 py-2 text-left font-medium">Type</th>
                <th className="px-4 py-2 text-left font-medium">Category</th>
                <th className="px-4 py-2 text-left font-medium">
                  Occupations · notes
                </th>
              </tr>
            </thead>
            <tbody className="text-[color:var(--color-text-secondary)]">
              <tr className="border-t border-[color:var(--color-border-subtle)]">
                <td className="px-4 py-2 font-medium">E-7-1</td>
                <td className="px-4 py-2">Professionals</td>
                <td className="px-4 py-2">
                  67 occupations (managers, engineers, IT specialists,
                  designers, researchers, etc.)
                </td>
              </tr>
              <tr className="border-t border-[color:var(--color-border-subtle)]">
                <td className="px-4 py-2 font-medium">E-7-2</td>
                <td className="px-4 py-2">Semi-professionals</td>
                <td className="px-4 py-2">10 occupations</td>
              </tr>
              <tr className="border-t border-[color:var(--color-border-subtle)]">
                <td className="px-4 py-2 font-medium">E-7-3</td>
                <td className="px-4 py-2">General skilled</td>
                <td className="px-4 py-2">10 occupations</td>
              </tr>
              <tr className="border-t border-[color:var(--color-border-subtle)]">
                <td className="px-4 py-2 font-medium">E-7-4</td>
                <td className="px-4 py-2">Skilled workers</td>
                <td className="px-4 py-2">
                  Points system (K-Point) · convert after 4+ years on
                  E-9/E-10/H-2 · 2026 quota 33,000
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-[color:var(--color-text-primary)]">
          3. The 2026 salary standard — gross annual
        </h2>
        <p>
          The MOJ announced the 2026 salary standard on 29 December 2025, and it
          applies from 2026-02-01 to 12-31. The figures below are gross annual
          salary.
        </p>
        <div className="overflow-hidden rounded-xl border border-[color:var(--color-border-subtle)] bg-[color:var(--color-bg-elevated)]">
          <table className="w-full text-sm">
            <thead className="text-xs uppercase tracking-wider text-[color:var(--color-text-tertiary)]">
              <tr>
                <th className="px-4 py-2 text-left font-medium">Type</th>
                <th className="px-4 py-2 text-right font-medium">
                  2026 minimum (gross)
                </th>
                <th className="px-4 py-2 text-right font-medium">
                  YoY change
                </th>
              </tr>
            </thead>
            <tbody className="text-[color:var(--color-text-secondary)] tabular-nums">
              <tr className="border-t border-[color:var(--color-border-subtle)]">
                <td className="px-4 py-2">E-7-1 Professionals</td>
                <td className="px-4 py-2 text-right">
                  ≈ KRW 31.12 million+
                </td>
                <td className="px-4 py-2 text-right">+≈ 2.45M</td>
              </tr>
              <tr className="border-t border-[color:var(--color-border-subtle)]">
                <td className="px-4 py-2">E-7-2 / E-7-3</td>
                <td className="px-4 py-2 text-right">
                  ≈ KRW 25.89 million+ each
                </td>
                <td className="px-4 py-2 text-right">+≈ 0.74M</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          One key point: only <strong>base pay and fixed allowances</strong>{" "}
          count toward the standard. Reimbursement items such as meals or
          transport are excluded. Fall short and the visa is refused or not
          renewed, so check how the contract is structured in advance.
        </p>
        <p>
          The <strong>GNI rule</strong> is worth knowing too. Since April 2025
          the same salary standard applies regardless of company size. However,
          large firms may use 80% of the prior-year per-capita GNI (roughly KRW
          39 million, approximate), while SMEs, non-capital-region companies,
          and ventures can be relaxed to 70%. A high-income exception (salary
          at least 1.5x GNI with a ministry recommendation, or 3x or more)
          waives the education and experience requirements. GNI amounts change
          each year, so treat these as ballpark figures.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-[color:var(--color-text-primary)]">
          4. General eligibility
        </h2>
        <ul className="list-inside list-disc space-y-1.5">
          <li>
            <strong>Degree / experience</strong>: a master&apos;s degree or
            higher, or a bachelor&apos;s plus 1 year of related experience, or 5
            years of related experience.
          </li>
          <li>
            <strong>Employer sponsor</strong>: required. No self-sponsorship.
            The employer obtains a Certificate for Confirmation of Visa Issuance
            (CSR), and you then apply at an overseas mission. The CSR is valid
            for 3 months.
          </li>
          <li>
            <strong>The 20% rule</strong>: in principle, foreigners may make up
            no more than 20% of the domestic employment-insurance insured. In
            effect, hiring 1 foreigner requires 5 Korean nationals.
          </li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-[color:var(--color-text-primary)]">
          5. The Top-Tier visa — advanced-field fast track
        </h2>
        <p>
          Introduced on 2 April 2025, the Top-Tier visa is a track for top
          talent in advanced fields such as semiconductors, bio, secondary
          batteries, displays, robots, and the defense industry. It is
          structured in stages as{" "}
          <strong>D-10-T (job seeking) → E-7-T (employment) → F-2-T (residence)</strong>.
        </p>
        <p>
          The biggest advantage is permanent residence. Top-Tier holders can
          apply for F-5 permanent residence in <strong>3 years</strong> rather
          than the usual 6 — the aim being to settle advanced-field talent
          quickly.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-[color:var(--color-text-primary)]">
          6. From E-7 to F-2-7 and F-5 — long-term settlement
        </h2>
        <p>
          The E-7 is not an endpoint but a stepping stone toward settlement.
          After staying 1+ year on an E-7 and reaching 80 points on the points
          system, you can convert to the{" "}
          <Link
            href={`/${locale}/f2-residence-visa`}
            className="text-indigo-300 underline-offset-2 hover:underline"
          >
            F-2-7 residence visa
          </Link>
          , and later to F-5 permanent residence. Education, income, age, and
          Korean ability are all scored, so it helps to estimate your score in
          advance with the F-2-7 points calculator.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-[color:var(--color-text-primary)]">
          7. Common rejection reasons and how to prepare
        </h2>
        <p>
          The most frequent rejection is an{" "}
          <strong>occupation–degree mismatch</strong>. The occupation code you
          apply under must line up with your job duties and academic background.
          Apply for an occupation far from your field and you may be refused for
          failing to prove the expertise the role requires. Prepare so that the
          job description, degree, and experience certificate all point to the
          same occupation.
        </p>
        <p>
          Next most common are falling short of the salary standard and breaching
          the 20% rule (too many foreigners relative to Korean nationals). Before
          applying, confirm the contract base pay clears that year&apos;s
          threshold and that the company has enough Korean insured employees.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-[color:var(--color-text-primary)]">
          What may change (planning stage)
        </h2>
        <p>
          On 3 March 2026 the MOJ announced a &ldquo;2030 immigration policy
          future strategy.&rdquo; It included directions such as creating a new
          E-7-M (manufacturing) category and simplifying 39 employment visas
          into 3 skill grades. This is an announced plan, however, and the
          implementation details are not finalized. Always re-check the official
          notices at the time you apply.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-[color:var(--color-text-primary)]">
          Frequently asked questions
        </h2>
        <div className="space-y-3">
          <p>
            <strong>Q. Which visa do Indian IT developers use?</strong>
            <br />
            India is not covered by the Employment Permit System (EPS, E-9), so
            for IT and engineering professionals the E-7 is effectively the main
            route (widely used in the Pangyo and Gangnam IT scene). The
            Korea–India CEPA allows employment across 163 occupations.
          </p>
          <p>
            <strong>Q. What happens if I fall short of the salary standard?</strong>
            <br />
            The visa is refused or not renewed. Only base pay and fixed
            allowances count — reimbursement items such as meals or transport are
            excluded — so check the contract structure in advance.
          </p>
          <p>
            <strong>Q. Can I apply as my own sponsor?</strong>
            <br />
            No. A Korean employer must sponsor you, obtain the CSR, and then you
            apply at an overseas mission (the CSR is valid for 3 months).
          </p>
          <p>
            <strong>Q. Can the E-7 lead to permanent residence?</strong>
            <br />
            Yes. With 1+ year on an E-7 and 80 points you move to the F-2-7
            residence visa, then to F-5 permanent residence. Top-Tier holders can
            apply for F-5 in just 3 years.
          </p>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-2xl font-semibold text-[color:var(--color-text-primary)]">
          Wrap-up · related links
        </h2>
        <p>
          In short, the E-7 is the broadest work route for professional and
          skilled foreign talent to establish themselves in Korea. Targets and
          requirements differ by type (E-7-1 to E-7-4), and the 2026 salary
          standard, employer sponsorship, the 20% rule, and occupation alignment
          are the key gates. If you are aiming for long-term settlement, also
          consider F-2-7 and F-5; for advanced fields, the Top-Tier track.
        </p>
        <ul className="list-inside list-disc space-y-1.5">
          <li>
            <Link
              href={`/${locale}/f2-residence-visa`}
              className="text-indigo-300 underline-offset-2 hover:underline"
            >
              F-2-7 residence points
            </Link>{" "}
            — score the next step after E-7
          </li>
          <li>
            <Link
              href={`/${locale}/guide/foreign-work-visa-korea`}
              className="text-indigo-300 underline-offset-2 hover:underline"
            >
              Korea work visa hub by country
            </Link>{" "}
            — routes by country of origin
          </li>
          <li>
            <Link
              href={`/${locale}/guide/eps-e9-work-visa`}
              className="text-indigo-300 underline-offset-2 hover:underline"
            >
              E-9 Employment Permit System guide
            </Link>{" "}
            — the route to converting into E-7-4
          </li>
        </ul>
        <p className="text-sm text-[color:var(--color-text-tertiary)]">
          Sources: MOJ HiKorea (hikorea.go.kr), Ministry of Justice. Salary
          standards, occupations, and quotas are updated yearly — always confirm
          through official channels before applying. This article is general
          information, not legal advice.
        </p>
      </section>
    </article>
  );
}

function ContentZh({ locale }: { locale: string }): React.ReactElement {
  return (
    <article className="space-y-8 leading-relaxed text-[color:var(--color-text-secondary)]">
      <header>
        <p className="text-xs font-medium uppercase tracking-wider text-[color:var(--color-text-tertiary)]">
          外国人 · 工作签证
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-[color:var(--color-text-primary)] md:text-4xl">
          韩国E-7专业工作签证完全指南2026(薪资标准·类型·积分制)
        </h1>
        <p className="mt-4 text-sm text-[color:var(--color-text-tertiary)]">
          适用2026年薪资标准(2026-02-01~12-31)。最后更新 2026-07-12。
        </p>
      </header>

      <section className="space-y-4">
        <p>
          E-7是为与韩国雇主签约、从事法务部指定的专业或熟练职种的外国人而设的工作签证。正式名称为
          <strong>特定活动(E-7, Foreign National of Special Ability)</strong>。
          适用对象十分广泛，从拥有硕士以上学位、或学士学位加相关经历的工程师·IT开发者·设计师·研究员，到以E-9等非专业签证在韩合法工作数年后转为熟练技能人力的人群。单次最长停留期为3年，可延长。
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-[color:var(--color-text-primary)]">
          1. E-7是什么 — 谁是适用对象
        </h2>
        <p>
          关键有两点。第一，职种必须在法务部指定的清单内，并非任何工作都可以。第二，必须由韩国雇主担任担保方。像自由职业者那样把自己作为担保方的
          <strong>自我担保是不允许的</strong>。
        </p>
        <p>
          因此E-7是面向&ldquo;韩国公司希望雇用的专业或熟练外国人力&rdquo;的通道。典型情形包括：研究生留学后转为在韩就业、从海外总部外派至韩国法人、以及长期在现场工作的技能人力晋升为熟练等级。
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-[color:var(--color-text-primary)]">
          2. 四个子类别(E-7-1 ~ E-7-4)
        </h2>
        <p>
          E-7按熟练程度与适用对象分为四条路线。其中E-7-4采用积分制(K-Point)运作，是E-9·E-10·H-2持有者在韩合法就业满4年以上后转换的定居型路径。
        </p>
        <div className="overflow-hidden rounded-xl border border-[color:var(--color-border-subtle)] bg-[color:var(--color-bg-elevated)]">
          <table className="w-full text-sm">
            <thead className="text-xs uppercase tracking-wider text-[color:var(--color-text-tertiary)]">
              <tr>
                <th className="px-4 py-2 text-left font-medium">类型</th>
                <th className="px-4 py-2 text-left font-medium">分类</th>
                <th className="px-4 py-2 text-left font-medium">
                  职种数 · 特点
                </th>
              </tr>
            </thead>
            <tbody className="text-[color:var(--color-text-secondary)]">
              <tr className="border-t border-[color:var(--color-border-subtle)]">
                <td className="px-4 py-2 font-medium">E-7-1</td>
                <td className="px-4 py-2">专业人力</td>
                <td className="px-4 py-2">
                  67个职种(管理者·工程师·IT专家·设计师·研究员等)
                </td>
              </tr>
              <tr className="border-t border-[color:var(--color-border-subtle)]">
                <td className="px-4 py-2 font-medium">E-7-2</td>
                <td className="px-4 py-2">准专业人力</td>
                <td className="px-4 py-2">10个职种</td>
              </tr>
              <tr className="border-t border-[color:var(--color-border-subtle)]">
                <td className="px-4 py-2 font-medium">E-7-3</td>
                <td className="px-4 py-2">一般技能人力</td>
                <td className="px-4 py-2">10个职种</td>
              </tr>
              <tr className="border-t border-[color:var(--color-border-subtle)]">
                <td className="px-4 py-2 font-medium">E-7-4</td>
                <td className="px-4 py-2">熟练技能人力</td>
                <td className="px-4 py-2">
                  积分制(K-Point) · E-9/E-10/H-2在韩满4年+后转换 · 2026年配额3.3万人
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-[color:var(--color-text-primary)]">
          3. 2026年薪资标准 — 税前年薪
        </h2>
        <p>
          法务部于2025年12月29日公布了2026年薪资标准，适用期为2026-02-01至12-31。以下为税前年薪基准。
        </p>
        <div className="overflow-hidden rounded-xl border border-[color:var(--color-border-subtle)] bg-[color:var(--color-bg-elevated)]">
          <table className="w-full text-sm">
            <thead className="text-xs uppercase tracking-wider text-[color:var(--color-text-tertiary)]">
              <tr>
                <th className="px-4 py-2 text-left font-medium">类型</th>
                <th className="px-4 py-2 text-right font-medium">
                  2026最低年薪(税前)
                </th>
                <th className="px-4 py-2 text-right font-medium">较上年</th>
              </tr>
            </thead>
            <tbody className="text-[color:var(--color-text-secondary)] tabular-nums">
              <tr className="border-t border-[color:var(--color-border-subtle)]">
                <td className="px-4 py-2">E-7-1 专业人力</td>
                <td className="px-4 py-2 text-right">约3,112万韩元以上</td>
                <td className="px-4 py-2 text-right">+约245万</td>
              </tr>
              <tr className="border-t border-[color:var(--color-border-subtle)]">
                <td className="px-4 py-2">E-7-2 / E-7-3</td>
                <td className="px-4 py-2 text-right">各约2,589万韩元以上</td>
                <td className="px-4 py-2 text-right">+约74万</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          重要一点。薪资标准仅认可<strong>基本工资与固定津贴</strong>，餐费·交通费等实报实销项目不计入。若未达标，将被拒发或拒绝延期，因此需提前确认合同构成。
        </p>
        <p>
          <strong>GNI规定</strong>也值得了解。自2025年4月起，无论公司规模均适用相同薪资标准。不过，大企业等可按上年人均GNI的80%(大约3,900万韩元上下)为基准，中小·非首都圈·风投企业则可放宽至70%。若薪资达到GNI的1.5倍以上并有部门推荐、或达到3倍以上等高收入例外情形，则可免除学历·经历要求。(GNI金额每年变动，此处为大致数值。)
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-[color:var(--color-text-primary)]">
          4. 一般资格要件
        </h2>
        <ul className="list-inside list-disc space-y-1.5">
          <li>
            <strong>学历·经历</strong>：硕士以上学位，或学士学位+相关1年经历，或相关5年经历，三者取其一。
          </li>
          <li>
            <strong>雇主担保</strong>：必需。不可自我担保。由雇主取得签证发放认定书(CSR, Certificate
            for Confirmation of Visa Issuance)后，再向驻外使领馆申请。CSR有效期为3个月。
          </li>
          <li>
            <strong>20%规则</strong>：原则上外国人雇用人数不得超过本国就业保险被保险人数的20%。也就是说，雇用1名外国人需要5名本国人。
          </li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-[color:var(--color-text-primary)]">
          5. Top-Tier签证 — 尖端领域快速通道
        </h2>
        <p>
          2025年4月2日引入的Top-Tier签证，是面向半导体·生物·二次电池·显示器·机器人·国防产业等尖端领域优秀人才的通道。按阶段构成为
          <strong>D-10-T(求职) → E-7-T(就业) → F-2-T(居住)</strong>。
        </p>
        <p>
          最大优势在于永住权。Top-Tier可在<strong>3年内</strong>申请F-5永住，而非通常的6年，意在让尖端领域人才快速定居。
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-[color:var(--color-text-primary)]">
          6. 从E-7到F-2-7·F-5 — 长期定居
        </h2>
        <p>
          E-7本身并非终点，而是通往定居的跳板。以E-7停留满1年以上并在积分制中达到80分，即可转换为
          <Link
            href={`/${locale}/f2-residence-visa`}
            className="text-indigo-300 underline-offset-2 hover:underline"
          >
            F-2-7居住签证
          </Link>
          ，之后再衔接F-5永住。学历·收入·年龄·韩语能力等均折算为分数，因此最好先用F-2-7积分计算器估算自己的分数。
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-[color:var(--color-text-primary)]">
          7. 常见拒签理由与应对
        </h2>
        <p>
          最常见的拒签理由是<strong>职种与学历不匹配</strong>。申请的职种代码须与本人的职务·学历背景相符。例如申请与专业相去甚远的职种，可能会以&ldquo;未能证明履行该职种所需的专业性&rdquo;为由被拒。请让职务说明书·学位·经历证明与申请职种一脉相承。
        </p>
        <p>
          其次常见的是薪资未达标、违反20%规则(外国人相对本国人比例过高)。申请前请确认合同基本工资是否超过当年标准、公司本国被保险人数是否充足。
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-[color:var(--color-text-primary)]">
          未来可能的变化(规划阶段)
        </h2>
        <p>
          2026年3月3日，法务部公布了&ldquo;2030移民政策未来战略&rdquo;，其中包含新设E-7-M(制造)、将39种就业签证简化为3个熟练等级等方向。但这属于已公布的规划，实施细节尚未确定。申请时请务必再次确认官方公告。
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-[color:var(--color-text-primary)]">
          常见问题
        </h2>
        <div className="space-y-3">
          <p>
            <strong>Q. 印度IT开发者使用哪种签证？</strong>
            <br />
            印度不属于雇佣许可制(EPS, E-9)对象国，因此IT·工程专业人才实际上以E-7为主要路径(在板桥·江南IT业界十分普遍)。凭借韩-印CEPA，可在163个职种就业。
          </p>
          <p>
            <strong>Q. 薪资未达标会怎样？</strong>
            <br />
            将被拒发或拒绝延期。标准仅认可基本工资与固定津贴，餐费·交通费等实报实销项目不计入，因此请提前确认合同构成。
          </p>
          <p>
            <strong>Q. 可以自我担保申请吗？</strong>
            <br />
            不可以。必须由韩国雇主担任担保方并取得CSR后，再向驻外使领馆申请(CSR有效期3个月)。
          </p>
          <p>
            <strong>Q. E-7能一路走到永住吗？</strong>
            <br />
            可以。E-7满1年以上+80分即可转F-2-7居住签证，之后衔接F-5永住。若为Top-Tier，可在3年内申请F-5。
          </p>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-2xl font-semibold text-[color:var(--color-text-primary)]">
          结语 · 相关链接
        </h2>
        <p>
          总而言之，E-7是专业·熟练外国人力在韩国立足的最宽广就业通道。对象与要件因类型(E-7-1~4)而异，2026薪资标准·雇主担保·20%规则·职种匹配是关键关卡。若着眼长期定居可一并考虑F-2-7·F-5；若属尖端领域可考虑Top-Tier通道。
        </p>
        <ul className="list-inside list-disc space-y-1.5">
          <li>
            <Link
              href={`/${locale}/f2-residence-visa`}
              className="text-indigo-300 underline-offset-2 hover:underline"
            >
              F-2-7居住签证积分制
            </Link>{" "}
            — 计算E-7下一步的分数
          </li>
          <li>
            <Link
              href={`/${locale}/guide/foreign-work-visa-korea`}
              className="text-indigo-300 underline-offset-2 hover:underline"
            >
              分国家韩国工作签证枢纽
            </Link>{" "}
            — 按出身国家的路径指引
          </li>
          <li>
            <Link
              href={`/${locale}/guide/eps-e9-work-visa`}
              className="text-indigo-300 underline-offset-2 hover:underline"
            >
              E-9雇佣许可制指南
            </Link>{" "}
            — 非专业就业后转E-7-4的路径
          </li>
        </ul>
        <p className="text-sm text-[color:var(--color-text-tertiary)]">
          来源：法务部HiKorea(hikorea.go.kr)、法务部。薪资标准·职种·配额每年更新，申请前请务必通过官方渠道确认。本文为一般信息，非法律咨询。
        </p>
      </section>
    </article>
  );
}

function ContentVi({ locale }: { locale: string }): React.ReactElement {
  return (
    <article className="space-y-8 leading-relaxed text-[color:var(--color-text-secondary)]">
      <header>
        <p className="text-xs font-medium uppercase tracking-wider text-[color:var(--color-text-tertiary)]">
          Người nước ngoài · Visa lao động
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-[color:var(--color-text-primary)] md:text-4xl">
          Visa lao động chuyên môn E-7 Hàn Quốc: Hướng dẫn 2026 (Lương, Loại,
          Điểm)
        </h1>
        <p className="mt-4 text-sm text-[color:var(--color-text-tertiary)]">
          Áp dụng chuẩn lương 2026 (2026-02-01~12-31). Cập nhật lần cuối
          2026-07-12.
        </p>
      </header>

      <section className="space-y-4">
        <p>
          E-7 là visa lao động dành cho người nước ngoài ký hợp đồng với chủ sử
          dụng lao động Hàn Quốc trong các ngành nghề chuyên môn hoặc lành nghề
          do Bộ Tư pháp chỉ định. Tên chính thức là{" "}
          <strong>Hoạt động đặc định (E-7, Foreign National of Special Ability)</strong>.
          Đối tượng rất rộng, từ kỹ sư, lập trình viên IT, nhà thiết kế, nghiên
          cứu viên có bằng thạc sĩ trở lên hoặc bằng cử nhân kèm kinh nghiệm, cho
          đến người từng sang bằng visa phi chuyên môn như E-9 rồi chuyển sang
          diện kỹ năng lành nghề sau nhiều năm làm việc hợp pháp. Thời gian lưu
          trú tối đa một lần là 3 năm và có thể gia hạn.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-[color:var(--color-text-primary)]">
          1. E-7 là gì — ai thuộc diện
        </h2>
        <p>
          Có hai điểm cốt lõi. Thứ nhất, ngành nghề phải nằm trong danh mục do
          Bộ Tư pháp chỉ định, không phải công việc nào cũng được. Thứ hai, phải
          có chủ sử dụng lao động Hàn Quốc đứng ra bảo lãnh.{" "}
          <strong>Tự bảo lãnh là không được phép</strong>, nên người làm tự do
          không thể tự bảo lãnh cho chính mình.
        </p>
        <p>
          Vì vậy E-7 là con đường dành cho nhân lực nước ngoài chuyên môn hoặc
          lành nghề mà một công ty Hàn Quốc muốn tuyển. Các trường hợp điển hình
          là: chuyển từ du học sau đại học sang làm việc trong nước, được cử từ
          trụ sở nước ngoài sang pháp nhân Hàn Quốc, hoặc người làm nghề lâu năm
          tại hiện trường được nâng lên bậc lành nghề.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-[color:var(--color-text-primary)]">
          2. Bốn loại phụ (E-7-1 ~ E-7-4)
        </h2>
        <p>
          E-7 chia thành bốn nhánh theo mức độ tay nghề và đối tượng. Đặc biệt
          E-7-4 vận hành theo hệ thống tính điểm (K-Point), là con đường định cư
          cho người giữ E-9, E-10 hoặc H-2 chuyển đổi sau hơn 4 năm làm việc hợp
          pháp tại Hàn Quốc.
        </p>
        <div className="overflow-hidden rounded-xl border border-[color:var(--color-border-subtle)] bg-[color:var(--color-bg-elevated)]">
          <table className="w-full text-sm">
            <thead className="text-xs uppercase tracking-wider text-[color:var(--color-text-tertiary)]">
              <tr>
                <th className="px-4 py-2 text-left font-medium">Loại</th>
                <th className="px-4 py-2 text-left font-medium">Phân loại</th>
                <th className="px-4 py-2 text-left font-medium">
                  Số ngành · đặc điểm
                </th>
              </tr>
            </thead>
            <tbody className="text-[color:var(--color-text-secondary)]">
              <tr className="border-t border-[color:var(--color-border-subtle)]">
                <td className="px-4 py-2 font-medium">E-7-1</td>
                <td className="px-4 py-2">Nhân lực chuyên môn</td>
                <td className="px-4 py-2">
                  67 ngành (quản lý, kỹ sư, chuyên gia IT, nhà thiết kế, nghiên
                  cứu viên...)
                </td>
              </tr>
              <tr className="border-t border-[color:var(--color-border-subtle)]">
                <td className="px-4 py-2 font-medium">E-7-2</td>
                <td className="px-4 py-2">Nhân lực bán chuyên môn</td>
                <td className="px-4 py-2">10 ngành</td>
              </tr>
              <tr className="border-t border-[color:var(--color-border-subtle)]">
                <td className="px-4 py-2 font-medium">E-7-3</td>
                <td className="px-4 py-2">Nhân lực kỹ năng thường</td>
                <td className="px-4 py-2">10 ngành</td>
              </tr>
              <tr className="border-t border-[color:var(--color-border-subtle)]">
                <td className="px-4 py-2 font-medium">E-7-4</td>
                <td className="px-4 py-2">Nhân lực kỹ năng lành nghề</td>
                <td className="px-4 py-2">
                  Hệ thống điểm (K-Point) · chuyển sau 4 năm+ trên E-9/E-10/H-2 ·
                  hạn ngạch 2026 là 33.000 người
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-[color:var(--color-text-primary)]">
          3. Chuẩn lương 2026 — lương năm trước thuế
        </h2>
        <p>
          Bộ Tư pháp công bố chuẩn lương 2026 vào ngày 29-12-2025, áp dụng từ
          2026-02-01 đến 12-31. Dưới đây là mức lương năm trước thuế.
        </p>
        <div className="overflow-hidden rounded-xl border border-[color:var(--color-border-subtle)] bg-[color:var(--color-bg-elevated)]">
          <table className="w-full text-sm">
            <thead className="text-xs uppercase tracking-wider text-[color:var(--color-text-tertiary)]">
              <tr>
                <th className="px-4 py-2 text-left font-medium">Loại</th>
                <th className="px-4 py-2 text-right font-medium">
                  Lương tối thiểu 2026 (trước thuế)
                </th>
                <th className="px-4 py-2 text-right font-medium">
                  So với năm trước
                </th>
              </tr>
            </thead>
            <tbody className="text-[color:var(--color-text-secondary)] tabular-nums">
              <tr className="border-t border-[color:var(--color-border-subtle)]">
                <td className="px-4 py-2">E-7-1 chuyên môn</td>
                <td className="px-4 py-2 text-right">
                  khoảng 31,12 triệu won trở lên
                </td>
                <td className="px-4 py-2 text-right">+khoảng 2,45 triệu</td>
              </tr>
              <tr className="border-t border-[color:var(--color-border-subtle)]">
                <td className="px-4 py-2">E-7-2 / E-7-3</td>
                <td className="px-4 py-2 text-right">
                  mỗi loại khoảng 25,89 triệu won trở lên
                </td>
                <td className="px-4 py-2 text-right">+khoảng 0,74 triệu</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          Một điểm quan trọng. Chuẩn lương chỉ tính{" "}
          <strong>lương cơ bản và các khoản phụ cấp cố định</strong>. Các khoản
          hoàn phí thực chi như tiền ăn, đi lại không được tính. Nếu không đạt,
          visa sẽ bị từ chối cấp hoặc từ chối gia hạn, nên cần kiểm tra cơ cấu
          hợp đồng trước.
        </p>
        <p>
          <strong>Quy định GNI</strong> cũng đáng lưu ý. Từ tháng 4-2025, cùng
          một chuẩn lương được áp dụng bất kể quy mô công ty. Tuy nhiên, doanh
          nghiệp lớn có thể lấy 80% GNI bình quân đầu người của năm trước (khoảng
          39 triệu won, ước chừng), còn doanh nghiệp vừa và nhỏ, ngoài vùng thủ
          đô, hoặc startup có thể được nới xuống 70%. Với ngoại lệ thu nhập cao
          (lương từ 1,5 lần GNI kèm đề xuất của bộ ngành, hoặc từ 3 lần trở lên),
          yêu cầu về học vấn và kinh nghiệm được miễn. (Số tiền GNI thay đổi mỗi
          năm nên đây chỉ là con số ước lượng.)
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-[color:var(--color-text-primary)]">
          4. Điều kiện chung
        </h2>
        <ul className="list-inside list-disc space-y-1.5">
          <li>
            <strong>Học vấn · kinh nghiệm</strong>: bằng thạc sĩ trở lên, hoặc
            bằng cử nhân + 1 năm kinh nghiệm liên quan, hoặc 5 năm kinh nghiệm
            liên quan.
          </li>
          <li>
            <strong>Chủ bảo lãnh</strong>: bắt buộc. Không được tự bảo lãnh. Chủ
            sử dụng lao động nhận Giấy xác nhận cấp visa (CSR, Certificate for
            Confirmation of Visa Issuance) rồi nộp hồ sơ tại cơ quan đại diện ở
            nước ngoài. CSR có hiệu lực 3 tháng.
          </li>
          <li>
            <strong>Quy tắc 20%</strong>: về nguyên tắc, người nước ngoài không
            được vượt quá 20% số người tham gia bảo hiểm việc làm là người bản
            xứ. Nghĩa là để tuyển 1 người nước ngoài cần 5 người Hàn Quốc.
          </li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-[color:var(--color-text-primary)]">
          5. Visa Top-Tier — tuyến nhanh cho lĩnh vực công nghệ cao
        </h2>
        <p>
          Được đưa vào áp dụng ngày 2-4-2025, visa Top-Tier là tuyến dành cho
          nhân tài xuất sắc trong các lĩnh vực công nghệ cao như bán dẫn, sinh
          học, pin thứ cấp, màn hình, robot và công nghiệp quốc phòng. Cấu trúc
          theo từng bước là{" "}
          <strong>D-10-T (tìm việc) → E-7-T (làm việc) → F-2-T (cư trú)</strong>.
        </p>
        <p>
          Lợi thế lớn nhất là quyền thường trú. Người giữ Top-Tier có thể xin
          thường trú F-5 trong <strong>3 năm</strong> thay vì 6 năm như thông
          thường, nhằm giúp nhân tài lĩnh vực công nghệ cao định cư nhanh.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-[color:var(--color-text-primary)]">
          6. Từ E-7 lên F-2-7 · F-5 — định cư lâu dài
        </h2>
        <p>
          E-7 tự thân không phải điểm cuối mà là bàn đạp tiến tới định cư. Sau
          khi lưu trú từ 1 năm trở lên bằng E-7 và đạt 80 điểm trong hệ thống
          tính điểm, bạn có thể chuyển sang{" "}
          <Link
            href={`/${locale}/f2-residence-visa`}
            className="text-indigo-300 underline-offset-2 hover:underline"
          >
            visa cư trú F-2-7
          </Link>
          , rồi tiếp đến thường trú F-5. Học vấn, thu nhập, độ tuổi, năng lực
          tiếng Hàn đều được quy đổi thành điểm, nên tốt nhất hãy ước tính điểm
          của mình trước bằng công cụ tính điểm F-2-7.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-[color:var(--color-text-primary)]">
          7. Lý do bị từ chối thường gặp và cách chuẩn bị
        </h2>
        <p>
          Lý do từ chối phổ biến nhất là{" "}
          <strong>ngành nghề không khớp với bằng cấp</strong>. Mã ngành nghề bạn
          nộp phải khớp với công việc và nền tảng học vấn của bản thân. Ví dụ nộp
          một ngành xa với chuyên môn có thể bị từ chối vì &ldquo;không chứng
          minh được chuyên môn cần thiết để làm ngành đó&rdquo;. Hãy chuẩn bị sao
          cho bản mô tả công việc, bằng cấp và giấy chứng nhận kinh nghiệm đều
          liền mạch với ngành nghề đăng ký.
        </p>
        <p>
          Tiếp theo hay gặp là không đạt chuẩn lương và vi phạm quy tắc 20% (tỷ
          lệ người nước ngoài quá cao so với người bản xứ). Trước khi nộp, hãy
          xác nhận lương cơ bản trong hợp đồng có vượt ngưỡng của năm đó không và
          công ty có đủ số người bản xứ tham gia bảo hiểm không.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-[color:var(--color-text-primary)]">
          Những điều có thể thay đổi (giai đoạn kế hoạch)
        </h2>
        <p>
          Ngày 3-3-2026, Bộ Tư pháp công bố &ldquo;Chiến lược tương lai chính
          sách nhập cư 2030&rdquo;. Nội dung bao gồm các hướng như lập mới E-7-M
          (chế tạo) và đơn giản hóa 39 loại visa lao động thành 3 bậc tay nghề.
          Tuy nhiên đây là kế hoạch đã công bố, chi tiết thực thi chưa được chốt.
          Tại thời điểm nộp hồ sơ, hãy nhất định kiểm tra lại các thông báo chính
          thức.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-[color:var(--color-text-primary)]">
          Câu hỏi thường gặp
        </h2>
        <div className="space-y-3">
          <p>
            <strong>Q. Lập trình viên IT Ấn Độ dùng visa nào?</strong>
            <br />
            Ấn Độ không thuộc nước đối tượng của Chế độ cấp phép tuyển dụng (EPS,
            E-9), nên với nhân lực IT và kỹ thuật, E-7 thực chất là con đường
            chính (rất phổ biến trong giới IT Pangyo, Gangnam). Nhờ CEPA Hàn -
            Ấn, có thể làm việc trong 163 ngành nghề.
          </p>
          <p>
            <strong>Q. Nếu không đạt chuẩn lương thì sao?</strong>
            <br />
            Visa sẽ bị từ chối cấp hoặc từ chối gia hạn. Chuẩn chỉ tính lương cơ
            bản và phụ cấp cố định, các khoản hoàn phí như tiền ăn, đi lại không
            được tính, nên hãy kiểm tra cơ cấu hợp đồng trước.
          </p>
          <p>
            <strong>Q. Có thể tự bảo lãnh để nộp không?</strong>
            <br />
            Không. Bắt buộc phải có chủ sử dụng lao động Hàn Quốc bảo lãnh, lấy
            CSR rồi mới nộp tại cơ quan đại diện ở nước ngoài (CSR hiệu lực 3
            tháng).
          </p>
          <p>
            <strong>Q. E-7 có thể dẫn tới thường trú không?</strong>
            <br />
            Có. Với E-7 từ 1 năm trở lên + 80 điểm, bạn chuyển sang visa cư trú
            F-2-7, rồi tiếp đến thường trú F-5. Nếu là Top-Tier, có thể xin F-5
            chỉ trong 3 năm.
          </p>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-2xl font-semibold text-[color:var(--color-text-primary)]">
          Kết luận · liên kết liên quan
        </h2>
        <p>
          Tóm lại, E-7 là con đường lao động rộng nhất để nhân lực nước ngoài
          chuyên môn và lành nghề an cư tại Hàn Quốc. Đối tượng và điều kiện khác
          nhau theo loại (E-7-1 đến E-7-4), và chuẩn lương 2026, sự bảo lãnh của
          chủ, quy tắc 20%, độ khớp ngành nghề là những cửa ải then chốt. Nếu
          nhắm định cư lâu dài, hãy cân nhắc thêm F-2-7 · F-5; nếu thuộc lĩnh vực
          công nghệ cao, hãy xem tuyến Top-Tier.
        </p>
        <ul className="list-inside list-disc space-y-1.5">
          <li>
            <Link
              href={`/${locale}/f2-residence-visa`}
              className="text-indigo-300 underline-offset-2 hover:underline"
            >
              Điểm số visa cư trú F-2-7
            </Link>{" "}
            — tính điểm cho bước tiếp theo sau E-7
          </li>
          <li>
            <Link
              href={`/${locale}/guide/foreign-work-visa-korea`}
              className="text-indigo-300 underline-offset-2 hover:underline"
            >
              Trung tâm visa lao động Hàn Quốc theo quốc gia
            </Link>{" "}
            — hướng dẫn theo quốc gia xuất thân
          </li>
          <li>
            <Link
              href={`/${locale}/guide/eps-e9-work-visa`}
              className="text-indigo-300 underline-offset-2 hover:underline"
            >
              Hướng dẫn Chế độ cấp phép tuyển dụng E-9
            </Link>{" "}
            — con đường chuyển sang E-7-4 sau lao động phi chuyên môn
          </li>
        </ul>
        <p className="text-sm text-[color:var(--color-text-tertiary)]">
          Nguồn: HiKorea Bộ Tư pháp (hikorea.go.kr), Bộ Tư pháp. Chuẩn lương,
          ngành nghề và hạn ngạch được cập nhật hằng năm — hãy luôn xác nhận qua
          kênh chính thức trước khi nộp hồ sơ. Bài viết này là thông tin chung,
          không phải tư vấn pháp lý.
        </p>
      </section>
    </article>
  );
}
