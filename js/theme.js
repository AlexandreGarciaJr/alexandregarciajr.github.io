
    // ── THEME SWITCHER ────────────────────────────────────────────────────────────
    (function () {
      const root = document.documentElement;
      const panel = document.getElementById('themePanel');
      const btn = document.getElementById('themeToggleBtn');
      const options = document.querySelectorAll('.theme-option');

      function applyTheme(theme) {
        root.setAttribute('data-theme', theme === 'default' ? '' : theme);
        options.forEach(o => {
          o.classList.toggle('active', o.dataset.themeValue === theme);
        });
        try { localStorage.setItem('ag-theme', theme); } catch (e) { }
      }

      // Restore saved theme
      try {
        const saved = localStorage.getItem('ag-theme');
        if (saved) applyTheme(saved);
      } catch (e) { }

      // Toggle panel
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        panel.classList.toggle('open');
      });

      // Pick theme
      options.forEach(opt => {
        opt.addEventListener('click', () => {
          applyTheme(opt.dataset.themeValue);
          setTimeout(() => { panel.classList.remove('open'); document.getElementById('themeSwitcher').classList.remove('panel-open'); }, 150);
        });
      });

      // Close on outside click
      document.addEventListener('click', () => { panel.classList.remove('open'); document.getElementById('themeSwitcher').classList.remove('panel-open'); });
    })();
