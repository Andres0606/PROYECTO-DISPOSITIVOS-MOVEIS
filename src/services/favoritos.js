
// SERVICE — Favoritos

import {
  obterLocaisFavoritos,
  removerFavoritoLocal,
} from './locais';

import {
  obterAtividadesFavoritas,
  removerFavoritoAtividade,
} from './atividades';

// Dados temporários — frases
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
};

function esperar(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

// Listar favoritos
export async function obterFavoritos(tipo) {
  if (tipo === 'lugares') {
    const locais = await obterLocaisFavoritos();

    return locais.map((local) => ({
      ...local,
      imagem: local.imagemUrl ?? null,
    }));
  }

  if (tipo === 'atividades') {
    return obterAtividadesFavoritas();
  }

  await esperar(150);

  return [...(FAVORITOS[tipo] ?? [])];
}

// Remover favorito
export async function removerFavorito(tipo, id) {
  if (tipo === 'lugares') {
    await removerFavoritoLocal(id);
    return true;
  }

  if (tipo === 'atividades') {
    await removerFavoritoAtividade(id);
    return true;
  }

  await esperar(150);

  FAVORITOS[tipo] = (FAVORITOS[tipo] ?? []).filter(
    (item) => item.id !== id
  );

  return true;
}
