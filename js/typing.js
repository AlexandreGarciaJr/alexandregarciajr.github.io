
    // ── Typing effect ──────────────────────────────────────────────────────
    (function () {
      const el = document.getElementById('typingText');
      let words = ['Frontend Developer', 'Backend Developer', 'Full Stack Developer'];
      window.__setTypingWords = function (w) { words = w; };
      let wi = 0, ci = 0, deleting = false;

      const TYPE_SPEED = 120;
      const DELETE_SPEED = 65;
      const PAUSE_END = 2400;
      const PAUSE_START = 500;

      function tick() {
        const word = words[wi];
        const current = word.slice(0, ci);
        el.textContent = current;

        if (!deleting) {
          if (ci < word.length) {
            ci++;
            setTimeout(tick, TYPE_SPEED);
          } else {
            // pause at end, then start deleting
            setTimeout(() => { deleting = true; tick(); }, PAUSE_END);
          }
        } else {
          if (ci > 0) {
            ci--;
            setTimeout(tick, DELETE_SPEED);
          } else {
            // move to next word
            deleting = false;
            wi = (wi + 1) % words.length;
            setTimeout(tick, PAUSE_START);
          }
        }
      }

      // Start after hero animation delay
      setTimeout(tick, 1200);
    })();