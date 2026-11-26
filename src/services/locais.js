// SERVICE — Locais

import { obterToken } from './storage';

import {
  obterLocaisApi,
  obterLocalApi,
  obterCategoriasLugarApi,
  obterLocaisFavoritosApi,
  verificarFavoritoLocalApi,
  adicionarFavoritoLocalApi,
  removerFavoritoLocalApi,
} from './api';

// ============================================================
// OBTER TOKEN DA SESSÃO
// ============================================================

async function obterTokenSessao() {
  const token = await obterToken();

  if (!token) {
    throw new Error(
      'Sessão não encontrada.'
    );
  }

  return token;
}

// ============================================================
// FORMATAR LOCAL
// ============================================================

function formatarLocal(local) {
  return {
    ...local,

    categoriaId:
      local.categoriaId ?? null,

    categoria:
      local.categoria?.nome ??
      'Sem categoria',

    bairro: [
      local.cidade,
      local.estado,
    ].filter(Boolean).join(', '),

    imagemUrl:
      local.imagemUrl ?? null,

    latitude:
      local.latitude != null
        ? Number(local.latitude)
        : null,

    longitude:
      local.longitude != null
        ? Number(local.longitude)
        : null,

    distanciaKm: null,
  };
}

// ============================================================
// LISTAR LOCAIS
// ============================================================

export async function obterLocais(filtros = {}) {
  const token = await obterTokenSessao();

  const locais = await obterLocaisApi(
    token,
    filtros
  );

  return locais.map(formatarLocal);
}

// ============================================================
// OBTER LOCAL POR ID
// ============================================================

export async function obterLocal(id) {
  const token = await obterTokenSessao();

  const local = await obterLocalApi(
    token,
    id
  );

  return formatarLocal(local);
}

// ============================================================
// LISTAR CATEGORIAS
// ============================================================

export async function obterCategoriasLugar() {
  const token = await obterTokenSessao();

  return obterCategoriasLugarApi(token);
}

// ============================================================
// LISTAR LOCAIS FAVORITOS
// ============================================================

export async function obterLocaisFavoritos() {
  const token = await obterTokenSessao();

  const locais =
    await obterLocaisFavoritosApi(token);

  return locais.map(formatarLocal);
}

// ============================================================
// VERIFICAR FAVORITO
// ============================================================

export async function verificarFavoritoLocal(id) {
  const token = await obterTokenSessao();

  const resultado =
    await verificarFavoritoLocalApi(
      token,
      id
    );

  return resultado.guardado;
}

// ============================================================
// ADICIONAR FAVORITO
// ============================================================

export async function adicionarFavoritoLocal(id) {
  const token = await obterTokenSessao();

  const resultado =
    await adicionarFavoritoLocalApi(
      token,
      id
    );

  return resultado.guardado;
}

// ============================================================
// REMOVER FAVORITO
// ============================================================

export async function removerFavoritoLocal(id) {
  const token = await obterTokenSessao();

  const resultado =
    await removerFavoritoLocalApi(
      token,
      id
    );

  return resultado.guardado;
}