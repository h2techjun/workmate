// 라이트 테마 FOUC 가드 — head 에서 동기 실행되어 첫 페인트 전에 적용.
// localStorage 에 명시적으로 'light' 가 저장된 경우에만 전환 (기본은 다크).
(function () {
  try {
    if (localStorage.getItem("wm-theme") === "light") {
      document.documentElement.setAttribute("data-theme", "light");
      var m = document.querySelector('meta[name="theme-color"]');
      if (m) {
        m.setAttribute("content", "#f6f7fb");
      }
    }
  } catch (e) {
    // storage 접근 불가 환경 — 다크 기본 유지
  }
})();
