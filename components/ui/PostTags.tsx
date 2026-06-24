/**
 * PostTags — 블로그 글 본문 끝에 표시되는 태그 칩 목록.
 * tags 배열을 받아 "#태그" 형식의 칩 row 를 렌더링.
 */

interface PostTagsProps {
  tags: string[];
  /** 라벨 언어 (true: 한국어, false: 영어). 기본 true */
  isKo?: boolean;
}

export default function PostTags({
  tags,
  isKo = true,
}: PostTagsProps): React.ReactElement {
  return (
    <div className="mt-10 border-t border-[color:var(--color-border-subtle)] pt-6">
      <p className="mb-3 text-xs font-medium uppercase tracking-wider text-[color:var(--color-text-tertiary)]">
        {isKo ? "태그" : "Tags"}
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
