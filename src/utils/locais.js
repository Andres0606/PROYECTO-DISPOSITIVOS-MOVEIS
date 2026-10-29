// UTILS — Filtro de locais (busca por texto + categoria)
import { CATEGORIA_TODOS } from '../constants/locais';
import { normalizarTexto } from './texto';

export function filtrarLocais(locais, busca, categoria) {
  const termo = normalizarTexto(busca.trim());

  return locais.filter((local) => {
    const categoriaOk =
      categoria === CATEGORIA_TODOS || local.categoria === categoria;
    const buscaOk =
      termo === '' ||
      normalizarTexto(local.nome).includes(termo) ||
      normalizarTexto(local.categoria).includes(termo);

    return categoriaOk && buscaOk;
  });
}