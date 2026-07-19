"use client";

import { useState } from "react";
import {
  SIZE_TABLES,
  type SizeCategory,
} from "@/lib/calculations/korean/sizeConvert";

interface SizeConvertFormProps {
  locale: "ko" | "en" | "vi" | "zh";
}

const T = {
  ko: {
    category: "분류",
    cats: {
      shoeMen: "남성 신발",
      shoeWomen: "여성 신발",
      clothingMen: "남성 의류",
      clothingWomen: "여성 의류",
    } as Record<SizeCategory, string>,
    krCol: "한국",
    intlNote: "참고",
    note: "KS 표준 + 국제 대조표 기준. 브랜드·국가별 ±1 사이즈 편차 가능 — 참고용. 신발은 mm(발 길이), 의류는 가슴둘레(cm) 기반.",
  },
  en: {
    category: "Category",
    cats: {
      shoeMen: "Men's shoes",
      shoeWomen: "Women's shoes",
      clothingMen: "Men's clothing",
      clothingWomen: "Women's clothing",
    } as Record<SizeCategory, string>,
    krCol: "Korea",
    intlNote: "Note",
    note: "Based on KS standards + international charts. ±1 size variation by brand/country — reference only. Shoes use mm (foot length); clothing uses chest cm.",
  },
  vi: {
    category: "Phân loại",
    cats: {
      shoeMen: "Giày nam",
      shoeWomen: "Giày nữ",
      clothingMen: "Quần áo nam",
      clothingWomen: "Quần áo nữ",
    } as Record<SizeCategory, string>,
    krCol: "Hàn Quốc",
    intlNote: "Ghi chú",
    note: "Dựa trên tiêu chuẩn KS + bảng đối chiếu quốc tế. Có thể lệch ±1 size tùy thương hiệu/quốc gia — chỉ mang tính tham khảo. Giày dùng mm (chiều dài bàn chân), quần áo dựa trên vòng ngực (cm).",
  },
  zh: {
    category: "分类",
    cats: {
      shoeMen: "男鞋",
      shoeWomen: "女鞋",
      clothingMen: "男装",
      clothingWomen: "女装",
    } as Record<SizeCategory, string>,
    krCol: "韩国",
    intlNote: "备注",
    note: "基于KS标准+国际对照表。品牌·国家不同可能有±1码偏差 — 仅供参考。鞋码以mm(脚长)为准，服装以胸围(cm)为准。",
  },
} as const;

const CATS: SizeCategory[] = [
  "shoeMen",
  "shoeWomen",
  "clothingMen",
  "clothingWomen",
];

export function SizeConvertForm({
  locale,
}: SizeConvertFormProps): React.ReactElement {
  const t = T[locale];
  const [cat, setCat] = useState<SizeCategory>("shoeMen");
  const table = SIZE_TABLES[cat];
  const hasIntl = table.some((r) => r.intl);

  return (
    <div className="space-y-6">
      <section className="surface-card p-5 md:p-7">
        <label className="mb-3 block text-sm font-semibold text-[color:var(--color-text-primary)]">
          {t.category}
        </label>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {CATS.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCat(c)}
              className={`rounded-lg px-3 py-3 text-sm font-medium transition-colors ${
                cat === c
                  ? "bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-md shadow-indigo-500/30"
                  : "border border-[color:var(--color-border-default)] bg-[color:var(--color-bg-elevated)] text-[color:var(--color-text-secondary)] hover:border-indigo-400"
              }`}
            >
              {t.cats[c]}
            </button>
          ))}
        </div>
      </section>

      <section className="surface-card overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[color:var(--color-border-subtle)] bg-[color:var(--color-bg-elevated)] text-[color:var(--color-text-tertiary)]">
                <th className="px-4 py-3 text-left font-semibold text-[color:var(--color-text-primary)]">
                  {t.krCol}
                </th>
                <th className="px-4 py-3 text-center font-medium">US</th>
                <th className="px-4 py-3 text-center font-medium">EU</th>
                <th className="px-4 py-3 text-center font-medium">UK</th>
                <th className="px-4 py-3 text-center font-medium">JP</th>
                {hasIntl && (
                  <th className="px-4 py-3 text-left font-medium">
                    {t.intlNote}
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="tabular-nums">
              {table.map((row) => (
                <tr
                  key={row.kr}
                  className="border-b border-[color:var(--color-border-subtle)]/50 last:border-0 transition-colors hover:bg-[color:var(--color-bg-elevated)]"
                >
                  <td className="px-4 py-2.5 font-semibold text-[color:var(--color-text-primary)]">
                    {row.kr}
                  </td>
                  <td className="px-4 py-2.5 text-center text-[color:var(--color-text-secondary)]">
                    {row.us}
                  </td>
                  <td className="px-4 py-2.5 text-center text-[color:var(--color-text-secondary)]">
                    {row.eu}
                  </td>
                  <td className="px-4 py-2.5 text-center text-[color:var(--color-text-secondary)]">
                    {row.uk}
                  </td>
                  <td className="px-4 py-2.5 text-center text-[color:var(--color-text-secondary)]">
                    {row.jp}
                  </td>
                  {hasIntl && (
                    <td className="px-4 py-2.5 text-xs text-[color:var(--color-text-tertiary)]">
                      {row.intl}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="border-t border-[color:var(--color-border-subtle)] px-4 py-3 text-[11px] leading-relaxed text-[color:var(--color-text-muted)]">
          {t.note}
        </p>
      </section>
    </div>
  );
}
