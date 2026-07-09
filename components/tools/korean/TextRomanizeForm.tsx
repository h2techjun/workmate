"use client";

import { useState } from "react";
import { romanizeText } from "@/lib/calculations/korean/textRomanize";

interface TextRomanizeFormProps {
  locale: "ko" | "en" | "vi" | "zh";
}

const T = {
  ko: {
    label: "한글 텍스트 입력",
    placeholder: "예: 안녕하세요, 서울 시청",
    result: "로마자 (음역)",
    syllables: "음절 수",
    empty: "한글을 입력하세요.",
    note: "국립국어원 표기법 기준 음절 단위 음역. 음운 변화(자음동화 등)는 미반영 — 예: 신라 → Sinra(발음 Silla 아님). 간판·메뉴·단어 읽기에 적합.",
  },
  en: {
    label: "Korean text (Hangul)",
    placeholder: "e.g. 안녕하세요, 서울 시청",
    result: "Romanization (transliteration)",
    syllables: "Syllables",
    empty: "Enter Korean text.",
    note: "Syllable-by-syllable transliteration per Revised Romanization. Sound changes (assimilation) are not reflected — e.g. 신라 → Sinra (not the spoken Silla). Best for signs, menus, words.",
  },
  vi: {
    label: "Nhập văn bản tiếng Hàn (Hangul)",
    placeholder: "VD: 안녕하세요, 서울 시청",
    result: "Phiên âm La-tinh",
    syllables: "Số âm tiết",
    empty: "Vui lòng nhập văn bản tiếng Hàn.",
    note: "Phiên âm theo từng âm tiết dựa trên quy tắc phiên âm chính thức của Viện Ngôn ngữ Quốc gia Hàn Quốc. Các biến đổi âm (đồng hóa phụ âm...) không được phản ánh — ví dụ: 신라 → Sinra (không phải cách phát âm thực tế là Silla). Phù hợp để đọc biển hiệu, thực đơn, từ vựng.",
  },
  zh: {
    label: "输入韩文文本",
    placeholder: "例: 안녕하세요, 서울 시청",
    result: "罗马字 (音译)",
    syllables: "音节数",
    empty: "请输入韩文。",
    note: "依据国立国语院标记法按音节音译。不反映音变(辅音同化等) — 例: 신라 → Sinra(实际发音并非Silla)。适合阅读招牌·菜单·单词。",
  },
} as const;

export function TextRomanizeForm({
  locale,
}: TextRomanizeFormProps): React.ReactElement {
  const t = T[locale];
  const [text, setText] = useState("안녕하세요");

  const r = romanizeText(text);

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <section className="surface-card space-y-4 p-5 md:p-7">
        <label className="block text-sm font-semibold text-[color:var(--color-text-primary)]">{t.label}</label>
        <textarea
          rows={5}
          className="input-base resize-none text-lg"
          placeholder={t.placeholder}
          value={text}
          onChange={(e) => setText(e.target.value)}
          maxLength={500}
        />
      </section>

      <section className="surface-card space-y-4 p-5 md:p-7">
        <h2 className="text-lg font-semibold text-[color:var(--color-text-primary)]">{t.result}</h2>
        {r.syllableCount > 0 ? (
          <>
            <div className="rounded-xl bg-gradient-to-br from-indigo-500/15 to-purple-500/10 p-4 ring-1 ring-indigo-500/20">
              <p className="break-words text-2xl font-bold text-[color:var(--color-text-hero)]">{r.romanized}</p>
              <p className="mt-2 text-xs text-[color:var(--color-text-tertiary)]">{t.syllables}: {r.syllableCount}</p>
            </div>
            <p className="text-[11px] leading-relaxed text-[color:var(--color-text-muted)]">{t.note}</p>
          </>
        ) : (
          <p className="text-sm text-[color:var(--color-text-tertiary)]">{t.empty}</p>
        )}
      </section>
    </div>
  );
}
