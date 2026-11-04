// SERVICE — Atividades e planos

let ATIVIDADES = [
  {
    id: '1',

    titulo:
      'Piquenique no Ecoparque',

    categoria:
      'Social',

    data:
      '14/11/2026',

    dataOriginal:
      '14/11/2026',

    dataCompleta:
      '14 de novembro',

    horario:
      '15:00',

    local:
      'Ecoparque Chapecó',

    interessados: 12,

    descricao:
      'Encontro informal para estudantes de intercâmbio que queiram conhecer gente e passar a tarde no parque.',

    imagem:
      'https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=800&q=80',

    dataOrdenacao:
      '2026-11-14T15:00:00',
  },

  {
    id: '2',

    titulo:
      'Partida de futebol',

    categoria:
      'Social',

    data:
      '15/11/2026',

    dataOriginal:
      '15/11/2026',

    dataCompleta:
      '15 de novembro',

    horario:
      '17:00',

    local:
      'Campo universitário',

    interessados: 8,

    descricao:
      'Partida amistosa de futebol entre estudantes para socializar, praticar esporte e conhecer novas pessoas.',

    imagem:
      'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=800&q=80',

    dataOrdenacao:
      '2026-11-15T17:00:00',
  },
];

function esperar(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

function converterDataParaISO(
  data,
  hora
) {
  const [
    dia,
    mes,
    ano,
  ] = data.split('/');

  return `${ano}-${mes}-${dia}T${hora}:00`;
}

export async function obterAtividades(
  ordenacao = 'recentes'
) {
  await esperar(300);

  const lista = [
    ...ATIVIDADES,
  ];

  if (
    ordenacao === 'populares'
  ) {
    return lista.sort(
      (a, b) =>
        b.interessados -
        a.interessados
    );
  }

  return lista.sort(
    (a, b) =>
      new Date(
        a.dataOrdenacao
      ) -
      new Date(
        b.dataOrdenacao
      )
  );
}

export async function obterAtividadePorId(
  id
) {
  await esperar(100);

  return (
    ATIVIDADES.find(
      (atividade) =>
        atividade.id === id
    ) ?? null
  );
}

export async function criarAtividade({
  nome,
  descricao,
  categoria,
  data,
  hora,
  local,
}) {
  await esperar(300);

  const novaAtividade = {
    id:
      Date.now().toString(),

    titulo:
      nome,

    categoria,

    data,

    dataOriginal:
      data,

    dataCompleta:
      data,

    horario:
      hora,

    local,

    interessados: 0,

    descricao,

    imagem: null,

    dataOrdenacao:
      converterDataParaISO(
        data,
        hora
      ),
  };

  ATIVIDADES = [
    novaAtividade,
    ...ATIVIDADES,
  ];

  return novaAtividade;
}

export async function atualizarAtividade(
  id,
  {
    nome,
    data,
    hora,
    local,
  }
) {
  await esperar(300);

  const indice =
    ATIVIDADES.findIndex(
      (atividade) =>
        atividade.id === id
    );

  if (indice === -1) {
    throw new Error(
      'Atividade não encontrada.'
    );
  }

  const atividadeAtualizada = {
    ...ATIVIDADES[indice],

    titulo:
      nome,

    data,

    dataOriginal:
      data,

    dataCompleta:
      data,

    horario:
      hora,

    local,

    dataOrdenacao:
      converterDataParaISO(
        data,
        hora
      ),
  };

  ATIVIDADES[indice] =
    atividadeAtualizada;

  return atividadeAtualizada;
}

export async function excluirAtividade(
  id
) {
  await esperar(300);

  const existe =
    ATIVIDADES.some(
      (atividade) =>
        atividade.id === id
    );

  if (!existe) {
    throw new Error(
      'Atividade não encontrada.'
    );
  }

  ATIVIDADES =
    ATIVIDADES.filter(
      (atividade) =>
        atividade.id !== id
    );

  return true;
}