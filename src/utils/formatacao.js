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

const MESES_CURTOS = [
  'jan.', 'fev.', 'mar.', 'abr.', 'mai.', 'jun.',
  'jul.', 'ago.', 'set.', 'out.', 'nov.', 'dez.',
];

// Formata data ISO (AAAA-MM-DD) como no Figma: "2026-09-20" -> "20 set."
// Devolve '' se a data for inválida.
export function formatarDataCurta(iso) {
  const [ano, mes, dia] = String(iso).split('-').map(Number);

  if (!ano || !dia || !mes || mes < 1 || mes > 12) {
    return '';
  }

  return `${dia} ${MESES_CURTOS[mes - 1]}`;
}