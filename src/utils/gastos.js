// UTILS — Formatação e filtro de gastos

import { normalizarTexto } from './texto';

export function formatarGasto(gasto) {
  return {
    ...gasto,
    conceito: gasto.descricao,
    descricao: gasto.observacao ?? '',
    categoria: gasto.categoria?.nome ?? 'Outros',
    data: gasto.dataGasto,
    valor: Number(gasto.valor),
  };
}

export function filtrarGastos(gastos, busca) {
  const termo = normalizarTexto(busca.trim());

  if (!termo) return gastos;

  return gastos.filter(gasto =>
    normalizarTexto(gasto.conceito).includes(termo) ||
    normalizarTexto(gasto.categoria).includes(termo)
  );
}