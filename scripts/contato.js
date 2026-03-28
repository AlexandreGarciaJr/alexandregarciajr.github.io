
// ---- Máscara telefone ----
const telInput = document.getElementById('telefone');
telInput.addEventListener('input', () => {
  let v = telInput.value.replace(/\D/g, '').slice(0, 13);
  if (v.length > 9)      v = '+55 ' + v.slice(2,4) + ' ' + v.slice(4,9) + '-' + v.slice(9);
  else if (v.length > 4) v = '+55 ' + v.slice(2,4) + ' ' + v.slice(4);
  else if (v.length > 2) v = '+55 ' + v.slice(2);
  telInput.value = v;
});
 
// ---- Contador de caracteres ----
const mensagemInput = document.getElementById('mensagem');
const charCount = document.getElementById('charCount');
mensagemInput.setAttribute('maxlength', 600);
mensagemInput.addEventListener('input', () => {
  const len = mensagemInput.value.length;
  charCount.textContent = len + ' / 600';
  charCount.classList.toggle('perto', len >= 510);
});
 
// ---- Validação ----
const form     = document.getElementById('contatoForm');
const btn      = document.getElementById('formBtn');
const feedback = document.getElementById('formFeedback');
 
function mostrarErro(id, msg) {
  const el = document.getElementById(id);
  if (!el) return;
  el.textContent = msg;
  el.classList.toggle('visivel', !!msg);
}
 
function validar() {
  let ok = true;
  const nome     = document.getElementById('nome').value.trim();
  const email    = document.getElementById('email').value.trim();
  const tipo     = document.getElementById('tipo').value;
  const mensagem = mensagemInput.value.trim();
 
  mostrarErro('erro-nome', nome.length < 2 ? 'Por favor, insira seu nome.' : '');
  if (nome.length < 2) ok = false;
 
  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  mostrarErro('erro-email', !emailOk ? 'E-mail inválido.' : '');
  if (!emailOk) ok = false;
 
  mostrarErro('erro-tipo', !tipo ? 'Selecione um tipo de projeto.' : '');
  if (!tipo) ok = false;
 
  mostrarErro('erro-mensagem', mensagem.length < 10 ? 'Mensagem muito curta.' : '');
  if (mensagem.length < 10) ok = false;
 
  return ok;
}
 
// Validação ao sair do campo
['nome', 'email', 'tipo', 'mensagem'].forEach(id => {
  const el = document.getElementById(id);
  el && el.addEventListener('blur', validar);
});
 
// ---- Envio ----
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  if (!validar()) return;
 
  btn.disabled = true;
  btn.querySelector('.btn-texto').textContent = 'Enviando...';
  feedback.className = 'form-feedback';
  feedback.textContent = '';
 
  try {
    const res = await fetch('./enviar.php', {
      method: 'POST',
      body: new FormData(form)
    });
 
    const texto = await res.text();
    console.log('Status HTTP:', res.status);
    console.log('Resposta servidor:', texto);
 
    let data;
    try {
      data = JSON.parse(texto);
    } catch (e) {
      throw new Error('Resposta inesperada: ' + texto.substring(0, 200));
    }
 
    btn.disabled = false;
    btn.querySelector('.btn-texto').textContent = 'Enviar mensagem';
 
    if (data.ok) {
      form.reset();
      charCount.textContent = '0 / 600';
      feedback.className = 'form-feedback sucesso visivel';
      feedback.textContent = '✓ Mensagem enviada! Responderei em breve.';
      setTimeout(() => feedback.classList.remove('visivel'), 6000);
    } else {
      feedback.className = 'form-feedback erro visivel';
      feedback.textContent = data.erro || 'Erro ao enviar. Tente novamente.';
    }
 
  } catch (err) {
    console.error('Erro no envio:', err.message);
    btn.disabled = false;
    btn.querySelector('.btn-texto').textContent = 'Enviar mensagem';
    feedback.className = 'form-feedback erro visivel';
    feedback.textContent = 'Erro: ' + err.message;
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