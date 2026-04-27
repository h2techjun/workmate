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
    title: locale === "en" ? "Terms of Use — WorkTool" : "이용약관 — WorkTool",
    description:
      locale === "en"
        ? "Use WorkTool freely. Results are reference-only. Verify with a licensed professional before construction or filing."
        : "WorkTool 이용 약관 — 무료로 자유롭게 사용 가능. 결과는 참고용이며 시공·신고 전에는 반드시 전문가 검토가 필요합니다.",
  };
}

export default async function TermsPage({
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
        {isKo ? <TermsKo /> : <TermsEn />}
      </div>
    </main>
  );
}

function TermsKo(): React.ReactElement {
  return (
    <article className="space-y-6 text-[color:var(--color-text-secondary)]">
      <header>
        <h1 className="text-3xl font-bold tracking-tight text-[color:var(--color-text-primary)] md:text-4xl">
          이용약관
        </h1>
        <p className="mt-3 text-sm text-[color:var(--color-text-tertiary)]">
          시행일 2026-04-27
        </p>
      </header>

      <section className="space-y-3 leading-relaxed">
        <h2 className="text-xl font-semibold text-[color:var(--color-text-primary)]">
          1. 서비스 성격
        </h2>
        <p>
          WorkTool은 한국 표준(KS·KEC·건축법·세법 등)에 기반한 계산
          참고 도구를 무료로 제공합니다. 회원가입은 없으며 누구나 자유롭게
          이용할 수 있습니다.
        </p>
      </section>

      <section className="space-y-3 leading-relaxed">
        <h2 className="text-xl font-semibold text-[color:var(--color-text-primary)]">
          2. 결과 활용 시 주의
        </h2>
        <p>
          본 도구의 계산 결과는 <strong>참고용</strong>이며, 다음 분야에서는
          반드시 자격 있는 전문가의 검토를 거쳐야 합니다.
        </p>
        <ul className="list-inside list-disc space-y-1.5 text-sm">
          <li>
            <strong>전기 시공</strong> — 전기안전관리자·전기공사기술자의 검토
            필수. 본 도구는 KEC 일부만 반영하며, 실제 시공 환경에 따라
            추가 보정이 필요합니다.
          </li>
          <li>
            <strong>구조 설계</strong> — 부재 경간 도구는 NDS의 7개 보정계수
            중 일부만 적용한 계획용 결과입니다. 시공 전 구조기술사의 검토
            필수.
          </li>
          <li>
            <strong>세무 신고</strong> — 4대보험·해외주식 양도세 등은 신고
            전 세무사 또는 국세청 상담을 통한 확인이 필요합니다.
          </li>
          <li>
            <strong>인허가</strong> — 단열·계단·기초 등의 결과는 사전 검토용이며,
            실제 인허가 도서 작성은 건축사가 담당해야 합니다.
          </li>
        </ul>
      </section>

      <section className="space-y-3 leading-relaxed">
        <h2 className="text-xl font-semibold text-[color:var(--color-text-primary)]">
          3. 책임 제한
        </h2>
        <p>
          본 도구의 결과를 사용한 시공·설계·신고로 인해 발생한 직간접
          손해에 대해 운영자는 책임지지 않습니다. 도구 사용 자체가
          전문가의 판단을 대체하지 못한다는 점을 사용자가 인지하고
          이용해야 합니다.
        </p>
      </section>

      <section className="space-y-3 leading-relaxed">
        <h2 className="text-xl font-semibold text-[color:var(--color-text-primary)]">
          4. 서비스 변경·중단
        </h2>
        <p className="text-sm">
          운영자는 사전 통지 없이 도구를 추가·변경·중단할 수 있습니다.
          광고 형태와 위치도 운영 정책에 따라 조정될 수 있습니다.
        </p>
      </section>

      <section className="space-y-3 leading-relaxed">
        <h2 className="text-xl font-semibold text-[color:var(--color-text-primary)]">
          5. 지적재산권
        </h2>
        <p className="text-sm">
          본 사이트의 도구·디자인·문서는 운영자에게 지적재산권이
          있습니다. 인용 시 출처를 명시해 주시고, 도구 자체를 복제하여
          상업적으로 재배포하지 마십시오. 결과 화면 캡처와 간단한
          링크 공유는 자유롭습니다.
        </p>
      </section>

      <section className="space-y-3 leading-relaxed">
        <h2 className="text-xl font-semibold text-[color:var(--color-text-primary)]">
          6. 광고
        </h2>
        <p className="text-sm">
          무료 운영을 위해 Google AdSense 등의 광고가 표시됩니다. 광고
          클릭은 사용자의 자유 의사이며, 광고로 인한 거래는 광고주와
          사용자 간의 책임입니다.
        </p>
      </section>

      <section className="space-y-3 leading-relaxed">
        <h2 className="text-xl font-semibold text-[color:var(--color-text-primary)]">
          7. 준거법
        </h2>
        <p className="text-sm">
          본 약관은 대한민국 법률을 따르며, 분쟁 발생 시 운영자
          소재지의 관할 법원에서 처리합니다.
        </p>
      </section>
    </article>
  );
}

