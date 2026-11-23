const API_URL = 'http://10.0.2.2:3000';

async function processarResposta(resposta) {
  const dados = await resposta.json();

  if (!resposta.ok) {
    throw new Error(
      dados.mensagem ||
        'Erro ao comunicar com o servidor.'
    );
  }

  return dados;
}

export async function obterRoles() {
  const resposta = await fetch(
    `${API_URL}/roles`
  );

  return processarResposta(resposta);
}

export async function loginApi(
  email,
  senha
) {
  const resposta = await fetch(
    `${API_URL}/auth/login`,
    {
      method: 'POST',

      headers: {
        'Content-Type':
          'application/json',
      },

      body: JSON.stringify({
        email,
        senha,
      }),
    }
  );

  return processarResposta(resposta);
}