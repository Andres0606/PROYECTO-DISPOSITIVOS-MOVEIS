
// UTILS — Formatação de tarefas

export function formatarTarefa(tarefa) {
  return {
    ...tarefa,
    etapa: tarefa.etapa?.nome ?? '',
    prioridade: tarefa.prioridade?.nome ?? '',
    estado: tarefa.estado?.nome ?? '',
    descricao: tarefa.descricao ?? '',
    prazo: tarefa.dataLimite ?? null,
    concluida: !!tarefa.concluida,
  };
}
