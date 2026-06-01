
    // ─── REVEAL ON SCROLL ───────────────────────────────────────────────────────
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting)
          setTimeout(() => entry.target.classList.add('visible'), i * 80);
      });
    }, { threshold: 0.1 });
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

    // ─── NAV SCROLL + HAMBURGER ──────────────────────────────────────────────────
    (function () {
      const nav = document.getElementById('mainNav');
      const hamburger = document.getElementById('hamburger');
      const navLinks = document.getElementById('navLinks');

      // Scroll: frosted glass effect
      window.addEventListener('scroll', () => {
        nav.classList.toggle('scrolled', window.scrollY > 60);
      });

      // Hamburger toggle
      hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('open');
        navLinks.classList.toggle('open');
        document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
      });

      // Close on link click
      document.querySelectorAll('.nav-item').forEach(link => {
        link.addEventListener('click', () => {
          hamburger.classList.remove('open');
          navLinks.classList.remove('open');
          document.body.style.overflow = '';
        });
      });
    })();
