// THEME — Tokens visuais do InterChapecó

// ============================================================
// PALETA — TEMA CLARO
// ============================================================

export const coresClaras = {
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
  bordaForte: '#B1B1B1',
  bordaFoco: '#605C57',
  divisor: '#E6E6E6',

  decoracao: '#A69F95',
  decoracaoClara: '#E9E9E9',

  // Chips — Início
  chipBorda: '#CAC4D0',
  chipTexto: '#1D1B20',

  // Busca, segmentado e pills — Explorar
  campoBusca: '#F5F5F5',
  segmentoBorda: '#79747E',
  segmentoSelecionado: '#D6D1CB',
  pillBorda: 'rgba(0, 0, 0, 0.43)',
  pillSelecionado: 'rgba(0, 0, 0, 0.9)',

  // Cartão de vidro — Recuperar senha
  vidro: 'rgba(255, 255, 255, 0.82)',
  vidroBorda: 'rgba(177, 177, 177, 0.7)',
  divisorCartao: 'rgba(255, 149, 0, 0.2)',
  campoCartao: '#FFF7F0',
  bordaCartao: 'rgba(0, 0, 0, 0.5)',

  // Botões e controles
  botaoPrincipal: '#000000',
  textoBotaoPrincipal: '#FFFFFF',
  textoSobrePrimaria: '#FFFFFF',
  interruptorAtivo: '#555555',
  interruptorInativo: '#BDBDBD',
  interruptorControle: '#FFFFFF',
};

// ============================================================
// PALETA — TEMA ESCURO
// ============================================================

export const coresEscuras = {
  fundo: '#181818',
  fundoFim: '#121212',
  superficie: '#252525',
  superficieSecundaria: '#303030',

  primaria: '#A69F95',
  primariaClara: '#C1B9AD',
  primariaEscura: '#807A72',

  perigo: '#F08080',
  sucesso: '#64C99A',

  texto: '#F5F5F5',
  textoSecundario: '#B0B0B0',

  borda: '#404040',
  bordaForte: '#606060',
  bordaFoco: '#A69F95',
  divisor: '#383838',

  decoracao: '#807A72',
  decoracaoClara: '#383838',

  // Chips — Início
  chipBorda: '#55515A',
  chipTexto: '#E8E3EA',

  // Busca, segmentado e pills — Explorar
  campoBusca: '#2C2C2C',
  segmentoBorda: '#888888',
  segmentoSelecionado: '#49443E',
  pillBorda: 'rgba(255, 255, 255, 0.43)',
  pillSelecionado: 'rgba(255, 255, 255, 0.9)',

  // Cartão de vidro — Recuperar senha
  vidro: 'rgba(37, 37, 37, 0.82)',
  vidroBorda: 'rgba(96, 96, 96, 0.7)',
  divisorCartao: 'rgba(255, 149, 0, 0.2)',
  campoCartao: '#302C28',
  bordaCartao: 'rgba(255, 255, 255, 0.5)',

  // Botões e controles
  botaoPrincipal: '#F5F5F5',
  textoBotaoPrincipal: '#181818',
  textoSobrePrimaria: '#181818',
  interruptorAtivo: '#A69F95',
  interruptorInativo: '#555555',
  interruptorControle: '#FFFFFF',
};

// ============================================================
// ESPAÇAMENTOS
// ============================================================

export const espacamentos = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

// ============================================================
// RAIOS
// ============================================================

export const raios = {
  sm: 8,
  md: 14,
  lg: 17,
  xl: 24,
  pill: 999,
};

// ============================================================
// TIPOGRAFIA
// ============================================================

export const tipografia = {
  titulo: 24,
  tituloCartao: 20,
  subtitulo: 16,
  corpo: 14,
  legenda: 12,
  botao: 15,
};

// ============================================================
// GRADIENTES DINÂMICOS
// ============================================================

function criarGradientes(paleta, temaEscuro) {
  return {
    fundo: {
      cores: [
        paleta.fundo,
        paleta.fundoFim,
      ],

      locais: [0.05, 1],
    },

    botao: {
      cores: [
        paleta.primariaClara,
        paleta.primaria,
        temaEscuro ? '#A69F95' : '#7F7971',
        paleta.primariaEscura,
      ],

      locais: [
        0.25,
        0.483,
        0.531,
        0.75,
      ],
    },
  };
}

// ============================================================
// SOMBRAS
// ============================================================

export const sombras = {
  logo: {
    shadowColor: '#AE7850',

    shadowOffset: {
      width: 0,
      height: 4,
    },

    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
};

// ============================================================
// TEMAS COMPLETOS
// ============================================================

export const temaClaro = {
  cores: coresClaras,
  espacamentos,
  raios,
  tipografia,
  gradientes: criarGradientes(coresClaras, false),
  sombras,
};

export const temaEscuro = {
  cores: coresEscuras,
  espacamentos,
  raios,
  tipografia,
  gradientes: criarGradientes(coresEscuras, true),
  sombras,
};

// ============================================================
// SELECIONAR TEMA
// ============================================================

export function obterTema(tema) {
  return tema === 'escuro'
    ? temaEscuro
    : temaClaro;
}

// ============================================================
// COMPATIBILIDADE COM OS COMPONENTES EXISTENTES
// ============================================================

export const cores = temaClaro.cores;

export const gradientes = temaClaro.gradientes;