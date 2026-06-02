document.addEventListener('DOMContentLoaded', () => {
  const waBtn = document.getElementById('waBtn');
  const waMenu = document.getElementById('waMenu');

  waBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    waMenu.classList.toggle('open');
  });

  document.addEventListener('click', (e) => {
    if (!waMenu.contains(e.target) && e.target !== waBtn) {
      waMenu.classList.remove('open');
    }
  });

  document.getElementById('waMenuLink').addEventListener('click', () => {
    waMenu.classList.remove('open');
  });
});