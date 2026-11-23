const API_URL = 'http://10.0.2.2:3000';

// ============================================================
// PROCESSAR RESPOSTA
// ============================================================

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

// ============================================================
// ROLES
// ============================================================

export async function obterRoles() {
  const resposta = await fetch(
    `${API_URL}/roles`
  );

  return processarResposta(resposta);
}

// ============================================================
// LOGIN
// ============================================================

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

// ============================================================
// USUÁRIO AUTENTICADO
// ============================================================

export async function obterUsuarioAutenticadoApi(
  token
) {
  const resposta = await fetch(
    `${API_URL}/auth/me`,
    {
      method: 'GET',

      headers: {
        Authorization:
          `Bearer ${token}`,
      },
    }
  );

  return processarResposta(resposta);
}