// UTILS — Funções simples de validação de formulários

export function campoObrigatorio(valor) {
  return valor.trim().length > 0;
}

export function emailValido(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export function senhaValida(senha) {
  return senha.length >= 6;
}