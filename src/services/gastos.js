// SERVICE — Gastos
// ETAPA FRONT: dados estáticos em memória (reiniciam ao recarregar o app).
// Depois, o corpo destas funções será trocado por chamadas HTTP reais,
// sem alterar as screens.
//
// As datas dos gastos de exemplo são relativas ao mês em curso:
// - Mês atual: 11 gastos que somam 1.245 de um orçamento de 2.000, igual ao
//   Figma (Resumo de gastos). Os quatro primeiros vêm do Figma (Histórico).
// - Mês anterior: 5 gastos que somam 1.353, para que a comparação em
//   Estatísticas dê -8 %.
// "data" usa formato ISO (AAAA-MM-DD). O resumo e as estatísticas consideram
// só o mês atual; o Histórico mostra todos os gastos.

const ORCAMENTO_MENSAL = 2000;

// "2026-10" para o mês atual (0), "2026-09" para o anterior (-1), etc.
function chaveMes(deslocamento = 0) {
  const base = new Date();
  const alvo = new Date(base.getFullYear(), base.getMonth() + deslocamento, 1);
  const mes = String(alvo.getMonth() + 1).padStart(2, '0');

  return `${alvo.getFullYear()}-${mes}`;
}

function dataIso(deslocamento, dia) {
  return `${chaveMes(deslocamento)}-${String(dia).padStart(2, '0')}`;
}

function gasto(id, conceito, valor, categoria, data, descricao = '') {
  return { id, conceito, valor, categoria, data, descricao };
}

let GASTOS = [
  // Mês atual (soma 1.245)
  gasto('g1', 'Mercado São José', 85, 'Supermercado', dataIso(0, 7)),
  gasto('g2', 'Restaurante Sabor', 42, 'Alimentação', dataIso(0, 6)),
  gasto('g3', 'Uber Ecoparque', 18, 'Serviços', dataIso(0, 5)),
  gasto('g4', 'Libreria Central', 60, 'Universidade', dataIso(0, 3)),
  gasto('g5', 'Jantar com a turma', 120, 'Alimentação', dataIso(0, 2)),
  gasto('g6', 'Café e lanches da semana', 148, 'Alimentação', dataIso(0, 1)),
  gasto('g7', 'Almoço no restaurante universitário', 200, 'Alimentação', dataIso(0, 2)),
  gasto('g8', 'Casaco de inverno', 220, 'Compras', dataIso(0, 1)),
  gasto('g9', 'Material de estudo', 100, 'Compras', dataIso(0, 2)),
  gasto('g10', 'Passagem para Florianópolis', 240, 'Viagens', dataIso(0, 1)),
  gasto('g11', 'Lavanderia', 12, 'Outros', dataIso(0, 2)),

  // Mês anterior (soma 1.353)
  gasto('g12', 'Compras do mês no mercado', 420, 'Supermercado', dataIso(-1, 20)),
  gasto('g13', 'Jantares e lanches', 380, 'Alimentação', dataIso(-1, 15)),
  gasto('g14', 'Roupas e calçados', 290, 'Compras', dataIso(-1, 12)),
  gasto('g15', 'Passeio em Chapecó', 150, 'Viagens', dataIso(-1, 8)),
  gasto('g16', 'Transporte por aplicativo', 113, 'Serviços', dataIso(-1, 5)),
];

let proximoId = 17;

function esperar(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function arredondar(numero) {
  return Math.round(numero * 100) / 100;
}

function buscar(id) {
  const encontrado = GASTOS.find((item) => item.id === id);

  if (!encontrado) {
    throw new Error('Gasto não encontrado.');
  }
  return encontrado;
}

function gastosDoMes(chave) {
  return GASTOS.filter((item) => item.data.startsWith(chave));
}

function somar(lista) {
  return arredondar(lista.reduce((soma, item) => soma + item.valor, 0));
}

function totaisPorCategoria(lista) {
  const totais = {};

  lista.forEach((item) => {
    totais[item.categoria] = (totais[item.categoria] || 0) + item.valor;
  });

  return totais;
}

// As 3 categorias com maior valor + "Outros" (todo o resto, incluindo
// a própria categoria "Outros"). Sem "Outros" se não houver resto.
function montarDistribuicao(lista) {
  const totais = totaisPorCategoria(lista);

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

// Resumo do mês atual.
export async function obterResumoGastos() {
  await esperar(400); // simula o tempo de uma requisição

  const doMes = gastosDoMes(chaveMes(0));

  return {
    orcamento: ORCAMENTO_MENSAL,
    gasto: somar(doMes),
    distribuicao: montarDistribuicao(doMes),
  };
}

// Estatísticas do mês atual: todas as categorias (maior valor primeiro),
// participação de cada uma no total e variação (%) em relação ao mês anterior
// (null se o mês anterior não tiver gastos).
export async function obterEstatisticasGastos() {
  await esperar(400);

  const atuais = gastosDoMes(chaveMes(0));
  const totalAtual = somar(atuais);
  const totalAnterior = somar(gastosDoMes(chaveMes(-1)));

  const categorias = Object.entries(totaisPorCategoria(atuais))
    .map(([categoria, valor]) => ({
      categoria,
      valor: arredondar(valor),
      participacao: totalAtual > 0 ? valor / totalAtual : 0,
    }))
    .sort((a, b) => b.valor - a.valor);

  const variacao =
    totalAnterior > 0
      ? Math.round(((totalAtual - totalAnterior) / totalAnterior) * 100)
      : null;

  return { gasto: totalAtual, categorias, variacao };
}

// Todos os gastos. Mais recente primeiro; na mesma data, o último
// registrado aparece antes.
export async function obterGastos() {
  await esperar(400);

  return [...GASTOS]
    .reverse()
    .sort((a, b) => b.data.localeCompare(a.data))
    .map((item) => ({ ...item }));
}

export async function obterGasto(id) {
  await esperar(250);
  return { ...buscar(id) };
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

export async function atualizarGasto(id, dados) {
  await esperar(400);

  const existente = buscar(id);
  const atualizado = {
    ...existente,
    conceito: dados.conceito,
    valor: dados.valor,
    categoria: dados.categoria,
    data: dados.data,
    descricao: dados.descricao ?? '',
  };

  GASTOS = GASTOS.map((item) => (item.id === id ? atualizado : item));
  return { ...atualizado };
}

export async function excluirGasto(id) {
  await esperar(300);
  buscar(id);

  GASTOS = GASTOS.filter((item) => item.id !== id);
}