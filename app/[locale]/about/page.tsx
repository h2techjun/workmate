/* eslint-disable react/no-unescaped-entities */
import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

interface PageProps {
  params: Promise<{ locale: string }>;
}

function localeKeyOf(locale: string): "ko" | "en" | "zh" | "vi" {
  if (locale === "ko") return "ko";
  if (locale === "zh") return "zh";
  if (locale === "vi") return "vi";
  return "en";
}

const META = {
  ko: {
    title: "Workmate은 어떤 도구인가요? — 만든 이유와 운영 원칙",
    desc: "현장 실무자가 매일 쓰는 계산을 위해 만들었습니다. 운영 철학과 작동 원리를 솔직하게 정리했습니다.",
  },
  en: {
    title: "About — Workmate",
    desc: "Why Workmate exists, who we serve, and the principles behind every calculator.",
  },
  zh: {
    title: "Workmate 是什么样的工具？— 关于",
    desc: "为现场从业者每天要用的计算而做。坦诚整理了运营理念与工作原理。",
  },
  vi: {
    title: "Workmate là công cụ như thế nào? — Giới thiệu",
    desc: "Được tạo ra cho các phép tính mà người làm nghề thực địa dùng mỗi ngày. Trình bày thẳng thắn triết lý vận hành và nguyên lý hoạt động.",
  },
} as const;

const HOME = { ko: "홈", en: "Home", zh: "首页", vi: "Trang chủ" } as const;

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const m = META[localeKeyOf(locale)];
  return { title: m.title, description: m.desc };
}

export default async function AboutPage({
  params,
}: PageProps): Promise<React.ReactElement> {
  const { locale } = await params;
  const k = localeKeyOf(locale);

  return (
    <main className="px-4 pb-16 pt-6 md:px-6 md:pt-12">
      <div className="mx-auto max-w-3xl">
        <nav className="mb-5 flex items-center gap-2 text-sm text-[color:var(--color-text-tertiary)]">
          <Link
            href={`/${locale}`}
            className="inline-flex items-center gap-1 transition-colors hover:text-[color:var(--color-text-primary)]"
          >
            <ChevronLeft className="h-4 w-4" />
            {HOME[k]}
          </Link>
        </nav>

        {k === "ko" ? (
          <AboutKo />
        ) : k === "zh" ? (
          <AboutZh />
        ) : k === "vi" ? (
          <AboutVi />
        ) : (
          <AboutEn />
        )}
      </div>
    </main>
  );
}

