document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const targetID = this.getAttribute('href');
    const target = document.querySelector(targetID);
    if (!target) return;

    const headerOffset = 80; // ajuste se quiser
    const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerOffset;
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    const duration = 800; // duração em ms
    let start = null;

    // Função de easing (easeInOutCubic)
    function easeInOutCubic(t) {
      return t < 0.5
        ? 4 * t * t * t
        : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }

    function step(timestamp) {
      if (!start) start = timestamp;
      const progress = timestamp - start;
      const timeFraction = Math.min(progress / duration, 1);
      const easedProgress = easeInOutCubic(timeFraction);

      window.scrollTo(0, startPosition + distance * easedProgress);

      if (progress < duration) {
        window.requestAnimationFrame(step);
      }
    }

    window.requestAnimationFrame(step);
  });
});
