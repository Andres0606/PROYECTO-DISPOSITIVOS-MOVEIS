// SERVICE — Conselhos de intercambistas

const CONSELHOS = [
  {
    id: '1',
    autor: 'Laura',
    pais: 'Colômbia',
    texto: 'Leve roupa de frio.',
    descricao:
      'Chapecó pode ser bastante fria no inverno. Recomendo levar uma boa jaqueta e se vestir por camadas, já que a diferença de temperatura entre o dia e a noite é considerável.',
    categoria: 'Adaptação',
    tag: 'Clima',
    curtidas: 27,
    comentarios: 6,
    data: '2026-08-27',
    tempo: '27 ago',
  },
  {
    id: '2',
    autor: 'Laura',
    pais: 'Colômbia',
    texto: 'Como obter o CPF rapidamente.',
    descricao:
      'O CPF é necessário para vários serviços no Brasil. É recomendável realizar o processo o quanto antes para facilitar cadastros e outras atividades durante o intercâmbio.',
    categoria: 'Adaptação',
    tag: 'Documentos',
    curtidas: 27,
    comentarios: 4,
    data: '2026-08-26',
    tempo: '26 ago',
  },
  {
    id: '3',
    autor: 'Laura',
    pais: 'Colômbia',
    texto: 'Melhores restaurantes perto de casa.',
    descricao:
      'Chapecó possui diferentes opções de restaurantes. Vale a pena explorar lugares próximos, comparar preços e conhecer novas opções durante o intercâmbio.',
    categoria: 'Adaptação',
    tag: 'Alimentação',
    curtidas: 27,
    comentarios: 8,
    data: '2026-08-25',
    tempo: '25 ago',
  },
];

function esperar(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

export async function obterConselhos(
  ordenacao = 'recentes'
) {
  await esperar(300);

  const lista = [...CONSELHOS];

  if (ordenacao === 'populares') {
    return lista.sort(
      (a, b) => b.curtidas - a.curtidas
    );
  }

  return lista.sort(
    (a, b) =>
      new Date(b.data) -
      new Date(a.data)
  );
}