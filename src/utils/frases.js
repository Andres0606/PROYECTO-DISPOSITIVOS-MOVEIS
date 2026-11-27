// UTILS — Formatação e busca de frases

import { normalizarTexto } from './texto';

export function formatarFrase(frase) {
  return {
    ...frase,
    portugues: frase.frasePortugues,
    espanhol: frase.traducaoEspanhol,
    ingles: frase.traducaoIngles ?? '',
    explicacao: frase.explicacao ?? '',
    explicacaoIngles: frase.explicacaoIngles ?? '',
    explicacaoPortugues: frase.explicacaoPortugues ?? '',
    guardado: !!frase.guardado,
  };
}

// Tradução conforme o idioma selecionado

export function obterTraducaoFrase(frase, idioma) {
  if (idioma === 'en') {
    return frase.ingles || frase.traducaoIngles || '—';
  }

  return frase.espanhol || frase.traducaoEspanhol || '—';
}

// Contexto conforme o idioma selecionado

export function obterContextoFrase(frase, idioma) {
  if (idioma === 'en') {
    return frase.explicacaoIngles || '';
  }

  if (idioma === 'pt-BR') {
    return frase.explicacaoPortugues || '';
  }

  return frase.explicacao || '';
}

// Busca nos três idiomas

export function filtrarFrases(frases, busca) {
  const termo = normalizarTexto(busca.trim());

  if (!termo) return frases;

  return frases.filter(frase =>
    [
      frase.portugues,
      frase.espanhol,
      frase.ingles,
      frase.explicacao,
      frase.explicacaoIngles,
      frase.explicacaoPortugues,
    ].some(texto =>
      normalizarTexto(texto ?? '').includes(termo)
    )
  );
}