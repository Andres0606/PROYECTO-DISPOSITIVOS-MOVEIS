// SERVICE — Resumo da tela Início

import { obterTarefas } from './tarefas';
import { obterResumoGastos } from './gastos';
import { obterConselhos } from './conselhos';
import { obterAtividades } from './atividades';
import { formatarDiaMes, formatarPeriodo } from '../utils/formatacao';

export async function obterResumoInicio() {
  const [tarefas, gastos, conselhos, atividades] = await Promise.all([
    obterTarefas(),
    obterResumoGastos(),
    obterConselhos('populares'),
    obterAtividades('recentes'),
  ]);

  const conselho = conselhos[0] ?? null;

  const atividade = atividades
    .filter(item => !item.vencida)
    .sort((a, b) => a.dataOrdenacao.localeCompare(b.dataOrdenacao))[0]
    ?? null;

  return {
    tarefas: {
      concluidas: tarefas.filter(item => item.concluida).length,
      total: tarefas.length,
    },
    gastos: {
      ano: gastos.ano,
      mes: gastos.mes,
      periodo: formatarPeriodo(gastos.ano, gastos.mes),
      gasto: gastos.gasto,
      orcamento: gastos.orcamento,
      disponivel: gastos.disponivel,
    },
    conselhoDestaque: conselho ? {
      id: conselho.id,
      texto: conselho.texto,
      autor: conselho.autor,
      pais: conselho.pais,
    } : null,
    proximaAtividade: atividade ? {
      id: atividade.id,
      titulo: atividade.titulo,
      dataAtividade: atividade.dataAtividade,
      horario: atividade.horario,
      data: `${formatarDiaMes(atividade.dataAtividade)} · ${atividade.horario}`,
    } : null,
  };
}