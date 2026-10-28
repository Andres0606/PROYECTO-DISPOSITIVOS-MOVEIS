// UTILS — Datas em formato dd/mm/aaaa (campos de formulário)

// Aplica a máscara enquanto a pessoa digita: "20092026" -> "20/09/2026"
export function mascaraData(texto) {
  const digitos = String(texto).replace(/\D/g, '').slice(0, 8);

  if (digitos.length <= 2) return digitos;
  if (digitos.length <= 4) return `${digitos.slice(0, 2)}/${digitos.slice(2)}`;
  return `${digitos.slice(0, 2)}/${digitos.slice(2, 4)}/${digitos.slice(4)}`;
}

// Confere se "dd/mm/aaaa" é uma data real (ex.: 31/02/2026 é inválida).
export function dataValida(texto) {
  const partes = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(texto);
  if (!partes) return false;

  const dia = Number(partes[1]);
  const mes = Number(partes[2]);
  const ano = Number(partes[3]);

  if (ano < 2000 || mes < 1 || mes > 12 || dia < 1) return false;

  const diasNoMes = new Date(ano, mes, 0).getDate();
  return dia <= diasNoMes;
}

// "20/09/2026" -> "2026-09-20"
export function brParaIso(texto) {
  const [dia, mes, ano] = texto.split('/');
  return `${ano}-${mes}-${dia}`;
}

// "2026-09-20" -> "20/09/2026" ('' se não houver data)
export function isoParaBr(iso) {
  if (!iso) return '';

  const [ano, mes, dia] = iso.split('-');
  return `${dia}/${mes}/${ano}`;
}