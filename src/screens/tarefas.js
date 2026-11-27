
// SERVICE — Tarefas do intercâmbio

import { obterToken } from './storage';
import { formatarTarefa } from '../utils/tarefas';
import {
  obterEtapasTarefaApi,
  obterEstadosTarefaApi,
  obterPrioridadesTarefaApi,
  obterTarefasApi,
  obterTarefaApi,
  criarTarefaApi,
  atualizarTarefaApi,
  atualizarEstadoTarefaApi,
  excluirTarefaApi,
} from './api';

async function obterTokenSessao() {
  const token = await obterToken();

  if (!token) throw new Error('Sessão não encontrada.');

  return token;
}

// Catálogos

export async function obterEtapasTarefa() {
  return obterEtapasTarefaApi(await obterTokenSessao());
}

export async function obterEstadosTarefa() {
  return obterEstadosTarefaApi(await obterTokenSessao());
}

export async function obterPrioridadesTarefa() {
  return obterPrioridadesTarefaApi(await obterTokenSessao());
}

// CRUD

export async function obterTarefas(etapaId) {
  const token = await obterTokenSessao();
  const tarefas = await obterTarefasApi(token, etapaId);

  return tarefas.map(formatarTarefa);
}

export async function obterTarefa(id) {
  const token = await obterTokenSessao();
  return formatarTarefa(await obterTarefaApi(token, id));
}

export async function criarTarefa(dados) {
  const token = await obterTokenSessao();
  return formatarTarefa(await criarTarefaApi(token, dados));
}

export async function atualizarTarefa(id, dados) {
  const token = await obterTokenSessao();
  return formatarTarefa(await atualizarTarefaApi(token, id, dados));
}

export async function atualizarEstadoTarefa(id, estadoId) {
  const token = await obterTokenSessao();

  return formatarTarefa(
    await atualizarEstadoTarefaApi(token, id, estadoId)
  );
}

export async function alternarTarefa(tarefa, estados) {
  const nomeEstado = tarefa.concluida ? 'A Fazer' : 'Concluído';
  const estado = estados.find(item => item.nome === nomeEstado);

  if (!estado) throw new Error('Estado da tarefa não encontrado.');

  return atualizarEstadoTarefa(tarefa.id, estado.id);
}

export async function excluirTarefa(id) {
  const token = await obterTokenSessao();
  await excluirTarefaApi(token, id);

  return true;
}
