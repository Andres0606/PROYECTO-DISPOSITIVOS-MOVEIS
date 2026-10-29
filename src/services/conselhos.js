// SERVICE — Conselhos de intercambistas

const CONSELHOS = [
  {
    id: '1',
    autor: 'Laura',
    pais: 'Colômbia',
    texto: 'Leve roupa de frio.',
    categoria: 'Adaptação',
    curtidas: 27,
    data: '2026-10-28',
  },
  {
    id: '2',
    autor: 'Laura',
    pais: 'Colômbia',
    texto: 'Como obter o CPF rapidamente.',
    categoria: 'Adaptação',
    curtidas: 27,
    data: '2026-10-27',
  },
  {
    id: '3',
    autor: 'Laura',
    pais: 'Colômbia',
    texto: 'Melhores restaurantes perto de casa.',
    categoria: 'Adaptação',
    curtidas: 27,
    data: '2026-10-26',
  },
];

function esperar(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function obterConselhos(ordenacao = 'recentes') {
  await esperar(300);

  const lista = [...CONSELHOS];

  if (ordenacao === 'populares') {
    return lista.sort(
      (a, b) => b.curtidas - a.curtidas
    );
  }

  return lista.sort(
    (a, b) => new Date(b.data) - new Date(a.data)
  );
}