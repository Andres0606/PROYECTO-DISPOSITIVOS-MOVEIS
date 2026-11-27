// SERVICE — Controle de sessão inválida

import { limparSessao, obterToken } from './storage';

let aoInvalidar = null;
let invalidando = false;

export function configurarSessao(callback) {
  aoInvalidar = callback;

  return () => {
    if (aoInvalidar === callback) {
      aoInvalidar = null;
    }
  };
}

export async function invalidarSessao(tokenRequisicao) {
  if (invalidando || !tokenRequisicao) return;

  invalidando = true;

  try {
    const tokenAtual = await obterToken();

    if (tokenAtual !== tokenRequisicao) return;

    await limparSessao();

    aoInvalidar?.();
  } finally {
    invalidando = false;
  }
}