@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo.
echo === Neo 로컬 웹앱 서버 ===
echo 이 창을 닫으면 서버가 종료됩니다.
echo.
echo 브라우저에서 아래 주소로 접속하세요:
echo   http://localhost:8787/webapps/
echo   http://localhost:8787/webapps/hq/
echo   http://localhost:8787/webapps/field/
echo.
npx --yes serve . -l 8787
