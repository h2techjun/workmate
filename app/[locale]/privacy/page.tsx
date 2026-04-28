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
        ? "Privacy Policy — Workmate"
        : "개인정보처리방침 — Workmate",
    description:
      locale === "en"
        ? "How Workmate handles your data — short answer: it doesn't leave your browser."
        : "Workmate의 개인정보 처리 방식. 입력값은 브라우저를 떠나지 않습니다.",
  };
}

export default async function PrivacyPage({
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

        {isKo ? <PrivacyKo /> : <PrivacyEn />}
      </div>
    </main>
  );
}

function PrivacyKo(): React.ReactElement {
  return (
    <article className="space-y-6 text-[color:var(--color-text-secondary)]">
      <header>
        <h1 className="text-3xl font-bold tracking-tight text-[color:var(--color-text-primary)] md:text-4xl">
          개인정보처리방침
        </h1>
        <p className="mt-3 text-sm text-[color:var(--color-text-tertiary)]">
          시행일 2026-04-27 · 본 방침은 Workmate 사이트(이하 &ldquo;본
          사이트&rdquo;)에 적용됩니다.
        </p>
      </header>

      <section className="space-y-3 leading-relaxed">
        <h2 className="text-xl font-semibold text-[color:var(--color-text-primary)]">
          요약
        </h2>
        <ul className="list-inside list-disc space-y-1.5 text-sm">
          <li>입력값은 브라우저에서만 처리되며 서버로 전송되지 않습니다.</li>
          <li>
            도구 입력값은 사용자 편의를 위해 로컬 저장소(localStorage)에
            저장될 수 있습니다. 사용자 기기에만 저장되며 외부로 나가지
            않습니다.
          </li>
          <li>
            광고 표시를 위해 Google AdSense를 사용하며, AdSense는 자체 쿠키로
            관심사를 추적할 수 있습니다.
          </li>
          <li>
            방문자 통계를 위해 Vercel Analytics(또는 동급의 익명 분석 도구)를
            사용할 수 있으며, 개인 식별 정보는 수집하지 않습니다.
          </li>
        </ul>
      </section>

      <section className="space-y-3 leading-relaxed">
        <h2 className="text-xl font-semibold text-[color:var(--color-text-primary)]">
          1. 수집하는 정보
        </h2>
        <p>
          본 사이트는 별도의 회원가입 절차가 없으며, 이름·이메일·전화번호 등
          개인 식별 정보를 수집하지 않습니다.
        </p>
        <p>
          계산기에 입력하는 값(예: 전압·전류·월급여 등)은 브라우저 메모리와
          URL 쿼리 파라미터·로컬 저장소에만 머무릅니다. 결과 공유 링크를
          만들면 입력값이 URL에 포함되며, 이 링크를 공유하는 행위로 입력값이
          수신자에게 전달됩니다.
        </p>
        <p>
          광고 사업자(Google AdSense)는 자체 쿠키와 식별자를 통해 광고
          개인화를 위한 익명 데이터를 수집할 수 있습니다. AdSense의 처리 방침은{" "}
          <a
            href="https://policies.google.com/privacy"
            target="_blank"
            rel="noopener noreferrer"
            className="text-indigo-300 underline-offset-2 hover:underline"
          >
            Google 개인정보처리방침
          </a>
          을 따릅니다.
        </p>
      </section>

      <section className="space-y-3 leading-relaxed">
        <h2 className="text-xl font-semibold text-[color:var(--color-text-primary)]">
          2. 쿠키와 로컬 저장소
        </h2>
        <p>
          본 사이트는 다음 용도로 쿠키와 로컬 저장소를 사용합니다.
        </p>
        <ul className="list-inside list-disc space-y-1.5 text-sm">
          <li>
            <strong>로컬 저장소</strong>: 도구별 입력값 자동 저장
            (다음 방문 시 복원). key prefix는 <code>worktool:</code> 입니다.
          </li>
          <li>
            <strong>쿠키 (광고)</strong>: AdSense의 광고 개인화·빈도 제한 등.
            브라우저 설정에서 차단할 수 있습니다.
          </li>
        </ul>
        <p className="text-sm">
          본 사이트가 직접 설치하는 추적 쿠키는 없습니다. 사용자는 브라우저
          설정에서 모든 쿠키와 로컬 저장소를 언제든 삭제할 수 있습니다.
        </p>
      </section>

      <section className="space-y-3 leading-relaxed">
        <h2 className="text-xl font-semibold text-[color:var(--color-text-primary)]">
          3. 제3자 제공
        </h2>
        <p>
          본 사이트는 사용자 개인정보를 제3자에게 제공하지 않습니다. 다만,
          페이지를 표시하기 위해 다음 외부 서비스가 사용됩니다.
        </p>
        <ul className="list-inside list-disc space-y-1.5 text-sm">
          <li>Vercel — 사이트 호스팅 및 CDN</li>
          <li>Google AdSense — 광고 표시</li>
          <li>Google Fonts (선택) — 폰트 제공</li>
        </ul>
      </section>

      <section className="space-y-3 leading-relaxed">
        <h2 className="text-xl font-semibold text-[color:var(--color-text-primary)]">
          4. 사용자의 권리
        </h2>
        <p className="text-sm">
          본 사이트는 식별 가능한 개인정보를 수집하지 않으므로, 일반적인
          삭제·수정·열람 요구의 대상이 되는 데이터가 없습니다. 다만 로컬에
          저장된 입력값을 삭제하려면 브라우저의 사이트 데이터 지우기 기능을
          사용하시기 바랍니다.
        </p>
      </section>

      <section className="space-y-3 leading-relaxed">
        <h2 className="text-xl font-semibold text-[color:var(--color-text-primary)]">
          5. 개정
        </h2>
        <p className="text-sm">
          본 방침은 법령 변경 또는 서비스 변경에 따라 개정될 수 있으며, 변경
          시 본 페이지에 시행일과 함께 공지합니다.
        </p>
      </section>

      <section className="space-y-3 leading-relaxed">
        <h2 className="text-xl font-semibold text-[color:var(--color-text-primary)]">
          문의
        </h2>
        <p className="text-sm">
          개인정보 관련 문의는{" "}
          <Link
            href="/ko/contact"
            className="text-indigo-300 underline-offset-2 hover:underline"
          >
            연락처 페이지
          </Link>
          를 통해 접수해 주세요.
        </p>
      </section>
    </article>
  );
}

