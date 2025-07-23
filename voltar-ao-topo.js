var btnVoltarAoTopo = document.getElementById("voltarAoTopo");

window.addEventListener("scroll", function() {
  if (document.body.scrollTop > 300 || document.documentElement.scrollTop > 300) {
    btnVoltarAoTopo.classList.add("mostrar");
  } else {
    btnVoltarAoTopo.classList.remove("mostrar");
  }
});

document.getElementById("voltarAoTopo").addEventListener("click", function() {
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
});