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
      title: "Korean insulation code in plain English | WorkTool",
      description:
        "Korea's energy code by region — Central1, Central2, South, Jeju — and what wall buildup actually passes.",
    };
  }
  return {
    title: "단열, 중부2 외벽 0.17 통과시키는 현실적 조합 | WorkTool",
    description:
      "에너지절약 설계기준 별표1을 매주 들여다보는 사람의 정리. 글라스울 140mm로는 중부2 못 통과합니다. 그럼 어떻게 하는지.",
  };
}

export default async function InsulationGuidePage({
  params,
}: PageProps): Promise<React.ReactElement> {
  const { locale } = await params;
  return (
    <main className="px-4 pb-16 pt-6 md:px-6 md:pt-12">
      <div className="mx-auto max-w-3xl">
        <nav className="mb-5 flex items-center gap-2 text-sm text-[color:var(--color-text-tertiary)]">
          <Link
            href={`/${locale}/timber-calc/insulation`}
            className="inline-flex items-center gap-1 transition-colors hover:text-[color:var(--color-text-primary)]"
          >
            <ChevronLeft className="h-4 w-4" />
            {locale === "ko" ? "단열 계산기로" : "To the calculator"}
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
          단열 · 인허가 가이드
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-[color:var(--color-text-primary)] md:text-4xl">
          단열, 중부2 외벽 0.17 통과시키는 현실적 조합
        </h1>
        <p className="mt-4 text-sm text-[color:var(--color-text-tertiary)]">
          마지막 업데이트 2026-04-27. 본 가이드는 건축물 에너지절약
          설계기준 별표1을 기준으로 작성됐습니다.
        </p>
      </header>

      <section className="space-y-4">
        <p>
          중부2(서울·인천·경기 대부분) 외벽 직접외기·거실의 U값 한계는
          0.17 W/m²·K입니다. 2x6 목구조에 글라스울 24K 140mm를 채워서는
          이걸 통과할 수 없습니다. 본 사이트의 단열 계산기로 정확한 숫자가
          나옵니다 — U값 0.250. 한참 모자랍니다.
        </p>
        <p>
          그럼 실제로는 어떻게 통과시키는가. 세 가지 길이 있습니다.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-[color:var(--color-text-primary)]">
          길 1. 외단열 추가 (가장 흔한 방법)
        </h2>
        <p>
          내부 2x6 (140mm) + OSB + <strong>외부에 50~75mm XPS 또는
          PIR 추가</strong>. 이렇게 하면 U값이 빠르게 떨어집니다.
        </p>
        <div className="surface-elevated overflow-hidden p-4 text-sm">
          <p className="font-semibold text-[color:var(--color-text-primary)]">
            구성 예
          </p>
          <p className="mt-2">
            석고 12.5mm + 글라스울 24K 140mm + OSB 11mm +{" "}
            <strong>XPS 50mm</strong> + 사이딩
          </p>
          <p className="mt-1">
            R 합 = 0.07 + 3.68 + 0.085 + 1.72 + 0.027 = 5.58 m²·K/W
          </p>
          <p>+ 표면 0.15 → 총 R 5.73 → U = <strong>0.175 W/m²·K</strong></p>
          <p className="mt-2 text-amber-200">
            중부2 한계 0.17 통과 직전. 안전 여유를 위해 XPS 75mm로
            올리면 U = 0.146으로 충분.
          </p>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-[color:var(--color-text-primary)]">
          길 2. 2x8 골조로 단열 두께 자체를 키우기
        </h2>
        <p>
          2x8 (184mm) 사용 + 고밀도 글라스울 48K 184mm. 외단열 안 쓰고
          가는 방법입니다.
        </p>
        <p>R = 0.184 / 0.034 = 5.41 m²·K/W. 다른 층 합쳐 총 R 약 5.6.
          U ≈ 0.179 — 통과 직전이지만 시공 오차 감안하면 한계선입니다.</p>
        <p>
          이 방법의 단점은 골조 비용 상승과 시공 난이도. 2x8 핸들링은
          2x6 대비 약 30% 노동력이 더 듭니다. 그래서 길 1을 더 선호하는
          편입니다.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-[color:var(--color-text-primary)]">
          길 3. PU 폼 시공 (장단점이 갈림)
        </h2>
        <p>
          2x6 (140mm)에 PU 폼 충전. λ = 0.024로 워낙 낮아서 같은
          두께로도 R = 5.83이 나옵니다. 외단열 없이 통과 가능.
        </p>
        <p>
          단점은 셋. (1) 비용. m²당 자재비가 글라스울의 4~5배. (2) 결로.
          습도가 높은 환경에서 폼 내부 결로가 보고된 사례가 있습니다.
          (3) 화재 시 유독 가스. 다중주택·상업시설은 별도 방화 검토가
          필요합니다.
        </p>
        <p className="text-sm">
          저는 단독주택 개별 외벽이라면 길 1을 추천합니다. 비용도
          관리되고 결로 위험도 낮습니다.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-[color:var(--color-text-primary)]">
          지역별 한계값 비교 (외벽 직접외기·거실 기준)
        </h2>
        <div className="overflow-hidden rounded-xl border border-[color:var(--color-border-subtle)] bg-[color:var(--color-bg-elevated)]">
          <table className="w-full text-sm">
            <thead className="text-xs uppercase tracking-wider text-[color:var(--color-text-tertiary)]">
              <tr>
                <th className="px-4 py-2 text-left font-medium">지역</th>
                <th className="px-4 py-2 text-right font-medium">U 한계 (W/m²·K)</th>
                <th className="px-4 py-2 text-right font-medium">대응 R 최소</th>
              </tr>
            </thead>
            <tbody className="text-[color:var(--color-text-secondary)]">
              <tr className="border-t border-[color:var(--color-border-subtle)]">
                <td className="px-4 py-2">중부1 (강원·경기 북부)</td>
                <td className="px-4 py-2 text-right tabular-nums">0.150</td>
                <td className="px-4 py-2 text-right tabular-nums">6.67</td>
              </tr>
              <tr className="border-t border-[color:var(--color-border-subtle)]">
                <td className="px-4 py-2">중부2 (서울·인천·대부분 경기)</td>
                <td className="px-4 py-2 text-right tabular-nums">0.170</td>
                <td className="px-4 py-2 text-right tabular-nums">5.88</td>
              </tr>
              <tr className="border-t border-[color:var(--color-border-subtle)]">
                <td className="px-4 py-2">남부</td>
                <td className="px-4 py-2 text-right tabular-nums">0.220</td>
                <td className="px-4 py-2 text-right tabular-nums">4.55</td>
              </tr>
              <tr className="border-t border-[color:var(--color-border-subtle)]">
                <td className="px-4 py-2">제주</td>
                <td className="px-4 py-2 text-right tabular-nums">0.290</td>
                <td className="px-4 py-2 text-right tabular-nums">3.45</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-sm">
          중부1과 중부2 차이가 0.02 W/m²·K뿐인데도 단열 두께로 환산하면
          XPS 기준 약 25mm 차이. 강원도 영서 시공 견적이 경기 시공
          견적보다 미세하게 비싸지는 이유입니다.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-[color:var(--color-text-primary)]">
          본 사이트 계산기의 한계
        </h2>
        <p>
          정직하게 짚어두자면, 사이트의 단열 계산기는 <strong>열교를
          반영하지 않습니다</strong>. 목구조 스터드(38×140mm)가 글라스울보다
          전도도가 약 4배 높아서 실제 벽체 평균 R은 계산값보다 10~20%
          낮습니다.
        </p>
        <p>
          이 차이를 메우는 방법:
        </p>
        <ul className="list-inside list-disc space-y-1 text-sm">
          <li>외단열을 추가해 스터드를 외부에서 가려준다 (가장 효과 큼)</li>
          <li>스터드를 24인치(600mm) 간격으로 넓혀 열교 면적 비율을 줄인다</li>
          <li>고급 빌더는 어드밴스드 프레이밍(advanced framing)으로
            스터드 자체를 줄임</li>
        </ul>
        <p>
          정밀 검토가 필요하면 한국패시브건축협회(PHIKO)의 열관류율
          계산기에서 열교 보정 옵션을 사용하세요.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-[color:var(--color-text-primary)]">
          현장에서 자주 쓰이는 자재 조합 (실제 가격 감각)
        </h2>
        <ul className="list-inside list-disc space-y-2 text-sm">
          <li>
            <strong>경제형 (남부)</strong>: 2x6 + 글라스울 24K 140 + 사이딩.
            m²당 자재비 약 30,000~40,000원.
          </li>
          <li>
            <strong>표준 (중부2)</strong>: 위 + 외부 XPS 50. m²당 약
            45,000~55,000원.
          </li>
          <li>
            <strong>고급 (중부1·패시브)</strong>: 2x8 + 글라스울 48K +
            외부 XPS 100 + 차폐 멤브레인. m²당 70,000원 이상.
          </li>
        </ul>
        <p className="text-sm">
          가격은 2026년 봄 기준. 자재비만이고 노동·기타 부자재 미포함.
          KCC·OCI·존스맨빌의 그라스울 가격대입니다.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-2xl font-semibold text-[color:var(--color-text-primary)]">
          마무리
        </h2>
        <p>
          단열은 두 가지를 같이 봐야 합니다. <strong>법규 통과 (U값 한계)</strong>와{" "}
          <strong>실제 성능 (열교 반영 후)</strong>. 통과만 노린 시공은
          나중에 결로·곰팡이로 돌아옵니다. 본 사이트의{" "}
          <Link
            href="/ko/timber-calc/insulation"
            className="text-indigo-300 underline-offset-2 hover:underline"
          >
            단열 R/U값 계산기
          </Link>
          로 1차 통과 검증 후, 인허가 도서는 건축사가 열교 반영해서 다시
          작성해야 안전합니다.
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
          Insulation · Code guide
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-[color:var(--color-text-primary)] md:text-4xl">
          Korean insulation code in plain English
        </h1>
        <p className="mt-4 text-sm text-[color:var(--color-text-tertiary)]">
          Last updated 2026-04-27. Based on the Korean Building Energy
          Saving Design Code Annex 1.
        </p>
      </header>

      <section className="space-y-4">
        <p>
          Central2 (Seoul, Incheon, most of Gyeonggi) demands U ≤ 0.17
          W/m²·K for an exterior wall directly exposed to outside air.
          A 2x6 stud wall packed with glasswool 24K (140mm) does not
          pass. The calculator gives U = 0.250. Significantly short.
        </p>
        <p>
          So how do you actually pass? Three approaches.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-[color:var(--color-text-primary)]">
          Path 1. Add exterior insulation (most common)
        </h2>
        <p>
          2x6 (140mm) interior + OSB + <strong>50–75mm XPS or PIR
          outside</strong>. U drops fast.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-[color:var(--color-text-primary)]">
          Path 2. Bigger studs (2x8)
        </h2>
        <p>
          2x8 (184mm) with high-density glasswool 48K. No exterior layer.
          U about 0.179 — passes Central2 with no margin. Higher framing
          cost.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-[color:var(--color-text-primary)]">
          Path 3. PU spray foam
        </h2>
        <p>
          λ = 0.024. R = 5.83 in 2x6. Passes alone. But: 4–5x material
          cost, condensation risk in humid environments, and additional
          fire review for multi-unit/commercial.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-2xl font-semibold text-[color:var(--color-text-primary)]">
          Bottom line
        </h2>
        <p>
          Insulation has two layers of truth: <strong>passing the code</strong>{" "}
          (U-limit) and <strong>real performance after thermal bridging</strong>.
          Build to pass alone and you may face condensation later. Use the{" "}
          <Link
            href="/en/timber-calc/insulation"
            className="text-indigo-300 underline-offset-2 hover:underline"
          >
            R/U calculator
          </Link>{" "}
          for first-pass verification, then have a licensed architect
          redo the official drawings with thermal bridging factored in.
        </p>
      </section>
    </article>
  );
}
