
// UTILS — Formatação de conselhos e comentários

import { formatarDiaMes } from './formatacao';

function formatarDataPublicacao(valor) {
  if (!valor) return '';

  const data = new Date(valor);

  if (Number.isNaN(data.getTime())) return '';

  const partes = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Sao_Paulo',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(data);

  const v = Object.fromEntries(
    partes.map(({ type, value }) => [type, value])
  );

  return formatarDiaMes(`${v.year}-${v.month}-${v.day}`);
}

export function formatarConselho(conselho) {
  return {
    ...conselho,
    autor: conselho.autor?.nomeCompleto ?? 'Estudante',
    fotoAutor: conselho.autor?.fotoUrl ?? null,
    pais: conselho.autor?.paisOrigem?.nome ?? '',
    texto: conselho.titulo,
    descricao: conselho.conteudo,
    categoriaId: conselho.categoriaId ?? null,
    categoria: conselho.categoria?.nome ?? 'Sem categoria',
    imagem: conselho.imagemUrl ?? null,
    data: conselho.criado_em,
    tempo: formatarDataPublicacao(conselho.criado_em),
    curtidas: Number(conselho.curtidas ?? 0),
    comentarios: Number(conselho.comentarios ?? 0),
    curtido: !!conselho.curtido,
    meuConselho: !!conselho.meuConselho,
  };
}

export function formatarComentario(comentario) {
  return {
    ...comentario,
    autor: comentario.autor?.nomeCompleto ?? 'Estudante',
    fotoAutor: comentario.autor?.fotoUrl ?? null,
    data: comentario.criado_em,
    tempo: formatarDataPublicacao(comentario.criado_em),
    editado: new Date(comentario.atualizado_em).getTime() >
      new Date(comentario.criado_em).getTime(),
    meuComentario: !!comentario.meuComentario,
  };
}
