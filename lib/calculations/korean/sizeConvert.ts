/**
 * 한국 ↔ 해외 의류·신발 사이즈 변환.
 *
 * 신발: 한국·일본은 mondopoint(mm). 예) 260 = 26.0cm. US/EU/UK 변환표.
 * 의류: 한국 남성 = 가슴둘레(cm) 기반 90/95/100/105/110.
 *       한국 여성 = 44/55/66/77/88 (전통) 또는 85/90/95/100.
 *
 * 출처: KS K 0050(의류 치수), KS M 6681(신발), 국제 사이즈 대조표.
 * 브랜드·국가별 편차가 있어 ±1 사이즈 오차 가능 — 참고용.
 */

export type SizeCategory = "shoeMen" | "shoeWomen" | "clothingMen" | "clothingWomen";

export interface SizeRow {
  /** 한국 표기 */
  kr: string;
  us: string;
  eu: string;
  uk: string;
  jp: string;
  /** 인치/cm 등 부가 (의류) */
  intl?: string;
}

/** 남성 신발 (mm 기준) */
export const SHOE_MEN: ReadonlyArray<SizeRow> = [
  { kr: "240", us: "6", eu: "39", uk: "5.5", jp: "24.0" },
  { kr: "245", us: "6.5", eu: "39.5", uk: "6", jp: "24.5" },
  { kr: "250", us: "7", eu: "40", uk: "6.5", jp: "25.0" },
  { kr: "255", us: "7.5", eu: "40.5", uk: "7", jp: "25.5" },
  { kr: "260", us: "8", eu: "41", uk: "7.5", jp: "26.0" },
  { kr: "265", us: "8.5", eu: "42", uk: "8", jp: "26.5" },
  { kr: "270", us: "9", eu: "42.5", uk: "8.5", jp: "27.0" },
  { kr: "275", us: "9.5", eu: "43", uk: "9", jp: "27.5" },
  { kr: "280", us: "10", eu: "44", uk: "9.5", jp: "28.0" },
  { kr: "285", us: "10.5", eu: "44.5", uk: "10", jp: "28.5" },
  { kr: "290", us: "11", eu: "45", uk: "10.5", jp: "29.0" },
  { kr: "295", us: "11.5", eu: "45.5", uk: "11", jp: "29.5" },
  { kr: "300", us: "12", eu: "46", uk: "11.5", jp: "30.0" },
];

/** 여성 신발 (mm 기준) */
export const SHOE_WOMEN: ReadonlyArray<SizeRow> = [
  { kr: "220", us: "5", eu: "35", uk: "2.5", jp: "22.0" },
  { kr: "225", us: "5.5", eu: "35.5", uk: "3", jp: "22.5" },
  { kr: "230", us: "6", eu: "36", uk: "3.5", jp: "23.0" },
  { kr: "235", us: "6.5", eu: "37", uk: "4", jp: "23.5" },
  { kr: "240", us: "7", eu: "37.5", uk: "4.5", jp: "24.0" },
  { kr: "245", us: "7.5", eu: "38", uk: "5", jp: "24.5" },
  { kr: "250", us: "8", eu: "38.5", uk: "5.5", jp: "25.0" },
  { kr: "255", us: "8.5", eu: "39", uk: "6", jp: "25.5" },
  { kr: "260", us: "9", eu: "40", uk: "6.5", jp: "26.0" },
  { kr: "265", us: "9.5", eu: "40.5", uk: "7", jp: "26.5" },
  { kr: "270", us: "10", eu: "41", uk: "7.5", jp: "27.0" },
];

/** 남성 의류 (상의, 가슴둘레 cm) */
export const CLOTHING_MEN: ReadonlyArray<SizeRow> = [
  { kr: "85 (XS)", us: "XS", eu: "44", uk: "34", jp: "S", intl: "가슴 85cm" },
  { kr: "90 (S)", us: "S", eu: "46", uk: "36", jp: "M", intl: "가슴 90cm" },
  { kr: "95 (M)", us: "M", eu: "48", uk: "38", jp: "L", intl: "가슴 95cm" },
  { kr: "100 (L)", us: "L", eu: "50", uk: "40", jp: "LL", intl: "가슴 100cm" },
  { kr: "105 (XL)", us: "XL", eu: "52", uk: "42", jp: "3L", intl: "가슴 105cm" },
  { kr: "110 (XXL)", us: "XXL", eu: "54", uk: "44", jp: "4L", intl: "가슴 110cm" },
];

/** 여성 의류 (44/55/66/77/88 전통 호칭) */
export const CLOTHING_WOMEN: ReadonlyArray<SizeRow> = [
  { kr: "44 (XS)", us: "0~2", eu: "32~34", uk: "4~6", jp: "5~7", intl: "가슴 82cm" },
  { kr: "55 (S)", us: "4", eu: "36", uk: "8", jp: "9", intl: "가슴 85cm" },
  { kr: "66 (M)", us: "6~8", eu: "38~40", uk: "10~12", jp: "11~13", intl: "가슴 88cm" },
  { kr: "77 (L)", us: "10~12", eu: "42~44", uk: "14~16", jp: "15~17", intl: "가슴 91cm" },
  { kr: "88 (XL)", us: "14~16", eu: "46~48", uk: "18~20", jp: "19~21", intl: "가슴 94cm" },
];

export const SIZE_TABLES: Record<SizeCategory, ReadonlyArray<SizeRow>> = {
  shoeMen: SHOE_MEN,
  shoeWomen: SHOE_WOMEN,
  clothingMen: CLOTHING_MEN,
  clothingWomen: CLOTHING_WOMEN,
};

/**
 * 한국 사이즈로 행 찾기 (정확 일치 또는 prefix).
 */
export function findByKorean(
  category: SizeCategory,
  kr: string,
): SizeRow | null {
  const table = SIZE_TABLES[category];
  const trimmed = kr.trim();
  return (
    table.find((r) => r.kr === trimmed) ??
    table.find((r) => r.kr.startsWith(trimmed)) ??
    null
  );
}
