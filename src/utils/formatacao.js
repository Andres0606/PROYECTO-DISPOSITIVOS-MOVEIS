// UTILS — Formatação de valores

// Formata em reais sem centavos, como no Figma: 1245 -> "R$ 1.245"
export function formatarReais(valor) {
  const inteiro = Math.round(valor)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return `R$ ${inteiro}`;
}

// Formata distância em km com vírgula: 1.2 -> "1,2 km"
export function formatarDistancia(km) {
  return `${Number(km).toFixed(1).replace('.', ',')} km`;
}