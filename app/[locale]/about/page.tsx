import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  return {
    title:
      locale === "en"
        ? "About — WorkTool"
        : "WorkTool은 어떤 도구인가요? — 만든 이유와 운영 원칙",
    description:
      locale === "en"
        ? "Why WorkTool exists, who we serve, and the principles behind every calculator."
        : "현장 실무자가 매일 쓰는 계산을 위해 만들었습니다. 운영 철학과 작동 원리를 솔직하게 정리했습니다.",
  };
}

export default async function AboutPage({
  params,
}: PageProps): Promise<React.ReactElement> {
  const { locale } = await params;
  const isKo = locale === "ko";

  return (
    <main className="px-4 pb-16 pt-6 md:px-6 md:pt-12">
      <div className="mx-auto max-w-3xl">
        <nav className="mb-5 flex items-center gap-2 text-sm text-[color:var(--color-text-tertiary)]">
          <Link
            href={`/${locale}`}
            className="inline-flex items-center gap-1 transition-colors hover:text-[color:var(--color-text-primary)]"
          >
            <ChevronLeft className="h-4 w-4" />
            {isKo ? "홈" : "Home"}
          </Link>
        </nav>

        {isKo ? <AboutKo /> : <AboutEn />}
      </div>
    </main>
  );
}

function AboutKo(): React.ReactElement {
  return (
    <article className="prose-content space-y-6 text-[color:var(--color-text-secondary)]">
      <header>
        <h1 className="text-3xl font-bold tracking-tight text-[color:var(--color-text-primary)] md:text-4xl">
          WorkTool은 어떤 도구인가요?
        </h1>
        <p className="mt-3 text-sm text-[color:var(--color-text-tertiary)]">
          최초 작성 2026-04-27 · 운영자: 한국 실무자 한 명
        </p>
      </header>

      <section className="space-y-4 leading-relaxed">
        <p>
          저는 전기·건축 현장에서 일하면서 같은 계산을 매번 반복했습니다. 전선
          굵기 정할 때마다 KEC 표 들춰보고, 4대보험 산정할 때마다 엑셀
          템플릿을 새로 짜고, 2x6 장선이 4미터 갈 수 있는지 기억나지 않아
          미국 표를 한국 단위로 환산하고. 이런 게 일상이었습니다.
        </p>
        <p>
          그래서 만들었습니다. 한국 표준(KS·KEC·건축법)에 정확히 맞춘 도구
          모음을 한곳에. 솔직히 이미 비슷한 도구들이 인터넷에 있긴 합니다.
          그런데 대부분 미국 단위거나, 모바일에서 쓰기 불편하거나, 광고가
          너무 많거나, 결과만 보여주고 어떻게 나왔는지 설명하지 않더군요.
        </p>
        <p>
          WorkTool의 모든 계산기는 <strong>계산 과정을 단계별로 보여줍니다</strong>.
          왜냐하면 결재용 자료에 첨부할 때 근거가 필요하고, 후배한테
          가르칠 때도 공식 보여주는 게 빠르고, 무엇보다 제 자신이
          맞는지 검증할 수 있어야 하니까요.
        </p>
      </section>

      <section className="space-y-3 leading-relaxed">
        <h2 className="text-xl font-semibold text-[color:var(--color-text-primary)]">
          누가 쓰면 좋은가요?
        </h2>
        <ul className="list-inside list-disc space-y-2 text-sm">
          <li>전기공사기능사·산업기사 시험 준비하시는 분 — KEC 표 그대로 따라옵니다</li>
          <li>목조주택 시공자 — 부재 경간·자재 수량·계단·기초 한 번에</li>
          <li>인사·총무 담당자 — 4대보험 한 번에, 2026 요율 자동</li>
          <li>해외주식 양도세 신고자 — 환율 두 번 입력하기 귀찮으신 분</li>
          <li>한국 표준이 필요한 외국인 엔지니어 — 영어 인터페이스 제공</li>
        </ul>
      </section>

      <section className="space-y-3 leading-relaxed">
        <h2 className="text-xl font-semibold text-[color:var(--color-text-primary)]">
          한 가지 분명히 밝혀둡니다
        </h2>
        <p>
          이 도구의 결과는 <strong>참고용</strong>입니다. 특히 구조 계산(부재
          경간)은 NDS의 7개 보정계수 중 일부만 적용했고, 단열은 열교를
          반영하지 않았습니다. 시공 전 반드시 구조사·전기안전관리자·세무사의
          검토를 거쳐야 합니다. 도구로 90%를 잡고, 나머지 10%는 전문가가
          잡는 게 안전한 방식입니다.
        </p>
        <p className="text-sm text-[color:var(--color-text-tertiary)]">
          그래도 계획 단계에서 빠르게 가닥 잡고, 견적서 초안 작성하고,
          학습용으로 쓰기엔 충분합니다. 매일 쓰면서 부족한 부분이 보이면
          개선하고 있습니다.
        </p>
      </section>

      <section className="space-y-3 leading-relaxed">
        <h2 className="text-xl font-semibold text-[color:var(--color-text-primary)]">
          데이터는 어떻게 처리되나요?
        </h2>
        <p>
          입력값은 모두 브라우저에서만 처리됩니다. 서버로 전송되지 않습니다.
          JSON↔CSV 변환기도 같은 방식입니다. 서버에 저장하는 게 없으니
          오프라인에서도 동작하고, 회사 보안 정책상 외부 도구 사용이
          제한된 환경에서도 쓸 수 있습니다.
        </p>
        <p className="text-sm">
          광고는 Google AdSense를 사용합니다. AdSense가 쿠키로 사용자
          관심사를 추적할 수 있는데, 이는{" "}
          <Link
            href="/ko/privacy"
            className="text-indigo-300 underline-offset-2 hover:underline"
          >
            개인정보처리방침
          </Link>
          에서 자세히 다룹니다.
        </p>
      </section>

      <section className="space-y-3 leading-relaxed">
        <h2 className="text-xl font-semibold text-[color:var(--color-text-primary)]">
          앞으로 추가할 도구
        </h2>
        <ul className="list-inside list-disc space-y-1.5 text-sm">
          <li>홈택스 API 연동 사업자등록 휴·폐업 조회 (현재는 체크섬만)</li>
          <li>MSDS 검색 (안전보건공단 DB 연동 검토 중)</li>
          <li>한글→영문 주소 변환 (도로명주소 API 검토 중)</li>
          <li>차단기 + 전선 + 전압강하 통합 회로 설계 도구</li>
          <li>건축 인허가 체크리스트</li>
        </ul>
        <p className="text-sm">
          만들어줬으면 하는 도구가 있으면{" "}
          <Link
            href="/ko/contact"
            className="text-indigo-300 underline-offset-2 hover:underline"
          >
            연락처
          </Link>
          로 알려주세요. 비슷한 요청이 여러 번 오면 우선순위로
          반영합니다.
        </p>
      </section>
    </article>
  );
}

