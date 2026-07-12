import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";

interface PageProps {
  params: Promise<{ locale: string }>;
}

const TITLE: Record<"ko" | "en" | "zh" | "vi", string> = {
  ko: "단열, 중부2 외벽 0.17 통과시키는 현실적 조합",
  en: "Korean insulation code in plain English",
  zh: "隔热，让中部2外墙通过0.17的现实组合",
  vi: "Cách nhiệt, tổ hợp thực tế để tường ngoài Trung tâm-2 đạt chuẩn 0.17",
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  if (locale === "ko") {
    return {
      title: "단열, 중부2 외벽 0.17 통과시키는 현실적 조합 | Workmate",
      description:
        "에너지절약 설계기준 별표1을 매주 들여다보는 사람의 정리. 글라스울 140mm로는 중부2 못 통과합니다. 그럼 어떻게 하는지.",
    };
  }
  if (locale === "zh") {
    return {
      title: "隔热，让中部2外墙通过0.17的现实组合 | Workmate",
      description:
        "每周查阅《建筑物节能设计标准》附表1的人整理的笔记。玻璃棉140mm无法通过中部2标准。那么到底该怎么做。",
    };
  }
  if (locale === "vi") {
    return {
      title:
        "Cách nhiệt, tổ hợp thực tế để tường ngoài Trung tâm-2 đạt chuẩn 0.17 | Workmate",
      description:
        "Ghi chú của người hằng tuần tra cứu Phụ lục 1 Tiêu chuẩn Thiết kế Tiết kiệm Năng lượng Công trình. Bông thủy tinh 140mm không thể đạt chuẩn Trung tâm-2. Vậy phải làm thế nào.",
    };
  }
  return {
    title: "Korean insulation code in plain English | Workmate",
    description:
      "Korea's energy code by region — Central1, Central2, South, Jeju — and what wall buildup actually passes.",
  };
}

