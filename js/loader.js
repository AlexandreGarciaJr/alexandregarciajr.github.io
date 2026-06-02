// ── LOADER ───────────────────────────────────────────────────────────────────
(function () {
  // Limpa o flag quando a aba for fechada de verdade
  window.addEventListener('pagehide', () => {
    sessionStorage.removeItem('loaderShown');
  });

  if (sessionStorage.getItem('loaderShown')) {
    const loader = document.getElementById('loader');
    if (loader) loader.remove();
    return;
  }

  const bootLines = [
    '> BOOT SEQUENCE INITIATED',
    '> LOADING MODULES...',
    '> INDEX.HTML        [OK]',
    '> STYLE.CSS        [OK]',
    '> THREE.JS    [OK]',
    '> READY.',
  ];

  const bootEl = document.getElementById('loaderBootText');
  const nameEl = document.getElementById('loaderName');
  const roleEl = document.getElementById('loaderRole');
  const barEl = document.getElementById('loaderBar');
  const labelEl = document.getElementById('loaderLabel');
  const loader = document.getElementById('loader');

  let lineIndex = 0;

  function typeLine(line, cb) {
    let i = 0;
    const span = document.createElement('div');
    bootEl.appendChild(span);
    const iv = setInterval(() => {
      span.textContent += line[i++];
      if (i >= line.length) { clearInterval(iv); setTimeout(cb, 80); }
    }, 28);
  }

  function typeLines() {
    if (lineIndex >= bootLines.length) {
      setTimeout(() => {
        nameEl.classList.add('reveal-name');
        setTimeout(() => roleEl.classList.add('show'), 700);
        setTimeout(() => {
          let pct = 0;
          const prog = setInterval(() => {
            pct += Math.random() * 12 + 4;
            if (pct >= 100) { pct = 100; clearInterval(prog); }
            barEl.style.width = pct + '%';
            labelEl.textContent = pct < 100 ? 'LOADING ' + Math.round(pct) + '%' : 'ENTER >';
            if (pct >= 100) {
              setTimeout(() => {
                sessionStorage.setItem('loaderShown', '1');
                loader.classList.add('hide');
                setTimeout(() => loader.remove(), 800);
              }, 600);
            }
          }, 90);
        }, 1800);
      }, 300);
      return;
    }
    typeLine(bootLines[lineIndex++], typeLines);
  }

  setTimeout(typeLines, 1500);
})();