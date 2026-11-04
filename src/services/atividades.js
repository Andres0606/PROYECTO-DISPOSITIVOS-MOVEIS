// SERVICE — Atividades e planos

const ATIVIDADES = [
  {
    id: '1',
    titulo: 'Piquenique no Ecoparque',
    categoria: 'Social',
    data: '14 sept',
    horario: '15:00',
    interessados: 12,
    imagem:
      'https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=800&q=80',
    dataOrdenacao: '2026-09-14T15:00:00',
  },

  {
    id: '2',
    titulo: 'Partida de futebol',
    categoria: 'Social',
    data: '15 sept',
    horario: '17:00',
    interessados: 8,
    imagem:
      'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=800&q=80',
    dataOrdenacao: '2026-09-15T17:00:00',
  },
];

function esperar(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

export async function obterAtividades(
  ordenacao = 'recentes'
) {
  await esperar(300);

  const lista = [...ATIVIDADES];

  if (ordenacao === 'populares') {
    return lista.sort(
      (a, b) =>
        b.interessados -
        a.interessados
    );
  }

  return lista.sort(
    (a, b) =>
      new Date(a.dataOrdenacao) -
      new Date(b.dataOrdenacao)
  );
}