function AboutKo(): React.ReactElement {
  return (
    <article className="prose-content space-y-6 text-[color:var(--color-text-secondary)]">
      <header>
        <h1 className="text-3xl font-bold tracking-tight text-[color:var(--color-text-primary)] md:text-4xl">
          Workmate은 어떤 도구인가요?
        </h1>
        <p className="mt-3 text-sm text-[color:var(--color-text-tertiary)]">
          최초 작성 2026-04-27 · 최종 검토 2026-06-17 · 운영자: 한국 실무자 한 명
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
          Workmate의 모든 계산기는 <strong>계산 과정을 단계별로 보여줍니다</strong>.
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
          <li>
            <strong>한국에 사는 외국인</strong> — 비자(F-2-7·D-8)·국민연금
            반환일시금·건강보험료·전월세·연말정산까지 영어로, 상황별 체크리스트와
            함께
          </li>
        </ul>
        <p className="text-sm text-[color:var(--color-text-tertiary)]">
          처음엔 현장 실무자용으로 시작했지만, 한국에 정착하는 외국인이
          "한국 기준을 영어로" 찾을 곳이 마땅치 않다는 걸 알게 됐습니다. 그래서
          비자·세금·주거·연금 도구를 영어 우선으로 늘려가고 있습니다.
        </p>
      </section>

      <section className="space-y-3 leading-relaxed">
        <h2 className="text-xl font-semibold text-[color:var(--color-text-primary)]">
          외국인용 정보는 어떻게 검증하나요?
        </h2>
        <p>
          비자·세금·연금·임대차처럼 잘못 알면 손해가 큰 영역은 한 가지 원칙을
          지킵니다. <strong>공식 출처만 인용</strong>합니다 — 국민연금공단(NPS)·
          국세청(NTS)·건강보험공단(NHIS)·하이코리아(출입국)·국토교통부(MOLIT)·
          관련 법령. 출처마다 수치가 다르거나(예: OASIS 점수) 비공개인 항목은{" "}
          <strong>단정하지 않고</strong> "기관에서 확인하세요"로 안내하고,
          국적·체류자격별로 달라지는 부분은 <strong>(verify)</strong> 표시를
          그대로 노출합니다.
        </p>
        <p className="text-sm text-[color:var(--color-text-tertiary)]">
          요율·법령은 바뀝니다. 2026년 국민연금 9.5% 인상처럼 확정되는 즉시
          반영하고, 각 도구 하단에 <strong>최종 검토일</strong>을 적어
          언제 기준인지 알 수 있게 합니다. 그래도 실제 신고·계약 전에는
          반드시 해당 기관이나 전문가의 확인을 거치세요 — 이 사이트는
          90%를 빠르게 잡는 용도입니다.
        </p>
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
          About Workmate
        </h1>
        <p className="mt-3 text-sm text-[color:var(--color-text-tertiary)]">
          First written 2026-04-27 · Last reviewed 2026-06-17 · Operated by a
          Korean construction professional
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
          Every calculator on Workmate{" "}
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
          <li>
            <strong>Foreigners living in Korea</strong> — visas (F-2-7, D-8),
            National Pension lump-sum refunds, health insurance, jeonse/wolse,
            and year-end tax settlement, in English, with situation-by-situation
            checklists
          </li>
        </ul>
        <p className="text-sm text-[color:var(--color-text-tertiary)]">
          It started as a tool for Korean tradespeople, but I realized foreigners
          settling here have nowhere good to find "Korean standards, in English."
          So I've been growing the visa, tax, housing, and pension tools
          English-first.
        </p>
      </section>

      <section className="space-y-3 leading-relaxed">
        <h2 className="text-xl font-semibold text-[color:var(--color-text-primary)]">
          How is the foreigner information verified?
        </h2>
        <p>
          For high-stakes areas like visas, tax, pension, and leases I follow one
          rule: <strong>cite official sources only</strong> — the National Pension
          Service (NPS), National Tax Service (NTS), the health-insurance service
          (NHIS), HiKorea (immigration), the land ministry (MOLIT), and the
          relevant statutes. Where sources disagree or the figure is unpublished
          (e.g. the OASIS score), I <strong>don&apos;t assert a number</strong> —
          I send you to the agency. Items that vary by nationality or visa status
          are marked <strong>(verify)</strong> right in the text.
        </p>
        <p className="text-sm text-[color:var(--color-text-tertiary)]">
          Rates and laws change. When something is confirmed — like the 2026
          National Pension rise to 9.5% — I update it immediately, and each tool
          shows a <strong>last-reviewed date</strong> so you know its basis.
          Still, always confirm with the agency or a professional before an
          actual filing or contract — this site is for nailing the first 90%
          quickly.
        </p>
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

function AboutZh(): React.ReactElement {
  return (
    <article className="prose-content space-y-6 text-[color:var(--color-text-secondary)]">
      <header>
        <h1 className="text-3xl font-bold tracking-tight text-[color:var(--color-text-primary)] md:text-4xl">
          Workmate 是一款什么样的工具？
        </h1>
        <p className="mt-3 text-sm text-[color:var(--color-text-tertiary)]">
          首次撰写 2026-04-27 · 最终审核 2026-06-17 · 运营者：一名韩国现场从业者
        </p>
      </header>

      <section className="space-y-4 leading-relaxed">
        <p>
          我在电气·建筑施工现场工作，每次都要重复同样的计算。每次确定电线
          粗细都要翻查 KEC 表格，每次计算四大保险都要重新制作 Excel
          模板，记不清 2x6 搁栅能否跨越 4 米时又要把美制表格换算成韩制
          单位。这些都是我的日常。
        </p>
        <p>
          于是我做了这个网站——把精确符合韩国标准（KS、KEC、建筑法）的工具
          集合在一处。说实话，网上已经有类似的工具了。但大多数使用美制
          单位、手机端体验差、广告过多，或者只显示结果却不说明是怎么
          算出来的。
        </p>
        <p>
          Workmate 的每个计算器都会<strong>逐步展示计算过程</strong>。因为
          附在审批材料里需要依据，教后辈时直接展示公式也更快，最重要的
          是，我自己也需要能够验证结果是否正确。
        </p>
      </section>

      <section className="space-y-3 leading-relaxed">
        <h2 className="text-xl font-semibold text-[color:var(--color-text-primary)]">
          适合谁使用？
        </h2>
        <ul className="list-inside list-disc space-y-2 text-sm">
          <li>备考电气工程技能士·产业技师考试的人士 — 完整对照 KEC 表格</li>
          <li>木结构住宅施工者 — 构件跨度·材料数量·楼梯·基础一次搞定</li>
          <li>人事·总务负责人 — 四大保险一次算清，2026 费率自动更新</li>
          <li>海外股票转让所得税申报者 — 不想重复输入两次汇率的人</li>
          <li>
            <strong>居住在韩国的外国人</strong> —
            签证（F-2-7、D-8）、国民年金一次性返还金、健康保险费、全租/
            月租、年末结算，全部提供英文说明和情境清单
          </li>
        </ul>
        <p className="text-sm text-[color:var(--color-text-tertiary)]">
          最初只是为现场从业者而做，后来我发现在韩国定居的外国人很难找到
          "用英文说明的韩国标准"。因此我正在以英文优先的方式不断扩充
          签证、税务、住房、养老金相关的工具。
        </p>
      </section>

      <section className="space-y-3 leading-relaxed">
        <h2 className="text-xl font-semibold text-[color:var(--color-text-primary)]">
          外国人相关信息如何核实？
        </h2>
        <p>
          对于签证、税务、养老金、租赁合同这类一旦理解错误就会造成重大
          损失的领域，我坚持一个原则——<strong>只引用官方来源</strong>：
          国民年金公团（NPS）、国税厅（NTS）、健康保险公团（NHIS）、
          HiKorea（出入境）、国土交通部（MOLIT）以及相关法令。对于各来源
          数值不一致（例如 OASIS 评分）或未公开的项目，我{" "}
          <strong>不会擅自断言</strong>，而是引导用户"向相关机构确认"；
          因国籍、滞留资格不同而有差异的部分，会原样标注{" "}
          <strong>(verify)</strong> 提示。
        </p>
        <p className="text-sm text-[color:var(--color-text-tertiary)]">
          费率与法令会发生变化。像 2026 年国民年金上调至 9.5% 这样一旦
          确定，我会立即更新，并在每个工具底部标注<strong>最终审核日期</strong>
          ，方便您了解数据的时间基准。尽管如此，在正式申报或签约前，请
          务必通过相关机构或专业人士进行确认——本网站的定位是帮您快速
          把握九成内容。
        </p>
      </section>

      <section className="space-y-3 leading-relaxed">
        <h2 className="text-xl font-semibold text-[color:var(--color-text-primary)]">
          有一点必须明确说明
        </h2>
        <p>
          本工具的结果<strong>仅供参考</strong>。尤其是结构计算（构件
          跨度）仅套用了 NDS 七项修正系数中的一部分，隔热计算也未反映
          热桥效应。施工前必须经结构技师、电气安全管理员、税务师审核。
          用工具把握九成，剩下一成交给专家把关，这才是安全的做法。
        </p>
        <p className="text-sm text-[color:var(--color-text-tertiary)]">
          不过用来在规划阶段快速理清思路、起草报价单、或作为学习用途
          已经绰绰有余。我每天都在使用，一旦发现不足就会持续改进。
        </p>
      </section>

      <section className="space-y-3 leading-relaxed">
        <h2 className="text-xl font-semibold text-[color:var(--color-text-primary)]">
          数据是如何处理的？
        </h2>
        <p>
          所有输入值仅在浏览器中处理，不会发送到服务器。JSON↔CSV
          转换器也采用同样的方式。由于没有任何数据保存在服务器上，因此
          离线也能使用，在因公司安全政策而限制使用外部工具的环境中同样
          可以使用。
        </p>
        <p className="text-sm">
          广告使用 Google AdSense。AdSense 可能通过 Cookie 追踪用户的
          兴趣偏好，详情请参阅{" "}
          <Link
            href="/zh/privacy"
            className="text-indigo-300 underline-offset-2 hover:underline"
          >
            隐私政策
          </Link>
          。
        </p>
      </section>

      <section className="space-y-3 leading-relaxed">
        <h2 className="text-xl font-semibold text-[color:var(--color-text-primary)]">
          未来计划新增的工具
        </h2>
        <ul className="list-inside list-disc space-y-1.5 text-sm">
          <li>对接 Hometax API 的工商登记停业·歇业查询（目前仅提供校验码验证）</li>
          <li>MSDS（化学品安全数据表）检索（正在评估对接安全保健公团数据库）</li>
          <li>韩文→英文地址转换（正在评估对接道路名地址 API）</li>
          <li>断路器 + 电线 + 电压降综合电路设计工具</li>
          <li>建筑许可审批检查清单</li>
        </ul>
        <p className="text-sm">
          如果您希望我们制作某个工具，欢迎通过{" "}
          <Link
            href="/zh/contact"
            className="text-indigo-300 underline-offset-2 hover:underline"
          >
            联系方式
          </Link>
          告诉我们。如果收到多次类似请求，会优先纳入开发计划。
        </p>
      </section>
    </article>
  );
}

function AboutVi(): React.ReactElement {
  return (
    <article className="prose-content space-y-6 text-[color:var(--color-text-secondary)]">
      <header>
        <h1 className="text-3xl font-bold tracking-tight text-[color:var(--color-text-primary)] md:text-4xl">
          Workmate là công cụ như thế nào?
        </h1>
        <p className="mt-3 text-sm text-[color:var(--color-text-tertiary)]">
          Viết lần đầu 2026-04-27 · Rà soát lần cuối 2026-06-17 · Người vận
          hành: một kỹ thuật viên thực địa tại Hàn Quốc
        </p>
      </header>

      <section className="space-y-4 leading-relaxed">
        <p>
          Tôi làm việc tại công trường điện và xây dựng, và tôi cứ phải lặp
          đi lặp lại những phép tính giống nhau. Mỗi lần chọn tiết diện dây
          điện lại phải lật bảng KEC, mỗi lần tính 4 loại bảo hiểm xã hội
          lại phải làm lại mẫu Excel, không nhớ được liệu thanh dầm 2x6 có
          vượt được nhịp 4 mét hay không nên phải quy đổi bảng tiêu chuẩn
          Mỹ sang đơn vị Hàn Quốc. Đó là chuyện thường ngày của tôi.
        </p>
        <p>
          Vì vậy tôi đã tạo ra trang này. Một bộ công cụ chính xác theo
          tiêu chuẩn Hàn Quốc (KS, KEC, Luật Xây dựng) tập hợp tại một nơi.
          Thành thật mà nói, các công cụ tương tự đã có sẵn trên mạng.
          Nhưng phần lớn dùng đơn vị Mỹ, khó dùng trên di động, quá nhiều
          quảng cáo, hoặc chỉ hiện kết quả mà không giải thích cách tính
          ra.
        </p>
        <p>
          Mọi công cụ tính toán trên Workmate đều{" "}
          <strong>hiển thị từng bước của quá trình tính toán</strong>. Bởi
          vì khi đính kèm vào tài liệu trình duyệt cần có căn cứ, khi
          hướng dẫn đàn em thì cho xem công thức cũng nhanh hơn, và quan
          trọng nhất là bản thân tôi cũng cần kiểm chứng được kết quả có
          đúng hay không.
        </p>
      </section>

      <section className="space-y-3 leading-relaxed">
        <h2 className="text-xl font-semibold text-[color:var(--color-text-primary)]">
          Ai nên sử dụng công cụ này?
        </h2>
        <ul className="list-inside list-disc space-y-2 text-sm">
          <li>
            Người ôn thi chứng chỉ kỹ thuật viên/kỹ sư công nghiệp ngành
            điện — bám sát bảng KEC
          </li>
          <li>
            Người thi công nhà khung gỗ — nhịp cấu kiện, số lượng vật
            liệu, cầu thang, móng trong một chỗ
          </li>
          <li>
            Nhân sự phụ trách nhân sự·tổng vụ — tính 4 loại bảo hiểm xã
            hội một lần, tỷ lệ 2026 tự động cập nhật
          </li>
          <li>
            Người khai thuế chuyển nhượng cổ phiếu nước ngoài — dành cho
            ai ngại nhập tỷ giá hai lần
          </li>
          <li>
            <strong>Người nước ngoài sinh sống tại Hàn Quốc</strong> —
            visa (F-2-7, D-8), tiền hoàn trả một lần Quỹ Hưu trí Quốc dân,
            phí bảo hiểm y tế, jeonse/wolse, quyết toán thuế cuối năm — tất
            cả bằng tiếng Anh kèm danh sách kiểm tra theo từng tình huống
          </li>
        </ul>
        <p className="text-sm text-[color:var(--color-text-tertiary)]">
          Ban đầu tôi chỉ làm cho người làm nghề thực địa, nhưng sau đó
          tôi nhận ra người nước ngoài định cư tại Hàn Quốc khó tìm được
          nơi cung cấp "tiêu chuẩn Hàn Quốc bằng tiếng Anh". Vì vậy tôi
          đang mở rộng các công cụ về visa, thuế, nhà ở, lương hưu theo
          hướng ưu tiên tiếng Anh trước.
        </p>
      </section>

      <section className="space-y-3 leading-relaxed">
        <h2 className="text-xl font-semibold text-[color:var(--color-text-primary)]">
          Thông tin dành cho người nước ngoài được xác minh như thế nào?
        </h2>
        <p>
          Với các lĩnh vực dễ gây thiệt hại lớn nếu hiểu sai như visa,
          thuế, lương hưu, hợp đồng thuê nhà, tôi tuân theo một nguyên
          tắc: <strong>chỉ trích dẫn nguồn chính thức</strong> — Quỹ Hưu
          trí Quốc dân (NPS), Cục Thuế Quốc gia (NTS), Công đoàn Bảo hiểm
          Y tế (NHIS), HiKorea (xuất nhập cảnh), Bộ Đất đai - Hạ tầng -
          Giao thông (MOLIT) và các văn bản pháp luật liên quan. Với các
          mục mà số liệu khác nhau giữa các nguồn (ví dụ điểm OASIS) hoặc
          không được công bố, tôi{" "}
          <strong>không khẳng định chắc chắn</strong> mà hướng dẫn "hãy
          xác nhận với cơ quan liên quan"; những phần thay đổi theo quốc
          tịch hoặc tư cách lưu trú sẽ được giữ nguyên nhãn{" "}
          <strong>(verify)</strong>.
        </p>
        <p className="text-sm text-[color:var(--color-text-tertiary)]">
          Tỷ lệ và luật pháp có thể thay đổi. Ngay khi được xác định — như
          việc lương hưu quốc dân tăng lên 9,5% vào năm 2026 — tôi sẽ cập
          nhật ngay lập tức, và ghi <strong>ngày rà soát cuối cùng</strong>{" "}
          ở cuối mỗi công cụ để bạn biết dữ liệu tính đến thời điểm nào. Dù
          vậy, trước khi khai báo hoặc ký hợp đồng thực tế, nhất định phải
          xác nhận với cơ quan liên quan hoặc chuyên gia — trang này chỉ
          nhằm giúp bạn nắm nhanh 90% nội dung.
        </p>
      </section>

      <section className="space-y-3 leading-relaxed">
        <h2 className="text-xl font-semibold text-[color:var(--color-text-primary)]">
          Có một điều cần nói rõ
        </h2>
        <p>
          Kết quả của công cụ này{" "}
          <strong>chỉ mang tính tham khảo</strong>. Đặc biệt phép tính kết
          cấu (nhịp cấu kiện) chỉ áp dụng một phần trong 7 hệ số điều
          chỉnh của NDS, và phép tính cách nhiệt chưa phản ánh hiện tượng
          cầu nhiệt. Trước khi thi công bắt buộc phải qua kiểm tra của kỹ
          sư kết cấu, người quản lý an toàn điện, kế toán thuế. Dùng công
          cụ để nắm 90%, còn 10% còn lại để chuyên gia đảm nhiệm — đó là
          cách làm an toàn.
        </p>
        <p className="text-sm text-[color:var(--color-text-tertiary)]">
          Tuy nhiên để nhanh chóng nắm hướng ở giai đoạn lập kế hoạch,
          soạn thảo báo giá, hay dùng cho mục đích học tập thì hoàn toàn
          đủ dùng. Tôi sử dụng hằng ngày và khi thấy chỗ nào còn thiếu
          sót thì liên tục cải thiện.
        </p>
      </section>

      <section className="space-y-3 leading-relaxed">
        <h2 className="text-xl font-semibold text-[color:var(--color-text-primary)]">
          Dữ liệu được xử lý như thế nào?
        </h2>
        <p>
          Mọi giá trị nhập vào chỉ được xử lý trong trình duyệt, không
          được gửi lên máy chủ. Bộ chuyển đổi JSON↔CSV cũng hoạt động
          theo cách tương tự. Vì không lưu trữ gì trên máy chủ nên có thể
          hoạt động cả khi ngoại tuyến, và có thể sử dụng ngay trong môi
          trường mà chính sách bảo mật công ty hạn chế dùng công cụ bên
          ngoài.
        </p>
        <p className="text-sm">
          Quảng cáo sử dụng Google AdSense. AdSense có thể dùng cookie để
          theo dõi sở thích người dùng, nội dung này được trình bày chi
          tiết trong{" "}
          <Link
            href="/vi/privacy"
            className="text-indigo-300 underline-offset-2 hover:underline"
          >
            Chính sách bảo mật
          </Link>
          .
        </p>
      </section>

      <section className="space-y-3 leading-relaxed">
        <h2 className="text-xl font-semibold text-[color:var(--color-text-primary)]">
          Các công cụ sẽ bổ sung trong tương lai
        </h2>
        <ul className="list-inside list-disc space-y-1.5 text-sm">
          <li>
            Tra cứu tình trạng đăng ký kinh doanh ngừng/đóng cửa qua kết
            nối API Hometax (hiện tại chỉ có kiểm tra checksum)
          </li>
          <li>
            Tra cứu MSDS (đang xem xét kết nối cơ sở dữ liệu Cơ quan An
            toàn Sức khỏe Lao động)
          </li>
          <li>
            Chuyển đổi địa chỉ tiếng Hàn → tiếng Anh (đang xem xét kết nối
            API địa chỉ theo tên đường)
          </li>
          <li>Công cụ thiết kế mạch điện tổng hợp: cầu dao + dây điện + sụt áp</li>
          <li>Danh sách kiểm tra cấp phép xây dựng</li>
        </ul>
        <p className="text-sm">
          Nếu bạn muốn có công cụ nào đó, hãy cho chúng tôi biết qua{" "}
          <Link
            href="/vi/contact"
            className="text-indigo-300 underline-offset-2 hover:underline"
          >
            trang liên hệ
          </Link>
          . Nếu nhận được nhiều yêu cầu tương tự, chúng tôi sẽ ưu tiên
          triển khai.
        </p>
      </section>
    </article>
  );
}
