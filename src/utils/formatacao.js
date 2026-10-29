// UTILS — Formatação de valores

// Formata em reais. Sem centavos quando o valor é inteiro, como no Figma:
// 1245 -> "R$ 1.245"   |   85.5 -> "R$ 85,50"
export function formatarReais(valor) {
  const arredondado = Math.round(Number(valor) * 100) / 100;
  const inteiro = Number.isInteger(arredondado);
  const [parteInteira, centavos] = arredondado
    .toFixed(inteiro ? 0 : 2)
    .split('.');

  const comMilhar = parteInteira.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

  return centavos ? `R$ ${comMilhar},${centavos}` : `R$ ${comMilhar}`;
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

// Dia com dois dígitos e mês abreviado, sem ponto: "2026-09-07" -> "07 set"
// Devolve '' se a data for inválida.
export function formatarDiaMes(iso) {
  const [ano, mes, dia] = String(iso).split('-').map(Number);

  if (!ano || !dia || !mes || mes < 1 || mes > 12) {
    return '';
  }

  const mesCurto = MESES_CURTOS[mes - 1].replace('.', '');
  return `${String(dia).padStart(2, '0')} ${mesCurto}`;
}