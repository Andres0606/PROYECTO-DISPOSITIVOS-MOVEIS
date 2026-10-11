// THEME — Tokens visuais do InterChapecó (baseados no Figma)

export const cores = {
  fundo: '#F5EEE5',
  fundoFim: '#FFFFFF',
  superficie: '#FFFFFF',
  superficieSecundaria: '#EEEEEE',
  primaria: '#807A72',
  primariaClara: '#968E82',
  primariaEscura: '#605C57',
  perigo: '#C0392B',
  sucesso: '#1E8E5A',
  texto: '#000000',
  textoSecundario: '#828282',
  borda: '#E0E0E0',
  bordaFoco: '#605C57',
  divisor: '#E6E6E6',
  decoracao: '#A69F95',
  decoracaoClara: '#E9E9E9',
};

export const espacamentos = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

export const raios = {
  sm: 8,
  md: 14,
  lg: 17,
  pill: 999,
};

export const tipografia = {
  titulo: 24,
  subtitulo: 16,
  corpo: 14,
  legenda: 12,
  botao: 15,
};

export const gradientes = {
  fundo: {
    cores: [cores.fundo, cores.fundoFim],
    locais: [0.05, 1],
  },
  botao: {
    cores: [cores.primariaClara, cores.primaria, '#7F7971', cores.primariaEscura],
    locais: [0.25, 0.483, 0.531, 0.75],
  },
};

export const sombras = {
  logo: {
    shadowColor: '#AE7850',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
};