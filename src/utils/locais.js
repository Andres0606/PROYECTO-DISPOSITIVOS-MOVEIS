// UTILS — Filtros de locais

import { CATEGORIA_TODOS } from '../constants/locais';
import { normalizarTexto } from './texto';

export function filtrarLocais(
  locais,
  busca,
  categoria
) {
  const termo = normalizarTexto(
    busca.trim()
  );

  return locais.filter((local) => {

    const categoriaOk =
      categoria === CATEGORIA_TODOS ||
      local.categoriaId === categoria;

    const campos = [
      local.nome,
      local.categoria,
      local.descricao,
      local.endereco,
    ];

    const buscaOk =
      termo === '' ||
      campos.some((campo) =>
        normalizarTexto(campo ?? '')
          .includes(termo)
      );

    return categoriaOk && buscaOk;
  });
}