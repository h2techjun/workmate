# 한글 빈칸(kword) Vite SPA 빌드 → public/kword 임베드. build-loopla.ps1 미러.
# 사용: pwsh tool/build-kword.ps1  (이후 worktool 커밋·배포하면 workmate.tools/kword 반영)
$ErrorActionPreference = "Stop"
$src = "D:\02_PROJECT\16_K_word"
$dest = "D:\02_PROJECT\10_worktool\public\kword"

Push-Location $src
Remove-Item -Recurse -Force dist -ErrorAction SilentlyContinue
npm run build   # tsc -b && vite build (base '/kword/')
Pop-Location

# stale 청크 방지 — 통째 교체
Remove-Item -Recurse -Force $dest -ErrorAction SilentlyContinue
New-Item -ItemType Directory -Force $dest | Out-Null
Copy-Item "$src\dist\*" $dest -Recurse -Force

$count = (Get-ChildItem $dest -Recurse -File | Measure-Object).Count
Write-Host "완료 — public/kword 파일 $count 개. worktool 커밋·푸시하면 라이브." -ForegroundColor Green
