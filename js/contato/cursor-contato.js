(function () {
      const cursor = document.getElementById('cursor');
      const ring = document.getElementById('cursorRing');
      const corner = document.getElementById('cursorCorner');
      const crossH = document.getElementById('cursorH');
      const crossV = document.getElementById('cursorV');
      let mx = 0, my = 0, rx = 0, ry = 0;
      document.addEventListener('mousemove', e => {
        mx = e.clientX; my = e.clientY;
        cursor.style.left = mx + 'px'; cursor.style.top = my + 'px';
        crossH.style.left = mx + 'px'; crossH.style.top = my + 'px';
        crossV.style.left = mx + 'px'; crossV.style.top = my + 'px';
      });
      (function tick() {
        rx += (mx - rx) * .10; ry += (my - ry) * .10;
        ring.style.left = rx + 'px'; ring.style.top = ry + 'px';
        corner.style.left = rx + 'px'; corner.style.top = ry + 'px';
        requestAnimationFrame(tick);
      })();
      document.querySelectorAll('a,button,input,select,textarea').forEach(el => {
        el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
        el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
      });
    })();

    // Nav scroll
    window.addEventListener('scroll', () => {
      document.getElementById('mainNav').classList.toggle('scrolled', window.scrollY > 60);
    });
