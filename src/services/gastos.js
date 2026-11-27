
// SERVICE — Meus gastos

import { obterToken } from './storage';
import { formatarGasto } from '../utils/gastos';
import {
  obterCategoriasGastoApi,
  obterGastosApi,
  obterGastoApi,
  criarGastoApi,
  atualizarGastoApi,
  excluirGastoApi,
  obterOrcamentoApi,
  atualizarOrcamentoApi,
  obterResumoGastosApi,
  obterEstatisticasGastosApi,
} from './api';

async function obterTokenSessao() {
  const token = await obterToken();

  if (!token) throw new Error('Sessão não encontrada.');

  return token;
}

// Categorias

export async function obterCategoriasGasto() {
  return obterCategoriasGastoApi(await obterTokenSessao());
}

// Compatibilidade com o formulário atual

async function prepararDados(token, dados) {
  const resultado = {};

  if (dados.conceito !== undefined) {
    resultado.descricao = dados.conceito.trim();
  }

  if (dados.descricao !== undefined) {
    resultado.observacao = dados.descricao.trim() || null;
  }

  if (dados.valor !== undefined) {
    resultado.valor = dados.valor;
  }

  if (dados.data !== undefined) {
    resultado.dataGasto = dados.data;
  }

  if (dados.categoriaId !== undefined) {
    resultado.categoriaId = dados.categoriaId;
  } else if (dados.categoria !== undefined) {
    const categorias = await obterCategoriasGastoApi(token);
    const categoria = categorias.find(item => item.nome === dados.categoria);

    if (!categoria) throw new Error('Categoria inválida.');

    resultado.categoriaId = categoria.id;
  }

  return resultado;
}

// CRUD

export async function obterGastos(ano, mes) {
  const token = await obterTokenSessao();
  const gastos = await obterGastosApi(token, ano, mes);

  return gastos.map(formatarGasto);
}

export async function obterGasto(id) {
  const token = await obterTokenSessao();

  return formatarGasto(await obterGastoApi(token, id));
}

export async function criarGasto(dados) {
  const token = await obterTokenSessao();
  const valores = await prepararDados(token, dados);

  return formatarGasto(await criarGastoApi(token, valores));
}

export async function atualizarGasto(id, dados) {
  const token = await obterTokenSessao();
  const valores = await prepararDados(token, dados);

  return formatarGasto(await atualizarGastoApi(token, id, valores));
}

export async function excluirGasto(id) {
  const token = await obterTokenSessao();
  await excluirGastoApi(token, id);

  return true;
}

// Orçamento

export async function obterOrcamento(ano, mes) {
  const token = await obterTokenSessao();

  return obterOrcamentoApi(token, ano, mes);
}

export async function atualizarOrcamento(valor, ano, mes) {
  const token = await obterTokenSessao();

  return atualizarOrcamentoApi(token, valor, ano, mes);
}

// Resumo e estatísticas

export async function obterResumoGastos(ano, mes) {
  const token = await obterTokenSessao();

  return obterResumoGastosApi(token, ano, mes);
}

export async function obterEstatisticasGastos(ano, mes) {
  const token = await obterTokenSessao();

  return obterEstatisticasGastosApi(token, ano, mes);
}
