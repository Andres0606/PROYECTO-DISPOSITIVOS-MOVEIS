// SERVICE — Tarefas
// ETAPA FRONT: dados estáticos em memória (reiniciam ao recarregar o app).
// Depois, o corpo destas funções será trocado por chamadas HTTP reais,
// sem alterar as screens.
//
// Só as tarefas da etapa "Chegada" vêm do Figma. As demais são exemplos,
// distribuídos para somar 12 concluídas de 18 (igual à tela Início).
// O campo "etapa" deve coincidir com ETAPAS em constants/tarefas.js.

let TAREFAS = [
  // Antes (6 de 6)
  { id: 't1', titulo: 'Solicitar o visto de estudante', etapa: 'Antes', concluida: true },
  { id: 't2', titulo: 'Comprar a passagem', etapa: 'Antes', concluida: true },
  { id: 't3', titulo: 'Contratar seguro-saúde', etapa: 'Antes', concluida: true },
  { id: 't4', titulo: 'Reservar moradia', etapa: 'Antes', concluida: true },
  { id: 't5', titulo: 'Separar os documentos', etapa: 'Antes', concluida: true },
  { id: 't6', titulo: 'Confirmar matrícula na Unochapecó', etapa: 'Antes', concluida: true },

  // Chegada (2 de 4) — vem do Figma
  { id: 't7', titulo: 'Comprar chip brasileiro', etapa: 'Chegada', concluida: true },
  { id: 't8', titulo: 'Conhecer o campus', etapa: 'Chegada', concluida: true },
  { id: 't9', titulo: 'Solicitar CPF', etapa: 'Chegada', concluida: false },
  { id: 't10', titulo: 'Localizar mercado próximo', etapa: 'Chegada', concluida: false },

  // Durante (4 de 6)
  { id: 't11', titulo: 'Abrir conta bancária', etapa: 'Durante', concluida: true },
  { id: 't12', titulo: 'Registrar o visto na Polícia Federal', etapa: 'Durante', concluida: true },
  { id: 't13', titulo: 'Conhecer o centro da cidade', etapa: 'Durante', concluida: true },
  { id: 't14', titulo: 'Participar de uma atividade', etapa: 'Durante', concluida: true },
  { id: 't15', titulo: 'Fazer um passeio pela região', etapa: 'Durante', concluida: false },
  { id: 't16', titulo: 'Registrar os gastos do mês', etapa: 'Durante', concluida: false },

  // Retorno (0 de 2)
  { id: 't17', titulo: 'Pedir o histórico acadêmico', etapa: 'Retorno', concluida: false },
  { id: 't18', titulo: 'Devolver as chaves da moradia', etapa: 'Retorno', concluida: false },
];

function esperar(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function copiar() {
  return TAREFAS.map((tarefa) => ({ ...tarefa }));
}

export async function obterTarefas() {
  await esperar(400); // simula o tempo de uma requisição
  return copiar();
}

// Marca/desmarca uma tarefa e devolve a lista atualizada.
export async function alternarTarefa(id) {
  await esperar(150);

  if (!TAREFAS.some((tarefa) => tarefa.id === id)) {
    throw new Error('Tarefa não encontrada.');
  }

  TAREFAS = TAREFAS.map((tarefa) =>
    tarefa.id === id ? { ...tarefa, concluida: !tarefa.concluida } : tarefa
  );

  return copiar();
}