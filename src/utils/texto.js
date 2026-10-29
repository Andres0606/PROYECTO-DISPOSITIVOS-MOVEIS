// UTILS — Texto

// Minúsculas e sem acentos: "Mercadão" casa com "mercadao"
export function normalizarTexto(texto) {
  return String(texto)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}