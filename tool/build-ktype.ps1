# 한글 타자 K-Type(Vite SPA) 정적 빌드 → worktool public/ktype 재현 스크립트 (Windows PowerShell)
#
# 17_K_type(별도 프로젝트, D:\02_PROJECT\17_K_type)를 base=/ktype/ 로 빌드해
# worktool 의 public/ktype/ 에 배치한다. 게임을 17_K_type 에서 수정한 뒤 이 스크립트를
# 돌리고 worktool 을 커밋·배포하면 workmate.tools/ktype 이 갱신된다.
#
# loopla(Next static export)와 달리 Vite SPA 는 단일 index.html 이라 이중 빌드 없이
# dist 를 그대로 복사한다.
#
# 사용: pwsh tool/build-ktype.ps1   (또는 PowerShell 에서 직접 실행)

$ErrorActionPreference = "Stop"
$src = "D:\02_PROJECT\17_K_type"
$dest = "D:\02_PROJECT\10_worktool\public\ktype"

Write-Host "① K-Type 빌드 (base=/ktype/)..." -ForegroundColor Cyan
Push-Location $src
npm run build
Pop-Location

Write-Host "② public/ktype/ 로 복사..." -ForegroundColor Cyan
Remove-Item -Recurse -Force $dest -ErrorAction SilentlyContinue
New-Item -ItemType Directory -Force $dest | Out-Null
Copy-Item "$src\dist\*" $dest -Recurse -Force

$count = (Get-ChildItem $dest -Recurse -File | Measure-Object).Count
Write-Host "완료 — public/ktype 파일 $count 개. worktool 커밋·배포하면 라이브 반영." -ForegroundColor Green
