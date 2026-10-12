// SERVICE — Resumo da tela Início
// ETAPA FRONT: dados estáticos. Depois, o corpo desta função será trocado
// por uma chamada HTTP real, sem alterar a screen.

function esperar(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function obterResumoInicio() {
  await esperar(400); // simula o tempo de uma requisição

  return {
    tarefas: { concluidas: 12, total: 18 },
    gastos: { mes: 'setembro', gasto: 1245, orcamento: 2000 },
    conselhoDestaque: {
      texto: 'Leve um bom casaco para o inverno de Chapecó.',
      autor: 'Laura',
      pais: 'Colômbia',
    },
    proximaAtividade: {
      titulo: 'Picnic no Ecoparque',
      data: '14 set · 15:00',
    },
  };
}