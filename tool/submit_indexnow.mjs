#!/usr/bin/env node
/**
 * IndexNow 일괄 핑 스크립트.
 *
 * 사용법 (PowerShell·bash 공통):
 *   $env:INDEXNOW_KEY="<발급키>"
 *   node tool/submit_indexnow.mjs                    # 사이트맵 전체 핑
 *   node tool/submit_indexnow.mjs --new              # 신규 도구 4개만 핑
 *   node tool/submit_indexnow.mjs https://workmate.tools/ko/income-tax
 *
 * 사이트맵 모드: workmate.tools/sitemap.xml 의 모든 <loc> 추출 후 핑.
 * 도구 추가/배포 직후 이 스크립트 한 번 돌리면 1~3일 내 Bing 색인.
 *
 * Google 색인은 Google Search Console 의 "URL 검사" → "색인 생성 요청" 으로
 * 따로 진행 (API 미공개·페이지당 수동).
 */

const HOST = "workmate.tools";
const ENDPOINT = "https://api.indexnow.org/IndexNow";
const SITEMAP_URL = `https://${HOST}/sitemap.xml`;

function exitWithMsg(msg, code = 1) {
  console.error(msg);
  process.exit(code);
}

function getKey() {
  const key = (process.env.INDEXNOW_KEY ?? "").trim();
  if (!key) {
    exitWithMsg("ERROR: INDEXNOW_KEY 환경변수가 설정되지 않았습니다.");
  }
  if (key.length < 32) {
    exitWithMsg("ERROR: INDEXNOW_KEY 는 최소 32자 이상이어야 합니다.");
  }
  return key;
}

async function fetchSitemapUrls() {
  const res = await fetch(SITEMAP_URL);
  if (!res.ok) {
    exitWithMsg(`sitemap.xml fetch 실패: HTTP ${res.status}`);
  }
  const xml = await res.text();
  const matches = xml.matchAll(/<loc>([^<]+)<\/loc>/g);
  return [...matches].map((m) => m[1]);
}

const NEW_TOOLS = [
  "/ko/income-tax",
  "/en/income-tax",
  "/ko/rent-cap",
  "/en/rent-cap",
  "/ko/loan-calc",
  "/en/loan-calc",
  "/ko/area-convert",
  "/en/area-convert",
  "/ko/percent-calc",
  "/en/percent-calc",
  "/ko/compound-calc",
  "/en/compound-calc",
].map((p) => `https://${HOST}${p}`);

async function main() {
  const key = getKey();
  const args = process.argv.slice(2);

  let urls;
  if (args.includes("--new")) {
    urls = NEW_TOOLS;
    console.log(`[indexnow] 신규 도구 ${urls.length}개 핑 모드`);
  } else if (args.length > 0 && args[0].startsWith("http")) {
    urls = args.filter((a) => a.startsWith("http"));
    console.log(`[indexnow] 명시 URL ${urls.length}개 핑`);
  } else {
    console.log(`[indexnow] 사이트맵 모드 — ${SITEMAP_URL} 가져오는 중...`);
    urls = await fetchSitemapUrls();
    console.log(`[indexnow] 사이트맵에서 ${urls.length}개 URL 추출`);
  }

  if (urls.length === 0) {
    exitWithMsg("핑할 URL 이 0개 입니다.");
  }

  const body = {
    host: HOST,
    key,
    keyLocation: `https://${HOST}/indexnow-key`,
    urlList: urls,
  };

  console.log(`[indexnow] POST ${ENDPOINT} — ${urls.length} URLs`);
  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify(body),
  });

  console.log(`[indexnow] HTTP ${res.status}`);
  if (res.ok) {
    console.log("[indexnow] ✅ 접수 완료. Bing 1~3일 내 색인 시작.");
  } else {
    const text = await res.text();
    console.error(`[indexnow] ❌ 실패: ${text.slice(0, 500)}`);
    process.exit(2);
  }

  // 보너스: Google sitemap ping (deprecated 2023 but Bing 등 여전히 유효)
  for (const engine of [
    `https://www.bing.com/ping?sitemap=${encodeURIComponent(SITEMAP_URL)}`,
  ]) {
    try {
      const r = await fetch(engine);
      console.log(`[sitemap-ping] ${engine.split("?")[0]} → ${r.status}`);
    } catch {
      // 무시
    }
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(99);
});
