// UTILS — Formatação de frases

export function formatarFrase(frase) {
  return {
    ...frase,
    portugues: frase.frasePortugues,
    espanhol: frase.traducaoEspanhol,
    explicacao: frase.explicacao ?? '',
    guardado: !!frase.guardado,
  };
}