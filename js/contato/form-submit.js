// ---- Máscara telefone ----
const telInput = document.getElementById('telefone');
telInput?.addEventListener('input', () => {
  let v = telInput.value.replace(/\D/g, '').slice(0, 13);
  if (v.length > 9)      v = '+55 ' + v.slice(2,4) + ' ' + v.slice(4,9) + '-' + v.slice(9);
  else if (v.length > 4) v = '+55 ' + v.slice(2,4) + ' ' + v.slice(4);
  else if (v.length > 2) v = '+55 ' + v.slice(2);
  telInput.value = v;
});

// ---- Contador de caracteres ----
const msgArea   = document.getElementById('msgArea');
const charCount = document.getElementById('charCount');
msgArea?.addEventListener('input', () => {
  const len = msgArea.value.length;
  charCount.textContent = len;
  charCount.parentElement.classList.toggle('perto', len >= 510);
});

// ---- Referências ----
const form       = document.getElementById('contactForm');
const btnSend    = form?.querySelector('.btn-send');
const btnTexto   = btnSend?.querySelector('span');
const formSucess = document.getElementById('formSuccess');

// ---- Validação ----
function getVal(id) {
  return document.getElementById(id)?.value.trim() ?? '';
}

function setError(input, msg) {
  // Remove erro anterior
  let err = input.parentElement.querySelector('.input-error');
  if (!err) {
    err = document.createElement('span');
    err.className = 'input-error';
    input.parentElement.appendChild(err);
  }
  err.textContent = msg;
  input.classList.toggle('input-invalid', !!msg);
}

function validar() {
  let ok = true;

  const nomeEl  = document.getElementById('nome');
  const emailEl = document.getElementById('email');
  const tipoEl  = document.getElementById('tipo');
  const msgEl   = document.getElementById('msgArea');

  // Nome
  if (nomeEl.value.trim().length < 2) {
    setError(nomeEl, 'Por favor, insira seu nome.');
    ok = false;
  } else setError(nomeEl, '');

  // Email
  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailEl.value.trim());
  if (!emailOk) {
    setError(emailEl, 'E-mail inválido.');
    ok = false;
  } else setError(emailEl, '');

  // Tipo
  if (!tipoEl.value) {
    setError(tipoEl, 'Selecione um tipo de projeto.');
    ok = false;
  } else setError(tipoEl, '');

  // Mensagem
  if (msgEl.value.trim().length < 10) {
    setError(msgEl, 'Mensagem muito curta.');
    ok = false;
  } else setError(msgEl, '');

  return ok;
}

// Valida ao sair de cada campo
['nome', 'email', 'tipo', 'msgArea'].forEach(id => {
  document.getElementById(id)?.addEventListener('blur', validar);
});

// ---- Envio ----
form?.addEventListener('submit', async (e) => {
  e.preventDefault();
  if (!validar()) return;

  btnSend.disabled = true;
  btnTexto.textContent = 'Enviando...';

  try {
    const res  = await fetch('./enviar.php', {
      method: 'POST',
      body: new FormData(form)
    });

    const texto = await res.text();
    console.log('Status HTTP:', res.status);
    console.log('Resposta servidor:', texto);

    let data;
    try {
      data = JSON.parse(texto);
    } catch {
      throw new Error('Resposta inesperada: ' + texto.substring(0, 200));
    }

    if (data.ok) {
      form.style.display = 'none';
      formSucess.style.display = 'flex'; // mostra o div de sucesso
    } else {
      alert(data.erro || 'Erro ao enviar. Tente novamente.');
    }

  } catch (err) {
    console.error('Erro:', err.message);
    alert('Erro: ' + err.message);
  } finally {
    btnSend.disabled = false;
    btnTexto.textContent = 'Enviar mensagem';
  }
});

// ---- Animação de entrada ----
document.querySelectorAll('.hidden-up').forEach((el, i) => {
  setTimeout(() => {
    const io = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        el.classList.add('show');
        io.unobserve(el);
      }
    }, { threshold: 0.1 });
    io.observe(el);
  }, i * 120);
});