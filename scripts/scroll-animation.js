const myObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('show');
      // Opcional: parar de observar o elemento após aparecer
      myObserver.unobserve(entry.target);
    }
  });
});

const elements = document.querySelectorAll('.hidden, .hidden-up, .hidden-up-forte, .hidden-down')

elements.forEach((Element) => myObserver.observe(Element))