import type { Locale } from "@/i18n";
import {
  renderToolCard,
  OG_SIZE,
  OG_CONTENT_TYPE,
} from "@/lib/og/toolCard";

export const alt = "Workmate — 한국 실무자가 매일 쓰는 무료 도구·계산기 모음";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

interface ImageParams {
  params: Promise<{ locale: string }>;
}

const COPY: Record<Locale, { sub: string; headline: string; chips: string[] }> = {
  ko: {
    sub: "한국 실무자가 매일 쓰는",
    headline: "무료 도구·계산기 모음",
    chips: ["전기 KEC", "4대보험 2026", "사업자번호", "목조 NDS", "연봉 실수령"],
  },
  en: {
    sub: "Free tools & calculators",
    headline: "for Korean standards (KEC, KS, NDS)",
    chips: ["Electric KEC", "4 Insurances", "Biz Number", "Timber NDS", "Take-home"],
  },
  vi: {
    sub: "Người Hàn Quốc dùng mỗi ngày",
    headline: "Bộ công cụ · máy tính miễn phí",
    chips: ["Điện KEC", "4 loại bảo hiểm", "Mã số DN", "Nhà gỗ NDS", "Lương thực nhận"],
  },
  zh: {
    sub: "韩国职场人每天使用的",
    headline: "免费工具·计算器合集",
    chips: ["电气KEC", "四大保险2026", "事业者登记号", "木结构NDS", "年薪实领"],
  },
};

export default async function Image({
  params,
}: ImageParams): Promise<Response> {
  const { locale } = await params;
  const copy = COPY[locale as Locale] ?? COPY.ko;
  return renderToolCard(copy);
}
