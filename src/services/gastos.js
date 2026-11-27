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

export async function obterCategoriasGasto() {
  return obterCategoriasGastoApi(await obterTokenSessao());
}

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
  return formatarGasto(await criarGastoApi(token, dados));
}

export async function atualizarGasto(id, dados) {
  const token = await obterTokenSessao();
  return formatarGasto(await atualizarGastoApi(token, id, dados));
}

export async function excluirGasto(id) {
  await excluirGastoApi(await obterTokenSessao(), id);
  return true;
}

export async function obterOrcamento(ano, mes) {
  return obterOrcamentoApi(await obterTokenSessao(), ano, mes);
}

export async function atualizarOrcamento(valor, ano, mes) {
  return atualizarOrcamentoApi(
    await obterTokenSessao(), valor, ano, mes
  );
}

export async function obterResumoGastos(ano, mes) {
  return obterResumoGastosApi(await obterTokenSessao(), ano, mes);
}

export async function obterEstatisticasGastos(ano, mes) {
  return obterEstatisticasGastosApi(await obterTokenSessao(), ano, mes);
}