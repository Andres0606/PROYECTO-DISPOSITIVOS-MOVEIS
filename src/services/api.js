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
// PAÍSES
// ============================================================

export async function obterPaises() {
  const resposta = await fetch(
    `${API_URL}/paises`
  );

  return processarResposta(resposta);
}

// ============================================================
// UNIVERSIDADES POR PAÍS
// ============================================================

export async function obterUniversidadesPorPais(
  paisId
) {
  const resposta = await fetch(
    `${API_URL}/universidades?paisId=${encodeURIComponent(
      paisId
    )}`
  );

  return processarResposta(resposta);
}

// ============================================================
// UNIVERSIDADES DE CHAPECÓ
// ============================================================

export async function obterUniversidadesChapeco() {
  const resposta = await fetch(
    `${API_URL}/universidades?cidade=${encodeURIComponent(
      'Chapecó'
    )}`
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
// CADASTRO
// ============================================================

export async function cadastroApi({
  nome,
  paisOrigemId,
  universidadeOrigemId,
  universidadeDestinoId,
  email,
  senha,
}) {
  const resposta = await fetch(
    `${API_URL}/auth/cadastro`,
    {
      method: 'POST',

      headers: {
        'Content-Type':
          'application/json',
      },

      body: JSON.stringify({
        nome,
        paisOrigemId,
        universidadeOrigemId,
        universidadeDestinoId,
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
// ============================================================
// ATUALIZAR PERFIL
// ============================================================

export async function atualizarPerfilApi(
  token,
  {
    nome,
    paisOrigemId,
    universidadeOrigemId,
    universidadeDestinoId,
    email,
  }
) {
  const resposta = await fetch(
    `${API_URL}/auth/me`,
    {
      method: 'PUT',

      headers: {
        'Content-Type':
          'application/json',

        Authorization:
          `Bearer ${token}`,
      },

      body: JSON.stringify({
        nome,
        paisOrigemId,
        universidadeOrigemId,
        universidadeDestinoId,
        email,
      }),
    }
  );

  return processarResposta(resposta);
}