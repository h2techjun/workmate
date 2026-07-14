/**
 * TourAPI 명소 데이터 수집 — 반자동 파이프라인 1단계(사실·사진·좌표만 자동).
 *
 * 본문 텍스트는 생성하지 않는다(AdSense near-dup·저작권 회피). 수집 결과(JSON)를
 * 근거로 사람이/Claude 가 lib/attractionsCatalog.ts 에 고유 본문을 창작해 병합한다.
 *
 * 사용: node --env-file=.env.local scripts/fetch-tourapi.mjs
 *   → scripts/_tourapi-out.json 에 후보 데이터 출력.
 *
 * 소스(한국관광공사 TourAPI, 공공데이터포털):
 *   - PhotoGalleryService1/gallerySearchList1 : 공공누리 1유형 사진 + 촬영자(출처)
 *   - EngService2/searchKeyword2              : 영문명·주소·좌표(mapx/mapy)
 */

import { writeFileSync } from "node:fs";

const KEY = process.env.TOURAPI_SERVICE_KEY;
if (!KEY) {
  console.error("TOURAPI_SERVICE_KEY 없음 (.env.local)");
  process.exit(1);
}
const ENC = encodeURIComponent(KEY);
const COMMON = `serviceKey=${ENC}&MobileOS=ETC&MobileApp=workmate&_type=json&numOfRows=3&pageNo=1&arrange=A`;

/** 수집 대상 — slug + 사진 검색어(한글) + 정보 검색어(영문) */
const TARGETS = [
  { slug: "n-seoul-tower", ko: "남산서울타워", en: "N Seoul Tower" },
  { slug: "bukchon-hanok-village", ko: "북촌한옥마을", en: "Bukchon Hanok Village" },
  { slug: "seongsan-ilchulbong", ko: "성산일출봉", en: "Seongsan Ilchulbong" },
  { slug: "jeonju-hanok-village", ko: "전주한옥마을", en: "Jeonju Hanok Village" },
  { slug: "gamcheon-culture-village", ko: "감천문화마을", en: "Gamcheon Culture Village" },
];

async function getJson(url) {
  const r = await fetch(url);
  const t = await r.text();
  try {
    return JSON.parse(t);
  } catch {
    return null;
  }
}

function firstItem(json) {
  const item = json?.response?.body?.items?.item;
  if (!item) return null;
  return Array.isArray(item) ? item[0] : item;
}

/** http 이미지 URL 을 https 로 강제(tong.visitkorea 는 https 지원) */
function https(url) {
  return typeof url === "string" ? url.replace(/^http:\/\//, "https://") : url;
}

async function collect(target) {
  const photo = firstItem(
    await getJson(
      `https://apis.data.go.kr/B551011/PhotoGalleryService1/gallerySearchList1?${COMMON}&keyword=${encodeURIComponent(target.ko)}`,
    ),
  );
  const eng = firstItem(
    await getJson(
      `https://apis.data.go.kr/B551011/EngService2/searchKeyword2?${COMMON}&keyword=${encodeURIComponent(target.en)}`,
    ),
  );

  return {
    slug: target.slug,
    nameKo: photo?.galTitle ?? target.ko,
    nameEn: eng?.title ?? target.en,
    // 이미지: 공공누리 1유형(포토코리아). 촬영자=출처표시.
    image: {
      url: https(photo?.galWebImageUrl) ?? null,
      photographer: photo?.galPhotographer ?? null,
      keyword: photo?.galSearchKeyword ?? null,
    },
    // 좌표·주소(영문). mapx=경도(lng), mapy=위도(lat).
    lat: eng?.mapy ? Number(eng.mapy) : null,
    lng: eng?.mapx ? Number(eng.mapx) : null,
    addrEn: eng?.addr1 ?? null,
    engContentId: eng?.contentid ?? null,
  };
}

const out = [];
for (const target of TARGETS) {
  const data = await collect(target);
  out.push(data);
  console.log(
    `[${data.slug}] 사진=${data.image.url ? "O" : "X"} 좌표=${data.lat ?? "X"},${data.lng ?? "X"} 촬영자=${data.image.photographer ?? "-"}`,
  );
}

writeFileSync(
  new URL("./_tourapi-out.json", import.meta.url),
  JSON.stringify(out, null, 2),
  "utf8",
);
console.log(`\n✅ ${out.length}곳 수집 → scripts/_tourapi-out.json`);
