import type { AttractionImage } from "@/lib/attractionsCatalog";

/**
 * 이미지 출처표시 — 상업이용 라이선스(공공누리 1유형·CC·Unsplash 등)의 필수 조건.
 * 모든 명소 이미지 바로 아래에 렌더한다. 문구는 카탈로그 필드를 그대로 표기.
 */
export function PhotoAttribution({
  image,
}: {
  image: AttractionImage;
}): React.ReactElement {
  return (
    <p className="mt-1.5 text-xs leading-relaxed text-[color:var(--color-text-tertiary)]">
      © {image.credit} ·{" "}
      <a
        href={image.creditUrl}
        target="_blank"
        rel="noreferrer noopener"
        className="underline decoration-dotted underline-offset-2 hover:text-[color:var(--color-text-secondary)]"
      >
        {image.license}
      </a>
    </p>
  );
}
