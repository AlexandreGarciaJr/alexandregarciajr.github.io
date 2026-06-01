
    // ── TOUCH RETICLE ─────────────────────────────────────────────────────────────
    (function () {
      if (!('ontouchstart' in window)) return; // desktop only uses mouse cursor

      const ret = document.getElementById('touchReticle');
      const retB = document.getElementById('touchReticleB');
      const dot = document.getElementById('touchDot');
      const b1 = document.getElementById('touchBurst');
      const b2 = document.getElementById('touchBurst2');

      let tx = 0, ty = 0, rx = 0, ry = 0;
      let hideTimer = null;

      function moveTo(x, y) {
        tx = x; ty = y;
        dot.style.left = x + 'px'; dot.style.top = y + 'px';
      }

      // Smooth follow via rAF
      function tick() {
        rx += (tx - rx) * 0.14;
        ry += (ty - ry) * 0.14;
        ret.style.left = rx + 'px'; ret.style.top = ry + 'px';
        retB.style.left = rx + 'px'; retB.style.top = ry + 'px';
        requestAnimationFrame(tick);
      }
      tick();

      function show() {
        ret.classList.add('visible');
        retB.classList.add('visible');
        dot.classList.add('visible');
        clearTimeout(hideTimer);
      }

      function hide() {
        hideTimer = setTimeout(() => {
          ret.classList.remove('visible');
          retB.classList.remove('visible');
          dot.classList.remove('visible');
        }, 400);
      }

      function burst(x, y) {
        [b1, b2].forEach(el => {
          el.style.left = x + 'px';
          el.style.top = y + 'px';
          el.classList.remove('pop');
          void el.offsetWidth; // reflow
          el.classList.add('pop');
        });
      }

      document.addEventListener('touchstart', e => {
        const t = e.touches[0];
        moveTo(t.clientX, t.clientY);
        tx = t.clientX; ty = t.clientY;
        rx = t.clientX; ry = t.clientY;
        show();
        burst(t.clientX, t.clientY);
      }, { passive: true });

      document.addEventListener('touchmove', e => {
        const t = e.touches[0];
        moveTo(t.clientX, t.clientY);
        show();
      }, { passive: true });

      document.addEventListener('touchend', hide, { passive: true });
      document.addEventListener('touchcancel', hide, { passive: true });
    })();
