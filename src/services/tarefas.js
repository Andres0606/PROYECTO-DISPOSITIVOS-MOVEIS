
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

  if (!token) {
    throw new Error('Sessão não encontrada.');
  }

  return token;
}

// Catálogos

export async function obterEtapasTarefa() {
  const token = await obterTokenSessao();
  return obterEtapasTarefaApi(token);
}

export async function obterEstadosTarefa() {
  const token = await obterTokenSessao();
  return obterEstadosTarefaApi(token);
}

export async function obterPrioridadesTarefa() {
  const token = await obterTokenSessao();
  return obterPrioridadesTarefaApi(token);
}

// Compatibilidade com os formulários atuais

async function prepararDados(token, dados) {
  const resultado = {};

  if (dados.titulo !== undefined) {
    resultado.titulo = dados.titulo;
  }

  if (dados.descricao !== undefined) {
    resultado.descricao = dados.descricao;
  }

  if (dados.etapaId !== undefined) {
    resultado.etapaId = dados.etapaId;
  } else if (dados.etapa !== undefined) {
    const etapas = await obterEtapasTarefaApi(token);
    const etapa = etapas.find(item => item.nome === dados.etapa);

    if (!etapa) throw new Error('Etapa inválida.');

    resultado.etapaId = etapa.id;
  }

  if (dados.prioridadeId !== undefined) {
    resultado.prioridadeId = dados.prioridadeId;
  } else if (dados.prioridade !== undefined) {
    if (!dados.prioridade) {
      resultado.prioridadeId = null;
    } else {
      const prioridades = await obterPrioridadesTarefaApi(token);
      const prioridade = prioridades.find(item => item.nome === dados.prioridade);

      if (!prioridade) throw new Error('Prioridade inválida.');

      resultado.prioridadeId = prioridade.id;
    }
  }

  if (dados.dataLimite !== undefined) {
    resultado.dataLimite = dados.dataLimite;
  } else if (dados.prazo !== undefined) {
    resultado.dataLimite = dados.prazo || null;
  }

  return resultado;
}

// CRUD

export async function obterTarefas(etapaId) {
  const token = await obterTokenSessao();
  const tarefas = await obterTarefasApi(token, etapaId);

  return tarefas.map(formatarTarefa);
}

export async function obterTarefa(id) {
  const token = await obterTokenSessao();
  const tarefa = await obterTarefaApi(token, id);

  return formatarTarefa(tarefa);
}

export async function criarTarefa(dados) {
  const token = await obterTokenSessao();
  const valores = await prepararDados(token, dados);
  const tarefa = await criarTarefaApi(token, valores);

  return formatarTarefa(tarefa);
}

export async function atualizarTarefa(id, dados) {
  const token = await obterTokenSessao();
  const valores = await prepararDados(token, dados);
  const tarefa = await atualizarTarefaApi(token, id, valores);

  return formatarTarefa(tarefa);
}

// Estados

export async function atualizarEstadoTarefa(id, estadoId) {
  const token = await obterTokenSessao();
  const tarefa = await atualizarEstadoTarefaApi(token, id, estadoId);

  return formatarTarefa(tarefa);
}

export async function alternarTarefa(id) {
  const token = await obterTokenSessao();

  const [tarefa, estados] = await Promise.all([
    obterTarefaApi(token, id),
    obterEstadosTarefaApi(token),
  ]);

  const nomeEstado = tarefa.concluida ? 'A Fazer' : 'Concluído';
  const estado = estados.find(item => item.nome === nomeEstado);

  if (!estado) {
    throw new Error('Estado da tarefa não encontrado.');
  }

  await atualizarEstadoTarefaApi(token, id, estado.id);

  const tarefas = await obterTarefasApi(token);

  return tarefas.map(formatarTarefa);
}

export async function excluirTarefa(id) {
  const token = await obterTokenSessao();

  await excluirTarefaApi(token, id);

  const tarefas = await obterTarefasApi(token);

  return tarefas.map(formatarTarefa);
}
