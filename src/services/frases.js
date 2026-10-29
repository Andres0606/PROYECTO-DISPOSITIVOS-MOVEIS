// SERVICE — Frases (Sobrevive em Português)

const CATEGORIAS = [
  { id: 'universidade', nome: 'Universidade', totalFrases: 4 },
  { id: 'restaurante', nome: 'Restaurante', totalFrases: 10 },
  { id: 'compras', nome: 'Compras', totalFrases: 8 },
  { id: 'saude', nome: 'Saúde', totalFrases: 9 },
  { id: 'vida-social', nome: 'Vida social', totalFrases: 7 },
  { id: 'expressoes-comuns', nome: 'Expressões comuns', totalFrases: 14 },
  { id: 'emergencias', nome: 'Emergências', totalFrases: 6 },
];

const FRASES = {
  universidade: [
    {
      id: 'universidade-1',
      portugues: 'Onde fica esta sala?',
      espanhol: '¿Dónde queda este salón?',
    },
    {
      id: 'universidade-2',
      portugues: 'Posso entregar o trabalho depois?',
      espanhol: '¿Puedo entregar el trabajo después?',
    },
    {
      id: 'universidade-3',
      portugues: 'Qual é o horário da aula?',
      espanhol: '¿Cuál es el horario de la clase?',
    },
    {
      id: 'universidade-4',
      portugues: 'Preciso falar com o professor.',
      espanhol: 'Necesito hablar con el profesor.',
    },
  ],

  restaurante: [],
  compras: [],
  saude: [],
  'vida-social': [],
  'expressoes-comuns': [],
  emergencias: [],
};

function esperar(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function obterCategoriasFrases() {
  await esperar(400);

  return CATEGORIAS;
}

export async function obterFrasesPorCategoria(categoriaId) {
  await esperar(300);

  return FRASES[categoriaId] ?? [];
}