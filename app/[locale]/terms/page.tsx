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
    title: "이용약관 — Workmate",
    desc: "Workmate 이용 약관 — 무료로 자유롭게 사용 가능. 결과는 참고용이며 시공·신고 전에는 반드시 전문가 검토가 필요합니다.",
  },
  en: {
    title: "Terms of Use — Workmate",
    desc: "Use Workmate freely. Results are reference-only. Verify with a licensed professional before construction or filing.",
  },
  zh: {
    title: "使用条款 — Workmate",
    desc: "Workmate 使用条款 — 免费自由使用。结果仅供参考，施工·申报前必须经专业人士审核。",
  },
  vi: {
    title: "Điều khoản sử dụng — Workmate",
    desc: "Điều khoản sử dụng Workmate — miễn phí, tự do sử dụng. Kết quả chỉ mang tính tham khảo, bắt buộc phải qua chuyên gia kiểm tra trước khi thi công hoặc khai báo.",
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

export default async function TermsPage({
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
          <TermsKo />
        ) : k === "zh" ? (
          <TermsZh />
        ) : k === "vi" ? (
          <TermsVi />
        ) : (
          <TermsEn />
        )}
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
          Workmate은 한국 표준(KS·KEC·건축법·세법 등)에 기반한 계산
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
          Workmate provides calculators based on Korean Standards (KS, KEC,
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

function TermsZh(): React.ReactElement {
  return (
    <article className="space-y-6 text-[color:var(--color-text-secondary)]">
      <header>
        <h1 className="text-3xl font-bold tracking-tight text-[color:var(--color-text-primary)] md:text-4xl">
          使用条款
        </h1>
        <p className="mt-3 text-sm text-[color:var(--color-text-tertiary)]">
          生效日期 2026-04-27
        </p>
      </header>

      <section className="space-y-3 leading-relaxed">
        <h2 className="text-xl font-semibold text-[color:var(--color-text-primary)]">
          1. 服务性质
        </h2>
        <p>
          Workmate 基于韩国标准（KS、KEC、建筑法、税法等）免费提供计算
          参考工具。无需注册，任何人均可自由使用。
        </p>
      </section>

      <section className="space-y-3 leading-relaxed">
        <h2 className="text-xl font-semibold text-[color:var(--color-text-primary)]">
          2. 结果使用注意事项
        </h2>
        <p>
          本工具的计算结果<strong>仅供参考</strong>，以下领域必须经过持证
          专业人士的审核。
        </p>
        <ul className="list-inside list-disc space-y-1.5 text-sm">
          <li>
            <strong>电气施工</strong> — 必须经电气安全管理员·电气工程技术
            人员审核。本工具仅反映部分 KEC 标准，实际施工环境可能需要
            额外修正。
          </li>
          <li>
            <strong>结构设计</strong> — 构件跨度工具仅套用 NDS
            七项修正系数中的一部分，为规划用途的结果。施工前必须经结构
            技师审核。
          </li>
          <li>
            <strong>税务申报</strong> — 四大保险·海外股票转让所得税等，
            申报前须通过税务师或国税厅咨询确认。
          </li>
          <li>
            <strong>许可审批</strong> — 隔热·楼梯·基础等结果仅供事前参考，
            实际许可文件须由建筑师负责编制。
          </li>
        </ul>
      </section>

      <section className="space-y-3 leading-relaxed">
        <h2 className="text-xl font-semibold text-[color:var(--color-text-primary)]">
          3. 责任限制
        </h2>
        <p>
          运营者对因使用本工具结果进行施工、设计、申报而产生的直接或间接
          损失不承担责任。用户须知悉工具本身不能替代专业人士的判断，
          并据此使用本工具。
        </p>
      </section>

      <section className="space-y-3 leading-relaxed">
        <h2 className="text-xl font-semibold text-[color:var(--color-text-primary)]">
          4. 服务变更与中止
        </h2>
        <p className="text-sm">
          运营者可在不预先通知的情况下新增、变更或中止工具。广告形式
          与位置也可能根据运营政策调整。
        </p>
      </section>

      <section className="space-y-3 leading-relaxed">
        <h2 className="text-xl font-semibold text-[color:var(--color-text-primary)]">
          5. 知识产权
        </h2>
        <p className="text-sm">
          本网站的工具、设计、文档的知识产权归运营者所有。引用时请注明
          出处，请勿复制工具本身进行商业性再分发。允许截图分享结果画面
          及简单链接分享。
        </p>
      </section>

      <section className="space-y-3 leading-relaxed">
        <h2 className="text-xl font-semibold text-[color:var(--color-text-primary)]">
          6. 广告
        </h2>
        <p className="text-sm">
          为维持免费运营，本站展示 Google AdSense 等广告。点击广告为
          用户自愿行为，因广告产生的交易由广告主与用户自行负责。
        </p>
      </section>

      <section className="space-y-3 leading-relaxed">
        <h2 className="text-xl font-semibold text-[color:var(--color-text-primary)]">
          7. 准据法
        </h2>
        <p className="text-sm">
          本条款适用大韩民国法律，如发生纠纷，由运营者所在地的管辖法院
          处理。
        </p>
      </section>
    </article>
  );
}

function TermsVi(): React.ReactElement {
  return (
    <article className="space-y-6 text-[color:var(--color-text-secondary)]">
      <header>
        <h1 className="text-3xl font-bold tracking-tight text-[color:var(--color-text-primary)] md:text-4xl">
          Điều khoản sử dụng
        </h1>
        <p className="mt-3 text-sm text-[color:var(--color-text-tertiary)]">
          Có hiệu lực từ 2026-04-27
        </p>
      </header>

      <section className="space-y-3 leading-relaxed">
        <h2 className="text-xl font-semibold text-[color:var(--color-text-primary)]">
          1. Tính chất dịch vụ
        </h2>
        <p>
          Workmate cung cấp miễn phí các công cụ tính toán tham khảo dựa
          trên tiêu chuẩn Hàn Quốc (KS, KEC, Luật Xây dựng, Luật Thuế, v.v.).
          Không cần đăng ký, ai cũng có thể sử dụng tự do.
        </p>
      </section>

      <section className="space-y-3 leading-relaxed">
        <h2 className="text-xl font-semibold text-[color:var(--color-text-primary)]">
          2. Lưu ý khi sử dụng kết quả
        </h2>
        <p>
          Kết quả tính toán của công cụ này{" "}
          <strong>chỉ mang tính tham khảo</strong>, các lĩnh vực sau đây bắt
          buộc phải qua kiểm tra của chuyên gia có chứng chỉ.
        </p>
        <ul className="list-inside list-disc space-y-1.5 text-sm">
          <li>
            <strong>Thi công điện</strong> — Bắt buộc kiểm tra bởi người
            quản lý an toàn điện hoặc kỹ thuật viên thi công điện. Công cụ
            này chỉ phản ánh một phần tiêu chuẩn KEC, có thể cần điều chỉnh
            thêm tùy môi trường thi công thực tế.
          </li>
          <li>
            <strong>Thiết kế kết cấu</strong> — Công cụ tính khẩu độ cấu
            kiện chỉ áp dụng một phần trong 7 hệ số điều chỉnh của NDS, là
            kết quả dùng cho mục đích lập kế hoạch. Bắt buộc kiểm tra bởi
            kỹ sư kết cấu trước khi thi công.
          </li>
          <li>
            <strong>Khai thuế</strong> — 4 loại bảo hiểm xã hội, thuế
            chuyển nhượng cổ phiếu nước ngoài, v.v. cần xác nhận qua kế
            toán thuế hoặc tư vấn Cục Thuế Quốc gia trước khi khai báo.
          </li>
          <li>
            <strong>Cấp phép</strong> — Kết quả về cách nhiệt, cầu thang,
            móng chỉ dùng để tham khảo trước; hồ sơ cấp phép thực tế phải
            do kiến trúc sư đảm nhiệm.
          </li>
        </ul>
      </section>

      <section className="space-y-3 leading-relaxed">
        <h2 className="text-xl font-semibold text-[color:var(--color-text-primary)]">
          3. Giới hạn trách nhiệm
        </h2>
        <p>
          Nhà vận hành không chịu trách nhiệm về thiệt hại trực tiếp hoặc
          gián tiếp phát sinh từ việc thi công, thiết kế, khai báo dựa
          trên kết quả của công cụ này. Người dùng cần nhận thức rằng bản
          thân việc sử dụng công cụ không thể thay thế phán đoán của
          chuyên gia trước khi sử dụng.
        </p>
      </section>

      <section className="space-y-3 leading-relaxed">
        <h2 className="text-xl font-semibold text-[color:var(--color-text-primary)]">
          4. Thay đổi và ngừng dịch vụ
        </h2>
        <p className="text-sm">
          Nhà vận hành có thể bổ sung, thay đổi hoặc ngừng cung cấp công
          cụ mà không cần thông báo trước. Hình thức và vị trí quảng cáo
          cũng có thể được điều chỉnh theo chính sách vận hành.
        </p>
      </section>

      <section className="space-y-3 leading-relaxed">
        <h2 className="text-xl font-semibold text-[color:var(--color-text-primary)]">
          5. Quyền sở hữu trí tuệ
        </h2>
        <p className="text-sm">
          Công cụ, thiết kế, tài liệu của trang web này thuộc quyền sở hữu
          trí tuệ của nhà vận hành. Khi trích dẫn vui lòng ghi rõ nguồn,
          không sao chép bản thân công cụ để phân phối lại vì mục đích
          thương mại. Việc chụp ảnh màn hình kết quả và chia sẻ liên kết
          đơn giản được tự do thực hiện.
        </p>
      </section>

      <section className="space-y-3 leading-relaxed">
        <h2 className="text-xl font-semibold text-[color:var(--color-text-primary)]">
          6. Quảng cáo
        </h2>
        <p className="text-sm">
          Để duy trì hoạt động miễn phí, trang web hiển thị quảng cáo như
          Google AdSense. Việc nhấp vào quảng cáo là ý chí tự do của người
          dùng, giao dịch phát sinh từ quảng cáo là trách nhiệm giữa nhà
          quảng cáo và người dùng.
        </p>
      </section>

      <section className="space-y-3 leading-relaxed">
        <h2 className="text-xl font-semibold text-[color:var(--color-text-primary)]">
          7. Luật áp dụng
        </h2>
        <p className="text-sm">
          Điều khoản này tuân theo pháp luật Đại Hàn Dân Quốc, khi phát
          sinh tranh chấp sẽ được xử lý tại tòa án có thẩm quyền nơi nhà
          vận hành đặt trụ sở.
        </p>
      </section>
    </article>
  );
}
