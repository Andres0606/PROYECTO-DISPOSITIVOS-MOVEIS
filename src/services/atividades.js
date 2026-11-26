
// SERVICE — Atividades e planos

import { obterToken } from './storage';

import {
  brParaIso,
  dataValida,
} from '../utils/datas';

import {
  formatarAtividade,
} from '../utils/atividades';

import {
  obterCategoriasAtividadeApi,
  obterAtividadesApi,
  obterAtividadeApi,
  criarAtividadeApi,
  atualizarAtividadeApi,
  excluirAtividadeApi,
  verificarInteresseAtividadeApi,
  adicionarInteresseAtividadeApi,
  removerInteresseAtividadeApi,
  obterAtividadesFavoritasApi,
  verificarFavoritoAtividadeApi,
  adicionarFavoritoAtividadeApi,
  removerFavoritoAtividadeApi,
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
// LISTAR CATEGORIAS
// ============================================================

export async function obterCategoriasAtividade() {
  const token = await obterTokenSessao();

  return obterCategoriasAtividadeApi(token);
}

// ============================================================
// LISTAR ATIVIDADES
// ============================================================

export async function obterAtividades(
  ordenacao = 'recentes'
) {
  const token = await obterTokenSessao();

  const atividades =
    await obterAtividadesApi(
      token,
      ordenacao
    );

  return atividades.map(
    formatarAtividade
  );
}

// ============================================================
// OBTER ATIVIDADE POR ID
// ============================================================

export async function obterAtividadePorId(id) {
  const token = await obterTokenSessao();

  const atividade =
    await obterAtividadeApi(
      token,
      id
    );

  return formatarAtividade(atividade);
}

// ============================================================
// CRIAR ATIVIDADE
// ============================================================

export async function criarAtividade({
  nome,
  descricao,
  categoria,
  categoriaId,
  data,
  hora,
  local,
}) {
  const token = await obterTokenSessao();

  if (!dataValida(data)) {
    throw new Error('Data inválida.');
  }

  let idCategoria = categoriaId;

  // Compatibilidade temporária com o formulário atual

  if (!idCategoria && categoria) {
    const categorias =
      await obterCategoriasAtividadeApi(token);

    const encontrada =
      categorias.find(
        (item) =>
          item.nome.toLowerCase() ===
          categoria.trim().toLowerCase()
      );

    if (!encontrada) {
      throw new Error(
        'Categoria inválida.'
      );
    }

    idCategoria = encontrada.id;
  }

  const atividade =
    await criarAtividadeApi(
      token,
      {
        nome,
        descricao,

        categoriaId:
          idCategoria ?? null,

        dataAtividade:
          brParaIso(data),

        horaInicio:
          hora,

        local,
      }
    );

  return formatarAtividade(atividade);
}

// ============================================================
// ATUALIZAR ATIVIDADE
// ============================================================

export async function atualizarAtividade(
  id,
  {
    nome,
    descricao,
    categoriaId,
    data,
    hora,
    local,
  }
) {
  const token = await obterTokenSessao();

  const dados = {};

  if (nome !== undefined) {
    dados.nome = nome;
  }

  if (descricao !== undefined) {
    dados.descricao = descricao;
  }

  if (categoriaId !== undefined) {
    dados.categoriaId = categoriaId;
  }

  if (data !== undefined) {
    if (!dataValida(data)) {
      throw new Error(
        'Data inválida.'
      );
    }

    dados.dataAtividade =
      brParaIso(data);
  }

  if (hora !== undefined) {
    dados.horaInicio = hora;
  }

  if (local !== undefined) {
    dados.local = local;
  }

  const atividade =
    await atualizarAtividadeApi(
      token,
      id,
      dados
    );

  return formatarAtividade(atividade);
}

// ============================================================
// EXCLUIR ATIVIDADE
// ============================================================

export async function excluirAtividade(id) {
  const token = await obterTokenSessao();

  await excluirAtividadeApi(
    token,
    id
  );

  return true;
}

// ============================================================
// VERIFICAR INTERESSE
// ============================================================

export async function verificarInteresseAtividade(id) {
  const token = await obterTokenSessao();

  return verificarInteresseAtividadeApi(
    token,
    id
  );
}

// ============================================================
// ADICIONAR INTERESSE
// ============================================================

export async function adicionarInteresseAtividade(id) {
  const token = await obterTokenSessao();

  return adicionarInteresseAtividadeApi(
    token,
    id
  );
}

// ============================================================
// REMOVER INTERESSE
// ============================================================

export async function removerInteresseAtividade(id) {
  const token = await obterTokenSessao();

  return removerInteresseAtividadeApi(
    token,
    id
  );
}

// ============================================================
// LISTAR ATIVIDADES FAVORITAS
// ============================================================

export async function obterAtividadesFavoritas() {
  const token = await obterTokenSessao();

  const atividades =
    await obterAtividadesFavoritasApi(token);

  return atividades.map(
    formatarAtividade
  );
}

// ============================================================
// VERIFICAR FAVORITO
// ============================================================

export async function verificarFavoritoAtividade(id) {
  const token = await obterTokenSessao();

  const resultado =
    await verificarFavoritoAtividadeApi(
      token,
      id
    );

  return resultado.guardado;
}

// ============================================================
// ADICIONAR FAVORITO
// ============================================================

export async function adicionarFavoritoAtividade(id) {
  const token = await obterTokenSessao();

  const resultado =
    await adicionarFavoritoAtividadeApi(
      token,
      id
    );

  return resultado.guardado;
}

// ============================================================
// REMOVER FAVORITO
// ============================================================

export async function removerFavoritoAtividade(id) {
  const token = await obterTokenSessao();

  const resultado =
    await removerFavoritoAtividadeApi(
      token,
      id
    );

  return resultado.guardado;
}
