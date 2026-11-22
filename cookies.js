const cookieNotice = document.querySelector('.cookie-notice');
const cookieNoticeKey = 'gojjin-cookie-notice-until';
const cookieNoticeDuration = 180 * 24 * 60 * 60 * 1000;

let acknowledgedUntil = 0;
try {
  acknowledgedUntil = Number(localStorage.getItem(cookieNoticeKey));
} catch {
  // The notice still works when browser storage is unavailable.
}

if (!(acknowledgedUntil > Date.now())) {
  cookieNotice.hidden = false;

  cookieNotice.querySelector('[data-cookie-accept]').addEventListener('click', () => {
    try {
      localStorage.setItem(cookieNoticeKey, String(Date.now() + cookieNoticeDuration));
    } catch {
      // Dismiss the notice for this page when the preference cannot be saved.
    }
    cookieNotice.hidden = true;
  });

  cookieNotice.querySelector('[data-cookie-dismiss]').addEventListener('click', () => {
    cookieNotice.hidden = true;
  });
}
