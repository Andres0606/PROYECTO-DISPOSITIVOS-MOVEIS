// SERVICE — Favoritos

let FAVORITOS = {
  lugares: [
    {
      id: 'lugar-1',
      nome: 'Unochapecó',
      imagem:
        'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=400&q=80',
    },
    {
      id: 'lugar-2',
      nome: 'Ecoparque Chapecó',
      imagem:
        'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=400&q=80',
    },
    {
      id: 'lugar-3',
      nome: 'Shopping Pátio Chapecó',
      imagem:
        'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?auto=format&fit=crop&w=400&q=80',
    },
  ],

  frases: [
    {
      id: 'frase-1',
      titulo: 'Tudo bem?',
      descricao: '¿Todo bien?',
    },
    {
      id: 'frase-2',
      titulo: 'Quanto custa?',
      descricao: '¿Cuánto cuesta?',
    },
    {
      id: 'frase-3',
      titulo: 'Onde fica?',
      descricao: '¿Dónde queda?',
    },
  ],

  atividades: [
    {
      id: 'atividade-1',
      titulo: 'Piquenique no Ecoparque',
      descricao: '14/11/2026 · 15:00',
    },
    {
      id: 'atividade-2',
      titulo: 'Partida de futebol',
      descricao: '15/11/2026 · 17:00',
    },
  ],
};

function esperar(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

export async function obterFavoritos(
  tipo
) {
  await esperar(150);

  return [
    ...(FAVORITOS[tipo] ?? []),
  ];
}

export async function removerFavorito(
  tipo,
  id
) {
  await esperar(150);

  FAVORITOS[tipo] =
    (FAVORITOS[tipo] ?? []).filter(
      (item) =>
        item.id !== id
    );

  return true;
}