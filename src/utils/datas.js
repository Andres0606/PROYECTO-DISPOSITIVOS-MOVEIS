// UTILS — Datas e horários

export function mascaraData(texto) {
  const digitos = String(texto).replace(/\D/g, '').slice(0, 8);
  if (digitos.length <= 2) return digitos;
  if (digitos.length <= 4) return `${digitos.slice(0, 2)}/${digitos.slice(2)}`;
  return `${digitos.slice(0, 2)}/${digitos.slice(2, 4)}/${digitos.slice(4)}`;
}

export function dataValida(texto) {
  const partes = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(texto);
  if (!partes) return false;
  const [, d, m, a] = partes;
  const dia = Number(d), mes = Number(m), ano = Number(a);
  if (ano < 2000 || mes < 1 || mes > 12 || dia < 1) return false;
  return dia <= new Date(ano, mes, 0).getDate();
}

export function brParaIso(texto) {
  const [dia, mes, ano] = texto.split('/');
  return `${ano}-${mes}-${dia}`;
}

export function isoParaBr(iso) {
  if (!iso) return '';
  const [ano, mes, dia] = iso.split('-');
  return `${dia}/${mes}/${ano}`;
}

export function hojeBr() {
  const agora = new Date();
  const dia = String(agora.getDate()).padStart(2, '0');
  const mes = String(agora.getMonth() + 1).padStart(2, '0');
  return `${dia}/${mes}/${agora.getFullYear()}`;
}

export function mascaraHora(texto) {
  const digitos = String(texto).replace(/\D/g, '').slice(0, 4);
  if (digitos.length <= 2) return digitos;
  return `${digitos.slice(0, 2)}:${digitos.slice(2)}`;
}

export function horaValida(texto) {
  return /^([01]\d|2[0-3]):[0-5]\d$/.test(texto);
}

function agoraChapeco() {
  const partes = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Sao_Paulo', year: 'numeric', month: '2-digit',
    day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(new Date());
  const v = Object.fromEntries(partes.map(({ type, value }) => [type, value]));
  return { data: `${v.year}-${v.month}-${v.day}`, hora: `${v.hour}:${v.minute}:${v.second}` };
}

export function dataFuturaValida(texto, limiteAnos = 5) {
  if (!dataValida(texto)) return false;
  const hoje = agoraChapeco().data;
  const limite = new Date(`${hoje}T00:00:00Z`);
  limite.setUTCFullYear(limite.getUTCFullYear() + limiteAnos);
  const data = brParaIso(texto);
  return data >= hoje && data <= limite.toISOString().slice(0, 10);
}

export function dataHoraFuturaValida(data, hora) {
  if (!dataValida(data) || !horaValida(hora)) return false;
  const agora = agoraChapeco();
  return `${brParaIso(data)}T${hora}:00` > `${agora.data}T${agora.hora}`;
}
