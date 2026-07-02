import { getRequestConfig } from "next-intl/server";
import type { AbstractIntlMessages } from "next-intl";
import { notFound } from "next/navigation";

export const locales = ["ko", "en", "vi"] as const;
export const defaultLocale = "ko" as const;

export type Locale = (typeof locales)[number];

type Messages = AbstractIntlMessages;

/**
 * vi 는 부분 번역 로케일 — en 을 베이스로 깊은 병합해 누락 키를 영어로 폴백한다.
 * (MISSING_MESSAGE 런타임 에러 방지 + 미번역 페이지도 /vi 에서 완전한 영어로 렌더)
 */
function deepMerge(base: Messages, override: Messages): Messages {
  const out: Messages = { ...base };
  for (const [key, value] of Object.entries(override)) {
    const baseVal = out[key];
    if (
      value &&
      typeof value === "object" &&
      !Array.isArray(value) &&
      baseVal &&
      typeof baseVal === "object" &&
      !Array.isArray(baseVal)
    ) {
      out[key] = deepMerge(baseVal as Messages, value as Messages);
    } else {
      out[key] = value as Messages[string];
    }
  }
  return out;
}

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = locales.includes(requested as Locale)
    ? (requested as Locale)
    : defaultLocale;

  if (!locales.includes(locale)) {
    notFound();
  }

  let messages: Messages;
  if (locale === "vi") {
    const en = (await import("./messages/en.json"))
      .default as unknown as Messages;
    const vi = (await import("./messages/vi.json"))
      .default as unknown as Messages;
    messages = deepMerge(en, vi);
  } else {
    messages = (await import(`./messages/${locale}.json`))
      .default as unknown as Messages;
  }

  return { locale, messages };
});