export default async function InsulationGuidePage({
  params,
}: PageProps): Promise<React.ReactElement> {
  const { locale } = await params;
  const localeKey: "ko" | "en" | "zh" | "vi" =
    locale === "ko" ? "ko" : locale === "zh" ? "zh" : locale === "vi" ? "vi" : "en";
  return (
    <main className="px-4 pb-16 pt-6 md:px-6 md:pt-12">
      <div className="mx-auto max-w-3xl">
        <Breadcrumbs
          path="/guide/insulation"
          locale={localeKey}
          id="guide-insulation"
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

function ContentZh(): React.ReactElement {
  return (
    <article className="space-y-8 leading-relaxed text-[color:var(--color-text-secondary)]">
      <header>
        <p className="text-xs font-medium uppercase tracking-wider text-[color:var(--color-text-tertiary)]">
          隔热 · 报批指南
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-[color:var(--color-text-primary)] md:text-4xl">
          隔热，让中部2外墙通过0.17的现实组合
        </h1>
        <p className="mt-4 text-sm text-[color:var(--color-text-tertiary)]">
          最后更新 2026-04-27。本指南以《建筑物节能设计标准》附表1为依据编写。
        </p>
      </header>

      <section className="space-y-4">
        <p>
          中部2(首尔·仁川·大部分京畿)外墙直接外气·居室部位的U值上限是0.17 W/m²·K。2x6木结构中填充玻璃棉24K 140mm无法通过这个标准。用本站的隔热计算器算出的准确数字是——U值0.250。差得还很远。
        </p>
        <p>那实际上要怎样才能通过呢？有三条路径。</p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-[color:var(--color-text-primary)]">
          路径1. 增加外保温(最常见的方法)
        </h2>
        <p>
          内部2x6(140mm) + OSB + <strong>外部增加50~75mm XPS或PIR</strong>。这样U值会迅速下降。
        </p>
        <div className="surface-elevated overflow-hidden p-4 text-sm">
          <p className="font-semibold text-[color:var(--color-text-primary)]">
            构成示例
          </p>
          <p className="mt-2">
            石膏板12.5mm + 玻璃棉24K 140mm + OSB 11mm +{" "}
            <strong>XPS 50mm</strong> + 护墙板
          </p>
          <p className="mt-1">
            R值合计 = 0.07 + 3.68 + 0.085 + 1.72 + 0.027 = 5.58 m²·K/W
          </p>
          <p>+ 表面热阻0.15 → 总R值5.73 → U值 = <strong>0.175 W/m²·K</strong></p>
          <p className="mt-2 text-amber-200">
            刚好通过中部2的0.17上限。为确保安全余量，将XPS提高到75mm，U值可降至0.146，绰绰有余。
          </p>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-[color:var(--color-text-primary)]">
          路径2. 用2x8墙骨柱直接加大隔热厚度
        </h2>
        <p>
          使用2x8(184mm)墙骨柱 + 高密度玻璃棉48K 184mm。不使用外保温的做法。
        </p>
        <p>R = 0.184 / 0.034 = 5.41 m²·K/W。加上其他层后总R约5.6，U ≈ 0.179——刚好能通过，但考虑到施工误差，已属临界线。</p>
        <p>
          这个方法的缺点是骨架材料成本上升与施工难度增加。2x8的施工比2x6多耗费约30%的人工。因此更倾向于推荐路径1。
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-[color:var(--color-text-primary)]">
          路径3. 喷涂PU泡沫施工(利弊参半)
        </h2>
        <p>
          在2x6(140mm)内填充PU泡沫。λ = 0.024非常低，即使相同厚度也能达到R = 5.83。无需外保温即可通过。
        </p>
        <p>
          缺点有三个。(1)成本。每平方米材料费是玻璃棉的4~5倍。(2)结露。在湿度较高的环境中，曾有泡沫内部发生结露的案例报告。(3)火灾时产生有毒气体。多户住宅·商业设施需要另行进行防火审查。
        </p>
        <p className="text-sm">
          如果是独栋住宅的外墙，我推荐路径1。成本可控，结露风险也较低。
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-[color:var(--color-text-primary)]">
          各地区限值比较(以外墙直接外气·居室为基准)
        </h2>
        <div className="overflow-hidden rounded-xl border border-[color:var(--color-border-subtle)] bg-[color:var(--color-bg-elevated)]">
          <table className="w-full text-sm">
            <thead className="text-xs uppercase tracking-wider text-[color:var(--color-text-tertiary)]">
              <tr>
                <th className="px-4 py-2 text-left font-medium">地区</th>
                <th className="px-4 py-2 text-right font-medium">U值上限 (W/m²·K)</th>
                <th className="px-4 py-2 text-right font-medium">对应最小R值</th>
              </tr>
            </thead>
            <tbody className="text-[color:var(--color-text-secondary)]">
              <tr className="border-t border-[color:var(--color-border-subtle)]">
                <td className="px-4 py-2">中部1(江原·京畿北部)</td>
                <td className="px-4 py-2 text-right tabular-nums">0.150</td>
                <td className="px-4 py-2 text-right tabular-nums">6.67</td>
              </tr>
              <tr className="border-t border-[color:var(--color-border-subtle)]">
                <td className="px-4 py-2">中部2(首尔·仁川·大部分京畿)</td>
                <td className="px-4 py-2 text-right tabular-nums">0.170</td>
                <td className="px-4 py-2 text-right tabular-nums">5.88</td>
              </tr>
              <tr className="border-t border-[color:var(--color-border-subtle)]">
                <td className="px-4 py-2">南部</td>
                <td className="px-4 py-2 text-right tabular-nums">0.220</td>
                <td className="px-4 py-2 text-right tabular-nums">4.55</td>
              </tr>
              <tr className="border-t border-[color:var(--color-border-subtle)]">
                <td className="px-4 py-2">济州</td>
                <td className="px-4 py-2 text-right tabular-nums">0.290</td>
                <td className="px-4 py-2 text-right tabular-nums">3.45</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-sm">
          中部1与中部2的差异仅为0.02 W/m²·K，但换算成隔热厚度，以XPS为基准相差约25mm。这就是江原道岭西地区的施工报价比京畿道略贵一些的原因。
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-[color:var(--color-text-primary)]">
          本站计算器的局限
        </h2>
        <p>
          老实说，本站的隔热计算器<strong>未反映热桥影响</strong>。木结构墙骨柱(38×140mm)的导热率比玻璃棉高约4倍，因此实际墙体的平均R值比计算值低10~20%。
        </p>
        <p>弥补这一差距的方法：</p>
        <ul className="list-inside list-disc space-y-1 text-sm">
          <li>增加外保温，从外部遮盖墙骨柱(效果最大)</li>
          <li>将墙骨柱间距扩大到24英寸(600mm)，降低热桥面积占比</li>
          <li>高端建造商采用进阶框架法(advanced framing)直接减少墙骨柱数量</li>
        </ul>
        <p>
          如需精确核算，请使用韩国被动式建筑协会(PHIKO)的传热系数计算器，并勾选热桥修正选项。
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-[color:var(--color-text-primary)]">
          现场常用的材料组合(实际价格感)
        </h2>
        <ul className="list-inside list-disc space-y-2 text-sm">
          <li>
            <strong>经济型(南部)</strong>：2x6 + 玻璃棉24K 140 + 护墙板。每平方米材料费约30,000~40,000韩元。
          </li>
          <li>
            <strong>标准型(中部2)</strong>：以上组合 + 外部XPS 50。每平方米约45,000~55,000韩元。
          </li>
          <li>
            <strong>高端型(中部1·被动式)</strong>：2x8 + 玻璃棉48K +
            外部XPS 100 + 防护膜。每平方米70,000韩元以上。
          </li>
        </ul>
        <p className="text-sm">
          价格以2026年春季为基准。仅为材料费，不含人工及其他辅材费用。为KCC·OCI·Johns Manville玻璃棉的价格区间。
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-2xl font-semibold text-[color:var(--color-text-primary)]">
          结语
        </h2>
        <p>
          隔热需要同时看两方面：<strong>法规通过 (U值上限)</strong>与<strong>实际性能 (反映热桥后)</strong>。只求通过审批的施工，日后会以结露·霉斑的形式反噬。用本站的
          <Link
            href="/zh/timber-calc/insulation"
            className="text-indigo-300 underline-offset-2 hover:underline"
          >
            隔热R/U值计算器
          </Link>
          完成初步验证后，报批图纸务必请建筑师在反映热桥的基础上重新绘制，才安全。
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
          Cách nhiệt · Hướng dẫn cấp phép
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-[color:var(--color-text-primary)] md:text-4xl">
          Cách nhiệt, tổ hợp thực tế để tường ngoài Trung tâm-2 đạt
          chuẩn 0.17
        </h1>
        <p className="mt-4 text-sm text-[color:var(--color-text-tertiary)]">
          Cập nhật lần cuối 2026-04-27. Hướng dẫn này được biên soạn dựa
          trên Phụ lục 1 của Tiêu chuẩn Thiết kế Tiết kiệm Năng lượng
          Công trình Hàn Quốc.
        </p>
      </header>

      <section className="space-y-4">
        <p>
          Giới hạn giá trị U cho tường ngoài tiếp xúc trực tiếp với
          không khí ngoài trời·phòng sinh hoạt tại Trung tâm-2 (Seoul,
          Incheon, phần lớn Gyeonggi) là 0.17 W/m²·K. Khung gỗ 2x6 lấp
          đầy bông thủy tinh 24K 140mm không thể đạt chuẩn này. Máy
          tính cách nhiệt của trang này cho ra con số chính xác — giá
          trị U = 0.250. Còn thiếu khá xa.
        </p>
        <p>Vậy thực tế thì phải làm sao để đạt chuẩn? Có ba hướng đi.</p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-[color:var(--color-text-primary)]">
          Hướng 1. Thêm lớp cách nhiệt bên ngoài (phương pháp phổ biến
          nhất)
        </h2>
        <p>
          Bên trong 2x6 (140mm) + OSB +{" "}
          <strong>thêm 50~75mm XPS hoặc PIR ở bên ngoài</strong>. Cách
          này giúp giá trị U giảm nhanh.
        </p>
        <div className="surface-elevated overflow-hidden p-4 text-sm">
          <p className="font-semibold text-[color:var(--color-text-primary)]">
            Ví dụ cấu tạo
          </p>
          <p className="mt-2">
            Thạch cao 12.5mm + bông thủy tinh 24K 140mm + OSB 11mm +{" "}
            <strong>XPS 50mm</strong> + tấm ốp ngoài
          </p>
          <p className="mt-1">
            Tổng giá trị R = 0.07 + 3.68 + 0.085 + 1.72 + 0.027 = 5.58
            m²·K/W
          </p>
          <p>+ bề mặt 0.15 → tổng R 5.73 → U = <strong>0.175 W/m²·K</strong></p>
          <p className="mt-2 text-amber-200">
            Vừa đủ vượt giới hạn 0.17 của Trung tâm-2. Để có biên độ an
            toàn, nâng XPS lên 75mm thì U = 0.146, dư sức đạt chuẩn.
          </p>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-[color:var(--color-text-primary)]">
          Hướng 2. Tăng độ dày cách nhiệt bằng khung 2x8
        </h2>
        <p>
          Dùng khung 2x8 (184mm) + bông thủy tinh mật độ cao 48K
          184mm. Cách đi không cần cách nhiệt ngoài.
        </p>
        <p>R = 0.184 / 0.034 = 5.41 m²·K/W. Cộng thêm các lớp khác,
          tổng R khoảng 5.6. U ≈ 0.179 — vừa đủ đạt chuẩn, nhưng nếu
          tính đến sai số thi công thì đây đã là mức giới hạn.</p>
        <p>
          Nhược điểm của cách này là chi phí khung tăng và thi công
          khó hơn. Thi công khung 2x8 tốn thêm khoảng 30% nhân công so
          với 2x6. Do đó, Hướng 1 vẫn là lựa chọn được ưu tiên hơn.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-[color:var(--color-text-primary)]">
          Hướng 3. Thi công phun bọt PU (ưu và nhược điểm rõ rệt)
        </h2>
        <p>
          Phun đầy bọt PU vào khoang 2x6 (140mm). λ = 0.024 rất thấp
          nên cùng độ dày vẫn cho R = 5.83. Có thể đạt chuẩn mà không
          cần cách nhiệt ngoài.
        </p>
        <p>
          Có ba nhược điểm. (1) Chi phí. Chi phí vật liệu trên mỗi m²
          cao gấp 4~5 lần bông thủy tinh. (2) Ngưng tụ. Đã có báo cáo
          về hiện tượng ngưng tụ bên trong lớp bọt ở môi trường độ ẩm
          cao. (3) Khí độc khi cháy. Nhà nhiều hộ·công trình thương
          mại cần thẩm định phòng cháy riêng.
        </p>
        <p className="text-sm">
          Với tường ngoài nhà ở riêng lẻ, tôi khuyên chọn Hướng 1. Chi
          phí dễ kiểm soát hơn và rủi ro ngưng tụ cũng thấp hơn.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-[color:var(--color-text-primary)]">
          So sánh giới hạn theo vùng (tường ngoài tiếp xúc trực
          tiếp·phòng sinh hoạt)
        </h2>
        <div className="overflow-hidden rounded-xl border border-[color:var(--color-border-subtle)] bg-[color:var(--color-bg-elevated)]">
          <table className="w-full text-sm">
            <thead className="text-xs uppercase tracking-wider text-[color:var(--color-text-tertiary)]">
              <tr>
                <th className="px-4 py-2 text-left font-medium">Vùng</th>
                <th className="px-4 py-2 text-right font-medium">Giới hạn U (W/m²·K)</th>
                <th className="px-4 py-2 text-right font-medium">R tối thiểu tương ứng</th>
              </tr>
            </thead>
            <tbody className="text-[color:var(--color-text-secondary)]">
              <tr className="border-t border-[color:var(--color-border-subtle)]">
                <td className="px-4 py-2">Trung tâm-1 (Gangwon·bắc Gyeonggi)</td>
                <td className="px-4 py-2 text-right tabular-nums">0.150</td>
                <td className="px-4 py-2 text-right tabular-nums">6.67</td>
              </tr>
              <tr className="border-t border-[color:var(--color-border-subtle)]">
                <td className="px-4 py-2">Trung tâm-2 (Seoul·Incheon·phần lớn Gyeonggi)</td>
                <td className="px-4 py-2 text-right tabular-nums">0.170</td>
                <td className="px-4 py-2 text-right tabular-nums">5.88</td>
              </tr>
              <tr className="border-t border-[color:var(--color-border-subtle)]">
                <td className="px-4 py-2">Phía Nam</td>
                <td className="px-4 py-2 text-right tabular-nums">0.220</td>
                <td className="px-4 py-2 text-right tabular-nums">4.55</td>
              </tr>
              <tr className="border-t border-[color:var(--color-border-subtle)]">
                <td className="px-4 py-2">Jeju</td>
                <td className="px-4 py-2 text-right tabular-nums">0.290</td>
                <td className="px-4 py-2 text-right tabular-nums">3.45</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-sm">
          Chênh lệch giữa Trung tâm-1 và Trung tâm-2 chỉ là 0.02
          W/m²·K, nhưng quy đổi ra độ dày cách nhiệt thì chênh khoảng
          25mm XPS. Đây là lý do báo giá thi công ở vùng Yeongseo
          (Gangwon) nhỉnh hơn một chút so với Gyeonggi.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-[color:var(--color-text-primary)]">
          Giới hạn của máy tính trên trang này
        </h2>
        <p>
          Nói thẳng, máy tính cách nhiệt của trang này{" "}
          <strong>không phản ánh cầu nhiệt</strong>. Thanh đứng khung
          gỗ (38×140mm) có độ dẫn nhiệt cao hơn bông thủy tinh khoảng
          4 lần, nên giá trị R trung bình thực tế của tường thấp hơn
          giá trị tính toán khoảng 10~20%.
        </p>
        <p>Cách bù đắp khoảng chênh lệch này:</p>
        <ul className="list-inside list-disc space-y-1 text-sm">
          <li>Thêm cách nhiệt ngoài để che thanh đứng từ bên ngoài
            (hiệu quả lớn nhất)</li>
          <li>Nới khoảng cách thanh đứng lên 24 inch (600mm) để giảm
            tỷ lệ diện tích cầu nhiệt</li>
          <li>Các nhà thầu cao cấp dùng phương pháp khung nâng cao
            (advanced framing) để giảm hẳn số lượng thanh đứng</li>
        </ul>
        <p>
          Nếu cần kiểm tra chính xác, hãy dùng máy tính hệ số truyền
          nhiệt của Hiệp hội Kiến trúc Nhà thụ động Hàn Quốc (PHIKO)
          với tùy chọn hiệu chỉnh cầu nhiệt.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-[color:var(--color-text-primary)]">
          Tổ hợp vật liệu thường dùng ngoài công trường (mức giá thực
          tế)
        </h2>
        <ul className="list-inside list-disc space-y-2 text-sm">
          <li>
            <strong>Loại tiết kiệm (Phía Nam)</strong>: 2x6 + bông
            thủy tinh 24K 140 + tấm ốp ngoài. Chi phí vật liệu khoảng
            30,000~40,000 won/m².
          </li>
          <li>
            <strong>Loại tiêu chuẩn (Trung tâm-2)</strong>: như trên +
            XPS 50 bên ngoài. Khoảng 45,000~55,000 won/m².
          </li>
          <li>
            <strong>Loại cao cấp (Trung tâm-1·nhà thụ động)</strong>:
            2x8 + bông thủy tinh 48K + XPS 100 bên ngoài + màng chắn
            bảo vệ. Từ 70,000 won/m² trở lên.
          </li>
        </ul>
        <p className="text-sm">
          Giá tính theo mùa xuân năm 2026. Chỉ tính chi phí vật liệu,
          chưa gồm nhân công và phụ liệu khác. Đây là mức giá của bông
          thủy tinh KCC·OCI·Johns Manville.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-2xl font-semibold text-[color:var(--color-text-primary)]">
          Kết luận
        </h2>
        <p>
          Cách nhiệt cần nhìn đồng thời hai mặt:{" "}
          <strong>đạt chuẩn pháp lý (giới hạn giá trị U)</strong> và{" "}
          <strong>hiệu suất thực tế (sau khi tính cầu nhiệt)</strong>.
          Thi công chỉ nhằm qua được thẩm định thì sau này sẽ phải trả
          giá bằng ngưng tụ·nấm mốc. Hãy dùng{" "}
          <Link
            href="/vi/timber-calc/insulation"
            className="text-indigo-300 underline-offset-2 hover:underline"
          >
            máy tính giá trị R/U cách nhiệt
          </Link>{" "}
          của trang này để xác minh bước đầu, sau đó bản vẽ xin phép
          cần được kiến trúc sư vẽ lại có tính đến cầu nhiệt mới an
          toàn.
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
