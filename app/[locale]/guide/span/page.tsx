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
  if (locale === "ko") {
    return {
      title: "2x10 SPF 장선, 몇 미터 갈 수 있나요? 부재 경간 실무 정리",
      description:
        "주거용 2x6 ~ 2x12 SPF #2 부재가 실제로 갈 수 있는 거리. 휨과 처짐 중 무엇이 결정요인인지, 강원 영동의 적설하중이 왜 게임 체인저인지.",
    };
  }
  if (locale === "zh") {
    return {
      title: "2x10 SPF 搁栅能跨多远?韩国构件跨度实务整理 | Workmate",
      description:
        "住宅用 2x6~2x12 SPF #2 构件实际能跨多远。弯曲与挠度哪个才是决定因素,以及江原岭东积雪荷载为何是真正的变数。",
    };
  }
  if (locale === "vi") {
    return {
      title:
        "Dầm sàn 2x10 SPF vượt được nhịp bao xa? Hướng dẫn thực tế | Workmate",
      description:
        "Cấu kiện SPF #2 2x6~2x12 dùng trong nhà ở thực tế vượt được nhịp bao xa. Uốn hay độ võng mới là yếu tố quyết định, và vì sao tải trọng tuyết ở Gangwon Yeongdong lại là yếu tố bất ngờ.",
    };
  }
  return {
    title: "2x10 SPF can span how far? Korean joist sizing | Workmate",
    description:
      "What 2x6, 2x8, 2x10 SPF #2 actually carry in Korean residential construction. Bending vs deflection, why deflection usually governs, and the snow-load surprise in Yeongdong.",
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
            {locale === "ko"
              ? "부재 경간 계산기로"
              : locale === "zh"
                ? "前往构件跨度计算器"
                : locale === "vi"
                  ? "Đến máy tính nhịp cấu kiện"
                  : "To the calculator"}
          </Link>
        </nav>
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

function ContentZh(): React.ReactElement {
  return (
    <article className="space-y-8 leading-relaxed text-[color:var(--color-text-secondary)]">
      <header>
        <p className="text-xs font-medium uppercase tracking-wider text-[color:var(--color-text-tertiary)]">
          木结构 · 结构指南
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-[color:var(--color-text-primary)] md:text-4xl">
          2x10 SPF 搁栅(joist)能跨多远？
        </h1>
        <p className="mt-4 text-sm text-[color:var(--color-text-tertiary)]">
          最后更新 2026-04-28。本指南基于 KDS 41 33 02 + NDS 2018 编写。
        </p>
      </header>

      <section className="space-y-4">
        <p>
          去年在江原道襄阳(Yangyang)为一栋独栋住宅做施工报价时发生的事。客厅开间 4.2m，参考 Canada Wood 的跨度表，认为 2x10 SPF #2 @ 400mm 间距已经足够，便据此订购了材料。可是施工完成一年后，屋檐处出现了明显的挠度(下垂)现象。原因是什么？襄阳属于江原岭东地区，积雪荷载高达 3.0 kN/m²，而当初却是按一般地区 0.5 的标准计算的，这就是问题所在。
        </p>
        <p>
          这篇文章要梳理的正是这类陷阱：为什么只看跨度表里的一行数据就直接下单是不行的。
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-[color:var(--color-text-primary)]">
          弯曲与挠度——哪一个先达到极限？
        </h2>
        <p>构件跨度必须同时满足两项检验。</p>
        <ul className="list-inside list-disc space-y-2 text-sm">
          <li>
            <strong>弯曲(Bending)</strong>：构件不发生断裂的极限，公式为
            L = √(8 × Fb × S / w)。
          </li>
          <li>
            <strong>挠度(Deflection)</strong>
            ：构件弯曲到令人观感不适的极限。楼板搁栅为 L/360，天花板为
            L/240，椽(rafter)为 L/180。
          </li>
        </ul>
        <p>
          有意思的是，在住宅常见构件中，
          <strong>几乎总是挠度先达到极限</strong>
          。从结构上看，弯曲本可以撑得更远，但最终却是挠度决定了截面尺寸，这一点即使看跨度表也不容易一眼看出来。
        </p>
        <div className="surface-elevated overflow-hidden p-4 text-sm">
          <p className="font-semibold text-[color:var(--color-text-primary)]">
            示例：SPF #2 2x10 @ 400mm，客厅楼板
          </p>
          <p className="mt-2">弯曲极限 ≈ 4,945mm</p>
          <p>挠度极限 (L/360) ≈ 4,367mm</p>
          <p className="mt-2 text-amber-200">
            → 最终以 4,367mm 为准。弯曲本可以多跨
            580mm，但因为挠度限制，最终只能到 4.37m。
          </p>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-[color:var(--color-text-primary)]">
          韩国积雪荷载——真正的变数
        </h2>
        <p>KDS 41 10 15 附录 B 按地区规定了如下积雪荷载。</p>
        <div className="overflow-hidden rounded-xl border border-[color:var(--color-border-subtle)] bg-[color:var(--color-bg-elevated)]">
          <table className="w-full text-sm">
            <thead className="text-xs uppercase tracking-wider text-[color:var(--color-text-tertiary)]">
              <tr>
                <th className="px-4 py-2 text-left font-medium">地区</th>
                <th className="px-4 py-2 text-right font-medium">积雪荷载 (kN/m²)</th>
              </tr>
            </thead>
            <tbody className="text-[color:var(--color-text-secondary)] tabular-nums">
              <tr className="border-t border-[color:var(--color-border-subtle)]">
                <td className="px-4 py-2 text-left">首尔·仁川·京畿·忠清·全罗·庆尚·济州</td>
                <td className="px-4 py-2 text-right">0.5</td>
              </tr>
              <tr className="border-t border-[color:var(--color-border-subtle)]">
                <td className="px-4 py-2 text-left">江原岭东(束草·高城·襄阳·江陵·东海·三陟)</td>
                <td className="px-4 py-2 text-right">3.0</td>
              </tr>
              <tr className="border-t border-[color:var(--color-border-subtle)]">
                <td className="px-4 py-2 text-left">郁陵岛</td>
                <td className="px-4 py-2 text-right">3.0</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          岭东、郁陵岛地区是其他地区的 6
          倍。这一差距会导致椽的截面需要提升一个等级，有时甚至两个等级。如果是在襄阳施工，原本在一般地区
          2x10 就足够的椽，就必须提升到 2x12。每栋房屋因此增加的成本大约在
          100万~200万韩元左右，这不是一笔小钱。
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-[color:var(--color-text-primary)]">
          NDS 修正系数——明确本工具的局限
        </h2>
        <p>
          这一点需要坦诚说明。本站的构件跨度计算器在 NDS 的 7
          个修正系数中，<strong>仅应用了重复构件系数 Cr</strong>
          ，其余系数均未纳入计算。
        </p>
        <ul className="list-inside list-disc space-y-1.5 text-sm">
          <li>
            <strong>CD (load duration，荷载持续时间)</strong>
            ——以积雪 2 个月为基准是 1.15，活荷载为 1.0。未应用该系数会使结果偏保守。
          </li>
          <li>
            <strong>CL (lateral stability，横向稳定性)</strong>
            ——侧向支撑效应。铺有胶合板基层的楼面该系数为 1.0，不产生影响。
          </li>
          <li>
            <strong>CF (size factor，截面尺寸系数)</strong>
            ——截面大小效应。2x10 及以上时为 0.9~1.0，结果略偏保守。
          </li>
          <li>
            <strong>CM (moisture，含水率)</strong>、
            <strong>Ct (temperature，温度)</strong>、
            <strong>Ci (incised，切痕处理)</strong>、
            <strong>Cfu (flat use，平放使用)</strong>
            ——在住宅一般环境下均为 1.0。
          </li>
        </ul>
        <p>
          结论：本工具的计算结果相较于 IRC 表格大约保守
          10~15%。这是偏安全侧的结果，在施工订料阶段没有问题;但对于成本优化至关重要的大型项目，还是应当由结构工程师依据
          NDS 全部修正系数重新计算。
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-[color:var(--color-text-primary)]">
          现场常用组合
        </h2>
        <div className="space-y-3">
          <div className="surface-elevated p-4 text-sm">
            <p className="font-semibold text-[color:var(--color-text-primary)]">
              普通独栋住宅(首尔·京畿·忠清·全罗·庆尚)
            </p>
            <p className="mt-2">
              楼板搁栅：SPF #2 2x10 @ 400mm——可达约 4.4m，满足一般客厅需求。
            </p>
            <p>
              椽：SPF #2 2x10 @ 400mm——可达约 4.5m(积雪
              0.5)，满足一般人字坡屋顶需求。
            </p>
          </div>
          <div className="surface-elevated p-4 text-sm">
            <p className="font-semibold text-[color:var(--color-text-primary)]">
              大型客厅(5m 以上)
            </p>
            <p className="mt-2">
              仅靠 SPF 不够，应改用胶合木(GLT)大梁，或考虑
              LVL，也可以选用钢结构 H 型钢梁。
            </p>
          </div>
          <div className="surface-elevated p-4 text-sm">
            <p className="font-semibold text-[color:var(--color-text-primary)]">
              江原岭东·郁陵岛(积雪 3.0)
            </p>
            <p className="mt-2">
              椽必须提升一个等级。一般地区用 2x10
              时，在岭东地区就要用到 2x12;也可以将间距从 600mm 缩窄到
              400mm，从而仍可使用 SPF Stud Grade。
            </p>
          </div>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-2xl font-semibold text-[color:var(--color-text-primary)]">
          总结
        </h2>
        <p>
          小结：通常挠度会比弯曲先达到极限;江原岭东地区因积雪荷载必须提升一个等级;由于部分
          NDS 修正系数未纳入计算，本工具的结果偏保守。本站的
          <Link
            href="/zh/timber-calc/span"
            className="text-indigo-300 underline-offset-2 hover:underline"
          >
            构件跨度计算器
          </Link>
          会自动处理上述三点，但施工前，务必请结构工程师进行复核。
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
          Kết cấu gỗ · Hướng dẫn kỹ thuật
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-[color:var(--color-text-primary)] md:text-4xl">
          Dầm sàn (joist) 2x10 SPF vượt được nhịp bao xa?
        </h1>
        <p className="mt-4 text-sm text-[color:var(--color-text-tertiary)]">
          Cập nhật lần cuối 2026-04-28. Hướng dẫn này được biên soạn dựa
          trên KDS 41 33 02 + NDS 2018.
        </p>
      </header>

      <section className="space-y-4">
        <p>
          Chuyện xảy ra năm ngoái khi tôi lập báo giá thi công cho một căn
          nhà riêng ở Yangyang. Phòng khách rộng 4.2m. Tôi tra bảng của
          Canada Wood, thấy dùng SPF #2 2x10 khoảng cách 400mm là đủ nên
          đặt vật tư theo đó. Nhưng một năm sau khi thi công xong, phần
          mái hiên bắt đầu xuất hiện độ võng rõ rệt. Lý do? Yangyang thuộc
          vùng Yeongdong của tỉnh Gangwon — tải trọng tuyết ở đây lên tới
          3.0 kN/m², trong khi tôi lại tính theo tiêu chuẩn khu vực thông
          thường là 0.5. Đó chính là nguyên nhân gây ra sự cố.
        </p>
        <p>
          Bài viết này sẽ tổng hợp lại những cái bẫy kiểu như vậy — vì sao
          chỉ nhìn một dòng trong bảng tra mà đặt hàng ngay là điều không
          nên làm.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-[color:var(--color-text-primary)]">
          Uốn và độ võng — cái nào đạt giới hạn trước?
        </h2>
        <p>Nhịp của cấu kiện phải đồng thời vượt qua hai bước kiểm tra.</p>
        <ul className="list-inside list-disc space-y-2 text-sm">
          <li>
            <strong>Uốn (Bending)</strong>: giới hạn để cấu kiện không bị
            gãy. Công thức L = √(8 × Fb × S / w).
          </li>
          <li>
            <strong>Độ võng (Deflection)</strong>: giới hạn khi cấu kiện
            bị uốn cong đến mức gây khó chịu khi nhìn. Dầm sàn (joist) là
            L/360, trần nhà là L/240, xà gồ (rafter) là L/180.
          </li>
        </ul>
        <p>
          Điều thú vị là, với các cấu kiện dân dụng thông thường,{" "}
          <strong>gần như lúc nào độ võng cũng đạt giới hạn trước</strong>.
          Về mặt kết cấu, uốn có thể chịu được nhịp xa hơn, nhưng độ võng
          lại là yếu tố quyết định kích thước tiết diện. Đây là điểm mà
          nhìn vào bảng tra cũng không dễ nhận ra ngay.
        </p>
        <div className="surface-elevated overflow-hidden p-4 text-sm">
          <p className="font-semibold text-[color:var(--color-text-primary)]">
            Ví dụ: SPF #2 2x10 @ 400mm, sàn phòng khách
          </p>
          <p className="mt-2">Giới hạn uốn ≈ 4,945mm</p>
          <p>Giới hạn độ võng (L/360) ≈ 4,367mm</p>
          <p className="mt-2 text-amber-200">
            → Cuối cùng giới hạn là 4,367mm. Uốn có thể vượt thêm 580mm
            nữa, nhưng vì độ võng nên chỉ dừng lại ở 4.37m.
          </p>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-[color:var(--color-text-primary)]">
          Tải trọng tuyết ở Hàn Quốc — yếu tố thay đổi cuộc chơi
        </h2>
        <p>
          Phụ lục B của KDS 41 10 15 quy định tải trọng tuyết theo từng
          khu vực như sau.
        </p>
        <div className="overflow-hidden rounded-xl border border-[color:var(--color-border-subtle)] bg-[color:var(--color-bg-elevated)]">
          <table className="w-full text-sm">
            <thead className="text-xs uppercase tracking-wider text-[color:var(--color-text-tertiary)]">
              <tr>
                <th className="px-4 py-2 text-left font-medium">Khu vực</th>
                <th className="px-4 py-2 text-right font-medium">Tải trọng tuyết (kN/m²)</th>
              </tr>
            </thead>
            <tbody className="text-[color:var(--color-text-secondary)] tabular-nums">
              <tr className="border-t border-[color:var(--color-border-subtle)]">
                <td className="px-4 py-2 text-left">Seoul · Incheon · Gyeonggi · Chungcheong · Jeolla · Gyeongsang · Jeju</td>
                <td className="px-4 py-2 text-right">0.5</td>
              </tr>
              <tr className="border-t border-[color:var(--color-border-subtle)]">
                <td className="px-4 py-2 text-left">Gangwon Yeongdong (Sokcho · Goseong · Yangyang · Gangneung · Donghae · Samcheok)</td>
                <td className="px-4 py-2 text-right">3.0</td>
              </tr>
              <tr className="border-t border-[color:var(--color-border-subtle)]">
                <td className="px-4 py-2 text-left">Đảo Ulleung</td>
                <td className="px-4 py-2 text-right">3.0</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          Yeongdong và Ulleung cao gấp 6 lần so với các khu vực khác. Sự
          chênh lệch này khiến tiết diện xà gồ (rafter) phải tăng thêm một
          cấp, đôi khi là hai cấp. Nếu thi công tại Yangyang, xà gồ vốn
          chỉ cần 2x10 ở khu vực thông thường sẽ phải nâng lên 2x12.
          Chênh lệch chi phí vào khoảng 1~2 triệu won mỗi căn nhà. Đây
          không phải là một khoản tiền nhỏ.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-[color:var(--color-text-primary)]">
          Hệ số điều chỉnh NDS — giới hạn rõ ràng của công cụ này
        </h2>
        <p>
          Đây là điều cần nói thẳng thắn. Máy tính nhịp cấu kiện của
          trang này <strong>chỉ áp dụng hệ số cấu kiện lặp lại Cr</strong>{" "}
          trong số 7 hệ số điều chỉnh của NDS. Các hệ số còn lại chưa
          được áp dụng.
        </p>
        <ul className="list-inside list-disc space-y-1.5 text-sm">
          <li>
            <strong>CD (load duration – thời gian tác dụng tải)</strong> —
            với tuyết, hệ số theo mốc 2 tháng là 1.15; với hoạt tải là
            1.0. Do chưa áp dụng nên kết quả thiên về an toàn.
          </li>
          <li>
            <strong>CL (lateral stability – ổn định ngang)</strong> — hiệu
            ứng giằng ngang. Với sàn đã phủ ván ép, hệ số là 1.0 nên
            không ảnh hưởng.
          </li>
          <li>
            <strong>CF (size factor – hệ số kích thước tiết diện)</strong>{" "}
            — hiệu ứng kích thước tiết diện. Từ 2x10 trở lên, hệ số ở mức
            0.9~1.0 nên hơi thiên về an toàn.
          </li>
          <li>
            <strong>CM (moisture – độ ẩm)</strong>,{" "}
            <strong>Ct (temperature – nhiệt độ)</strong>,{" "}
            <strong>Ci (incised – rạch khía)</strong>,{" "}
            <strong>Cfu (flat use – dùng nằm phẳng)</strong> — trong môi
            trường dân dụng thông thường đều bằng 1.0.
          </li>
        </ul>
        <p>
          Kết luận. Kết quả của công cụ này thiên về an toàn khoảng
          10~15% so với bảng tra IRC. Vì là kết quả an toàn nên không có
          vấn đề gì ở giai đoạn đặt vật tư thi công; nhưng với các dự án
          lớn mà việc tối ưu chi phí là quan trọng, kỹ sư kết cấu nên
          tính lại đầy đủ theo các hệ số điều chỉnh của NDS.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-[color:var(--color-text-primary)]">
          Các tổ hợp thường dùng trên công trường
        </h2>
        <div className="space-y-3">
          <div className="surface-elevated p-4 text-sm">
            <p className="font-semibold text-[color:var(--color-text-primary)]">
              Nhà ở riêng lẻ thông thường (Seoul · Gyeonggi · Chungcheong
              · Jeolla · Gyeongsang)
            </p>
            <p className="mt-2">
              Dầm sàn: SPF #2 2x10 @ 400mm — đạt khoảng 4.4m. Đủ dùng cho
              phòng khách thông thường.
            </p>
            <p>
              Xà gồ: SPF #2 2x10 @ 400mm — đạt khoảng 4.5m (tải trọng
              tuyết 0.5). Đủ dùng cho mái dốc đôi thông thường.
            </p>
          </div>
          <div className="surface-elevated p-4 text-sm">
            <p className="font-semibold text-[color:var(--color-text-primary)]">
              Phòng khách lớn (từ 5m trở lên)
            </p>
            <p className="mt-2">
              Dùng SPF là không đủ. Nên chuyển sang dầm gỗ dán nhiều lớp
              (GLT) hoặc xem xét LVL. Hoặc dùng dầm thép hình H.
            </p>
          </div>
          <div className="surface-elevated p-4 text-sm">
            <p className="font-semibold text-[color:var(--color-text-primary)]">
              Gangwon Yeongdong · Ulleung (tải trọng tuyết 3.0)
            </p>
            <p className="mt-2">
              Xà gồ phải tăng thêm một cấp. Nếu khu vực thông thường dùng
              2x10 thì ở Yeongdong phải dùng 2x12; hoặc có thể thu hẹp
              khoảng cách từ 600mm xuống 400mm để vẫn dùng được SPF Stud
              Grade.
            </p>
          </div>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-2xl font-semibold text-[color:var(--color-text-primary)]">
          Kết luận
        </h2>
        <p>
          Tóm lại. Độ võng thường đạt giới hạn trước uốn; vùng Gangwon
          Yeongdong phải tăng thêm một cấp do tải trọng tuyết; và vì một
          số hệ số điều chỉnh NDS chưa được áp dụng nên kết quả của công
          cụ này thiên về an toàn. Dùng{" "}
          <Link
            href="/vi/timber-calc/span"
            className="text-indigo-300 underline-offset-2 hover:underline"
          >
            máy tính nhịp cấu kiện
          </Link>{" "}
          của trang này để tự động xử lý ba điều trên. Tuy nhiên, trước
          khi thi công nhất định phải có kỹ sư kết cấu kiểm tra lại.
        </p>
      </section>
    </article>
  );
}
