# Loopla(vibe-english) 정적 빌드 → worktool public/loopla 재현 스크립트 (Windows PowerShell)
#
# vibe-english(별도 repo, D:\02_PROJECT\11_english)를 basePath=/loopla 로 두 번 빌드해
# worktool 의 public/loopla/(영어) + public/loopla/korean/(한국어)에 배치한다.
# 카드 데이터·앱 UI 를 vibe-english 에서 수정한 뒤 이 스크립트를 돌리고 worktool 을
# 커밋·배포하면 workmate.tools/loopla 가 갱신된다.
#
# 사용: pwsh tool/build-loopla.ps1   (또는 PowerShell 에서 직접 실행)

$ErrorActionPreference = "Stop"
$vibe = "D:\02_PROJECT\11_english"
$dest = "D:\02_PROJECT\10_worktool\public\loopla"

Write-Host "① Loopla English 빌드 (basePath=/loopla)..." -ForegroundColor Cyan
Push-Location $vibe
Remove-Item -Recurse -Force .next -ErrorAction SilentlyContinue
$env:NEXT_PUBLIC_APP_TARGET = $null
$env:NEXT_PUBLIC_BASE_PATH = "/loopla"
npm run build
Pop-Location

Write-Host "② public/loopla/ 로 복사..." -ForegroundColor Cyan
Remove-Item -Recurse -Force $dest -ErrorAction SilentlyContinue
New-Item -ItemType Directory -Force $dest | Out-Null
Copy-Item "$vibe\out\*" $dest -Recurse -Force

Write-Host "③ Loopla Korean 빌드 (basePath=/loopla/korean)..." -ForegroundColor Cyan
Push-Location $vibe
Remove-Item -Recurse -Force .next -ErrorAction SilentlyContinue
$env:NEXT_PUBLIC_APP_TARGET = "korean"
$env:NEXT_PUBLIC_BASE_PATH = "/loopla/korean"
npm run build
Pop-Location

Write-Host "④ public/loopla/korean/ 로 복사..." -ForegroundColor Cyan
Copy-Item "$vibe\out\*" "$dest\korean" -Recurse -Force

$count = (Get-ChildItem $dest -Recurse -File | Measure-Object).Count
Write-Host "완료 — public/loopla 파일 $count 개. worktool 커밋·배포하면 라이브 반영." -ForegroundColor Green
