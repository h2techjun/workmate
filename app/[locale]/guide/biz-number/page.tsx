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
      title: "Korean business numbers — what the middle two digits mean",
      description:
        "Why 81 means a corporation HQ, what 89 actually is, and how the NTS checksum tells you a number is fake before you call.",
    };
  }
  return {
    title: "사업자등록번호 가운데 두 자리, 무슨 의미인가요? | 검증 알고리즘",
    description:
      "104-81-XXXXX와 104-50-XXXXX 차이. 가운데 두 자리로 사업자 종류를 알아보는 법, 그리고 가짜 번호를 전화 안 걸고 잡아내는 체크섬 검증.",
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
            {locale === "ko" ? "사업자등록번호 검증으로" : "To the validator"}
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
