// SERVICE — Autenticação

import {
  limparSessao,
  obterToken,
  obterUsuario,
  salvarToken,
  salvarUsuario,
} from './storage';

import {
  loginApi,
} from './api';

// ============================================================
// LOGIN
// ============================================================

export async function fazerLogin(
  email,
  senha
) {
  const resultado =
    await loginApi(
      email.trim().toLowerCase(),
      senha
    );

  const {
    token,
    usuario,
  } = resultado;

  await salvarToken(token);
  await salvarUsuario(usuario);

  return {
    token,
    usuario,
  };
}

// ============================================================
// CADASTRO
// Ainda será conectado ao backend
// ============================================================

export async function fazerCadastro({
  nome,
  pais,
  email,
  universidade,
}) {
  throw new Error(
    'Cadastro ainda não conectado ao backend.'
  );
}

// ============================================================
// RECUPERAÇÃO DE SENHA
// Ainda será conectada ao backend
// ============================================================

export async function recuperarSenha(
  email
) {
  throw new Error(
    'Recuperação de senha ainda não conectada ao backend.'
  );
}

// ============================================================
// VERIFICAÇÃO DE SESSÃO
// ============================================================

export async function sessaoAtiva() {
  const token =
    await obterToken();

  return !!token;
}

// ============================================================
// USUÁRIO DA SESSÃO
// ============================================================

export async function obterSessao() {
  return obterUsuario();
}

// ============================================================
// LOGOUT
// ============================================================

export async function logout() {
  await limparSessao();
}