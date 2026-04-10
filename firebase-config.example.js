/**
 * 이 파일을 복사해 firebase-config.js 로 저장한 뒤, Firebase 콘솔의 웹 앱 설정값을 채우세요.
 * cp firebase-config.example.js firebase-config.js  (Mac/Linux)
 * copy firebase-config.example.js firebase-config.js  (Windows)
 */
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
