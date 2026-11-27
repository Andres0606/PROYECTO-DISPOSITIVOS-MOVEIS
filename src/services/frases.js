// SERVICE — Sobrevive em Português

import { obterToken } from './storage';
import { formatarFrase } from '../utils/frases';
import {
  obterCategoriasFrasesApi,
  obterFrasesApi,
  obterFraseApi,
  obterFrasesFavoritasApi,
  verificarFavoritoFraseApi,
  adicionarFavoritoFraseApi,
  removerFavoritoFraseApi,
} from './api';

async function obterTokenSessao() {
  const token = await obterToken();

  if (!token) throw new Error('Sessão não encontrada.');

  return token;
}

export async function obterCategoriasFrases() {
  return obterCategoriasFrasesApi(await obterTokenSessao());
}

export async function obterFrases(categoriaId, busca) {
  const token = await obterTokenSessao();
  const frases = await obterFrasesApi(token, categoriaId, busca);

  return frases.map(formatarFrase);
}

export async function obterFrasesPorCategoria(categoriaId, busca) {
  return obterFrases(categoriaId, busca);
}

export async function obterFrasePorId(id) {
  const token = await obterTokenSessao();

  return formatarFrase(await obterFraseApi(token, id));
}

// FAVORITOS

export async function obterFrasesFavoritas() {
  const token = await obterTokenSessao();
  const frases = await obterFrasesFavoritasApi(token);

  return frases.map(formatarFrase);
}

export async function verificarFavoritoFrase(id) {
  return verificarFavoritoFraseApi(await obterTokenSessao(), id);
}

export async function adicionarFavoritoFrase(id) {
  return adicionarFavoritoFraseApi(await obterTokenSessao(), id);
}

export async function removerFavoritoFrase(id) {
  return removerFavoritoFraseApi(await obterTokenSessao(), id);
}