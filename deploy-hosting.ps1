# Neo → Firebase Hosting 배포 (이 스크립트가 있는 폴더 기준)
Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"
Set-Location -LiteralPath $PSScriptRoot

if (-not (Test-Path -LiteralPath (Join-Path $PSScriptRoot "firebase-config.js"))) {
  Write-Host "firebase-config.js 가 없습니다." -ForegroundColor Red
  Write-Host "예: copy firebase-config.example.js firebase-config.js 후 Firebase 콘솔 값을 채우세요."
  exit 1
}

Write-Host "배포 중: hosting …" -ForegroundColor Cyan
firebase deploy --only hosting
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
Write-Host "완료. 콘솔에 표시된 Hosting URL을 확인하세요." -ForegroundColor Green
