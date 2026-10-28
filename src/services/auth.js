// SERVICE — Autenticação
// Nesta etapa, a autenticação ainda é simulada.
// Depois, fazerLogin e sessaoAtiva serão conectados à API real.

import {
  limparSessao,
  obterToken,
  obterUsuario,
  salvarToken,
  salvarUsuario,
} from './storage';

const USUARIO_TESTE = {
  nome: 'Estudante Teste',
  email: 'aluno@interchapeco.com',
  senha: '123456',
  pais: 'Colômbia',
  universidade: 'Unochapecó',
};

function esperar(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function fazerLogin(email, senha) {
  await esperar(600);

  const credenciaisCorretas =
    email.toLowerCase() === USUARIO_TESTE.email &&
    senha === USUARIO_TESTE.senha;

  if (!credenciaisCorretas) {
    throw new Error('E-mail ou senha inválidos.');
  }

  const token = 'token-fixo-de-teste';

  const usuario = {
    nome: USUARIO_TESTE.nome,
    email: USUARIO_TESTE.email,
    pais: USUARIO_TESTE.pais,
    universidade: USUARIO_TESTE.universidade,
  };

  await salvarToken(token);
  await salvarUsuario(usuario);

  return {
    token,
    usuario,
  };
}

export async function fazerCadastro({
  nome,
  pais,
  email,
  universidade,
}) {
  await esperar(600);

  const token = 'token-fixo-de-teste';

  const usuario = {
    nome,
    email,
    pais,
    universidade,
  };

  await salvarToken(token);
  await salvarUsuario(usuario);

  return {
    token,
    usuario,
  };
}

export async function recuperarSenha(email) {
  await esperar(600);

  return {
    enviado: true,
    email,
  };
}

export async function sessaoAtiva() {
  const token = await obterToken();

  if (!token) {
    return false;
  }

  // Quando houver backend real, aqui será feita a validação
  // do token com a API, como no projeto do professor.
  return true;
}

export async function obterSessao() {
  return obterUsuario();
}

export async function logout() {
  await limparSessao();
}