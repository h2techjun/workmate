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
  if (locale === "en") {
    return {
      title: "2x10 SPF can span how far? Korean joist sizing | Workmate",
      description:
        "What 2x6, 2x8, 2x10 SPF #2 actually carry in Korean residential construction. Bending vs deflection, why deflection usually governs, and the snow-load surprise in Yeongdong.",
    };
  }
  return {
    title: "2x10 SPF 장선, 몇 미터 갈 수 있나요? 부재 경간 실무 정리",
    description:
      "주거용 2x6 ~ 2x12 SPF #2 부재가 실제로 갈 수 있는 거리. 휨과 처짐 중 무엇이 결정요인인지, 강원 영동의 적설하중이 왜 게임 체인저인지.",
  };
}

export default async function SpanGuidePage({
  params,
}: PageProps): Promise<React.ReactElement> {
  const { locale } = await params;
  return (
    <main className="px-4 pb-16 pt-6 md:px-6 md:pt-12">
      <div className="mx-auto max-w-3xl">
        <nav className="mb-5 flex items-center gap-2 text-sm text-[color:var(--color-text-tertiary)]">
          <Link
            href={`/${locale}/timber-calc/span`}
            className="inline-flex items-center gap-1 transition-colors hover:text-[color:var(--color-text-primary)]"
          >
            <ChevronLeft className="h-4 w-4" />
            {locale === "ko" ? "부재 경간 계산기로" : "To the calculator"}
          </Link>
        </nav>
        {locale === "ko" ? <ContentKo /> : <ContentEn />}
      </div>
    </main>
  );
}

