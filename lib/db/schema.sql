-- 명소 댓글/반응 스키마 (Neon Postgres) — 단일 진실원.
-- idempotent: 재실행해도 안전. 적용: `node scripts/db/migrate.mjs`
-- 스키마 변경 시 이 파일을 수정하고 migrate 를 재실행한다(테이블 2개라 이력 테이블 미도입).

-- 익명 댓글 (닉네임 + 내용). 물리삭제 없이 is_deleted 소프트삭제.
CREATE TABLE IF NOT EXISTS attraction_comments (
  id BIGSERIAL PRIMARY KEY,
  attraction_slug TEXT NOT NULL,
  nickname TEXT NOT NULL,
  content TEXT NOT NULL,
  locale TEXT NOT NULL DEFAULT 'ko',
  ip_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  is_deleted BOOLEAN NOT NULL DEFAULT false,
  deleted_reason TEXT
);

-- 목록 조회: 슬러그별 최신순, 삭제 제외
CREATE INDEX IF NOT EXISTS idx_comments_slug_created
  ON attraction_comments (attraction_slug, created_at DESC)
  WHERE is_deleted = false;

-- rate limit: 같은 IP의 최근 작성 조회
CREATE INDEX IF NOT EXISTS idx_comments_iphash_created
  ON attraction_comments (ip_hash, created_at DESC);

-- 이모지 반응 (이벤트 로그). UNIQUE 제약이 "IP당 이모지당 1회"를 스키마 레벨에서 강제.
CREATE TABLE IF NOT EXISTS attraction_reactions (
  id BIGSERIAL PRIMARY KEY,
  attraction_slug TEXT NOT NULL,
  emoji TEXT NOT NULL CHECK (emoji IN ('heart', 'thumbsup', 'wow')),
  ip_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (attraction_slug, emoji, ip_hash)
);

CREATE INDEX IF NOT EXISTS idx_reactions_slug
  ON attraction_reactions (attraction_slug);
