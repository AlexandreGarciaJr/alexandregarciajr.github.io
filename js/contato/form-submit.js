   
    // Char counter
    const msgArea = document.getElementById('msgArea');
    const charCount = document.getElementById('charCount');
    msgArea.addEventListener('input', () => charCount.textContent = msgArea.value.length);

    // Form submit (demo — swap for your backend/formspree)
    document.getElementById('contactForm').addEventListener('submit', e => {
      e.preventDefault();
      const form = document.getElementById('contactForm');
      const success = document.getElementById('formSuccess');
      form.style.display = 'none';
      success.style.display = 'flex';
    });