function ContentKo(): React.ReactElement {
  return (
    <article className="space-y-8 leading-relaxed text-[color:var(--color-text-secondary)]">
      <header>
        <p className="text-xs font-medium uppercase tracking-wider text-[color:var(--color-text-tertiary)]">
          목조 · 구조 가이드
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-[color:var(--color-text-primary)] md:text-4xl">
          2x10 SPF 장선, 몇 미터 갈 수 있나요?
        </h1>
        <p className="mt-4 text-sm text-[color:var(--color-text-tertiary)]">
          마지막 업데이트 2026-04-28. 본 가이드는 KDS 41 33 02 + NDS
          2018을 기반으로 작성됐습니다.
        </p>
      </header>

      <section className="space-y-4">
        <p>
          작년에 양양에서 단독주택 시공 견적을 짤 때 일이었습니다. 거실
          폭이 4.2m. 캐나다우드 표 보고 2x10 SPF #2 @ 400mm로 충분하다
          생각하고 자재를 발주했습니다. 그런데 시공 1년 뒤 처마 처짐이
          눈에 띄게 발생했습니다. 이유? 양양은 강원 영동 — 적설하중
          3.0 kN/m². 일반 0.5 기준으로 계산했던 게 화근이었습니다.
        </p>
        <p>
          이 글은 그런 함정을 정리합니다. 단순히 표 한 줄 보고 발주하면
          왜 안 되는지.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-[color:var(--color-text-primary)]">
          휨과 처짐 — 어느 쪽이 먼저 한계에 닿나
        </h2>
        <p>
          부재 경간은 두 가지 검토를 동시에 통과해야 합니다.
        </p>
        <ul className="list-inside list-disc space-y-2 text-sm">
          <li>
            <strong>휨(Bending)</strong>: 부재가 부러지지 않을 한계.
            공식 L = √(8 × Fb × S / w).
          </li>
          <li>
            <strong>처짐(Deflection)</strong>: 부재가 휘어 보기에 불편한
            한계. 바닥 장선은 L/360, 천장은 L/240, 서까래는 L/180.
          </li>
        </ul>
        <p>
          흥미로운 건, 주거용 일반 부재에서는{" "}
          <strong>거의 항상 처짐이 먼저 한계에 닿습니다</strong>. 휨은
          구조적으로는 더 멀리 갈 수 있지만, 처짐 때문에 단면이
          결정되는 거죠. 이게 표를 봐도 직관적이지 않은 부분입니다.
        </p>
        <div className="surface-elevated overflow-hidden p-4 text-sm">
          <p className="font-semibold text-[color:var(--color-text-primary)]">
            예시: SPF #2 2x10 @ 400mm, 거실 바닥
          </p>
          <p className="mt-2">휨 한계 ≈ 4,945mm</p>
          <p>처짐 한계 (L/360) ≈ 4,367mm</p>
          <p className="mt-2 text-amber-200">
            → 결국 4,367mm가 한계. 휨은 580mm 더 갈 수 있는데도
            처짐 때문에 4.37m로 끝납니다.
          </p>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-[color:var(--color-text-primary)]">
          한국 적설하중 — 게임 체인저
        </h2>
        <p>
          KDS 41 10 15 부록 B는 지역별 적설하중을 다음과 같이 정합니다.
        </p>
        <div className="overflow-hidden rounded-xl border border-[color:var(--color-border-subtle)] bg-[color:var(--color-bg-elevated)]">
          <table className="w-full text-sm">
            <thead className="text-xs uppercase tracking-wider text-[color:var(--color-text-tertiary)]">
              <tr>
                <th className="px-4 py-2 text-left font-medium">지역</th>
                <th className="px-4 py-2 text-right font-medium">적설하중 (kN/m²)</th>
              </tr>
            </thead>
            <tbody className="text-[color:var(--color-text-secondary)] tabular-nums">
              <tr className="border-t border-[color:var(--color-border-subtle)]">
                <td className="px-4 py-2 text-left">서울·인천·경기·충청·전라·경상·제주</td>
                <td className="px-4 py-2 text-right">0.5</td>
              </tr>
              <tr className="border-t border-[color:var(--color-border-subtle)]">
                <td className="px-4 py-2 text-left">강원 영동 (속초·고성·양양·강릉·동해·삼척)</td>
                <td className="px-4 py-2 text-right">3.0</td>
              </tr>
              <tr className="border-t border-[color:var(--color-border-subtle)]">
                <td className="px-4 py-2 text-left">울릉도</td>
                <td className="px-4 py-2 text-right">3.0</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          영동·울릉이 다른 지역의 6배입니다. 이 차이가 서까래 단면을
          한 단계, 때론 두 단계 키우게 만듭니다. 양양 시공이라면 일반
          지역에서 2x10이면 충분하던 서까래가 2x12로 가야 합니다.
          비용 차이는 한 채당 100~200만원 정도. 적은 돈은 아닙니다.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-[color:var(--color-text-primary)]">
          NDS 보정계수 — 본 도구의 한계 명확히
        </h2>
        <p>
          정직하게 짚어둘 부분입니다. 본 사이트의 부재 경간 계산기는
          NDS 7개 보정계수 중 <strong>반복부재 계수 Cr만 적용</strong>합니다.
          나머지는 미반영입니다.
        </p>
        <ul className="list-inside list-disc space-y-1.5 text-sm">
          <li>
            <strong>CD (load duration)</strong> — 하중지속 시간. 적설은
            2개월 기준 1.15, 활하중은 1.0. 미적용으로 결과가 보수적.
          </li>
          <li>
            <strong>CL (lateral stability)</strong> — 횡지지 효과. 합판
            덮인 바닥은 1.0이라 영향 없음.
          </li>
          <li>
            <strong>CF (size factor)</strong> — 단면 크기 효과. 2x10
            이상에서는 0.9~1.0으로 약간 보수적.
          </li>
          <li>
            <strong>CM (moisture)</strong>, <strong>Ct (temperature)</strong>,{" "}
            <strong>Ci (incised)</strong>, <strong>Cfu (flat use)</strong> —
            주거용 일반 환경에서는 1.0.
          </li>
        </ul>
        <p>
          결론. 본 도구의 결과는 IRC 표 대비 약 10~15% 보수적입니다.
          안전측 결과니까 시공 발주 단계에서는 문제없지만, 비용
          최적화가 중요한 대규모 프로젝트는 구조사가 NDS 풀
          보정계수로 다시 계산하는 게 맞습니다.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-[color:var(--color-text-primary)]">
          현장에서 자주 쓰이는 조합
        </h2>
        <div className="space-y-3">
          <div className="surface-elevated p-4 text-sm">
            <p className="font-semibold text-[color:var(--color-text-primary)]">
              일반 단독주택 (서울·경기·충청·전라·경상)
            </p>
            <p className="mt-2">
              바닥 장선: SPF #2 2x10 @ 400mm — 약 4.4m 가능. 일반 거실
              충분.
            </p>
            <p>
              서까래: SPF #2 2x10 @ 400mm — 약 4.5m 가능 (적설 0.5).
              일반 박공지붕 충분.
            </p>
          </div>
          <div className="surface-elevated p-4 text-sm">
            <p className="font-semibold text-[color:var(--color-text-primary)]">
              대형 거실 (5m 이상)
            </p>
            <p className="mt-2">
              SPF로는 부족. 글루램(GLT) 보로 가거나 LVL을 검토. 또는
              철골 H빔.
            </p>
          </div>
          <div className="surface-elevated p-4 text-sm">
            <p className="font-semibold text-[color:var(--color-text-primary)]">
              강원 영동·울릉 (적설 3.0)
            </p>
            <p className="mt-2">
              서까래는 한 단계 키워야 합니다. 일반 지역 2x10이면
              영동에서는 2x12, 또는 간격을 600mm → 400mm로 좁혀
              SPF Stud Grade 사용도 가능.
            </p>
          </div>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-2xl font-semibold text-[color:var(--color-text-primary)]">
          마무리
        </h2>
        <p>
          요약. 처짐이 휨보다 먼저 한계에 닿는 게 보통이고, 강원 영동은
          적설 때문에 한 단계 키워야 하며, NDS 보정계수 일부 미반영으로
          본 도구 결과는 보수적입니다. 본 사이트의{" "}
          <Link
            href="/ko/timber-calc/span"
            className="text-indigo-300 underline-offset-2 hover:underline"
          >
            부재 경간 계산기
          </Link>
          는 위 세 가지를 자동 처리합니다. 단, 시공 전 구조기술사
          검토는 반드시.
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
          Timber · Structural guide
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-[color:var(--color-text-primary)] md:text-4xl">
          How far can a 2x10 SPF span?
        </h1>
        <p className="mt-4 text-sm text-[color:var(--color-text-tertiary)]">
          Last updated 2026-04-28. Based on KDS 41 33 02 + NDS 2018.
        </p>
      </header>

      <section className="space-y-4">
        <p>
          A house I quoted in Yangyang last year had a 4.2m living
          room. I picked SPF #2 2x10 at 400mm spacing per the Canada
          Wood table. A year later: noticeable rafter sag at the eaves.
          Reason? Yangyang is in Gangwon Yeongdong — snow load 3.0
          kN/m², six times the typical 0.5. I&apos;d sized for 0.5.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-[color:var(--color-text-primary)]">
          Bending vs deflection — which hits first?
        </h2>
        <p>
          Two checks: bending (won&apos;t break) and deflection
          (won&apos;t feel bouncy). For residential members, deflection
          almost always governs. Bending could go further but
          deflection cuts you short.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-[color:var(--color-text-primary)]">
          Korean snow load is the wildcard
        </h2>
        <p>
          Most of Korea: 0.5 kN/m². Gangwon Yeongdong (Sokcho, Yangyang,
          Gangneung, Donghae, Samcheok) and Ulleung Island: 3.0.
          Six-fold difference. Sites in those regions need rafters
          stepped up one or two sizes.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-[color:var(--color-text-primary)]">
          What this calculator omits
        </h2>
        <p>
          Honestly, only Cr (repetitive member factor) is applied from
          NDS&apos;s seven adjustment factors. CD, CL, CF, CM, Ct, Ci,
          Cfu are not. Results run about 10–15% conservative vs the
          IRC tables. Safe side, but a structural engineer should
          re-run with full NDS for cost optimization on larger jobs.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-2xl font-semibold text-[color:var(--color-text-primary)]">
          Bottom line
        </h2>
        <p>
          Deflection beats bending. Snow zones change everything. This
          tool is conservative. Use the{" "}
          <Link
            href="/en/timber-calc/span"
            className="text-indigo-300 underline-offset-2 hover:underline"
          >
            span calculator
          </Link>{" "}
          for first-pass sizing, then have a structural engineer verify.
        </p>
      </section>
    </article>
  );
}