function PrivacyEn(): React.ReactElement {
  return (
    <article className="space-y-6 text-[color:var(--color-text-secondary)]">
      <header>
        <h1 className="text-3xl font-bold tracking-tight text-[color:var(--color-text-primary)] md:text-4xl">
          Privacy Policy
        </h1>
        <p className="mt-3 text-sm text-[color:var(--color-text-tertiary)]">
          Effective 2026-04-27 · Applies to the Workmate website
        </p>
      </header>

      <section className="space-y-3 leading-relaxed">
        <h2 className="text-xl font-semibold text-[color:var(--color-text-primary)]">
          Summary
        </h2>
        <ul className="list-inside list-disc space-y-1.5 text-sm">
          <li>Calculator inputs stay in your browser. They are never sent to a server.</li>
          <li>Inputs may be saved to your browser&apos;s localStorage for convenience. They never leave your device.</li>
          <li>Google AdSense displays ads and may track interests via its own cookies.</li>
          <li>Anonymous analytics (Vercel Analytics or equivalent) may count visits without identifying you.</li>
        </ul>
      </section>

      <section className="space-y-3 leading-relaxed">
        <h2 className="text-xl font-semibold text-[color:var(--color-text-primary)]">
          1. Information collected
        </h2>
        <p>
          We do not require sign-up. We do not collect names, email
          addresses, or phone numbers.
        </p>
        <p>
          Calculator inputs (voltages, salaries, etc.) live only in browser
          memory, URL query params, and localStorage. If you create a share
          URL, your inputs are encoded into the URL — sharing that URL
          shares your inputs with whoever you send it to.
        </p>
        <p>
          Google AdSense may use cookies and identifiers for ad
          personalization. Their handling is governed by{" "}
          <a
            href="https://policies.google.com/privacy"
            target="_blank"
            rel="noopener noreferrer"
            className="text-indigo-300 underline-offset-2 hover:underline"
          >
            Google&apos;s Privacy Policy
          </a>
          .
        </p>
      </section>

      <section className="space-y-3 leading-relaxed">
        <h2 className="text-xl font-semibold text-[color:var(--color-text-primary)]">
          2. Cookies and local storage
        </h2>
        <ul className="list-inside list-disc space-y-1.5 text-sm">
          <li>
            <strong>Local storage</strong>: per-tool input restoration. Keys
            are prefixed <code>worktool:</code>.
          </li>
          <li>
            <strong>Cookies (ads)</strong>: AdSense personalization and
            frequency capping. Block via browser settings.
          </li>
        </ul>
      </section>

      <section className="space-y-3 leading-relaxed">
        <h2 className="text-xl font-semibold text-[color:var(--color-text-primary)]">
          3. Third parties
        </h2>
        <ul className="list-inside list-disc space-y-1.5 text-sm">
          <li>Vercel — hosting and CDN</li>
          <li>Google AdSense — ad display</li>
          <li>Google Fonts (optional) — typography</li>
        </ul>
      </section>

      <section className="space-y-3 leading-relaxed">
        <h2 className="text-xl font-semibold text-[color:var(--color-text-primary)]">
          4. Your rights
        </h2>
        <p className="text-sm">
          Because we do not collect personally identifiable information,
          there is no central record to delete. To clear locally stored
          inputs, use your browser&apos;s &ldquo;Clear site data&rdquo;
          option.
        </p>
      </section>

      <section className="space-y-3 leading-relaxed">
        <h2 className="text-xl font-semibold text-[color:var(--color-text-primary)]">
          5. Changes
        </h2>
        <p className="text-sm">
          This policy may change. The current effective date is shown at
          the top.
        </p>
      </section>
    </article>
  );
}
