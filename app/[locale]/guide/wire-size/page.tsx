import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";

interface PageProps {
  params: Promise<{ locale: string }>;
}

const TITLE: Record<"ko" | "en" | "zh" | "vi", string> = {
  ko: "전선 굵기, 이렇게 정해야 후회 없습니다",
  en: "Sizing wires under KEC 232.5 — a field guide",
  zh: "电线粗细，这样选才不会后悔",
  vi: "Cách chọn tiết diện dây dẫn để không phải hối hận",
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  if (locale === "zh") {
    return {
      title: "电线粗细,这样选才不会后悔 — KEC 232.5 现场指南",
      description:
        "只看 KEC 232.5 来定截面积必出问题。从锅炉房跳闸的案例到变频器电路的陷阱,汇总现场经验整理而成的实务指南。",
    };
  }
  if (locale === "vi") {
    return {
      title:
        "Cách chọn tiết diện dây dẫn để không phải hối hận — Hướng dẫn thực tế KEC 232.5",
      description:
        "Chỉ nhìn KEC 232.5 để chọn tiết diện thì chắc chắn sẽ gặp rắc rối. Từ các trường hợp nhảy aptomat trong phòng lò hơi đến cạm bẫy của mạch biến tần, đây là hướng dẫn thực tế được đúc kết từ kinh nghiệm hiện trường.",
    };
  }
  if (locale !== "ko") {
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
  const localeKey: "ko" | "en" | "zh" | "vi" =
    locale === "ko" ? "ko" : locale === "zh" ? "zh" : locale === "vi" ? "vi" : "en";
  return (
    <main className="px-4 pb-16 pt-6 md:px-6 md:pt-12">
      <div className="mx-auto max-w-3xl">
        <Breadcrumbs
          path="/guide/wire-size"
          locale={localeKey}
          id="guide-wire-size"
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

function ContentZh(): React.ReactElement {
  return (
    <article className="space-y-8 leading-relaxed text-[color:var(--color-text-secondary)]">
      <header>
        <p className="text-xs font-medium uppercase tracking-wider text-[color:var(--color-text-tertiary)]">
          电气 · 现场指南
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-[color:var(--color-text-primary)] md:text-4xl">
          电线粗细，这样选才不会后悔
        </h1>
        <p className="mt-4 text-sm text-[color:var(--color-text-tertiary)]">
          结合现场案例讲解 KEC 232.5 与内线规程(내선규정)1410-1 的实务指南。最后更新 2026-04-27。
        </p>
      </header>

      <section className="space-y-4">
        <p>
          我曾在工厂锅炉房见过 4mm² 电缆一个月内就变色的情况。按设计标准来看判定是合适的，但遗漏了一点——周边环境温度接近 50 度。
          KEC 表格以 30 度为基准，而现场几乎不会按这个基准运行。
        </p>
        <p>
          这篇文章整理了这类陷阱。跟着一步步往下看，就会明白为什么不能只看表格里的一行数字就下结论。
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-[color:var(--color-text-primary)]">
          截面积必须同时满足两个条件
        </h2>
        <p>
          决定电线粗细的标准有两个。一个是<strong>载流量</strong>
          (KEC 表格)，另一个是<strong>电压降</strong>
          (内线规程 1410-1)。必须在两者中选择更大的截面积。现场常见的误区就是只看其中一个条件就下结论。
        </p>
        <p>
          短距离、大电流的情况下，载流量是决定因素。相反，长距离时电压降会成为决定因素。可以记住 30m 大致是分界点。
        </p>
        <div className="surface-elevated overflow-hidden p-4 text-sm">
          <p className="font-semibold text-[color:var(--color-text-primary)]">
            示例
          </p>
          <p className="mt-2">
            220V 单相二线制，电流 100A，距离 5m → 截面积 50mm²(由载流量决定)
          </p>
          <p>
            220V 单相二线制，电流 30A，距离 80m → 截面积 16mm²(由电压降决定)
          </p>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-[color:var(--color-text-primary)]">
          不要漏掉两个修正系数(Ct·Cg)
        </h2>
        <p>
          KEC 表格以 30°C、单一回路为基准。实际现场几乎都不一样，所以需要两项修正。
        </p>
        <h3 className="mt-3 text-lg font-semibold text-[color:var(--color-text-primary)]">
          Ct — 环境温度修正
        </h3>
        <p>
          PVC 绝缘电缆在 40°C 环境施工时要乘以 0.87，50°C 时为 0.71。锅炉房或屋顶桥架这类环境下，这项修正是决定性的。对照的是表
          B.52.14，本站在隔热信息旁边提供的电线粗细计算器会自动完成修正。
        </p>
        <h3 className="mt-3 text-lg font-semibold text-[color:var(--color-text-primary)]">
          Cg — 回路合并修正
        </h3>
        <p>
          同一桥架内有 3 个回路时乘以 0.70，4 个回路时为 0.65，9 个回路时会降到 0.50。也就是说，在强电配电箱中，如果回路集中在一处桥架，载流量会很快降到一半左右。
        </p>
        <p>
          两项修正需要相乘应用。40°C、4 回路桥架的情况下：0.87 ×
          0.65 = 0.566，载流量几乎降到一半。忽视这一点非常危险。
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-[color:var(--color-text-primary)]">
          使用 XLPE 电缆有什么不同？
        </h2>
        <p>
          XLPE(交联聚乙烯)绝缘电缆导体最高温度可达 90°C，比 70°C 的
          PVC 电缆载流量高出约 25%。单价差异不大，却能把截面积降低一个等级，从而节省成本。不过它燃烧时产生的有毒气体比 PVC
          少，因此在精密工厂或通信室这类场所更受青睐。
        </p>
        <p>
          需要注意一点。本站计算器把 XLPE 的效果简化处理为 PVC 表格数值 × 1.25。精密设计时应直接查阅 XLPE 专用表格(KS C IEC
          60364-5-52 附录 B 表 B.52.4)。
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-[color:var(--color-text-primary)]">
          关于铝导体的韩国市场现状
        </h2>
        <p>
          整个行业中铝导体的占比正在逐步上升，但韩国住宅施工现场依然以铜导体为主。不过在 100A 以上的干线或引入线中，也经常能看到铝导体。
        </p>
        <p>
          铝导体在相同截面积下，导电率约为铜的 62% 左右。因此电压降系数要乘以 1.6，载流量也必须依据专用表格，而不是铜导体的表格。KEC 规定不建议使用 16mm² 以下的铝导体。本站计算器在输入 16mm² 以下铝导体时会自动弹出警告。
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-[color:var(--color-text-primary)]">
          按距离划分的允许电压降率(内线规程 1410-1)
        </h2>
        <div className="overflow-hidden rounded-xl border border-[color:var(--color-border-subtle)] bg-[color:var(--color-bg-elevated)]">
          <table className="w-full text-sm">
            <thead className="text-xs uppercase tracking-wider text-[color:var(--color-text-tertiary)]">
              <tr>
                <th className="px-4 py-2 text-left font-medium">距离</th>
                <th className="px-4 py-2 text-right font-medium">
                  允许电压降率
                </th>
              </tr>
            </thead>
            <tbody className="text-[color:var(--color-text-secondary)]">
              <tr className="border-t border-[color:var(--color-border-subtle)]">
                <td className="px-4 py-2">≤ 60m</td>
                <td className="px-4 py-2 text-right tabular-nums">3%</td>
              </tr>
              <tr className="border-t border-[color:var(--color-border-subtle)]">
                <td className="px-4 py-2">&gt; 60m ~ 120m</td>
                <td className="px-4 py-2 text-right tabular-nums">5%</td>
              </tr>
              <tr className="border-t border-[color:var(--color-border-subtle)]">
                <td className="px-4 py-2">&gt; 120m ~ 200m</td>
                <td className="px-4 py-2 text-right tabular-nums">6%</td>
              </tr>
              <tr className="border-t border-[color:var(--color-border-subtle)]">
                <td className="px-4 py-2">&gt; 200m</td>
                <td className="px-4 py-2 text-right tabular-nums">7%</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-sm">
          补充一点。以上数值是引入后到干线为止的基准。受电设施内部通常建议按 2% 以内设计。有精密设备的重要回路(服务器机房、医疗设备等)则要更严格地控制在 1% 以内。
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-[color:var(--color-text-primary)]">
          常见问题
        </h2>
        <div className="space-y-4">
          <div className="surface-elevated p-4">
            <p className="font-semibold text-[color:var(--color-text-primary)]">
              Q. 220V 30A 单相二线制，距离 50m。截面积应该选多少？
            </p>
            <p className="mt-2 text-sm">
              允许电压降 3% = 6.6V。A_min = (35.6 × 50 × 30) / (1000 ×
              6.6) = 8.09mm² → KS 标准 10mm²。从载流量角度看，10mm²
              单相可承受 57A，应对 30A 毫无压力。结果选 10mm²。如果是锅炉房这类高温环境，建议提高一个等级选用 16mm² 更安全。
            </p>
          </div>
          <div className="surface-elevated p-4">
            <p className="font-semibold text-[color:var(--color-text-primary)]">
              Q. 变频器负载的截面积该怎么定？
            </p>
            <p className="mt-2 text-sm">
              变频器本身按额定电流的标准来计算，和普通负载一样。问题出在断路器上。由于变频器的 Y 电容漏电电流，30mA 的
              ELB(漏电断路器)会频繁跳闸。应改用 MCB·MCCB 而非
              ELB，如果必须要有漏电保护，可以考虑 100mA·300mA 或
              IT 系统专用模块。
            </p>
          </div>
          <div className="surface-elevated p-4">
            <p className="font-semibold text-[color:var(--color-text-primary)]">
              Q. 只按 KEC 表格来选不就行了吗？
            </p>
            <p className="mt-2 text-sm">
              KEC 是最低安全标准，是及格线而非最优解。考虑到温度、回路合并以及未来负载增加的余地，现场通常会比表格数值提高一到两个等级施工。成本差异一般只占总工程费用的
              1~3%，与其后悔不如留有余量更划算。
            </p>
          </div>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-2xl font-semibold text-[color:var(--color-text-primary)]">
          总结
        </h2>
        <p>
          总结成三点。第一，同时查看两个条件(载流量·电压降)。第二，不要漏掉 Ct·Cg 修正。第三，把 KEC 当作最低标准，预留一个等级的余量。本站的{" "}
          <Link
            href="/zh/electric-calc/wire-size"
            className="text-indigo-300 underline-offset-2 hover:underline"
          >
            电线粗细计算器
          </Link>
          会自动处理以上三项。不过计算结果仅供参考，施工前请务必经过电气安全负责人的审核。
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
          Điện · Hướng dẫn thực tế
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-[color:var(--color-text-primary)] md:text-4xl">
          Cách chọn tiết diện dây dẫn để không phải hối hận
        </h1>
        <p className="mt-4 text-sm text-[color:var(--color-text-tertiary)]">
          Hướng dẫn thực tế diễn giải KEC 232.5 và Quy định nội tuyến
          (내선규정) 1410-1 bằng các tình huống thực tế. Cập nhật lần
          cuối 2026-04-27.
        </p>
      </header>

      <section className="space-y-4">
        <p>
          Tôi từng thấy một sợi cáp 4mm² trong phòng lò hơi của nhà máy
          bị đổi màu chỉ sau một tháng. Theo thiết kế thì vẫn đạt
          chuẩn. Nhưng có một điều bị bỏ sót — môi trường xung quanh
          gần 50 độ C. Bảng KEC lấy chuẩn 30 độ, còn thực tế hiện
          trường hầu như không bao giờ đúng theo chuẩn đó.
        </p>
        <p>
          Bài viết này tổng hợp những cạm bẫy kiểu như vậy. Đọc theo
          từng bước, bạn sẽ hiểu vì sao không thể chỉ nhìn một dòng
          trong bảng tra rồi kết luận.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-[color:var(--color-text-primary)]">
          Tiết diện phải thoả mãn đồng thời hai điều kiện
        </h2>
        <p>
          Có hai tiêu chí để xác định tiết diện dây dẫn. Một là{" "}
          <strong>dòng cho phép</strong> (bảng KEC), hai là{" "}
          <strong>sụt áp</strong> (Quy định nội tuyến 1410-1). Phải
          chọn tiết diện lớn hơn trong hai kết quả. Sai lầm phổ biến
          tại hiện trường là chỉ xét một trong hai rồi dừng lại.
        </p>
        <p>
          Khoảng cách ngắn với dòng điện lớn thì dòng cho phép là yếu
          tố quyết định. Ngược lại, khoảng cách dài thì sụt áp là yếu
          tố quyết định. Có thể ghi nhớ mốc 30m là điểm bản lề.
        </p>
        <div className="surface-elevated overflow-hidden p-4 text-sm">
          <p className="font-semibold text-[color:var(--color-text-primary)]">
            Ví dụ
          </p>
          <p className="mt-2">
            220V một pha hai dây, dòng điện 100A, khoảng cách 5m →
            tiết diện 50mm² (do dòng cho phép quyết định)
          </p>
          <p>
            220V một pha hai dây, dòng điện 30A, khoảng cách 80m →
            tiết diện 16mm² (do sụt áp quyết định)
          </p>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-[color:var(--color-text-primary)]">
          Đừng quên hai hệ số hiệu chỉnh (Ct·Cg)
        </h2>
        <p>
          Bảng KEC lấy chuẩn 30°C và một mạch đơn. Thực tế hiện trường
          hầu như luôn khác, vì vậy cần hai phép hiệu chỉnh.
        </p>
        <h3 className="mt-3 text-lg font-semibold text-[color:var(--color-text-primary)]">
          Ct — hiệu chỉnh nhiệt độ môi trường
        </h3>
        <p>
          Cách điện PVC lắp đặt ở môi trường 40°C thì nhân với 0.87. Ở
          50°C là 0.71. Với phòng lò hơi hay khay cáp trên mái, hệ số
          này mang tính quyết định. Tham chiếu bảng B.52.14 — công cụ
          tính tiết diện dây dẫn của trang này (ngay cạnh phần cách
          nhiệt) sẽ tự động áp dụng hiệu chỉnh.
        </p>
        <h3 className="mt-3 text-lg font-semibold text-[color:var(--color-text-primary)]">
          Cg — hiệu chỉnh gộp mạch
        </h3>
        <p>
          Nếu cùng một khay cáp có 3 mạch thì nhân với 0.70. 4 mạch là
          0.65. 9 mạch giảm xuống còn 0.50. Nói cách khác, trong tủ
          điện công suất lớn, nếu các mạch dồn vào một khay cáp thì
          dòng cho phép nhanh chóng giảm còn khoảng một nửa.
        </p>
        <p>
          Hai hệ số hiệu chỉnh được áp dụng bằng cách nhân với nhau. Ở
          40°C với khay 4 mạch: 0.87 × 0.65 = 0.566. Dòng cho phép gần
          như giảm một nửa. Bỏ qua điều này thực sự nguy hiểm.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-[color:var(--color-text-primary)]">
          Dùng XLPE thì khác thế nào?
        </h2>
        <p>
          Cách điện XLPE (polyethylene liên kết ngang) có nhiệt độ tối
          đa của lõi dẫn lên tới 90°C, nên dòng cho phép cao hơn
          khoảng 25% so với PVC (70°C). Chênh lệch đơn giá không lớn
          nhưng có thể giảm một cấp tiết diện, nhờ đó tiết kiệm chi
          phí. Tuy nhiên khi cháy, XLPE sinh ít khí độc hơn PVC nên
          thường được ưa chuộng ở các nhà máy đòi hỏi độ chính xác cao
          hoặc phòng thông tin liên lạc.
        </p>
        <p>
          Một lưu ý. Công cụ tính của trang này xử lý đơn giản hiệu
          ứng XLPE bằng cách lấy bảng PVC nhân × 1.25. Với thiết kế
          chính xác, cần tra trực tiếp bảng chuyên dụng cho XLPE (KS C
          IEC 60364-5-52, Phụ lục B, Bảng B.52.4).
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-[color:var(--color-text-primary)]">
          Thực tế thị trường Hàn Quốc về dây dẫn nhôm
        </h2>
        <p>
          Tỷ lệ sử dụng nhôm đang tăng dần trong toàn ngành, nhưng các
          công trình nhà ở tại Hàn Quốc vẫn chủ yếu dùng dây đồng. Tuy
          vậy, với đường trục hoặc dây dẫn vào từ 100A trở lên, dây
          nhôm cũng thường xuất hiện.
        </p>
        <p>
          Với cùng tiết diện, độ dẫn điện của nhôm chỉ khoảng 62% so
          với đồng. Vì vậy hệ số sụt áp phải nhân với 1.6, còn dòng
          cho phép phải tra theo bảng riêng chứ không dùng bảng của
          dây đồng. Theo KEC, không khuyến khích dùng nhôm dưới
          16mm². Công cụ tính của trang này sẽ tự động hiển thị cảnh
          báo khi nhập dây nhôm dưới 16mm².
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-[color:var(--color-text-primary)]">
          Tỷ lệ sụt áp cho phép theo khoảng cách (Quy định nội tuyến
          1410-1)
        </h2>
        <div className="overflow-hidden rounded-xl border border-[color:var(--color-border-subtle)] bg-[color:var(--color-bg-elevated)]">
          <table className="w-full text-sm">
            <thead className="text-xs uppercase tracking-wider text-[color:var(--color-text-tertiary)]">
              <tr>
                <th className="px-4 py-2 text-left font-medium">
                  Khoảng cách
                </th>
                <th className="px-4 py-2 text-right font-medium">
                  Tỷ lệ sụt áp cho phép
                </th>
              </tr>
            </thead>
            <tbody className="text-[color:var(--color-text-secondary)]">
              <tr className="border-t border-[color:var(--color-border-subtle)]">
                <td className="px-4 py-2">≤ 60m</td>
                <td className="px-4 py-2 text-right tabular-nums">3%</td>
              </tr>
              <tr className="border-t border-[color:var(--color-border-subtle)]">
                <td className="px-4 py-2">&gt; 60m ~ 120m</td>
                <td className="px-4 py-2 text-right tabular-nums">5%</td>
              </tr>
              <tr className="border-t border-[color:var(--color-border-subtle)]">
                <td className="px-4 py-2">&gt; 120m ~ 200m</td>
                <td className="px-4 py-2 text-right tabular-nums">6%</td>
              </tr>
              <tr className="border-t border-[color:var(--color-border-subtle)]">
                <td className="px-4 py-2">&gt; 200m</td>
                <td className="px-4 py-2 text-right tabular-nums">7%</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-sm">
          Một điều bổ sung. Các số trên áp dụng cho đoạn từ sau điểm
          đấu nối đến hết đường trục. Bên trong khu vực sử dụng điện,
          thường nên thiết kế trong phạm vi 2%. Với các mạch có thiết
          bị chính xác quan trọng (phòng máy chủ, thiết bị y tế...),
          nên siết chặt hơn, trong phạm vi 1%.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-[color:var(--color-text-primary)]">
          Câu hỏi thường gặp
        </h2>
        <div className="space-y-4">
          <div className="surface-elevated p-4">
            <p className="font-semibold text-[color:var(--color-text-primary)]">
              Q. 220V 30A một pha hai dây, khoảng cách 50m. Nên chọn
              tiết diện bao nhiêu?
            </p>
            <p className="mt-2 text-sm">
              Sụt áp cho phép 3% = 6.6V. A_min = (35.6 × 50 × 30) /
              (1000 × 6.6) = 8.09mm² → theo tiêu chuẩn KS là 10mm².
              Xét về dòng cho phép, 10mm² một pha chịu được 57A, xử
              lý 30A hoàn toàn thoải mái. Kết quả chọn 10mm². Nếu là
              môi trường nhiệt độ cao như phòng lò hơi, nên tăng thêm
              một cấp lên 16mm² để an toàn hơn.
            </p>
          </div>
          <div className="surface-elevated p-4">
            <p className="font-semibold text-[color:var(--color-text-primary)]">
              Q. Tải biến tần thì xác định tiết diện thế nào?
            </p>
            <p className="mt-2 text-sm">
              Bản thân biến tần được tính theo dòng điện định mức
              giống như tải thông thường. Vấn đề nằm ở aptomat (cầu
              dao tự động). Do dòng rò từ tụ điện Y của biến tần, loại
              ELB 30mA thường xuyên bị nhảy. Nên dùng MCB·MCCB thay vì
              ELB, và nếu bắt buộc phải có bảo vệ chống rò điện thì
              cân nhắc loại 100mA·300mA hoặc module dành cho hệ thống
              IT.
            </p>
          </div>
          <div className="surface-elevated p-4">
            <p className="font-semibold text-[color:var(--color-text-primary)]">
              Q. Chỉ cần theo đúng bảng KEC là được phải không?
            </p>
            <p className="mt-2 text-sm">
              KEC là tiêu chuẩn an toàn tối thiểu — nghĩa là đạt
              chuẩn, chứ chưa phải tối ưu. Nếu tính đến nhiệt độ, việc
              gộp mạch và khả năng tăng tải trong tương lai, người ta
              thường thi công với tiết diện lớn hơn bảng tra một đến
              hai cấp. Chênh lệch chi phí thường chỉ chiếm khoảng
              1~3% tổng chi phí công trình, nên thà dư còn hơn phải
              hối hận.
            </p>
          </div>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-2xl font-semibold text-[color:var(--color-text-primary)]">
          Tổng kết
        </h2>
        <p>
          Tóm lại có ba điều. Một, xem xét đồng thời hai điều kiện
          (dòng cho phép · sụt áp). Hai, không bỏ sót hiệu chỉnh
          Ct·Cg. Ba, xem KEC là mức tối thiểu và chừa thêm một cấp dự
          phòng.{" "}
          <Link
            href="/vi/electric-calc/wire-size"
            className="text-indigo-300 underline-offset-2 hover:underline"
          >
            Công cụ tính tiết diện dây dẫn
          </Link>{" "}
          của trang này tự động xử lý ba điều trên. Tuy nhiên kết quả
          chỉ mang tính tham khảo, trước khi thi công nhất định phải
          qua kiểm tra của người quản lý an toàn điện.
        </p>
      </section>
    </article>
  );
}
