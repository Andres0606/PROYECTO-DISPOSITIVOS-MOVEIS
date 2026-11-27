// I18N — Geolocalização

const TEXTOS = {
  'pt-BR': {
    obtendo: 'Obtendo localização...',
    disponivel: 'Localização disponível',
    indisponivel: 'Localização indisponível',
    proximidade: 'Mais próximos',
    distancia: 'Distância em linha reta',
    suaLocalizacao: 'Sua localização',
    ordemPadrao: 'Ordem padrão',
  },

  es: {
    obtendo: 'Obteniendo ubicación...',
    disponivel: 'Ubicación disponible',
    indisponivel: 'Ubicación no disponible',
    proximidade: 'Más cercanos',
    distancia: 'Distancia en línea recta',
    suaLocalizacao: 'Tu ubicación',
    ordemPadrao: 'Orden predeterminado',
  },

  en: {
    obtendo: 'Getting location...',
    disponivel: 'Location available',
    indisponivel: 'Location unavailable',
    proximidade: 'Nearest places',
    distancia: 'Straight-line distance',
    suaLocalizacao: 'Your location',
    ordemPadrao: 'Default order',
  },
};

export function textosGeolocalizacao(idioma) {
  return TEXTOS[idioma] ?? TEXTOS['pt-BR'];
}