import { MapPin } from "lucide-react";
import type { Locale } from "@/i18n";

/**
 * 좌표 → 외부 지도 딥링크(구글/네이버/카카오). SDK·API 키 불필요(MVP 범위).
 */
const OPEN_IN: Record<Locale, string> = {
  ko: "지도에서 열기",
  en: "Open in maps",
  zh: "在地图中打开",
  vi: "Mở trên bản đồ",
};

export function AttractionMap({
  lat,
  lng,
  name,
  address,
  locale,
}: {
  lat: number;
  lng: number;
  name: string;
  address: string;
  locale: Locale;
}): React.ReactElement {
  const q = encodeURIComponent(name);
  const links = [
    {
      label: "Google Maps",
      href: `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`,
    },
    { label: "네이버 지도", href: `https://map.naver.com/v5/search/${q}` },
    { label: "카카오맵", href: `https://map.kakao.com/?q=${q}` },
  ];

  return (
    <div className="rounded-xl border border-[color:var(--color-border-subtle)] bg-[color:var(--color-bg-card)] p-4">
      <p className="flex items-start gap-2 text-sm text-[color:var(--color-text-secondary)]">
        <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-rose-400" />
        <span>{address}</span>
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-[color:var(--color-text-tertiary)]">
          {OPEN_IN[locale]}:
        </span>
        {links.map((l) => (
          <a
            key={l.label}
            href={l.href}
            target="_blank"
            rel="noreferrer noopener"
            className="inline-flex min-h-11 items-center rounded-full border border-[color:var(--color-border-subtle)] bg-[color:var(--color-bg-elevated)] px-3.5 py-2.5 text-xs font-medium text-[color:var(--color-text-secondary)] transition-colors hover:border-rose-400/40 hover:text-rose-300"
          >
            {l.label}
          </a>
        ))}
      </div>
    </div>
  );
}
