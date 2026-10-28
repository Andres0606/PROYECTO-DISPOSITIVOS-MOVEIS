// SERVICE — Frases (Sobrevive em Português)


const CATEGORIAS = [
  { id: 'universidade', nome: 'Universidade', totalFrases: 12 },
  { id: 'restaurante', nome: 'Restaurante', totalFrases: 10 },
  { id: 'compras', nome: 'Compras', totalFrases: 8 },
  { id: 'saude', nome: 'Saúde', totalFrases: 9 },
  { id: 'vida-social', nome: 'Vida social', totalFrases: 7 },
  { id: 'expressoes-comuns', nome: 'Expressões comuns', totalFrases: 14 },
  { id: 'emergencias', nome: 'Emergências', totalFrases: 6 },
];

function esperar(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function obterCategoriasFrases() {
  await esperar(400); // simula o tempo de uma requisição
  return CATEGORIAS;
}