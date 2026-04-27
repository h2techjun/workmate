/**
 * 루트 레이아웃 — 실제 chrome(html/body)은 [locale]/layout.tsx 가 담당.
 * 본 파일은 Next.js App Router 가 root layout 을 요구하므로 최소 형태로 유지.
 *
 * 모든 화면은 middleware 가 / → /ko 또는 /en 으로 리디렉트하므로,
 * 이 레이아웃은 사실상 children 만 통과시키는 역할.
 */

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}): React.ReactElement {
  return <>{children}</>;
}
