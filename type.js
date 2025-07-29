const phrases = ['Frontend', 'Backend', 'Backend & Frontend'];
let idx = 0, subIdx = 0, direction = 1;

function type() {
  const text = phrases[idx].slice(0, subIdx + direction);
  document.getElementById('digitando').innerHTML = text;
  subIdx += direction;

  if (subIdx === phrases[idx].length) {
    // terminou de digitar a frase inteira
    direction = -1; // começa a apagar

    // se for a última frase, pausa mais tempo antes de apagar
    if (idx === phrases.length - 1) {
      setTimeout(type, 5000); // fica 3 segundos parada na tela
      return;
    } else {
      setTimeout(type, 2000); // pausa normal
      return;
    }
  }

  if (subIdx === 0) {
    direction = 1; // começa a digitar próxima
    idx = (idx + 1) % phrases.length;
    setTimeout(type, 600); // pequena pausa antes de digitar próxima
    return;
  }

  setTimeout(type, 200); // velocidade normal digitando ou apagando
}

type();
