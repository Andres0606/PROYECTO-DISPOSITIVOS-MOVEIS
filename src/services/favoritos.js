
// SERVICE — Favoritos

import {
  obterLocaisFavoritos,
  removerFavoritoLocal,
} from './locais';

// ============================================================
// DADOS TEMPORÁRIOS — FRASES E ATIVIDADES
// ============================================================

let FAVORITOS = {
  frases: [
    {
      id: 'frase-1',
      titulo: 'Tudo bem?',
      descricao: '¿Todo bien?',
    },
    {
      id: 'frase-2',
      titulo: 'Quanto custa?',
      descricao: '¿Cuánto cuesta?',
    },
    {
      id: 'frase-3',
      titulo: 'Onde fica?',
      descricao: '¿Dónde queda?',
    },
  ],

  atividades: [
    {
      id: 'atividade-1',
      titulo: 'Piquenique no Ecoparque',
      descricao: '14/11/2026 · 15:00',
    },
    {
      id: 'atividade-2',
      titulo: 'Partida de futebol',
      descricao: '15/11/2026 · 17:00',
    },
  ],
};

function esperar(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

// ============================================================
// LISTAR FAVORITOS
// ============================================================

export async function obterFavoritos(tipo) {
  if (tipo === 'lugares') {
    const locais = await obterLocaisFavoritos();

    return locais.map((local) => ({
      ...local,
      imagem: local.imagemUrl ?? null,
    }));
  }

  await esperar(150);

  return [
    ...(FAVORITOS[tipo] ?? []),
  ];
}

// ============================================================
// REMOVER FAVORITO
// ============================================================

export async function removerFavorito(tipo, id) {
  if (tipo === 'lugares') {
    await removerFavoritoLocal(id);

    return true;
  }

  await esperar(150);

  FAVORITOS[tipo] =
    (FAVORITOS[tipo] ?? []).filter(
      (item) => item.id !== id
    );

  return true;
}
