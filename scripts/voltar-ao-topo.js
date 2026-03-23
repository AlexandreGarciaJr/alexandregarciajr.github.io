var btnVoltarAoTopo = document.getElementById("voltarAoTopo");

window.addEventListener("scroll", function () {
  if (
    document.body.scrollTop > 300 ||
    document.documentElement.scrollTop > 300
  ) {
    btnVoltarAoTopo.classList.add("mostrar");
  } else {
    btnVoltarAoTopo.classList.remove("mostrar");
  }
});

btnVoltarAoTopo.addEventListener("click", function () {
  scrollToTop(600); // 600ms
});

function scrollToTop(duration) {
  const start = document.documentElement.scrollTop || document.body.scrollTop;
  const startTime = performance.now();

  function scrollStep(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1); // de 0 a 1
    // easing suave: easeOutQuad
    const ease = 1 - (1 - progress) * (1 - progress);
    window.scrollTo(0, start * (1 - ease));
    if (elapsed < duration) {
      requestAnimationFrame(scrollStep);
    }
  }
  requestAnimationFrame(scrollStep);
}
