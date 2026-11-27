// UTILS — Formatação de valores e datas

const MESES = {
  'pt-BR': [
    'janeiro', 'fevereiro', 'março', 'abril',
    'maio', 'junho', 'julho', 'agosto',
    'setembro', 'outubro', 'novembro', 'dezembro',
  ],

  es: [
    'enero', 'febrero', 'marzo', 'abril',
    'mayo', 'junio', 'julio', 'agosto',
    'septiembre', 'octubre', 'noviembre', 'diciembre',
  ],

  en: [
    'January', 'February', 'March', 'April',
    'May', 'June', 'July', 'August',
    'September', 'October', 'November', 'December',
  ],
};

const MESES_CURTOS = {
  'pt-BR': [
    'jan.', 'fev.', 'mar.', 'abr.',
    'mai.', 'jun.', 'jul.', 'ago.',
    'set.', 'out.', 'nov.', 'dez.',
  ],

  es: [
    'ene.', 'feb.', 'mar.', 'abr.',
    'may.', 'jun.', 'jul.', 'ago.',
    'sept.', 'oct.', 'nov.', 'dic.',
  ],

  en: [
    'Jan', 'Feb', 'Mar', 'Apr',
    'May', 'Jun', 'Jul', 'Aug',
    'Sep', 'Oct', 'Nov', 'Dec',
  ],
};

// IDIOMA

function normalizarIdioma(idioma) {
  return Object.prototype.hasOwnProperty.call(MESES, idioma)
    ? idioma
    : 'pt-BR';
}

function capitalizar(texto) {
  return texto.charAt(0).toUpperCase() + texto.slice(1);
}

// VALIDAR DATA ISO

function obterPartesData(iso) {
  if (!iso) return null;

  const texto = String(iso);

  if (!/^\d{4}-\d{2}-\d{2}$/.test(texto)) {
    return null;
  }

  const [ano, mes, dia] = texto.split('-').map(Number);

  if (
    ano < 1 ||
    mes < 1 ||
    mes > 12 ||
    dia < 1 ||
    dia > 31
  ) {
    return null;
  }

  const data = new Date(0);
  data.setUTCFullYear(ano, mes - 1, dia);

  if (
    data.getUTCFullYear() !== ano ||
    data.getUTCMonth() !== mes - 1 ||
    data.getUTCDate() !== dia
  ) {
    return null;
  }

  return { ano, mes, dia };
}

// FORMATAR VALORES EM REAIS

export function formatarReais(valor, idioma = 'pt-BR') {
  const numero = Number(valor);

  if (!Number.isFinite(numero)) return '—';

  const arredondado = Math.round(numero * 100) / 100;
  const inteiro = Number.isInteger(arredondado);

  const [parteInteira, centavos] = arredondado
    .toFixed(inteiro ? 0 : 2)
    .split('.');

  const ingles = idioma === 'en';

  const separadorMilhar = ingles ? ',' : '.';
  const separadorDecimal = ingles ? '.' : ',';

  const comMilhar = parteInteira.replace(
    /\B(?=(\d{3})+(?!\d))/g,
    separadorMilhar
  );

  return centavos
    ? `R$ ${comMilhar}${separadorDecimal}${centavos}`
    : `R$ ${comMilhar}`;
}

// FORMATAR DISTÂNCIA

export function formatarDistancia(km, idioma = 'pt-BR') {
  const numero = Number(km);

  if (!Number.isFinite(numero)) return '—';

  const valor = numero.toFixed(1);

  return idioma === 'en'
    ? `${valor} km`
    : `${valor.replace('.', ',')} km`;
}

// FORMATAR DATA CURTA

export function formatarDataCurta(iso, idioma = 'pt-BR') {
  const partes = obterPartesData(iso);

  if (!partes) return '';

  const { mes, dia } = partes;
  const idiomaValido = normalizarIdioma(idioma);

  const nomeMes = MESES_CURTOS[idiomaValido][mes - 1];

  return idiomaValido === 'en'
    ? `${nomeMes} ${dia}`
    : `${dia} ${nomeMes}`;
}

// FORMATAR DIA E MÊS

export function formatarDiaMes(iso, idioma = 'pt-BR') {
  const partes = obterPartesData(iso);

  if (!partes) return '';

  const { mes, dia } = partes;
  const idiomaValido = normalizarIdioma(idioma);

  const nomeMes = MESES_CURTOS[idiomaValido][mes - 1]
    .replace('.', '');

  const diaFormatado = String(dia).padStart(2, '0');

  return idiomaValido === 'en'
    ? `${nomeMes} ${diaFormatado}`
    : `${diaFormatado} ${nomeMes}`;
}

// FORMATAR DATA COMPLETA

export function formatarDataCompleta(
  iso,
  idioma = 'pt-BR'
) {
  const partes = obterPartesData(iso);

  if (!partes) return '';

  const { mes, dia } = partes;
  const idiomaValido = normalizarIdioma(idioma);

  const nomeMes = MESES[idiomaValido][mes - 1];

  return idiomaValido === 'en'
    ? `${nomeMes} ${dia}`
    : `${dia} de ${nomeMes}`;
}

// FORMATAR DATA NUMÉRICA

export function formatarDataNumerica(
  iso,
  idioma = 'pt-BR'
) {
  const partes = obterPartesData(iso);

  if (!partes) return '';

  const { ano, mes, dia } = partes;

  const dd = String(dia).padStart(2, '0');
  const mm = String(mes).padStart(2, '0');
  const yyyy = String(ano).padStart(4, '0');

  return idioma === 'en'
    ? `${mm}/${dd}/${yyyy}`
    : `${dd}/${mm}/${yyyy}`;
}

// FORMATAR PERÍODO MENSAL

export function formatarPeriodo(
  ano,
  mes,
  idioma = 'pt-BR'
) {
  const idiomaValido = normalizarIdioma(idioma);

  const nome = MESES[idiomaValido][mes - 1];

  if (!nome) return '';

  return idiomaValido === 'en'
    ? `${nome} ${ano}`
    : `${capitalizar(nome)} de ${ano}`;
}

// FORMATAR DATA DE PUBLICAÇÃO

export function formatarDataPublicacao(
  valor,
  idioma = 'pt-BR'
) {
  if (!valor) return '';

  const data = new Date(valor);

  if (Number.isNaN(data.getTime())) return '';

  const partes = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Sao_Paulo',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(data);

  const valores = Object.fromEntries(
    partes.map(({ type, value }) => [type, value])
  );

  const iso = `${valores.year}-${valores.month}-${valores.day}`;

  return formatarDiaMes(iso, idioma);
}