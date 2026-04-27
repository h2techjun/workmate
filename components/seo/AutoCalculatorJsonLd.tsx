import { CalculatorJsonLd } from "./StructuredData";

interface AutoCalculatorJsonLdProps {
  /** 현재 locale ("ko" | "en") */
  locale: string;
  /** path (e.g., "/electric-calc/wire-size") */
  path: string;
  /** 도구 표시명 */
  name: string;
  /** 한 줄 설명 */
  description: string;
  /** 카테고리 (전기/목조/재무/유틸/사업자) */
  category?:
    | "BusinessApplication"
    | "UtilityApplication"
    | "FinanceApplication";
  /** 사용 절차 — 한국어 + 영문 두 버전을 받아 locale에 맞게 자동 선택 */
  howToStepsByLocale?: Record<
    string,
    ReadonlyArray<{ name: string; text: string }>
  >;
}

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://worktool.kr";

/**
 * 모든 도구 페이지에서 사용하는 Schema.org wrapper.
 * 환경변수와 path만으로 절대 URL과 howTo 단계를 자동 처리.
 */
export function AutoCalculatorJsonLd({
  locale,
  path,
  name,
  description,
  category = "BusinessApplication",
  howToStepsByLocale,
}: AutoCalculatorJsonLdProps): React.ReactElement {
  const url = `${SITE_URL}/${locale}${path}`;
  const steps = howToStepsByLocale?.[locale] ?? howToStepsByLocale?.ko;

  return (
    <CalculatorJsonLd
      name={name}
      description={description}
      url={url}
      applicationCategory={category}
      howToSteps={steps}
    />
  );
}
