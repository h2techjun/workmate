/**
 * PostTags — 블로그 글 본문 끝에 표시되는 태그 칩 목록.
 * tags 배열을 받아 "#태그" 형식의 칩 row 를 렌더링.
 */

interface PostTagsProps {
  tags: readonly string[];
  /** 라벨 언어 (true: 한국어, false: 영어). 기본 true. locale 지정 시 무시 */
  isKo?: boolean;
  /** 4로케일 라벨 (지정 시 isKo 대신 사용) */
  locale?: "ko" | "en" | "zh" | "vi";
}

const TAG_LABEL: Record<"ko" | "en" | "zh" | "vi", string> = {
  ko: "태그",
  en: "Tags",
  zh: "标签",
  vi: "Thẻ",
};

export default function PostTags({
  tags,
  isKo = true,
  locale,
}: PostTagsProps): React.ReactElement {
  const label = locale ? TAG_LABEL[locale] : isKo ? "태그" : "Tags";
  return (
    <div className="mt-10 border-t border-[color:var(--color-border-subtle)] pt-6">
      <p className="mb-3 text-xs font-medium uppercase tracking-wider text-[color:var(--color-text-tertiary)]">
        {label}
      </p>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <span
            key={tag}
            className="inline-block rounded-full border border-[color:var(--color-border-subtle)] bg-[color:var(--color-bg-card)] px-3 py-1 text-sm text-[color:var(--color-text-secondary)] transition-colors hover:border-indigo-500/40 hover:bg-indigo-500/5 hover:text-indigo-300"
          >
            #{tag}
          </span>
        ))}
      </div>
    </div>
  );
}