function AboutEn(): React.ReactElement {
  return (
    <article className="space-y-6 text-[color:var(--color-text-secondary)]">
      <header>
        <h1 className="text-3xl font-bold tracking-tight text-[color:var(--color-text-primary)] md:text-4xl">
          About WorkTool
        </h1>
        <p className="mt-3 text-sm text-[color:var(--color-text-tertiary)]">
          First written 2026-04-27 · Operated by a Korean construction professional
        </p>
      </header>

      <section className="space-y-4 leading-relaxed">
        <p>
          I work in electrical and construction sites, and I kept doing the
          same calculations over and over. Looking up wire sizes from KEC
          tables. Recreating Excel templates for Korean payroll insurance.
          Translating American span tables into metric to figure out whether
          a 2x6 joist could span 4 meters.
        </p>
        <p>
          So I built this. A collection of calculators precisely aligned to
          Korean Standards (KS, KEC, building code) in one place. To be
          honest, similar tools exist on the internet. But most use US
          units, are clunky on mobile, are buried under ads, or only show
          the answer without explaining how they got there.
        </p>
        <p>
          Every calculator on WorkTool{" "}
          <strong>shows the calculation steps</strong>. Because you need to
          attach the rationale to approval documents. Because explaining the
          formula is faster than handwaving when teaching someone. Because
          you should be able to verify the result yourself.
        </p>
      </section>

      <section className="space-y-3 leading-relaxed">
        <h2 className="text-xl font-semibold text-[color:var(--color-text-primary)]">
          Who is this for?
        </h2>
        <ul className="list-inside list-disc space-y-2 text-sm">
          <li>Korean electrical contractors and exam takers — KEC tables built in</li>
          <li>Wood frame builders — span, material, stairs, foundation in one place</li>
          <li>HR/payroll administrators — Korean 4-major insurance, 2026 rates</li>
          <li>Foreign stock investors filing Korean capital gains tax</li>
          <li>Foreign engineers needing Korean standards in English</li>
        </ul>
      </section>

      <section className="space-y-3 leading-relaxed">
        <h2 className="text-xl font-semibold text-[color:var(--color-text-primary)]">
          One important caveat
        </h2>
        <p>
          Results are for <strong>reference only</strong>. The structural
          span calculator applies only some of NDS&apos;s seven adjustment
          factors. The insulation calculator ignores thermal bridging. A
          structural engineer, electrical safety manager, or tax accountant
          must review your work before construction or filing. Use this tool
          to nail down 90%; let the expert nail the remaining 10%.
        </p>
      </section>

      <section className="space-y-3 leading-relaxed">
        <h2 className="text-xl font-semibold text-[color:var(--color-text-primary)]">
          How is your data handled?
        </h2>
        <p>
          All inputs are processed in your browser. Nothing is sent to a
          server. The JSON↔CSV converter works the same way. This means
          everything works offline, and you can use it inside corporate
          environments where external tools are restricted.
        </p>
        <p className="text-sm">
          We use Google AdSense for ads. AdSense may track interests via
          cookies — see our{" "}
          <Link
            href="/en/privacy"
            className="text-indigo-300 underline-offset-2 hover:underline"
          >
            Privacy Policy
          </Link>
          .
        </p>
      </section>
    </article>
  );
}
