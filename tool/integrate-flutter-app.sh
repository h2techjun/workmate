#!/usr/bin/env bash
# Flutter Web 앱을 Workmate 의 서브패스로 통합 빌드/복사 스크립트.
#
# Usage:
#   bash tool/integrate-flutter-app.sh <flutter-project-dir> <subpath>
#
# Example:
#   bash tool/integrate-flutter-app.sh D:/02_PROJECT/08_k-poker          play/k-poker
#   bash tool/integrate-flutter-app.sh D:/02_PROJECT/defense             play/defense
#   bash tool/integrate-flutter-app.sh D:/02_PROJECT/01_Hakrew/app       app/hakrew
#
# 동작:
#   1. cd <flutter-project-dir>
#   2. flutter clean (선택, --clean 옵션)
#   3. flutter build web --release --base-href //<subpath>// (Git Bash 경로 변환 회피)
#   4. sed 로 base href 정상화
#   5. WORKMATE_ROOT/public/<subpath>/ 으로 복사
#   6. .nojekyll 생성 (혹시 GitHub Pages 도 같이 쓸 때 대비)

set -euo pipefail

WORKMATE_ROOT="${WORKMATE_ROOT:-D:/02_PROJECT/10_worktool}"

FLUTTER_DIR="${1:-}"
SUBPATH="${2:-}"
DO_CLEAN="${3:-}"

if [[ -z "$FLUTTER_DIR" || -z "$SUBPATH" ]]; then
  echo "Usage: bash tool/integrate-flutter-app.sh <flutter-project-dir> <subpath> [--clean]"
  echo "Example:"
  echo "  bash tool/integrate-flutter-app.sh D:/02_PROJECT/08_k-poker play/k-poker"
  exit 1
fi

if [[ ! -d "$FLUTTER_DIR" ]]; then
  echo "❌ Flutter project not found: $FLUTTER_DIR"
  exit 1
fi

if [[ ! -d "$WORKMATE_ROOT" ]]; then
  echo "❌ Workmate root not found: $WORKMATE_ROOT"
  exit 1
fi

DEST="$WORKMATE_ROOT/public/$SUBPATH"

echo "─────────────────────────────────────────────────────────"
echo "📦 Integrating Flutter app"
echo "   Source : $FLUTTER_DIR"
echo "   Subpath: /$SUBPATH/"
echo "   Dest   : $DEST"
echo "─────────────────────────────────────────────────────────"

cd "$FLUTTER_DIR"

if [[ "$DO_CLEAN" == "--clean" ]]; then
  echo "🧹 flutter clean ..."
  flutter clean
  flutter pub get
fi

# Git Bash 자동 경로 변환을 막기 위해 슬래시 이중화 + sed 후처리
echo "🛠  flutter build web ..."
MSYS_NO_PATHCONV=1 flutter build web --release --base-href "//$SUBPATH//"

INDEX="build/web/index.html"
if [[ ! -f "$INDEX" ]]; then
  echo "❌ build/web/index.html not produced. Build failed."
  exit 1
fi

echo "✏️  Normalizing base href ..."
sed -i "s|base href=\"//$SUBPATH//\"|base href=\"/$SUBPATH/\"|g" "$INDEX"

# 정적 호스팅 환경에서 Service Worker scope 가 의도치 않게 도메인 전체로 잡히는 사고 예방
# Flutter 의 flutter_bootstrap.js / flutter_service_worker.js 는 base href 기준이므로
# 여기서는 추가 패치 없이도 정상 동작하지만, 서버 응답 헤더가 SW scope 를 제한해야 안전.
# (해당 헤더 설정은 Vercel 의 vercel.json 또는 Next.js headers() 에서 처리.)

echo "📂 Copying to Workmate public/ ..."
rm -rf "$DEST"
mkdir -p "$DEST"
cp -r build/web/. "$DEST/"
touch "$DEST/.nojekyll"

# 통합 메타 마커
cat > "$DEST/.workmate-integrated.json" <<EOF
{
  "subpath": "/$SUBPATH/",
  "source": "$FLUTTER_DIR",
  "integratedAt": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")"
}
EOF

# 복사 결과 요약
SIZE=$(du -sh "$DEST" 2>/dev/null | cut -f1)
FILES=$(find "$DEST" -type f | wc -l)

echo ""
echo "✅ Done."
echo "   Files copied: $FILES"
echo "   Total size  : $SIZE"
echo "   Local check : http://localhost:3000/$SUBPATH/"
echo ""
echo "Next: cd $WORKMATE_ROOT && git add public/$SUBPATH && git commit -m 'feat: integrate $SUBPATH'"
