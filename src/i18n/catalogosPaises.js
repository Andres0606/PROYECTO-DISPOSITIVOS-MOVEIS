// I18N — Tradução de nomes de países

const PAISES = {
  'argentina': ['Argentina', 'Argentina'],
  'bolivia': ['Bolivia', 'Bolivia'],
  'brasil': ['Brasil', 'Brazil'],
  'chile': ['Chile', 'Chile'],
  'colombia': ['Colombia', 'Colombia'],
  'equador': ['Ecuador', 'Ecuador'],
  'paraguai': ['Paraguay', 'Paraguay'],
  'peru': ['Perú', 'Peru'],
  'uruguai': ['Uruguay', 'Uruguay'],
  'venezuela': ['Venezuela', 'Venezuela'],
  'mexico': ['México', 'Mexico'],
  'estados unidos': ['Estados Unidos', 'United States'],
  'canada': ['Canadá', 'Canada'],
  'espanha': ['España', 'Spain'],
  'portugal': ['Portugal', 'Portugal'],
  'franca': ['Francia', 'France'],
  'alemanha': ['Alemania', 'Germany'],
  'italia': ['Italia', 'Italy'],
  'reino unido': ['Reino Unido', 'United Kingdom'],
  'irlanda': ['Irlanda', 'Ireland'],
  'paises baixos': ['Países Bajos', 'Netherlands'],
  'holanda': ['Países Bajos', 'Netherlands'],
  'belgica': ['Bélgica', 'Belgium'],
  'suica': ['Suiza', 'Switzerland'],
  'austria': ['Austria', 'Austria'],
  'polonia': ['Polonia', 'Poland'],
  'suecia': ['Suecia', 'Sweden'],
  'noruega': ['Noruega', 'Norway'],
  'dinamarca': ['Dinamarca', 'Denmark'],
  'finlandia': ['Finlandia', 'Finland'],
  'china': ['China', 'China'],
  'japao': ['Japón', 'Japan'],
  'coreia do sul': ['Corea del Sur', 'South Korea'],
  'india': ['India', 'India'],
  'australia': ['Australia', 'Australia'],
  'nova zelandia': ['Nueva Zelanda', 'New Zealand'],
  'africa do sul': ['Sudáfrica', 'South Africa'],
  'angola': ['Angola', 'Angola'],
  'mocambique': ['Mozambique', 'Mozambique'],
  'cabo verde': ['Cabo Verde', 'Cabo Verde'],
  'costa rica': ['Costa Rica', 'Costa Rica'],
  'panama': ['Panamá', 'Panama'],
  'guatemala': ['Guatemala', 'Guatemala'],
  'honduras': ['Honduras', 'Honduras'],
  'el salvador': ['El Salvador', 'El Salvador'],
  'nicaragua': ['Nicaragua', 'Nicaragua'],
  'cuba': ['Cuba', 'Cuba'],
  'republica dominicana': ['República Dominicana', 'Dominican Republic'],
  'porto rico': ['Puerto Rico', 'Puerto Rico'],
  'haiti': ['Haití', 'Haiti'],
  'jamaica': ['Jamaica', 'Jamaica'],
  'guiana': ['Guyana', 'Guyana'],
  'suriname': ['Surinam', 'Suriname'],
  'russia': ['Rusia', 'Russia'],
  'ucrania': ['Ucrania', 'Ukraine'],
  'turquia': ['Turquía', 'Türkiye'],
  'grecia': ['Grecia', 'Greece'],
  'egito': ['Egipto', 'Egypt'],
  'marrocos': ['Marruecos', 'Morocco'],
};

function normalizarNome(nome) {
  return String(nome ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toLowerCase();
}

export function traduzirPais(nome, idioma = 'pt-BR') {
  if (!nome) return nome;

  if (idioma === 'pt-BR') return nome;

  const traducoes = PAISES[normalizarNome(nome)];

  if (!traducoes) return nome;

  if (idioma === 'es') return traducoes[0];

  if (idioma === 'en') return traducoes[1];

  return nome;
}