import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft, Mail } from "lucide-react";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: locale === "en" ? "Contact — WorkTool" : "연락처 — WorkTool",
    description:
      locale === "en"
        ? "How to reach the operator — bug reports, tool requests, partnerships."
        : "WorkTool 운영자 연락처 — 버그 제보, 도구 요청, 제휴 문의.",
  };
}

export default async function ContactPage({
  params,
}: PageProps): Promise<React.ReactElement> {
  const { locale } = await params;
  const isKo = locale === "ko";
  const email = "h2techjun@gmail.com";

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

        {isKo ? (
          <article className="space-y-6 text-[color:var(--color-text-secondary)]">
            <header>
              <h1 className="text-3xl font-bold tracking-tight text-[color:var(--color-text-primary)] md:text-4xl">
                연락처
              </h1>
              <p className="mt-3">
                계산이 이상하거나, 새 도구가 필요하거나, 제휴 제안이
                있으시면 메일 주세요.
              </p>
            </header>

            <section className="space-y-3">
              <a
                href={`mailto:${email}?subject=WorkTool 문의`}
                className="surface-card group inline-flex items-center gap-3 p-4 transition-colors hover:bg-[color:var(--color-bg-card-hover)]"
              >
                <Mail className="h-5 w-5 text-indigo-300" />
                <span className="font-mono text-sm text-[color:var(--color-text-primary)]">
                  {email}
                </span>
              </a>
              <p className="text-sm text-[color:var(--color-text-tertiary)]">
                보통 영업일 기준 1~3일 내 답장 드립니다.
              </p>
            </section>

            <section className="space-y-3 leading-relaxed">
              <h2 className="text-xl font-semibold text-[color:var(--color-text-primary)]">
                메일 보내기 전에 확인해 주세요
              </h2>
              <ul className="list-inside list-disc space-y-2 text-sm">
                <li>
                  <strong>버그 제보</strong> — 어떤 도구에서, 어떤 입력값으로,
                  어떤 결과가 나왔는지 적어주시면 재현이 빠릅니다. 가능하면
                  결과 공유 URL을 함께 보내주세요.
                </li>
                <li>
                  <strong>새 도구 요청</strong> — 같은 요청이 여러 번 들어오면
                  우선순위로 만듭니다. 어떤 상황에서 어떻게 쓰실지 1~2줄로
                  적어주세요.
                </li>
                <li>
                  <strong>계산 결과 정확성</strong> — KEC·KS·건축법 표 인용이
                  의심스러우면 페이지 출처와 함께 알려주세요. 운영자가
                  확인하고 표를 갱신합니다.
                </li>
                <li>
                  <strong>제휴·광고</strong> — 자재몰·시공업체와의 제휴 또는
                  광고 직접 게재 제안은 회사명과 사업 내용을 함께
                  보내주세요.
                </li>
              </ul>
            </section>

            <section className="space-y-3 leading-relaxed">
              <h2 className="text-xl font-semibold text-[color:var(--color-text-primary)]">
                답장이 어려운 문의
              </h2>
              <ul className="list-inside list-disc space-y-1.5 text-sm">
                <li>개별 시공 현장의 구조·전기 컨설팅 (구조사·전기안전관리자에게 문의)</li>
                <li>세무 신고 대행 (세무사 사무소)</li>
                <li>특정 기업·개인의 사업자등록 휴·폐업 조회 (홈택스에서 직접)</li>
              </ul>
            </section>
          </article>
        ) : (
          <article className="space-y-6 text-[color:var(--color-text-secondary)]">
            <header>
              <h1 className="text-3xl font-bold tracking-tight text-[color:var(--color-text-primary)] md:text-4xl">
                Contact
              </h1>
              <p className="mt-3">
                Email me about wrong results, new tool ideas, or partnership
                proposals.
              </p>
            </header>

            <a
              href={`mailto:${email}?subject=WorkTool inquiry`}
              className="surface-card group inline-flex items-center gap-3 p-4 transition-colors hover:bg-[color:var(--color-bg-card-hover)]"
            >
              <Mail className="h-5 w-5 text-indigo-300" />
              <span className="font-mono text-sm text-[color:var(--color-text-primary)]">
                {email}
              </span>
            </a>
            <p className="text-sm text-[color:var(--color-text-tertiary)]">
              I usually reply within 1–3 business days.
            </p>

            <section className="space-y-3 leading-relaxed">
              <h2 className="text-xl font-semibold text-[color:var(--color-text-primary)]">
                Before you write
              </h2>
              <ul className="list-inside list-disc space-y-2 text-sm">
                <li>
                  <strong>Bug reports</strong> — which tool, which inputs,
                  what result you got. A share URL helps me reproduce
                  fast.
                </li>
                <li>
                  <strong>Tool requests</strong> — common requests get
                  prioritized. One or two lines on the use case.
                </li>
                <li>
                  <strong>Result accuracy</strong> — if a KEC/KS/code table
                  citation looks off, send the source and I&apos;ll verify
                  and update.
                </li>
              </ul>
            </section>
          </article>
        )}
      </div>
    </main>
  );
}
