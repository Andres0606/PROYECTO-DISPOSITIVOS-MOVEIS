// UTILS — Formatação e busca de frases

import { normalizarTexto } from './texto';

export function formatarFrase(frase) {
  return {
    ...frase,
    portugues: frase.frasePortugues,
    espanhol: frase.traducaoEspanhol,
    explicacao: frase.explicacao ?? '',
    guardado: !!frase.guardado,
  };
}

export function filtrarFrases(frases, busca) {
  const termo = normalizarTexto(busca.trim());

  if (!termo) return frases;

  return frases.filter(frase =>
    normalizarTexto(frase.portugues).includes(termo) ||
    normalizarTexto(frase.espanhol).includes(termo) ||
    normalizarTexto(frase.explicacao ?? '').includes(termo)
  );
}