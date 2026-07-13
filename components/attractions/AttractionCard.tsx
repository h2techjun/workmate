import Image from "next/image";
import Link from "next/link";
import type { Locale } from "@/i18n";
import {
  type AttractionEntry,
  localizedAttraction,
} from "@/lib/attractionsCatalog";

/**
 * 명소 목록 카드 — 대표 이미지 + 지역 배지 + 이름 + 요약. 허브·오늘의 명소 공용.
 */
export function AttractionCard({
  attraction,
  locale,
  priority = false,
}: {
  attraction: AttractionEntry;
  locale: Locale;
  priority?: boolean;
}): React.ReactElement {
  const t = localizedAttraction(attraction, locale);
  return (
    <Link
      href={`/${locale}/attractions/${attraction.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-[color:var(--color-border-subtle)] bg-[color:var(--color-bg-card)] transition-colors hover:border-rose-400/40"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-[color:var(--color-bg-elevated)]">
        <Image
          src={attraction.image.url}
          alt={attraction.image.alt}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          priority={priority}
          className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
        />
        <span className="absolute left-3 top-3 rounded-full bg-black/55 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur-sm">
          {t.regionLabel} · {t.categoryLabel}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-4">
        <h3 className="text-base font-bold text-[color:var(--color-text-primary)]">
          {t.name}
        </h3>
        <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-[color:var(--color-text-tertiary)]">
          {t.summary}
        </p>
      </div>
    </Link>
  );
}
