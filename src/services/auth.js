// SERVICE — Autenticação
// ETAPA FRONT: lógica estática apenas para testar a navegação.
// Depois, o corpo destas funções será trocado por chamadas HTTP reais
// (api.js) e o token será guardado com storage.js (SecureStore).

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
  await esperar(600); // simula o tempo de uma requisição

  const credenciaisCorretas =
    email.toLowerCase() === USUARIO_TESTE.email && senha === USUARIO_TESTE.senha;

  if (!credenciaisCorretas) {
    throw new Error('E-mail ou senha inválidos.');
  }

  return {
    token: 'token-fixo-de-teste',
    usuario: {
      nome: USUARIO_TESTE.nome,
      email: USUARIO_TESTE.email,
      pais: USUARIO_TESTE.pais,
      universidade: USUARIO_TESTE.universidade,
    },
  };
}

export async function fazerCadastro({ nome, pais, email, universidade }) {
  await esperar(600);

  return {
    token: 'token-fixo-de-teste',
    usuario: { nome, email, pais, universidade },
  };
}

export async function recuperarSenha(email) {
  await esperar(600);

  // Estático: sempre "envia". O backend real devolverá sucesso ou erro.
  return { enviado: true, email };
}