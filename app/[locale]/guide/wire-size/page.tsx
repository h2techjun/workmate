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
      title: "Sizing wires under KEC 232.5 — a field guide | Workmate",
      description:
        "How to actually pick wire size under Korea's KEC 232.5. Real cases, the temperature factor traps people miss, and when to ignore the calculator.",
    };
  }
  return {
    title: "전선 굵기, 이렇게 정해야 후회 없습니다 — KEC 232.5 현장 가이드",
    description:
      "KEC 232.5만 보고 단면적 정하면 망합니다. 보일러실에서 트립 났던 사례부터 인버터 회로의 함정까지, 현장 경력 묶어서 정리한 실무 가이드.",
  };
}

export default async function WireSizeGuidePage({
  params,
}: PageProps): Promise<React.ReactElement> {
  const { locale } = await params;
  return (
    <main className="px-4 pb-16 pt-6 md:px-6 md:pt-12">
      <div className="mx-auto max-w-3xl">
        <nav className="mb-5 flex items-center gap-2 text-sm text-[color:var(--color-text-tertiary)]">
          <Link
            href={`/${locale}/electric-calc/wire-size`}
            className="inline-flex items-center gap-1 transition-colors hover:text-[color:var(--color-text-primary)]"
          >
            <ChevronLeft className="h-4 w-4" />
            {locale === "ko" ? "전선 굵기 계산기로" : "To the calculator"}
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
          전기 · 현장 가이드
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-[color:var(--color-text-primary)] md:text-4xl">
          전선 굵기, 이렇게 정해야 후회 없습니다
        </h1>
        <p className="mt-4 text-sm text-[color:var(--color-text-tertiary)]">
          KEC 232.5와 내선규정 1410-1을 현장 사례로 풀어쓴 실무 가이드.
          마지막 업데이트 2026-04-27.
        </p>
      </header>

      <section className="space-y-4">
        <p>
          공장 보일러실에서 4mm² 케이블이 한 달 만에 색깔 바뀌는 걸 본 적
          있습니다. 설계상으로는 적합 판정. 그런데 주변이 50도 가까이
          올라가는 환경이라는 게 빠졌습니다. KEC 표는 30도 기준이고,
          현장은 거의 그 기준대로 나오질 않거든요.
        </p>
        <p>
          이 글은 그런 함정들을 정리했습니다. 차근차근 따라가다 보면
          왜 단순히 표 한 줄 보고 끝내면 안 되는지 보일 겁니다.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-[color:var(--color-text-primary)]">
          단면적은 두 가지 조건을 동시에 만족해야 합니다
        </h2>
        <p>
          전선 굵기를 정하는 기준은 두 개입니다. 하나는 <strong>허용
          전류</strong>(KEC 표), 다른 하나는 <strong>전압강하</strong>(내선규정
          1410-1). 둘 중 더 큰 단면적을 선택해야 합니다. 현장에서 흔한
          착각이 둘 중 하나만 보고 끝내는 것입니다.
        </p>
        <p>
          짧은 거리에 큰 전류가 흐르면 허용 전류가 결정요인입니다. 반대로
          긴 거리는 전압강하가 결정요인이 됩니다. 30m가 갈림길 정도라고
          기억하면 됩니다.
        </p>
        <div className="surface-elevated overflow-hidden p-4 text-sm">
          <p className="font-semibold text-[color:var(--color-text-primary)]">
            예시
          </p>
          <p className="mt-2">
            220V 단상 2선식, 전류 100A, 거리 5m → 단면적 50mm² (허용
            전류 결정)
          </p>
          <p>
            220V 단상 2선식, 전류 30A, 거리 80m → 단면적 16mm² (전압강하
            결정)
          </p>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-[color:var(--color-text-primary)]">
          보정계수 두 개를 빼먹지 마세요 (Ct·Cg)
        </h2>
        <p>
          KEC 표는 30°C, 단일 회로 기준입니다. 실제 현장은 거의 다릅니다.
          그래서 두 개 보정이 필요합니다.
        </p>
        <h3 className="mt-3 text-lg font-semibold text-[color:var(--color-text-primary)]">
          Ct — 주위 온도 보정
        </h3>
        <p>
          PVC 절연을 40°C 환경에 시공하면 0.87을 곱합니다. 50°C면 0.71.
          보일러실이나 옥상 트레이는 이 보정이 결정적입니다. 표 B.52.14를
          쓰는데, 본 사이트의 단열 옆에 붙어있는 전선 굵기 계산기는 자동
          보정합니다.
        </p>
        <h3 className="mt-3 text-lg font-semibold text-[color:var(--color-text-primary)]">
          Cg — 회로 묶음 보정
        </h3>
        <p>
          같은 트레이에 회로가 3개면 0.70을 곱합니다. 4개면 0.65. 9개면
          0.50까지 떨어집니다. 강전 분전반에서 트레이 한 곳에 회로가
          몰리면 빠르게 1/2로 떨어진다는 얘깁니다.
        </p>
        <p>
          두 보정은 곱해서 적용합니다. 40°C에 4회로 트레이면 0.87 × 0.65 = 0.566.
          허용 전류가 거의 절반이 되는 셈이죠. 이걸 무시하면 진짜 위험합니다.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-[color:var(--color-text-primary)]">
          XLPE를 쓰면 어떻게 다른가요?
        </h2>
        <p>
          XLPE(가교 폴리에틸렌) 절연은 도체 최대 온도가 90°C라서 70°C인
          PVC보다 약 25% 높은 허용 전류를 갖습니다. 단가 차이는 크지
          않은데 단면적 한 단계 줄일 수 있어 비용이 빠집니다. 단,
          연소 시 PVC보다 유독 가스가 적어서 옥내 정공장이나 통신실
          쪽에서 선호되는 편입니다.
        </p>
        <p>
          한 가지 주의. 사이트의 계산기는 XLPE 효과를 PVC 표 × 1.25로
          간단히 처리합니다. 정밀 설계에서는 XLPE 전용 표 (KS C IEC
          60364-5-52 부속서 B 표 B.52.4)를 직접 봐야 합니다.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-[color:var(--color-text-primary)]">
          알루미늄 도체에 대한 한국 시장 현실
        </h2>
        <p>
          전체 산업에서 알루미늄 비율은 점점 올라가고 있는데 한국 주거용
          시공 현장은 여전히 동선 중심입니다. 그렇지만 100A 이상의
          간선이나 인입선에서는 알루미늄도 자주 보입니다.
        </p>
        <p>
          알루미늄은 같은 단면적이면 도전율이 동의 약 62% 수준입니다.
          그래서 전압강하 계수에 1.6을 곱하고, 허용 전류는 동선 표보다
          별도 표를 따라야 합니다. 16mm² 미만은 KEC상 알루미늄 사용을
          권장하지 않습니다. 본 사이트의 계산기는 16mm² 미만 알루미늄을
          입력하면 자동으로 경고가 뜹니다.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-[color:var(--color-text-primary)]">
          거리별 허용 전압강하율 (내선규정 1410-1)
        </h2>
        <div className="overflow-hidden rounded-xl border border-[color:var(--color-border-subtle)] bg-[color:var(--color-bg-elevated)]">
          <table className="w-full text-sm">
            <thead className="text-xs uppercase tracking-wider text-[color:var(--color-text-tertiary)]">
              <tr>
                <th className="px-4 py-2 text-left font-medium">거리</th>
                <th className="px-4 py-2 text-right font-medium">허용 강하율</th>
              </tr>
            </thead>
            <tbody className="text-[color:var(--color-text-secondary)]">
              <tr className="border-t border-[color:var(--color-border-subtle)]">
                <td className="px-4 py-2">60m 이하</td>
                <td className="px-4 py-2 text-right tabular-nums">3%</td>
              </tr>
              <tr className="border-t border-[color:var(--color-border-subtle)]">
                <td className="px-4 py-2">60m 초과 ~ 120m</td>
                <td className="px-4 py-2 text-right tabular-nums">5%</td>
              </tr>
              <tr className="border-t border-[color:var(--color-border-subtle)]">
                <td className="px-4 py-2">120m 초과 ~ 200m</td>
                <td className="px-4 py-2 text-right tabular-nums">6%</td>
              </tr>
              <tr className="border-t border-[color:var(--color-border-subtle)]">
                <td className="px-4 py-2">200m 초과</td>
                <td className="px-4 py-2 text-right tabular-nums">7%</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-sm">
          한 가지 첨언. 위는 인입 후 간선까지 기준입니다. 수용가
          내부에서는 보통 2% 이내로 설계하는 게 권장됩니다. 중요한
          정밀 장비가 있는 회로(서버실, 의료 장비 등)는 1% 이내로 더
          타이트하게 잡습니다.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-[color:var(--color-text-primary)]">
          자주 받는 질문
        </h2>
        <div className="space-y-4">
          <div className="surface-elevated p-4">
            <p className="font-semibold text-[color:var(--color-text-primary)]">
              Q. 220V 30A 단상 2선식, 거리 50m. 단면적 얼마면 되나요?
            </p>
            <p className="mt-2 text-sm">
              허용 전압강하 3% = 6.6V. A_min = (35.6 × 50 × 30) / (1000 × 6.6)
              = 8.09mm² → KS 표준 10mm². 허용 전류 측면에서는 10mm² 단상
              57A로 30A 부담 없이 처리. 결과는 10mm². 보일러실 같은
              고온 환경이면 한 단계 키워서 16mm²로 가는 게 안전합니다.
            </p>
          </div>
          <div className="surface-elevated p-4">
            <p className="font-semibold text-[color:var(--color-text-primary)]">
              Q. 인버터 부하인데 단면적 어떻게 잡나요?
            </p>
            <p className="mt-2 text-sm">
              인버터 자체는 정격 전류 기준으로 동일하게 산정합니다.
              문제는 차단기. 인버터의 Y-캐패시터 누설전류 때문에 30mA
              ELB는 잦은 트립을 일으킵니다. ELB 대신 MCB·MCCB로 가야
              하고, 누전 보호가 필수면 100mA·300mA 또는 IT-체계용
              모듈을 검토합니다.
            </p>
          </div>
          <div className="surface-elevated p-4">
            <p className="font-semibold text-[color:var(--color-text-primary)]">
              Q. KEC 표만 따르면 되는 거 아닌가요?
            </p>
            <p className="mt-2 text-sm">
              KEC는 최저 안전 기준입니다. 합격이지 최적이 아닙니다.
              온도·회로 묶음·향후 부하 증설 여지를 고려하면 표보다
              한두 단계 키워 시공하는 게 일반적입니다. 비용 차이는 보통
              총 공사비의 1~3% 수준이라 후회보다는 여유 잡는 쪽이
              유리합니다.
            </p>
          </div>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-2xl font-semibold text-[color:var(--color-text-primary)]">
          마무리
        </h2>
        <p>
          요약하면 셋입니다. 첫째, 두 조건(허용전류·전압강하)을 같이
          본다. 둘째, Ct·Cg 보정을 빠뜨리지 않는다. 셋째, KEC를 최저로
          보고 한 단계 여유 잡는다. 본 사이트의{" "}
          <Link
            href="/ko/electric-calc/wire-size"
            className="text-indigo-300 underline-offset-2 hover:underline"
          >
            전선 굵기 계산기
          </Link>
          는 위 세 가지를 자동으로 처리합니다. 다만 결과는 참고용이고,
          시공 전 전기안전관리자 검토는 반드시 거치세요.
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
          Electrical · Field guide
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-[color:var(--color-text-primary)] md:text-4xl">
          Sizing wires under KEC 232.5 — a field guide
        </h1>
        <p className="mt-4 text-sm text-[color:var(--color-text-tertiary)]">
          The temperature factor traps people miss, the inverter+ELB
          combo, and when to step up a size. Last updated 2026-04-27.
        </p>
      </header>

      <section className="space-y-4">
        <p>
          A 4mm² cable in a Korean factory boiler room turned brown in
          under a month. The design said it was fine. The mistake? Korean
          KEC tables assume 30°C ambient, and the boiler room ran near
          50°C. That single missing factor was the difference.
        </p>
        <p>
          Here are the traps to avoid when sizing wires under Korean
          KEC 232.5 and Naesun Code 1410-1.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-[color:var(--color-text-primary)]">
          Two conditions must be satisfied at the same time
        </h2>
        <p>
          Wire sizing has two governing conditions: <strong>ampacity</strong>{" "}
          (KEC tables) and <strong>voltage drop</strong> (Naesun 1410-1).
          Pick the larger cross-section. The common mistake is checking
          only one.
        </p>
        <p>
          Short distance with high current → ampacity governs. Long
          distance → voltage drop governs. 30 meters is the rough
          tipping point.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-[color:var(--color-text-primary)]">
          Don&apos;t forget the two derating factors
        </h2>
        <p>
          KEC tables assume 30°C and a single circuit. Real sites rarely
          match. Two derating factors apply.
        </p>
        <h3 className="text-lg font-semibold text-[color:var(--color-text-primary)]">
          Ct — ambient temperature
        </h3>
        <p>
          PVC at 40°C: ×0.87. At 50°C: ×0.71. Boiler rooms and rooftop
          trays — this is decisive. Reference: KS Table B.52.14.
        </p>
        <h3 className="text-lg font-semibold text-[color:var(--color-text-primary)]">
          Cg — circuit grouping
        </h3>
        <p>
          Three circuits in one tray: ×0.70. Four: ×0.65. Nine: ×0.50.
          Multiply Ct × Cg. At 40°C with 4 circuits, ampacity drops to
          0.87 × 0.65 = 0.566 — about half. Ignoring this is dangerous.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-[color:var(--color-text-primary)]">
          Voltage drop limits by distance
        </h2>
        <ul className="list-inside list-disc space-y-1.5 text-sm">
          <li>≤ 60m: 3%</li>
          <li>≤ 120m: 5%</li>
          <li>≤ 200m: 6%</li>
          <li>&gt; 200m: 7%</li>
        </ul>
        <p className="text-sm">
          These are for the trunk after service entry. Inside dwellings,
          design for 2% to be safe. Sensitive loads (servers, medical
          equipment): tighten to 1%.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-2xl font-semibold text-[color:var(--color-text-primary)]">
          Bottom line
        </h2>
        <p>
          Three things. Check both ampacity and voltage drop. Apply
          Ct·Cg. Treat KEC as a floor, not a ceiling — go one size up
          when in doubt. The{" "}
          <Link
            href="/en/electric-calc/wire-size"
            className="text-indigo-300 underline-offset-2 hover:underline"
          >
            wire size calculator
          </Link>{" "}
          handles all three automatically. Still, an electrical safety
          manager must review before construction.
        </p>
      </section>
    </article>
  );
}
