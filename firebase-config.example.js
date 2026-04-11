/**
 * 이 파일을 복사해 firebase-config.js 로 저장한 뒤, Firebase 콘솔의 웹 앱 설정값을 채우세요.
 * cp firebase-config.example.js firebase-config.js  (Mac/Linux)
 * copy firebase-config.example.js firebase-config.js  (Windows)
 *
 * 현장 앱(현장_영업사원.html): 이메일 인증 메일 한글·문구 수정
 *   Firebase Console → Authentication → Templates → 이메일 주소 인증
 *   (앱에서 firebase.auth().languageCode = 'ko' 로 발송 언어를 한국어로 요청합니다.)
 *   승인된 도메인에 배포 URL(예: Hosting)을 등록해야 인증 링크가 동작합니다.
 *
 * (선택) 인증·비밀번호 재설정 메일의 continue URL. 비워 두면 앱이
 *   현재 주소(http/https) → projectId.web.app/해당HTML → authDomain 순으로 자동 선택합니다.
 * (기본 스킴은 HTML에 http:// 로 맞춰 두었습니다. https만 쓰려면 해당 HTML의 NEO_PUBLIC_URL_SCHEME 를 "https://" 로 바꾸세요.)
 * 커스텀 도메인만 쓸 때는 여기에 http(s) 전체 URL을 넣으세요.
 */
window.__NEO_EMAIL_CONTINUE_URL__ = "";

/** (선택) 본사 관리「가입 요청」에 표시할 영업사원 앱 전체 URL. 비우면 현재 호스트 또는 projectId.web.app 기준으로 자동 생성합니다. */
window.__NEO_FIELD_APP_URL__ = "";

window.__NEO_FIREBASE_CONFIG__ = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID",
  measurementId: "G-XXXXXXXXXX",
};

window.__NEO_APP_CHECK_RECAPTCHA_V3_SITE_KEY__ = "";

window.neoActivateAppCheckIfConfigured = function neoActivateAppCheckIfConfigured() {
  if (window.__NEO_APP_CHECK_ACTIVATED__) return;
  if (typeof firebase === "undefined" || typeof firebase.appCheck !== "function") return;
  if (!firebase.apps.length) return;
  const key = window.__NEO_APP_CHECK_RECAPTCHA_V3_SITE_KEY__;
  if (!key || typeof key !== "string" || key.indexOf("YOUR_") === 0 || key.trim() === "") return;
  try {
    firebase.appCheck().activate(key, true);
    window.__NEO_APP_CHECK_ACTIVATED__ = true;
  } catch (e) {
    console.warn("[Neo] App Check 활성화 실패:", e);
  }
};
