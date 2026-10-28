// SERVICE — Tarefas
// ETAPA FRONT: dados estáticos em memória (reiniciam ao recarregar o app).
// Depois, o corpo destas funções será trocado por chamadas HTTP reais,
// sem alterar as screens.
//
// Só "Solicitar CPF" (etapa Chegada) vem do Figma com todos os campos.
// As demais são exemplos, distribuídos para somar 12 concluídas de 18
// (igual à tela Início).
// O campo "etapa" deve coincidir com ETAPAS em constants/tarefas.js.
// "prazo" usa data ISO (AAAA-MM-DD) ou null.

function tarefa(id, titulo, etapa, concluida, prioridade, prazo, descricao) {
  return { id, titulo, etapa, concluida, prioridade, prazo, descricao };
}

let TAREFAS = [
  // Antes (6 de 6)
  tarefa('t1', 'Solicitar o visto de estudante', 'Antes', true, 'Alta', null, 'Reunir a documentação e agendar o pedido do visto no consulado.'),
  tarefa('t2', 'Comprar a passagem', 'Antes', true, 'Alta', null, 'Comparar preços e comprar a passagem com bagagem despachada.'),
  tarefa('t3', 'Contratar seguro-saúde', 'Antes', true, 'Média', null, 'Escolher um seguro com cobertura para todo o período do intercâmbio.'),
  tarefa('t4', 'Reservar moradia', 'Antes', true, 'Alta', null, 'Confirmar o endereço e o contrato antes da viagem.'),
  tarefa('t5', 'Separar os documentos', 'Antes', true, 'Média', null, 'Passaporte, comprovante de matrícula e cópias dos documentos.'),
  tarefa('t6', 'Confirmar matrícula na Unochapecó', 'Antes', true, 'Alta', null, 'Confirmar com a universidade as disciplinas e a data de início.'),

  // Chegada (2 de 4) — "Solicitar CPF" vem do Figma
  tarefa('t7', 'Comprar chip brasileiro', 'Chegada', true, 'Média', null, 'Comprar um chip com plano de dados para usar o celular no Brasil.'),
  tarefa('t8', 'Conhecer o campus', 'Chegada', true, 'Baixa', null, 'Visitar a biblioteca, a secretaria e o restaurante universitário.'),
  tarefa('t9', 'Solicitar CPF', 'Chegada', false, 'Alta', '2026-09-20', 'Agendar um horário na Receita Federal e levar o passaporte e o comprovante de matrícula.'),
  tarefa('t10', 'Localizar mercado próximo', 'Chegada', false, 'Média', '2026-09-22', 'Descobrir o mercado mais próximo da moradia para as compras da semana.'),

  // Durante (4 de 6)
  tarefa('t11', 'Abrir conta bancária', 'Durante', true, 'Média', null, 'Perguntar na agência quais documentos são exigidos para estrangeiros.'),
  tarefa('t12', 'Registrar o visto na Polícia Federal', 'Durante', true, 'Alta', null, 'Fazer o registro no prazo indicado depois da chegada.'),
  tarefa('t13', 'Conhecer o centro da cidade', 'Durante', true, 'Baixa', null, 'Passear pela Avenida Getúlio Vargas e pelos pontos turísticos.'),
  tarefa('t14', 'Participar de uma atividade', 'Durante', true, 'Baixa', null, 'Escolher um encontro na tela Atividades e Planos.'),
  tarefa('t15', 'Fazer um passeio pela região', 'Durante', false, 'Baixa', '2026-10-05', 'Escolher um passeio e combinar com outros intercambistas.'),
  tarefa('t16', 'Registrar os gastos do mês', 'Durante', false, 'Média', '2026-09-30', 'Lançar na tela Meus Gastos tudo o que foi gasto no mês.'),

  // Retorno (0 de 2)
  tarefa('t17', 'Pedir o histórico acadêmico', 'Retorno', false, 'Média', '2026-12-10', 'Solicitar na secretaria o histórico com as disciplinas cursadas.'),
  tarefa('t18', 'Devolver as chaves da moradia', 'Retorno', false, 'Alta', '2026-12-15', 'Combinar a vistoria e devolver as chaves ao proprietário.'),
];

let proximoId = 19;

function esperar(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function copiar() {
  return TAREFAS.map((item) => ({ ...item }));
}

function buscar(id) {
  const encontrada = TAREFAS.find((item) => item.id === id);

  if (!encontrada) {
    throw new Error('Tarefa não encontrada.');
  }
  return encontrada;
}

export async function obterTarefas() {
  await esperar(400); // simula o tempo de uma requisição
  return copiar();
}

export async function obterTarefa(id) {
  await esperar(250);
  return { ...buscar(id) };
}

// dados: { titulo, descricao, etapa, prioridade, prazo (ISO ou null) }
export async function criarTarefa(dados) {
  await esperar(400);

  const nova = tarefa(
    `t${proximoId++}`,
    dados.titulo,
    dados.etapa,
    false,
    dados.prioridade,
    dados.prazo ?? null,
    dados.descricao ?? ''
  );

  TAREFAS = [...TAREFAS, nova];
  return { ...nova };
}

// Atualiza os campos editáveis; mantém o estado "concluída" e o id.
export async function atualizarTarefa(id, dados) {
  await esperar(400);

  const existente = buscar(id);
  const atualizada = {
    ...existente,
    titulo: dados.titulo,
    descricao: dados.descricao ?? '',
    etapa: dados.etapa,
    prioridade: dados.prioridade,
    prazo: dados.prazo ?? null,
  };

  TAREFAS = TAREFAS.map((item) => (item.id === id ? atualizada : item));
  return { ...atualizada };
}

// Marca/desmarca uma tarefa e devolve a lista atualizada.
export async function alternarTarefa(id) {
  await esperar(150);
  buscar(id);

  TAREFAS = TAREFAS.map((item) =>
    item.id === id ? { ...item, concluida: !item.concluida } : item
  );

  return copiar();
}

// Remove uma tarefa e devolve a lista atualizada.
export async function excluirTarefa(id) {
  await esperar(300);
  buscar(id);

  TAREFAS = TAREFAS.filter((item) => item.id !== id);

  return copiar();
}