function TermsEn(): React.ReactElement {
  return (
    <article className="space-y-6 text-[color:var(--color-text-secondary)]">
      <header>
        <h1 className="text-3xl font-bold tracking-tight text-[color:var(--color-text-primary)] md:text-4xl">
          Terms of Use
        </h1>
        <p className="mt-3 text-sm text-[color:var(--color-text-tertiary)]">
          Effective 2026-04-27
        </p>
      </header>
      <section className="space-y-3 leading-relaxed">
        <h2 className="text-xl font-semibold text-[color:var(--color-text-primary)]">
          1. Service nature
        </h2>
        <p>
          WorkTool provides calculators based on Korean Standards (KS, KEC,
          Korean building code, tax law) free of charge. No sign-up
          required.
        </p>
      </section>
      <section className="space-y-3 leading-relaxed">
        <h2 className="text-xl font-semibold text-[color:var(--color-text-primary)]">
          2. Result usage
        </h2>
        <p>
          Calculator outputs are <strong>for reference only</strong>. A
          licensed professional must review:
        </p>
        <ul className="list-inside list-disc space-y-1.5 text-sm">
          <li>Electrical work — by a certified electrical safety manager.</li>
          <li>Structural span — by a structural engineer (the NDS adjustments are partial).</li>
          <li>Tax filing — by a tax accountant or NTS.</li>
          <li>Building permits — by a licensed architect.</li>
        </ul>
      </section>
      <section className="space-y-3 leading-relaxed">
        <h2 className="text-xl font-semibold text-[color:var(--color-text-primary)]">
          3. Liability
        </h2>
        <p>
          The operator is not liable for direct or indirect damages arising
          from use of these results. Tools do not replace professional
          judgment.
        </p>
      </section>
      <section className="space-y-3 leading-relaxed">
        <h2 className="text-xl font-semibold text-[color:var(--color-text-primary)]">
          4. Changes
        </h2>
        <p className="text-sm">
          Tools may be added, modified, or removed without notice.
        </p>
      </section>
      <section className="space-y-3 leading-relaxed">
        <h2 className="text-xl font-semibold text-[color:var(--color-text-primary)]">
          5. Intellectual property
        </h2>
        <p className="text-sm">
          Tools, designs, and content are the operator&apos;s property.
          Cite the source when quoting. Do not redistribute the tool itself
          commercially. Screenshots and link sharing are fine.
        </p>
      </section>
      <section className="space-y-3 leading-relaxed">
        <h2 className="text-xl font-semibold text-[color:var(--color-text-primary)]">
          6. Ads
        </h2>
        <p className="text-sm">
          Google AdSense and similar services display ads to keep this site
          free. Transactions resulting from clicked ads are between the
          advertiser and the user.
        </p>
      </section>
      <section className="space-y-3 leading-relaxed">
        <h2 className="text-xl font-semibold text-[color:var(--color-text-primary)]">
          7. Governing law
        </h2>
        <p className="text-sm">
          Governed by the laws of the Republic of Korea. Disputes will be
          resolved in courts at the operator&apos;s location.
        </p>
      </section>
    </article>
  );
}
