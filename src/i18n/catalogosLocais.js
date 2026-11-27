// I18N — Categorias de lugares

const CATEGORIAS = {
  Compras: {
    es: 'Compras',
    en: 'Shopping',
  },

  Lazer: {
    es: 'Ocio',
    en: 'Leisure',
  },

  Parque: {
    es: 'Parque',
    en: 'Park',
  },

  Restaurante: {
    es: 'Restaurante',
    en: 'Restaurant',
  },

  Saúde: {
    es: 'Salud',
    en: 'Health',
  },

  Serviços: {
    es: 'Servicios',
    en: 'Services',
  },

  Transporte: {
    es: 'Transporte',
    en: 'Transport',
  },

  Universidade: {
    es: 'Universidad',
    en: 'University',
  },
};

export function traduzirCategoriaLocal(nome, idioma) {
  if (idioma === 'pt-BR') return nome;

  return CATEGORIAS[nome]?.[idioma] ?? nome;
}