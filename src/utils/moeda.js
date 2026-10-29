// UTILS — Valores em reais digitados em formulários

// Mantém só dígitos e uma vírgula (máx. 2 decimais).
// Se o teclado enviar ponto como separador, ele vira vírgula: "45.5" -> "45,5"
export function limparValor(texto) {
  const limpo = String(texto).replace(/\./g, ',').replace(/[^\d,]/g, '');
  const [inteiro, ...resto] = limpo.split(',');

  if (resto.length === 0) {
    return inteiro;
  }
  return `${inteiro},${resto.join('').slice(0, 2)}`;
}

// "45,50" -> 45.5 (NaN se não for um número)
export function valorParaNumero(texto) {
  const numero = Number(String(texto).replace(',', '.'));
  return Number.isFinite(numero) ? numero : NaN;
}

// 45.5 -> "45,5" (usado para preencher o formulário na edição)
export function numeroParaValor(numero) {
  return String(numero).replace('.', ',');
}