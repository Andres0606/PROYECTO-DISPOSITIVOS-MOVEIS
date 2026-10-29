// UTILS — Filtro de gastos (busca por conceito ou categoria)
import { normalizarTexto } from './texto';

export function filtrarGastos(gastos, busca) {
  const termo = normalizarTexto(busca.trim());

  if (termo === '') {
    return gastos;
  }

  return gastos.filter(
    (gasto) =>
      normalizarTexto(gasto.conceito).includes(termo) ||
      normalizarTexto(gasto.categoria).includes(termo)
  );
}