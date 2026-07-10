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
      title: "사업자등록번호 가운데 두 자리, 무슨 의미인가요? | 검증 알고리즘",
      description:
        "104-81-XXXXX와 104-50-XXXXX 차이. 가운데 두 자리로 사업자 종류를 알아보는 법, 그리고 가짜 번호를 전화 안 걸고 잡아내는 체크섬 검증.",
    };
  }
  if (locale === "zh") {
    return {
      title: "事业者登记号中间两位数字是什么意思？| 校验位算法",
      description:
        "104-81-XXXXX与104-50-XXXXX的区别。教你用中间两位数字判断事业者种类，以及不打电话也能靠校验位识破假号码的方法。",
    };
  }
  if (locale === "vi") {
    return {
      title: "Hai chữ số giữa mã số đăng ký kinh doanh Hàn Quốc có ý nghĩa gì?",
      description:
        "Vì sao 81 là trụ sở pháp nhân, 89 thực chất là gì, và cách checksum của NTS giúp bạn phát hiện mã số giả mà không cần gọi điện xác minh.",
    };
  }
  return {
    title: "Korean business numbers — what the middle two digits mean",
    description:
      "Why 81 means a corporation HQ, what 89 actually is, and how the NTS checksum tells you a number is fake before you call.",
  };
}

