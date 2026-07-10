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
    title: "개인정보처리방침 — Workmate",
    desc: "Workmate의 개인정보 처리 방식. 입력값은 브라우저를 떠나지 않습니다.",
  },
  en: {
    title: "Privacy Policy — Workmate",
    desc: "How Workmate handles your data — short answer: it doesn't leave your browser.",
  },
  zh: {
    title: "隐私政策 — Workmate",
    desc: "Workmate 的个人信息处理方式——简而言之：输入内容不会离开您的浏览器。",
  },
  vi: {
    title: "Chính sách bảo mật — Workmate",
    desc: "Cách Workmate xử lý dữ liệu của bạn — nói ngắn gọn: dữ liệu không rời khỏi trình duyệt của bạn.",
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

export default async function PrivacyPage({
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
          <PrivacyKo />
        ) : k === "zh" ? (
          <PrivacyZh />
        ) : k === "vi" ? (
          <PrivacyVi />
        ) : (
          <PrivacyEn />
        )}
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

function PrivacyZh(): React.ReactElement {
  return (
    <article className="space-y-6 text-[color:var(--color-text-secondary)]">
      <header>
        <h1 className="text-3xl font-bold tracking-tight text-[color:var(--color-text-primary)] md:text-4xl">
          隐私政策
        </h1>
        <p className="mt-3 text-sm text-[color:var(--color-text-tertiary)]">
          生效日期 2026-04-27 · 本政策适用于 Workmate 网站（以下简称
          &ldquo;本网站&rdquo;）。
        </p>
      </header>

      <section className="space-y-3 leading-relaxed">
        <h2 className="text-xl font-semibold text-[color:var(--color-text-primary)]">
          摘要
        </h2>
        <ul className="list-inside list-disc space-y-1.5 text-sm">
          <li>输入值仅在浏览器中处理，不会发送到服务器。</li>
          <li>
            为方便用户，工具输入值可能被保存到本地存储（localStorage）。
            仅保存在用户设备上，不会外传。
          </li>
          <li>
            为展示广告使用 Google AdSense，AdSense 可能通过自有 Cookie
            追踪用户兴趣。
          </li>
          <li>
            可能使用 Vercel Analytics（或同等的匿名分析工具）统计访问情况，
            不收集可识别个人身份的信息。
          </li>
        </ul>
      </section>

      <section className="space-y-3 leading-relaxed">
        <h2 className="text-xl font-semibold text-[color:var(--color-text-primary)]">
          1. 收集的信息
        </h2>
        <p>
          本网站没有单独的会员注册流程，不收集姓名、电子邮箱、电话号码等
          可识别个人身份的信息。
        </p>
        <p>
          输入计算器的数值（例如电压、电流、月薪等）仅保留在浏览器内存、
          URL 查询参数和本地存储中。生成结果分享链接时，输入值会包含在
          URL 中；分享该链接即代表将输入值传递给了接收者。
        </p>
        <p>
          广告服务商（Google AdSense）可能通过自有 Cookie 与标识符收集
          用于广告个性化的匿名数据。AdSense 的处理方式遵循{" "}
          <a
            href="https://policies.google.com/privacy"
            target="_blank"
            rel="noopener noreferrer"
            className="text-indigo-300 underline-offset-2 hover:underline"
          >
            Google 隐私权政策
          </a>
          。
        </p>
      </section>

      <section className="space-y-3 leading-relaxed">
        <h2 className="text-xl font-semibold text-[color:var(--color-text-primary)]">
          2. Cookie 与本地存储
        </h2>
        <p>本网站将 Cookie 与本地存储用于以下用途。</p>
        <ul className="list-inside list-disc space-y-1.5 text-sm">
          <li>
            <strong>本地存储</strong>：自动保存各工具的输入值（下次访问时
            恢复）。键名前缀为 <code>worktool:</code>。
          </li>
          <li>
            <strong>Cookie（广告）</strong>：用于 AdSense
            的广告个性化、频次控制等，可在浏览器设置中屏蔽。
          </li>
        </ul>
        <p className="text-sm">
          本网站不会自行植入任何追踪 Cookie。用户可随时在浏览器设置中
          删除所有 Cookie 与本地存储。
        </p>
      </section>

      <section className="space-y-3 leading-relaxed">
        <h2 className="text-xl font-semibold text-[color:var(--color-text-primary)]">
          3. 提供给第三方
        </h2>
        <p>
          本网站不会向第三方提供用户的个人信息。但为了显示页面，会使用
          以下外部服务。
        </p>
        <ul className="list-inside list-disc space-y-1.5 text-sm">
          <li>Vercel — 网站托管及 CDN</li>
          <li>Google AdSense — 展示广告</li>
          <li>Google Fonts（可选）— 提供字体</li>
        </ul>
      </section>

      <section className="space-y-3 leading-relaxed">
        <h2 className="text-xl font-semibold text-[color:var(--color-text-primary)]">
          4. 用户的权利
        </h2>
        <p className="text-sm">
          由于本网站不收集可识别身份的个人信息，因此不存在通常意义上可供
          删除、更正、查阅请求的数据。若需删除本地保存的输入值，请使用
          浏览器的&ldquo;清除网站数据&rdquo;功能。
        </p>
      </section>

      <section className="space-y-3 leading-relaxed">
        <h2 className="text-xl font-semibold text-[color:var(--color-text-primary)]">
          5. 修订
        </h2>
        <p className="text-sm">
          本政策可能因法令变更或服务变更而修订，如有变更将在本页面连同
          生效日期一并公布。
        </p>
      </section>

      <section className="space-y-3 leading-relaxed">
        <h2 className="text-xl font-semibold text-[color:var(--color-text-primary)]">
          咨询
        </h2>
        <p className="text-sm">
          如有个人信息相关问题，请通过{" "}
          <Link
            href="/zh/contact"
            className="text-indigo-300 underline-offset-2 hover:underline"
          >
            联系页面
          </Link>
          提交。
        </p>
      </section>
    </article>
  );
}

function PrivacyVi(): React.ReactElement {
  return (
    <article className="space-y-6 text-[color:var(--color-text-secondary)]">
      <header>
        <h1 className="text-3xl font-bold tracking-tight text-[color:var(--color-text-primary)] md:text-4xl">
          Chính sách bảo mật
        </h1>
        <p className="mt-3 text-sm text-[color:var(--color-text-tertiary)]">
          Có hiệu lực từ 2026-04-27 · Chính sách này áp dụng cho trang web
          Workmate (sau đây gọi là &ldquo;trang web này&rdquo;).
        </p>
      </header>

      <section className="space-y-3 leading-relaxed">
        <h2 className="text-xl font-semibold text-[color:var(--color-text-primary)]">
          Tóm tắt
        </h2>
        <ul className="list-inside list-disc space-y-1.5 text-sm">
          <li>
            Giá trị nhập vào chỉ được xử lý trong trình duyệt, không được
            gửi lên máy chủ.
          </li>
          <li>
            Giá trị nhập của công cụ có thể được lưu vào bộ nhớ cục bộ
            (localStorage) để thuận tiện cho người dùng. Chỉ lưu trên thiết
            bị của người dùng, không truyền ra ngoài.
          </li>
          <li>
            Sử dụng Google AdSense để hiển thị quảng cáo, AdSense có thể
            dùng cookie riêng để theo dõi sở thích người dùng.
          </li>
          <li>
            Có thể sử dụng Vercel Analytics (hoặc công cụ phân tích ẩn danh
            tương đương) để thống kê lượt truy cập, không thu thập thông
            tin nhận dạng cá nhân.
          </li>
        </ul>
      </section>

      <section className="space-y-3 leading-relaxed">
        <h2 className="text-xl font-semibold text-[color:var(--color-text-primary)]">
          1. Thông tin thu thập
        </h2>
        <p>
          Trang web này không có quy trình đăng ký thành viên riêng, không
          thu thập thông tin nhận dạng cá nhân như họ tên, email, số điện
          thoại.
        </p>
        <p>
          Các giá trị nhập vào công cụ tính toán (ví dụ điện áp, dòng điện,
          lương tháng, v.v.) chỉ tồn tại trong bộ nhớ trình duyệt, tham số
          truy vấn URL và bộ nhớ cục bộ. Khi tạo liên kết chia sẻ kết quả,
          giá trị nhập sẽ được đưa vào URL; hành động chia sẻ liên kết đó
          đồng nghĩa với việc truyền giá trị nhập cho người nhận.
        </p>
        <p>
          Nhà cung cấp quảng cáo (Google AdSense) có thể thu thập dữ liệu
          ẩn danh phục vụ cá nhân hóa quảng cáo thông qua cookie và mã định
          danh riêng. Cách xử lý của AdSense tuân theo{" "}
          <a
            href="https://policies.google.com/privacy"
            target="_blank"
            rel="noopener noreferrer"
            className="text-indigo-300 underline-offset-2 hover:underline"
          >
            Chính sách quyền riêng tư của Google
          </a>
          .
        </p>
      </section>

      <section className="space-y-3 leading-relaxed">
        <h2 className="text-xl font-semibold text-[color:var(--color-text-primary)]">
          2. Cookie và bộ nhớ cục bộ
        </h2>
        <p>
          Trang web này sử dụng cookie và bộ nhớ cục bộ cho các mục đích
          sau.
        </p>
        <ul className="list-inside list-disc space-y-1.5 text-sm">
          <li>
            <strong>Bộ nhớ cục bộ</strong>: tự động lưu giá trị nhập của
            từng công cụ (khôi phục khi truy cập lần sau). Tiền tố khóa là{" "}
            <code>worktool:</code>.
          </li>
          <li>
            <strong>Cookie (quảng cáo)</strong>: dùng cho cá nhân hóa quảng
            cáo, giới hạn tần suất hiển thị của AdSense, v.v. Có thể chặn
            trong cài đặt trình duyệt.
          </li>
        </ul>
        <p className="text-sm">
          Trang web này không tự cài đặt bất kỳ cookie theo dõi nào. Người
          dùng có thể xóa toàn bộ cookie và bộ nhớ cục bộ bất cứ lúc nào
          trong cài đặt trình duyệt.
        </p>
      </section>

      <section className="space-y-3 leading-relaxed">
        <h2 className="text-xl font-semibold text-[color:var(--color-text-primary)]">
          3. Cung cấp cho bên thứ ba
        </h2>
        <p>
          Trang web này không cung cấp thông tin cá nhân của người dùng cho
          bên thứ ba. Tuy nhiên, để hiển thị trang, có sử dụng các dịch vụ
          bên ngoài sau đây.
        </p>
        <ul className="list-inside list-disc space-y-1.5 text-sm">
          <li>Vercel — Lưu trữ trang web và CDN</li>
          <li>Google AdSense — Hiển thị quảng cáo</li>
          <li>Google Fonts (tùy chọn) — Cung cấp phông chữ</li>
        </ul>
      </section>

      <section className="space-y-3 leading-relaxed">
        <h2 className="text-xl font-semibold text-[color:var(--color-text-primary)]">
          4. Quyền của người dùng
        </h2>
        <p className="text-sm">
          Vì trang web này không thu thập thông tin cá nhân có thể nhận
          dạng, nên không có dữ liệu nào là đối tượng của các yêu cầu xóa,
          sửa đổi, truy cập thông thường. Tuy nhiên, để xóa giá trị nhập đã
          lưu cục bộ, vui lòng sử dụng chức năng &ldquo;Xóa dữ liệu trang
          web&rdquo; của trình duyệt.
        </p>
      </section>

      <section className="space-y-3 leading-relaxed">
        <h2 className="text-xl font-semibold text-[color:var(--color-text-primary)]">
          5. Sửa đổi
        </h2>
        <p className="text-sm">
          Chính sách này có thể được sửa đổi theo thay đổi của pháp luật
          hoặc dịch vụ, khi có thay đổi sẽ được thông báo trên trang này
          kèm theo ngày có hiệu lực.
        </p>
      </section>

      <section className="space-y-3 leading-relaxed">
        <h2 className="text-xl font-semibold text-[color:var(--color-text-primary)]">
          Liên hệ
        </h2>
        <p className="text-sm">
          Mọi thắc mắc liên quan đến thông tin cá nhân vui lòng gửi qua{" "}
          <Link
            href="/vi/contact"
            className="text-indigo-300 underline-offset-2 hover:underline"
          >
            trang liên hệ
          </Link>
          .
        </p>
      </section>
    </article>
  );
}
