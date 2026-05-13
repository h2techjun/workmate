/**
 * IndexNow 색인 가속 핑 유틸 — Bing·Yandex·기타 IndexNow 호환 검색엔진에
 * URL 변경/추가를 즉시 알림.
 *
 * 검색엔진은 sitemap 크롤링 주기가 며칠~수 주 걸리는데, IndexNow ping 은
 * "이 URL 들 색인해줘" 를 즉시 전달 → 보통 24시간 내 색인.
 *
 * Google 은 IndexNow 미지원이지만 Google Search Console 의
 * "URL 검사 → 색인 생성 요청" 으로 대응 (수동·페이지당).
 *
 * 호출 예 (배포 후 새 URL 등록):
 *   await submitToIndexNow([
 *     "https://workmate.tools/ko/income-tax",
 *     "https://workmate.tools/en/income-tax",
 *   ]);
 *
 * 환경변수 미설정 시 noop (안전).
 */

const HOST = "workmate.tools";
const ENDPOINT = "https://api.indexnow.org/IndexNow";

export interface IndexNowResult {
  ok: boolean;
  status: number;
  reason?: string;
}

export async function submitToIndexNow(
  urls: ReadonlyArray<string>,
): Promise<IndexNowResult> {
  const key = process.env.INDEXNOW_KEY?.trim();
  if (!key) {
    return { ok: false, status: 0, reason: "INDEXNOW_KEY not set" };
  }
  if (urls.length === 0) {
    return { ok: false, status: 0, reason: "no urls" };
  }

  const body = {
    host: HOST,
    key,
    keyLocation: `https://${HOST}/indexnow-key`,
    urlList: urls.slice(0, 10000), // IndexNow 한 요청 당 최대 10,000개
  };

  try {
    const res = await fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify(body),
    });
    // 200·202 = 정상 접수. 422 = 키 검증 실패. 429 = rate limit.
    return { ok: res.ok, status: res.status };
  } catch (err) {
    return {
      ok: false,
      status: -1,
      reason: err instanceof Error ? err.message : "unknown",
    };
  }
}
