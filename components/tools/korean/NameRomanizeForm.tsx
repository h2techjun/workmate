"use client";

import { useState } from "react";
import { romanizeKoreanName } from "@/lib/calculations/korean/romanize";

interface NameRomanizeFormProps {
  locale: "ko" | "en" | "vi" | "zh";
}

const T = {
  ko: {
    label: "한글 이름 입력",
    placeholder: "예: 홍길동",
    result: "로마자 표기",
    revised: "정식 표기 (국립국어원)",
    conventional: "관습 표기 (여권 통용)",
    hyphen: "하이픈 방식",
    surname: "성",
    given: "이름",
    empty: "한글 이름을 입력하세요.",
    note: "국립국어원 로마자 표기법(2000) 기준. 이름은 음운 변화를 반영하지 않고 음절 단위로 표기. 성씨는 관습 표기(Kim·Lee·Park 등)가 여권에 널리 쓰임.",
  },
  en: {
    label: "Korean name (Hangul)",
    placeholder: "e.g. 홍길동",
    result: "Romanization",
    revised: "Official (Revised Romanization)",
    conventional: "Conventional (common on passports)",
    hyphen: "Hyphenated",
    surname: "Surname",
    given: "Given name",
    empty: "Enter a Korean name in Hangul.",
    note: "Based on the Revised Romanization of Korean (2000). Names are romanized syllable-by-syllable without sound changes. Surnames commonly use conventional spellings (Kim, Lee, Park) on passports.",
  },
  vi: {
    label: "Nhập tên tiếng Hàn (Hangul)",
    placeholder: "vd: 홍길동",
    result: "Phiên âm La-tinh",
    revised: "Cách viết chính thức (Viện Quốc ngữ Quốc gia)",
    conventional: "Cách viết thông dụng (phổ biến trên hộ chiếu)",
    hyphen: "Dạng có gạch nối",
    surname: "Họ",
    given: "Tên",
    empty: "Vui lòng nhập tên tiếng Hàn.",
    note: "Dựa trên Quy tắc La-tinh hóa tiếng Hàn sửa đổi (2000). Tên được phiên âm theo từng âm tiết mà không phản ánh biến âm. Họ thường dùng cách viết thông dụng (Kim, Lee, Park...) trên hộ chiếu.",
  },
  zh: {
    label: "输入韩文姓名",
    placeholder: "例: 홍길동",
    result: "罗马字标记",
    revised: "正式标记 (国立国语院)",
    conventional: "惯用标记 (护照通用)",
    hyphen: "连字符方式",
    surname: "姓",
    given: "名",
    empty: "请输入韩文姓名。",
    note: "依据国立国语院罗马字标记法(2000)。姓名按音节标记，不反映音变。姓氏惯用标记(Kim·Lee·Park等)在护照上广泛使用。",
  },
} as const;

export function NameRomanizeForm({
  locale,
}: NameRomanizeFormProps): React.ReactElement {
  const t = T[locale];
  const [name, setName] = useState<string>("홍길동");

  const r = romanizeKoreanName(name);
  const hasInput = r.input.length > 0;

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <section className="surface-card space-y-5 p-5 md:p-7">
        <div>
          <label className="mb-2 block text-sm font-semibold text-[color:var(--color-text-primary)]">
            {t.label}
          </label>
          <input
            type="text"
            className="input-base text-2xl font-bold"
            placeholder={t.placeholder}
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={20}
          />
        </div>
        {hasInput && (
          <dl className="grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-lg border border-[color:var(--color-border-subtle)] bg-[color:var(--color-bg-elevated)] p-3">
              <dt className="text-xs text-[color:var(--color-text-tertiary)]">
                {t.surname}
              </dt>
              <dd className="mt-1 text-lg font-bold text-[color:var(--color-text-primary)]">
                {r.surnameKo}
              </dd>
            </div>
            <div className="rounded-lg border border-[color:var(--color-border-subtle)] bg-[color:var(--color-bg-elevated)] p-3">
              <dt className="text-xs text-[color:var(--color-text-tertiary)]">
                {t.given}
              </dt>
              <dd className="mt-1 text-lg font-bold text-[color:var(--color-text-primary)]">
                {r.givenKo || "—"}
              </dd>
            </div>
          </dl>
        )}
      </section>

      <section className="surface-card space-y-4 p-5 md:p-7">
        <h2 className="text-lg font-semibold text-[color:var(--color-text-primary)]">
          {t.result}
        </h2>
        {hasInput ? (
          <div className="space-y-3">
            <div className="rounded-xl bg-gradient-to-br from-indigo-500/15 to-purple-500/10 p-4 ring-1 ring-indigo-500/20">
              <dt className="text-xs font-medium text-[color:var(--color-text-tertiary)]">
                {t.revised}
              </dt>
              <dd className="mt-1 text-3xl font-bold text-white">
                {r.fullRevised}
              </dd>
            </div>
            {r.surnameConventional && (
              <div className="rounded-xl border border-[color:var(--color-border-subtle)] bg-[color:var(--color-bg-elevated)] p-4">
                <dt className="text-xs text-[color:var(--color-text-tertiary)]">
                  {t.conventional}
                </dt>
                <dd className="mt-1 text-2xl font-bold text-[color:var(--color-text-primary)]">
                  {r.fullConventional}
                </dd>
              </div>
            )}
            {r.givenHyphenated && (
              <div className="rounded-xl border border-[color:var(--color-border-subtle)] bg-[color:var(--color-bg-elevated)] p-4">
                <dt className="text-xs text-[color:var(--color-text-tertiary)]">
                  {t.hyphen}
                </dt>
                <dd className="mt-1 text-xl font-semibold text-[color:var(--color-text-secondary)]">
                  {r.surnameConventional ?? r.surnameRevised}{" "}
                  {r.givenHyphenated}
                </dd>
              </div>
            )}
            <p className="text-[11px] leading-relaxed text-[color:var(--color-text-muted)]">
              {t.note}
            </p>
          </div>
        ) : (
          <p className="text-sm text-[color:var(--color-text-tertiary)]">
            {t.empty}
          </p>
        )}
      </section>
    </div>
  );
}