export default async function BizNumberGuidePage({
  params,
}: PageProps): Promise<React.ReactElement> {
  const { locale } = await params;
  return (
    <main className="px-4 pb-16 pt-6 md:px-6 md:pt-12">
      <div className="mx-auto max-w-3xl">
        <nav className="mb-5 flex items-center gap-2 text-sm text-[color:var(--color-text-tertiary)]">
          <Link
            href={`/${locale}/biznum-check`}
            className="inline-flex items-center gap-1 transition-colors hover:text-[color:var(--color-text-primary)]"
          >
            <ChevronLeft className="h-4 w-4" />
            {locale === "ko"
              ? "사업자등록번호 검증으로"
              : locale === "zh"
                ? "返回事业者登记号验证"
                : locale === "vi"
                  ? "Về trang xác thực mã số đăng ký kinh doanh"
                  : "To the validator"}
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
          사업자 · Q&amp;A
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-[color:var(--color-text-primary)] md:text-4xl">
          사업자등록번호 가운데 두 자리, 무슨 의미인가요?
        </h1>
        <p className="mt-4 text-sm text-[color:var(--color-text-tertiary)]">
          마지막 업데이트 2026-04-28.
        </p>
      </header>

      <section className="space-y-4">
        <p>
          영업하다 보면 거래처 사업자등록번호 받는 일이 흔한데, 가끔
          숫자 한두 개 잘못 받아 적은 걸 모르고 세금계산서 발행했다가
          반려되는 경우가 있습니다. 그러기 전에 번호 자체로 1차 검증할
          수 있는 방법이 있습니다.
        </p>
        <p>이 글은 자주 묻는 질문 형식으로 정리했습니다.</p>
      </section>

      <section className="space-y-5">
        <div className="surface-elevated p-5">
          <h2 className="text-xl font-semibold text-[color:var(--color-text-primary)]">
            Q1. 가운데 두 자리는 무슨 뜻인가요?
          </h2>
          <p className="mt-3 text-sm">
            <strong>사업자 종류 코드</strong>입니다. 국세청이 사업자
            종류별로 번호 대역을 나눠 부여합니다.
          </p>
          <ul className="mt-3 list-inside list-disc space-y-1 text-sm">
            <li>01~79: 개인사업자 (일반과세자)</li>
            <li>80: 비영리법인의 본점 (개인 대표)</li>
            <li>81, 86, 87, 88: 영리법인의 본점</li>
            <li>82: 비영리법인의 본·지점</li>
            <li>83: 국가·지방자치단체</li>
            <li>84: 외국법인의 본·지점·연락사무소</li>
            <li>85: 영리법인의 지점</li>
            <li>89: 비사업자</li>
            <li>90~99: 부가가치세 면세 개인사업자</li>
          </ul>
          <p className="mt-3 text-sm">
            예를 들어 <code>104-81-12345</code>는 영리법인 본점,{" "}
            <code>104-50-12345</code>는 일반 개인사업자입니다. 주변
            가게가 개인인지 법인인지 번호만 봐도 구분됩니다.
          </p>
        </div>

        <div className="surface-elevated p-5">
          <h2 className="text-xl font-semibold text-[color:var(--color-text-primary)]">
            Q2. 마지막 한 자리는 어떻게 결정되나요?
          </h2>
          <p className="mt-3 text-sm">
            <strong>체크섬 자리</strong>입니다. 앞 9자리에 가중치를
            곱한 합으로 자동 계산됩니다.
          </p>
          <p className="mt-2 text-sm">
            가중치는 <code>1, 3, 7, 1, 3, 7, 1, 3, 5</code>. 9번째
            자리는 ×5의 결과 중 십의 자리만 추가로 더합니다(약간
            특이한 부분).
          </p>
          <p className="mt-2 text-sm">
            계산법: 합산 sum 을 10으로 나눈 나머지를 10에서 뺀 값.
            <br />
            <code>checksum = (10 - sum % 10) % 10</code>
          </p>
          <p className="mt-2 text-sm text-[color:var(--color-text-tertiary)]">
            결과가 마지막 자리와 일치하면 형식 유효.
          </p>
        </div>

        <div className="surface-elevated p-5">
          <h2 className="text-xl font-semibold text-[color:var(--color-text-primary)]">
            Q3. 체크섬만 통과하면 진짜 사업자인가요?
          </h2>
          <p className="mt-3 text-sm">
            아닙니다. 체크섬은 <strong>형식 검증</strong>일
            뿐입니다. 실제 사업자가 활성 상태인지, 휴·폐업했는지는
            국세청 홈택스 API로 별도 조회해야 합니다.
          </p>
          <p className="mt-2 text-sm">
            그래도 가치 있는 이유:
          </p>
          <ul className="mt-2 list-inside list-disc space-y-1 text-sm">
            <li>오타 즉시 잡아냄 (실제 입력 오류의 90%가 형식 단계에서 걸림)</li>
            <li>임의로 만든 가짜 번호 차단</li>
            <li>휴·폐업 조회 API 호출 전 1차 필터로 비용 절감</li>
          </ul>
          <p className="mt-3 text-sm">
            예시: <code>123-45-67890</code> — 형식은 맞지만 체크섬
            계산해보면 마지막 자리가 1이어야 합니다. 즉 가짜.
          </p>
        </div>

        <div className="surface-elevated p-5">
          <h2 className="text-xl font-semibold text-[color:var(--color-text-primary)]">
            Q4. 휴·폐업은 어디서 조회하나요?
          </h2>
          <p className="mt-3 text-sm">
            국세청 홈택스{" "}
            <a
              href="https://www.hometax.go.kr"
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-300 underline-offset-2 hover:underline"
            >
              hometax.go.kr
            </a>{" "}
            에서 무료 조회. 단, 매일 100건 제한이 있어 대량 검증은
            제휴사 API를 써야 합니다 (NICE평가정보, KCB 등).
          </p>
        </div>

        <div className="surface-elevated p-5">
          <h2 className="text-xl font-semibold text-[color:var(--color-text-primary)]">
            Q5. 외국인 등록번호와 어떻게 구별되나요?
          </h2>
          <p className="mt-3 text-sm">
            외국인등록번호는 13자리, 사업자등록번호는 10자리입니다.
            그리고 외국인등록번호는 첫째 자리가 5~6, 사업자번호는
            지역별 다른 대역을 씁니다.
          </p>
          <p className="mt-2 text-sm text-[color:var(--color-text-tertiary)]">
            한 가지 더. 주민등록번호(13자리)와 사업자등록번호(10자리)는
            아예 자릿수가 다릅니다.
          </p>
        </div>

        <div className="surface-elevated p-5">
          <h2 className="text-xl font-semibold text-[color:var(--color-text-primary)]">
            Q6. 본 사이트의 검증기 vs 홈택스 어느 쪽?
          </h2>
          <p className="mt-3 text-sm">
            용도가 다릅니다.
          </p>
          <ul className="mt-2 list-inside list-disc space-y-1 text-sm">
            <li>
              <strong>본 사이트</strong>: 즉시 형식 검증, 오프라인
              가능, 일일 횟수 제한 없음. 단 활성 여부 모름.
            </li>
            <li>
              <strong>홈택스</strong>: 활성·휴폐업 조회 가능. 단
              일일 100건 제한, 대량 자동화 불가.
            </li>
          </ul>
          <p className="mt-3 text-sm">
            대량 거래처 명단 검증할 때는 본 사이트로 1차 형식 필터
            → 살아남은 것만 홈택스에서 활성 조회 — 가 가장 효율적
            입니다.
          </p>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-2xl font-semibold text-[color:var(--color-text-primary)]">
          마무리
        </h2>
        <p>
          요약. 가운데 두 자리는 사업자 종류, 마지막 한 자리는 체크섬.
          체크섬 통과 = 형식 OK ≠ 활성 사업자. 본 사이트의{" "}
          <Link
            href="/ko/biznum-check"
            className="text-indigo-300 underline-offset-2 hover:underline"
          >
            사업자등록번호 검증
          </Link>
          으로 형식부터 거른 뒤, 활성 여부는 홈택스에서.
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
          Business · FAQ
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-[color:var(--color-text-primary)] md:text-4xl">
          What the middle digits in a Korean business number mean
        </h1>
        <p className="mt-4 text-sm text-[color:var(--color-text-tertiary)]">
          Last updated 2026-04-28.
        </p>
      </header>

      <section className="space-y-4">
        <p>
          The 10-digit Korean business registration number isn&apos;t
          random. The middle two digits encode the entity type, the
          last digit is a checksum, and you can validate fake numbers
          without calling anyone.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-[color:var(--color-text-primary)]">
          Middle two digits → entity type
        </h2>
        <ul className="list-inside list-disc space-y-1 text-sm">
          <li>01–79: Individual business (general taxpayer)</li>
          <li>80: Non-profit HQ (individual representative)</li>
          <li>81, 86–88: For-profit corporation HQ</li>
          <li>82: Non-profit corporation HQ/branch</li>
          <li>83: State/local government</li>
          <li>84: Foreign corporation HQ/branch</li>
          <li>85: For-profit corporation branch</li>
          <li>89: Non-business</li>
          <li>90–99: VAT-exempt individual business</li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-[color:var(--color-text-primary)]">
          Last digit = checksum
        </h2>
        <p>
          Weights <code>1, 3, 7, 1, 3, 7, 1, 3, 5</code> applied to the
          first 9 digits. The 9th digit also adds the tens-place of its
          ×5 result. Then{" "}
          <code>checksum = (10 - sum % 10) % 10</code>.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-2xl font-semibold text-[color:var(--color-text-primary)]">
          Bottom line
        </h2>
        <p>
          Checksum passing = format is valid, not that the business is
          active. Use the{" "}
          <Link
            href="/en/biznum-check"
            className="text-indigo-300 underline-offset-2 hover:underline"
          >
            validator
          </Link>{" "}
          first, then check Hometax for active status.
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
          事业者 · Q&amp;A
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-[color:var(--color-text-primary)] md:text-4xl">
          事业者登记号中间两位数字，是什么意思？
        </h1>
        <p className="mt-4 text-sm text-[color:var(--color-text-tertiary)]">
          最后更新 2026-04-28。
        </p>
      </header>

      <section className="space-y-4">
        <p>
          做生意时经常需要拿到交易对象的事业者登记号，但有时会因为记错
          一两个数字、没有察觉就直接开具税务发票，结果被退回。在那之前，
          其实有办法仅凭号码本身做第一道验证。
        </p>
        <p>本文以常见问答的形式整理。</p>
      </section>

      <section className="space-y-5">
        <div className="surface-elevated p-5">
          <h2 className="text-xl font-semibold text-[color:var(--color-text-primary)]">
            Q1. 中间两位数字是什么意思？
          </h2>
          <p className="mt-3 text-sm">
            是<strong>事业者种类代码</strong>。国税厅按事业者种类划分
            号码段并分配。
          </p>
          <ul className="mt-3 list-inside list-disc space-y-1 text-sm">
            <li>01~79: 个人事业者(一般纳税人)</li>
            <li>80: 非营利法人总部(个人代表)</li>
            <li>81·86·87·88: 营利法人总部</li>
            <li>82: 非营利法人总部·分支机构</li>
            <li>83: 国家·地方自治团体</li>
            <li>84: 外国法人总部·分支机构·联络处</li>
            <li>85: 营利法人分支机构</li>
            <li>89: 非事业者</li>
            <li>90~99: 增值税免税个人事业者</li>
          </ul>
          <p className="mt-3 text-sm">
            例如 <code>104-81-12345</code> 是营利法人总部，
            <code>104-50-12345</code> 是普通个人事业者。只看号码就能
            分辨周边店铺是个人还是法人。
          </p>
        </div>

        <div className="surface-elevated p-5">
          <h2 className="text-xl font-semibold text-[color:var(--color-text-primary)]">
            Q2. 最后一位数字是怎么决定的？
          </h2>
          <p className="mt-3 text-sm">
            是<strong>校验位</strong>。由前9位数字分别乘以对应权重后
            相加，自动计算得出。
          </p>
          <p className="mt-2 text-sm">
            权重为 <code>1, 3, 7, 1, 3, 7, 1, 3, 5</code>。第9位数字
            比较特殊——需要额外加上其×5结果的十位数(略微特殊的一步)。
          </p>
          <p className="mt-2 text-sm">
            计算方法：将合计sum除以10所得的余数，再用10减去该余数。
            <br />
            <code>checksum = (10 - sum % 10) % 10</code>
          </p>
          <p className="mt-2 text-sm text-[color:var(--color-text-tertiary)]">
            计算结果与最后一位数字一致，则格式有效。
          </p>
        </div>

        <div className="surface-elevated p-5">
          <h2 className="text-xl font-semibold text-[color:var(--color-text-primary)]">
            Q3. 只要通过校验位，就是真实存在的事业者吗？
          </h2>
          <p className="mt-3 text-sm">
            不是的。校验位只是<strong>格式验证</strong>而已。该事业者
            是否实际登记、正在营业，还是已经停业·歇业，需要另行通过
            国税厅Hometax API查询。
          </p>
          <p className="mt-2 text-sm">
            即便如此，它依然有价值，原因如下：
          </p>
          <ul className="mt-2 list-inside list-disc space-y-1 text-sm">
            <li>立即抓出打字错误(实际输入错误中90%在格式阶段就能被拦下)</li>
            <li>拦截随意编造的虚假号码</li>
            <li>作为调用停业·歇业查询API前的第一道筛选，节省成本</li>
          </ul>
          <p className="mt-3 text-sm">
            示例：<code>123-45-67890</code> — 格式看起来没问题，但
            实际计算校验位后，最后一位应该是1。也就是说这是一个
            伪造号码。
          </p>
        </div>

        <div className="surface-elevated p-5">
          <h2 className="text-xl font-semibold text-[color:var(--color-text-primary)]">
            Q4. 停业·歇业信息在哪里查询？
          </h2>
          <p className="mt-3 text-sm">
            可在国税厅Hometax{" "}
            <a
              href="https://www.hometax.go.kr"
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-300 underline-offset-2 hover:underline"
            >
              hometax.go.kr
            </a>{" "}
            免费查询。不过每天限查100件，如需大量验证，须使用合作
            机构API(NICE、KCB等)。
          </p>
        </div>

        <div className="surface-elevated p-5">
          <h2 className="text-xl font-semibold text-[color:var(--color-text-primary)]">
            Q5. 与外国人登录号有什么区别？
          </h2>
          <p className="mt-3 text-sm">
            外国人登录号为13位，事业者登记号为10位。而且外国人登录号
            的第一位数字是5~6，事业者登记号则按地区使用不同号码段。
          </p>
          <p className="mt-2 text-sm text-[color:var(--color-text-tertiary)]">
            再补充一点：居民登记号码(13位)与事业者登记号(10位)本身
            位数就不同。
          </p>
        </div>

        <div className="surface-elevated p-5">
          <h2 className="text-xl font-semibold text-[color:var(--color-text-primary)]">
            Q6. 本站验证工具 vs Hometax，该用哪一个？
          </h2>
          <p className="mt-3 text-sm">
            用途不同。
          </p>
          <ul className="mt-2 list-inside list-disc space-y-1 text-sm">
            <li>
              <strong>本站</strong>：即时格式验证，可离线使用，且
              没有每日次数限制。缺点是无法得知是否在营业。
            </li>
            <li>
              <strong>Hometax</strong>：可查询营业·停业状态。缺点是
              每日限100件，无法批量自动化。
            </li>
          </ul>
          <p className="mt-3 text-sm">
            验证大量交易对象名单时，最有效率的做法是：先用本站做
            第一道格式筛选 → 剩下的号码再到Hometax查询是否在营业。
          </p>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-2xl font-semibold text-[color:var(--color-text-primary)]">
          结语
        </h2>
        <p>
          总结。中间两位代表事业者种类，最后一位是校验位。通过
          校验位 = 格式没问题，不代表事业者正在营业。请先用本站的
          <Link
            href="/zh/biznum-check"
            className="text-indigo-300 underline-offset-2 hover:underline"
          >
            事业者登记号验证
          </Link>
          做格式筛选，再到Hometax确认是否在营业。
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
          Doanh nghiệp · Q&amp;A
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-[color:var(--color-text-primary)] md:text-4xl">
          Hai chữ số ở giữa mã số đăng ký kinh doanh có ý nghĩa gì?
        </h1>
        <p className="mt-4 text-sm text-[color:var(--color-text-tertiary)]">
          Cập nhật lần cuối 2026-04-28.
        </p>
      </header>

      <section className="space-y-4">
        <p>
          Khi kinh doanh, việc nhận mã số đăng ký kinh doanh từ đối tác
          là chuyện thường xuyên, nhưng đôi khi ghi nhầm một hai chữ số
          mà không phát hiện, đến khi phát hành hóa đơn thuế xong mới bị
          trả về. Trước khi điều đó xảy ra, có một cách kiểm tra sơ bộ
          chỉ bằng chính dãy số đó.
        </p>
        <p>Bài viết này được trình bày theo dạng hỏi đáp thường gặp.</p>
      </section>

      <section className="space-y-5">
        <div className="surface-elevated p-5">
          <h2 className="text-xl font-semibold text-[color:var(--color-text-primary)]">
            Q1. Hai chữ số ở giữa có ý nghĩa gì?
          </h2>
          <p className="mt-3 text-sm">
            Đó là <strong>mã loại hình doanh nghiệp</strong>. Cơ quan
            Thuế Quốc gia (NTS) chia dải số theo từng loại hình doanh
            nghiệp rồi cấp phát.
          </p>
          <ul className="mt-3 list-inside list-disc space-y-1 text-sm">
            <li>01~79: Cá nhân kinh doanh (người nộp thuế thông thường)</li>
            <li>80: Trụ sở phi lợi nhuận (đại diện cá nhân)</li>
            <li>81, 86, 87, 88: Trụ sở pháp nhân vì lợi nhuận</li>
            <li>82: Trụ sở/chi nhánh pháp nhân phi lợi nhuận</li>
            <li>83: Cơ quan Nhà nước/địa phương</li>
            <li>84: Trụ sở/chi nhánh/văn phòng đại diện pháp nhân nước ngoài</li>
            <li>85: Chi nhánh pháp nhân vì lợi nhuận</li>
            <li>89: Không kinh doanh</li>
            <li>90~99: Cá nhân kinh doanh miễn thuế GTGT</li>
          </ul>
          <p className="mt-3 text-sm">
            Ví dụ, <code>104-81-12345</code> là trụ sở pháp nhân vì lợi
            nhuận, còn <code>104-50-12345</code> là cá nhân kinh doanh
            thông thường. Chỉ cần nhìn mã số là phân biệt được cửa hàng
            xung quanh là cá nhân hay pháp nhân.
          </p>
        </div>

        <div className="surface-elevated p-5">
          <h2 className="text-xl font-semibold text-[color:var(--color-text-primary)]">
            Q2. Chữ số cuối cùng được xác định như thế nào?
          </h2>
          <p className="mt-3 text-sm">
            Đó là <strong>chữ số kiểm tra (checksum)</strong>. Được
            tính tự động từ tổng của 9 chữ số đầu nhân với trọng số
            tương ứng.
          </p>
          <p className="mt-2 text-sm">
            Trọng số là <code>1, 3, 7, 1, 3, 7, 1, 3, 5</code>. Chữ số
            thứ 9 hơi đặc biệt — chỉ cộng thêm hàng chục của kết quả
            ×5 (phần này hơi khác thường).
          </p>
          <p className="mt-2 text-sm">
            Cách tính: lấy 10 trừ đi số dư của phép chia tổng sum cho 10.
            <br />
            <code>checksum = (10 - sum % 10) % 10</code>
          </p>
          <p className="mt-2 text-sm text-[color:var(--color-text-tertiary)]">
            Nếu kết quả trùng với chữ số cuối, định dạng hợp lệ.
          </p>
        </div>

        <div className="surface-elevated p-5">
          <h2 className="text-xl font-semibold text-[color:var(--color-text-primary)]">
            Q3. Chỉ cần vượt qua checksum là doanh nghiệp có thật?
          </h2>
          <p className="mt-3 text-sm">
            Không. Checksum chỉ là <strong>kiểm tra định dạng</strong>.
            Muốn biết doanh nghiệp có đang hoạt động hay đã tạm ngưng,
            đóng cửa, phải tra cứu riêng qua API Hometax của NTS.
          </p>
          <p className="mt-2 text-sm">
            Dù vậy, nó vẫn có giá trị vì:
          </p>
          <ul className="mt-2 list-inside list-disc space-y-1 text-sm">
            <li>Phát hiện lỗi gõ ngay lập tức (90% lỗi nhập liệu thực tế bị chặn ngay từ bước định dạng)</li>
            <li>Chặn các mã số giả được tạo tùy tiện</li>
            <li>Là bộ lọc bước đầu giúp tiết kiệm chi phí trước khi gọi API tra cứu tình trạng tạm ngưng/đóng cửa</li>
          </ul>
          <p className="mt-3 text-sm">
            Ví dụ: <code>123-45-67890</code> — định dạng có vẻ đúng,
            nhưng khi tính checksum thì chữ số cuối phải là 1. Tức là
            mã số giả.
          </p>
        </div>

        <div className="surface-elevated p-5">
          <h2 className="text-xl font-semibold text-[color:var(--color-text-primary)]">
            Q4. Tra cứu tình trạng tạm ngưng/đóng cửa ở đâu?
          </h2>
          <p className="mt-3 text-sm">
            Có thể tra cứu miễn phí tại Hometax của NTS{" "}
            <a
              href="https://www.hometax.go.kr"
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-300 underline-offset-2 hover:underline"
            >
              hometax.go.kr
            </a>
            . Tuy nhiên giới hạn 100 lượt/ngày, nên nếu cần xác minh số
            lượng lớn phải dùng API của các đơn vị liên kết (NICE, KCB,
            v.v.).
          </p>
        </div>

        <div className="surface-elevated p-5">
          <h2 className="text-xl font-semibold text-[color:var(--color-text-primary)]">
            Q5. Phân biệt với số đăng ký người nước ngoài như thế nào?
          </h2>
          <p className="mt-3 text-sm">
            Số đăng ký người nước ngoài có 13 chữ số, còn mã số đăng
            ký kinh doanh có 10 chữ số. Ngoài ra, chữ số đầu tiên của
            số đăng ký người nước ngoài là 5~6, còn mã số kinh doanh
            dùng các dải số khác nhau theo từng khu vực.
          </p>
          <p className="mt-2 text-sm text-[color:var(--color-text-tertiary)]">
            Thêm một điều nữa: số đăng ký cư trú (13 chữ số) và mã số
            đăng ký kinh doanh (10 chữ số) vốn đã khác nhau về số chữ
            số.
          </p>
        </div>

        <div className="surface-elevated p-5">
          <h2 className="text-xl font-semibold text-[color:var(--color-text-primary)]">
            Q6. Công cụ kiểm tra của trang này so với Hometax, nên
            dùng cái nào?
          </h2>
          <p className="mt-3 text-sm">
            Mục đích khác nhau.
          </p>
          <ul className="mt-2 list-inside list-disc space-y-1 text-sm">
            <li>
              <strong>Trang này</strong>: kiểm tra định dạng tức thì,
              dùng được ngoại tuyến, không giới hạn số lần mỗi ngày.
              Nhược điểm là không biết doanh nghiệp có đang hoạt động
              hay không.
            </li>
            <li>
              <strong>Hometax</strong>: tra cứu được tình trạng hoạt
              động/tạm ngưng/đóng cửa. Nhược điểm là giới hạn 100
              lượt/ngày, không thể tự động hóa hàng loạt.
            </li>
          </ul>
          <p className="mt-3 text-sm">
            Khi cần xác minh danh sách đối tác số lượng lớn, cách hiệu
            quả nhất là: lọc định dạng bước đầu bằng trang này → chỉ
            những mã số còn lại mới tra cứu tình trạng hoạt động trên
            Hometax.
          </p>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-2xl font-semibold text-[color:var(--color-text-primary)]">
          Kết luận
        </h2>
        <p>
          Tóm lại. Hai chữ số ở giữa là loại hình doanh nghiệp, chữ số
          cuối là checksum. Vượt qua checksum = định dạng ổn, không có
          nghĩa là doanh nghiệp đang hoạt động. Hãy lọc định dạng
          trước bằng{" "}
          <Link
            href="/vi/biznum-check"
            className="text-indigo-300 underline-offset-2 hover:underline"
          >
            công cụ xác thực mã số đăng ký kinh doanh
          </Link>{" "}
          của trang này, rồi kiểm tra tình trạng hoạt động tại Hometax.
        </p>
      </section>
    </article>
  );
}
