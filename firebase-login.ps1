# Firebase CLI 로그인 (브라우저에서 Google 계정 승인)
Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot

if (-not (Get-Command firebase -ErrorAction SilentlyContinue)) {
  Write-Host "firebase 명령이 없습니다. 설치: npm install -g firebase-tools" -ForegroundColor Red
  exit 1
}

Write-Host ""
Write-Host "=== Firebase CLI 로그인 ===" -ForegroundColor Cyan
Write-Host "1) 잠시 후 브라우저가 열리면 Google 계정으로 승인하세요."
Write-Host "2) 브라우저가 안 열리면 표시되는 URL을 복사해 브라우저에서 여세요."
Write-Host "3) 이미 로그인된 경우에도 토큰이 만료되면 이 스크립트를 다시 실행하세요."
Write-Host ""

# 만료된 토큰 재인증
firebase login --reauth
$ok = $?

Write-Host ""
if ($ok) {
  Write-Host "로그인 완료. 연결된 프로젝트 목록:" -ForegroundColor Green
  firebase projects:list
} else {
  Write-Host "로그인이 취소되었거나 실패했습니다." -ForegroundColor Yellow
}
Write-Host ""
