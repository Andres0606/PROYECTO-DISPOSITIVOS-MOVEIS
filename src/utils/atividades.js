// UTILS — Formatação de atividades

import { isoParaBr } from './datas';
import { formatarDataCompleta } from './formatacao';

export function formatarAtividade(atividade) {
  return {
    ...atividade,
    titulo: atividade.nome,
    categoriaId: atividade.categoriaId ?? null,
    categoria: atividade.categoria?.nome ?? 'Sem categoria',
    data: isoParaBr(atividade.dataAtividade),
    dataOriginal: isoParaBr(atividade.dataAtividade),
    dataCompleta: formatarDataCompleta(atividade.dataAtividade),
    horario: atividade.horaInicio?.slice(0, 5) ?? '',
    imagem: atividade.imagemUrl ?? null,
    interessados: Number(atividade.interessados ?? 0),
    interessado: !!atividade.interessado,
    guardado: !!atividade.guardado,
    vencida: !!atividade.vencida,
    minhaAtividade: !!atividade.minhaAtividade,
    dataOrdenacao: `${atividade.dataAtividade}T${atividade.horaInicio}`,
  };
}
