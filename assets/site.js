/* Shared behavior for both language versions. */
(() => {
  'use strict';
  const root = document.documentElement;
  const themeButton = document.getElementById('theme-toggle');
  const sun = document.getElementById('icon-sun');
  const moon = document.getElementById('icon-moon');
  const themeMeta = document.querySelector('meta[name="theme-color"]');
  const media = window.matchMedia('(prefers-color-scheme: dark)');
  function savedTheme() {
    try { return localStorage.getItem('theme'); } catch (_) { return null; }
  }
  function applyTheme(dark, persist = false) {
    root.classList.toggle('dark', dark);
    themeButton?.setAttribute('aria-pressed', String(dark));
    sun?.classList.toggle('icon--active', !dark);
    moon?.classList.toggle('icon--active', dark);
    themeMeta?.setAttribute('content', dark ? '#0b1020' : '#f9fafb');
    if (persist) {
      try { localStorage.setItem('theme', dark ? 'dark' : 'light'); } catch (_) { /* Theme still works if storage is disabled. */ }
    }
  }
  applyTheme(savedTheme() ? savedTheme() === 'dark' : media.matches);
  themeButton?.addEventListener('click', () => applyTheme(!root.classList.contains('dark'), true));
  media.addEventListener('change', (event) => {
    if (!savedTheme()) applyTheme(event.matches);
  });
  window.addEventListener('storage', (event) => {
    if (event.key === 'theme') applyTheme(event.newValue ? event.newValue === 'dark' : media.matches);
  });
  const year = document.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());

  const dialog = document.getElementById('muss-dialog');
  let dialogOpener = null;
  if (dialog) {
    document.querySelectorAll('[data-dialog="muss-dialog"]').forEach((button) => {
      button.addEventListener('click', () => {
        dialogOpener = button;
        dialog.showModal();
        root.classList.add('dialog-open');
        dialog.scrollTop = 0;
      });
    });
    dialog.querySelector('[data-close-dialog]')?.addEventListener('click', () => dialog.close());
    // Native Escape dismisses the modal. Clicking its backdrop also closes it.
    let pointerStartedOnBackdrop = false;
    const outside = (event) => {
      const rect = dialog.getBoundingClientRect();
      return event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom;
    };
    dialog.addEventListener('pointerdown', (event) => {
      pointerStartedOnBackdrop = event.target === dialog && outside(event);
    });
    dialog.addEventListener('click', (event) => {
      if (pointerStartedOnBackdrop && event.target === dialog && outside(event)) dialog.close();
      pointerStartedOnBackdrop = false;
    });
    dialog.addEventListener('close', () => {
      root.classList.remove('dialog-open');
      dialogOpener?.focus({ preventScroll: true });
    });
  }
})();
