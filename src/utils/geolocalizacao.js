// UTILS — Geolocalização e cálculo de distâncias

const RAIO_TERRA_KM = 6371;

// VALIDAR COORDENADAS

export function coordenadasValidas(posicao) {
  return (
    posicao != null &&
    Number.isFinite(posicao.latitude) &&
    Number.isFinite(posicao.longitude) &&
    Math.abs(posicao.latitude) <= 90 &&
    Math.abs(posicao.longitude) <= 180
  );
}

// CONVERTER GRAUS PARA RADIANOS

function paraRadianos(graus) {
  return graus * Math.PI / 180;
}

// CALCULAR DISTÂNCIA — FÓRMULA DE HAVERSINE

export function calcularDistanciaKm(origem, destino) {
  if (
    !coordenadasValidas(origem) ||
    !coordenadasValidas(destino)
  ) {
    return null;
  }

  const latitudeOrigem =
    paraRadianos(origem.latitude);

  const latitudeDestino =
    paraRadianos(destino.latitude);

  const diferencaLatitude =
    paraRadianos(
      destino.latitude - origem.latitude
    );

  const diferencaLongitude =
    paraRadianos(
      destino.longitude - origem.longitude
    );

  const a =
    Math.sin(diferencaLatitude / 2) ** 2 +
    Math.cos(latitudeOrigem) *
    Math.cos(latitudeDestino) *
    Math.sin(diferencaLongitude / 2) ** 2;

  const valorSeguro =
    Math.min(1, Math.max(0, a));

  const c =
    2 * Math.atan2(
      Math.sqrt(valorSeguro),
      Math.sqrt(1 - valorSeguro)
    );

  return RAIO_TERRA_KM * c;
}

// ADICIONAR DISTÂNCIA A UM LOCAL

export function adicionarDistanciaLocal(local, posicao) {
  return {
    ...local,

    distanciaKm:
      calcularDistanciaKm(posicao, local),
  };
}

// ADICIONAR DISTÂNCIAS À LISTA DE LOCAIS

export function adicionarDistanciasLocais(locais, posicao) {
  return locais.map(local =>
    adicionarDistanciaLocal(local, posicao)
  );
}

// ORDENAR LOCAIS POR PROXIMIDADE

export function ordenarLocaisPorDistancia(locais) {
  return [...locais].sort((a, b) => {
    const distanciaA = a.distanciaKm;
    const distanciaB = b.distanciaKm;

    const validaA =
      Number.isFinite(distanciaA);

    const validaB =
      Number.isFinite(distanciaB);

    if (!validaA && !validaB) return 0;

    if (!validaA) return 1;

    if (!validaB) return -1;

    return distanciaA - distanciaB;
  });
}