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
  cadastroApi,
  obterUsuarioAutenticadoApi,
  atualizarPerfilApi,
  atualizarFotoPerfilApi,
  removerFotoPerfilApi,
  obterConfiguracoesApi,
  atualizarConfiguracoesApi,
  recuperarSenhaApi,
  redefinirSenhaApi,
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
// ============================================================

export async function fazerCadastro({
  nome,
  paisOrigemId,
  universidadeOrigemId,
  universidadeDestinoId,
  email,
  senha,
}) {
  const resultado =
    await cadastroApi({
      nome: nome.trim(),

      paisOrigemId,

      universidadeOrigemId,

      universidadeDestinoId,

      email:
        email.trim().toLowerCase(),

      senha,
    });

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
// RECUPERAÇÃO DE SENHA
// ============================================================

export async function recuperarSenha(email) {
  const resultado = await recuperarSenhaApi(
    email.trim().toLowerCase()
  );

  return resultado;
}

// ============================================================
// REDEFINIÇÃO DE SENHA
// ============================================================

export async function redefinirSenha(
  token,
  novaSenha
) {
  const resultado = await redefinirSenhaApi(
    token.trim(),
    novaSenha
  );

  return resultado;
}

// ============================================================
// VERIFICAÇÃO REAL DA SESSÃO
// ============================================================

export async function sessaoAtiva() {
  const token =
    await obterToken();

  if (!token) {
    return false;
  }

  try {
    const resultado =
      await obterUsuarioAutenticadoApi(
        token
      );

    await salvarUsuario(
      resultado.usuario
    );

    return true;
  } catch (erro) {
    await limparSessao();

    return false;
  }
}

// ============================================================
// USUÁRIO DA SESSÃO
// ============================================================

export async function obterSessao() {
  return obterUsuario();
}
// ============================================================
// ATUALIZAR PERFIL
// ============================================================

export async function atualizarPerfil(
  dados
) {
  const token =
    await obterToken();

  if (!token) {
    throw new Error(
      'Sessão não encontrada.'
    );
  }

  const resultado =
    await atualizarPerfilApi(
      token,
      dados
    );

  await salvarUsuario(
    resultado.usuario
  );

  return resultado.usuario;
}
// ============================================================
// LOGOUT
// ============================================================

export async function logout() {
  await limparSessao();
}

// ============================================================
// ATUALIZAR FOTO DO PERFIL
// ============================================================

export async function atualizarFotoPerfil(imagem) {
  const token = await obterToken();

  if (!token) {
    throw new Error('Sessão não encontrada.');
  }

  const resultado = await atualizarFotoPerfilApi(
    token,
    imagem
  );

  const dados = await obterUsuarioAutenticadoApi(token);

  await salvarUsuario(dados.usuario);

  return resultado.fotoUrl;
}

// ============================================================
// REMOVER FOTO DO PERFIL
// ============================================================

export async function removerFotoPerfil() {
  const token = await obterToken();

  if (!token) {
    throw new Error('Sessão não encontrada.');
  }

  await removerFotoPerfilApi(token);

  const dados = await obterUsuarioAutenticadoApi(token);

  await salvarUsuario(dados.usuario);

  return null;
}

// ============================================================
// CONSULTAR CONFIGURAÇÕES
// ============================================================

export async function obterConfiguracoes() {
  const token = await obterToken();

  if (!token) {
    throw new Error('Sessão não encontrada.');
  }

  const resultado =
    await obterConfiguracoesApi(token);

  return resultado.configuracoes;
}

// ============================================================
// ATUALIZAR CONFIGURAÇÕES
// ============================================================

export async function atualizarConfiguracoes(dados) {
  const token = await obterToken();

  if (!token) {
    throw new Error('Sessão não encontrada.');
  }

  const resultado =
    await atualizarConfiguracoesApi(
      token,
      dados
    );

  const usuario = await obterUsuario();

  if (usuario) {
    await salvarUsuario({
      ...usuario,

      idioma:
        resultado.configuracoes.idioma,

      tema:
        resultado.configuracoes.tema,
    });
  }

  return resultado.configuracoes;
}