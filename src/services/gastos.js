// SERVICE — Gastos
// ETAPA FRONT: dados estáticos em memória (reiniciam ao recarregar o app).
// Depois, o corpo destas funções será trocado por chamadas HTTP reais,
// sem alterar as screens.
//
// Os 11 gastos de exemplo somam 1.245 de um orçamento de 2.000, igual ao
// Figma (Resumo de gastos) e ao card "Gastos de setembro" da tela Início.
// Os quatro primeiros vêm do Figma (Histórico).
// "data" usa formato ISO (AAAA-MM-DD). Por enquanto o resumo soma todos os
// gastos da lista; a separação por mês virá com Histórico e Estatísticas.

const ORCAMENTO_MENSAL = 2000;

function gasto(id, conceito, valor, categoria, data, descricao = '') {
  return { id, conceito, valor, categoria, data, descricao };
}

let GASTOS = [
  gasto('g1', 'Mercado São José', 85, 'Supermercado', '2026-09-07'),
  gasto('g2', 'Restaurante Sabor', 42, 'Alimentação', '2026-09-06'),
  gasto('g3', 'Uber Ecoparque', 18, 'Serviços', '2026-09-05'),
  gasto('g4', 'Libreria Central', 60, 'Universidade', '2026-09-03'),
  gasto('g5', 'Jantar com a turma', 120, 'Alimentação', '2026-09-12'),
  gasto('g6', 'Café e lanches da semana', 148, 'Alimentação', '2026-09-15'),
  gasto('g7', 'Almoço no restaurante universitário', 200, 'Alimentação', '2026-09-18'),
  gasto('g8', 'Casaco de inverno', 220, 'Compras', '2026-09-10'),
  gasto('g9', 'Material de estudo', 100, 'Compras', '2026-09-11'),
  gasto('g10', 'Passagem para Florianópolis', 240, 'Viagens', '2026-09-20'),
  gasto('g11', 'Lavanderia', 12, 'Outros', '2026-09-09'),
];

let proximoId = 12;

function esperar(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function arredondar(numero) {
  return Math.round(numero * 100) / 100;
}

// As 3 categorias com maior valor + "Outros" (todo o resto, incluindo
// a própria categoria "Outros"). Sem "Outros" se não houver resto.
function montarDistribuicao() {
  const totais = {};

  GASTOS.forEach((item) => {
    totais[item.categoria] = (totais[item.categoria] || 0) + item.valor;
  });

  const ordenadas = Object.entries(totais)
    .filter(([categoria]) => categoria !== 'Outros')
    .map(([categoria, valor]) => ({ categoria, valor: arredondar(valor) }))
    .sort((a, b) => b.valor - a.valor);

  const principais = ordenadas.slice(0, 3);
  const resto = arredondar(
    ordenadas.slice(3).reduce((soma, item) => soma + item.valor, 0) +
      (totais.Outros || 0)
  );

  return resto > 0
    ? [...principais, { categoria: 'Outros', valor: resto }]
    : principais;
}

export async function obterResumoGastos() {
  await esperar(400); // simula o tempo de uma requisição

  const total = arredondar(GASTOS.reduce((soma, item) => soma + item.valor, 0));

  return {
    orcamento: ORCAMENTO_MENSAL,
    gasto: total,
    distribuicao: montarDistribuicao(),
  };
}

// dados: { conceito, valor (número), categoria, data (ISO), descricao }
export async function criarGasto(dados) {
  await esperar(400);

  const novo = gasto(
    `g${proximoId++}`,
    dados.conceito,
    dados.valor,
    dados.categoria,
    dados.data,
    dados.descricao ?? ''
  );

  GASTOS = [...GASTOS, novo];
  return { ...novo };
}