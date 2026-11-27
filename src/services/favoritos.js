// SERVICE — Favoritos

import { obterLocaisFavoritos, removerFavoritoLocal } from './locais';
import { obterAtividadesFavoritas, removerFavoritoAtividade } from './atividades';
import { obterFrasesFavoritas, removerFavoritoFrase } from './frases';

export async function obterFavoritos(tipo) {
  if (tipo === 'lugares') {
    const locais = await obterLocaisFavoritos();

    return locais.map(local => ({
      ...local,
      imagem: local.imagemUrl ?? null,
    }));
  }

  if (tipo === 'atividades') {
    return obterAtividadesFavoritas();
  }

  if (tipo === 'frases') {
    const frases = await obterFrasesFavoritas();

    return frases.map(frase => ({
      ...frase,
      titulo: frase.portugues,
      descricao: frase.espanhol,
    }));
  }

  return [];
}

export async function removerFavorito(tipo, id) {
  if (tipo === 'lugares') {
    await removerFavoritoLocal(id);
  } else if (tipo === 'atividades') {
    await removerFavoritoAtividade(id);
  } else if (tipo === 'frases') {
    await removerFavoritoFrase(id);
  } else {
    throw new Error('Tipo de favorito inválido.');
  }

  return true;
}