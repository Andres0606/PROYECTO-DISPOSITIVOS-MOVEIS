// UTILS — Filtro de locais (busca por texto + categoria)
import { CATEGORIA_TODOS } from '../constants/locais';

// Minúsculas e sem acentos: "Mercadão" casa com "mercadao"
function normalizar(texto) {
  return String(texto)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

export function filtrarLocais(locais, busca, categoria) {
  const termo = normalizar(busca.trim());

  return locais.filter((local) => {
    const categoriaOk =
      categoria === CATEGORIA_TODOS || local.categoria === categoria;
    const buscaOk =
      termo === '' ||
      normalizar(local.nome).includes(termo) ||
      normalizar(local.categoria).includes(termo);

    return categoriaOk && buscaOk;
  });
}