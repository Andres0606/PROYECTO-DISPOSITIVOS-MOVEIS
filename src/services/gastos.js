// SERVICE — Gastos
// ETAPA FRONT: dados estáticos. Depois, o corpo destas funções será trocado
// por chamadas HTTP reais, sem alterar as screens.
//
// Os valores somam 1.245 de um orçamento de 2.000, igual ao Figma
// (Resumo de gastos) e ao card "Gastos de setembro" da tela Início.
// Quando existir a lista de gastos (Registrar gasto / Histórico), o
// resumo passará a ser calculado a partir dela.

const ORCAMENTO_MENSAL = 2000;

const DISTRIBUICAO = [
  { categoria: 'Alimentação', valor: 520 },
  { categoria: 'Compras', valor: 330 },
  { categoria: 'Viagens', valor: 240 },
  { categoria: 'Outros', valor: 155 },
];

function esperar(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function obterResumoGastos() {
  await esperar(400); // simula o tempo de uma requisição

  const gasto = DISTRIBUICAO.reduce((total, item) => total + item.valor, 0);

  return {
    orcamento: ORCAMENTO_MENSAL,
    gasto,
    distribuicao: DISTRIBUICAO.map((item) => ({ ...item })),
  };
}