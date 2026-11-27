import ptBR from './pt-BR';
import es from './es';
import en from './en';

export const IDIOMA_PADRAO = 'pt-BR';

export const IDIOMAS = {
  'pt-BR': ptBR,
  es,
  en,
};

function obterValor(dicionario, chave) {
  return chave.split('.').reduce(
    (valor, parte) => valor?.[parte],
    dicionario
  );
}

export function normalizarIdioma(idioma) {
  return Object.prototype.hasOwnProperty.call(IDIOMAS, idioma)
    ? idioma
    : IDIOMA_PADRAO;
}

export function traduzir(idioma, chave, parametros = {}) {
  const idiomaValido = normalizarIdioma(idioma);

  const valor = obterValor(
    IDIOMAS[idiomaValido],
    chave
  );

  const valorPadrao = obterValor(
    IDIOMAS[IDIOMA_PADRAO],
    chave
  );

  const texto =
    typeof valor === 'string'
      ? valor
      : typeof valorPadrao === 'string'
        ? valorPadrao
        : chave;

  return texto.replace(
    /\{\{(\w+)\}\}/g,
    (original, nome) =>
      parametros[nome] != null
        ? String(parametros[nome])
        : original
  );
}