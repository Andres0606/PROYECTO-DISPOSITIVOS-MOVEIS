import { File } from 'expo-file-system';
import { fetch as expoFetch } from 'expo/fetch';
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

// ============================================================
// ATUALIZAR FOTO DO PERFIL
// ============================================================

// ============================================================
// ATUALIZAR FOTO DO PERFIL
// ============================================================


// Enviar fotografia para a API
async function enviarFotoApi(token, rota, imagem) {
  if (!imagem?.uri) {
    throw new Error('Nenhuma imagem selecionada.');
  }

  const arquivo = new File(imagem.uri);

  if (!arquivo.exists) {
    throw new Error('Arquivo não encontrado.');
  }

  if (arquivo.size > 5 * 1024 * 1024) {
    throw new Error('A imagem deve ter no máximo 5 MB.');
  }

  const formulario = new FormData();
  formulario.append('foto', arquivo);

  const resposta = await expoFetch(`${API_URL}${rota}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formulario,
  });

  return processarResposta(resposta);
}

// Atualizar foto do perfil
export async function atualizarFotoPerfilApi(token, imagem) {
  return enviarFotoApi(token, '/auth/me/foto', imagem);
}


// ============================================================
// REMOVER FOTO DO PERFIL
// ============================================================

export async function removerFotoPerfilApi(token) {
  const resposta = await fetch(
    `${API_URL}/auth/me/foto`,
    {
      method: 'DELETE',

      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return processarResposta(resposta);
}

// ============================================================
// CONSULTAR CONFIGURAÇÕES DO USUÁRIO
// ============================================================

export async function obterConfiguracoesApi(token) {
  const resposta = await fetch(
    `${API_URL}/configuracoes/me`,
    {
      method: 'GET',

      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return processarResposta(resposta);
}

// ============================================================
// ATUALIZAR CONFIGURAÇÕES DO USUÁRIO
// ============================================================

export async function atualizarConfiguracoesApi(
  token,
  dados
) {
  const resposta = await fetch(
    `${API_URL}/configuracoes/me`,
    {
      method: 'PUT',

      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },

      body: JSON.stringify(dados),
    }
  );

  return processarResposta(resposta);
}

// ============================================================
// SOLICITAR RECUPERAÇÃO DE SENHA
// ============================================================

export async function recuperarSenhaApi(email) {
  const resposta = await fetch(
    `${API_URL}/auth/recuperar-senha`,
    {
      method: 'POST',

      headers: {
        'Content-Type': 'application/json',
      },

      body: JSON.stringify({
        email,
      }),
    }
  );

  return processarResposta(resposta);
}

// ============================================================
// REDEFINIR SENHA
// ============================================================

export async function redefinirSenhaApi(
  token,
  novaSenha
) {
  const resposta = await fetch(
    `${API_URL}/auth/redefinir-senha`,
    {
      method: 'POST',

      headers: {
        'Content-Type': 'application/json',
      },

      body: JSON.stringify({
        token,
        novaSenha,
      }),
    }
  );

  return processarResposta(resposta);
}

// ============================================================
// EXPLORAR CHAPECÓ — REQUISIÇÕES AUTENTICADAS
// ============================================================

async function requisicaoExplorar(
  token,
  rota,
  metodo = 'GET'
) {
  const resposta = await fetch(
    `${API_URL}${rota}`,
    {
      method: metodo,

      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return processarResposta(resposta);
}

// ============================================================
// LISTAR LUGARES
// ============================================================

export async function obterLocaisApi(
  token,
  filtros = {}
) {
  const parametros = [];

  if (filtros.busca) {
    parametros.push(
      `busca=${encodeURIComponent(filtros.busca)}`
    );
  }

  if (filtros.categoriaId) {
    parametros.push(
      `categoriaId=${encodeURIComponent(filtros.categoriaId)}`
    );
  }

  const consulta = parametros.length
    ? `?${parametros.join('&')}`
    : '';

  return requisicaoExplorar(
    token,
    `/lugares${consulta}`
  );
}

// ============================================================
// OBTER LUGAR POR ID
// ============================================================

export async function obterLocalApi(token, id) {
  return requisicaoExplorar(
    token,
    `/lugares/${encodeURIComponent(id)}`
  );
}

// ============================================================
// LISTAR CATEGORIAS
// ============================================================

export async function obterCategoriasLugarApi(token) {
  return requisicaoExplorar(
    token,
    '/categorias-lugar'
  );
}

// ============================================================
// LISTAR FAVORITOS
// ============================================================

export async function obterLocaisFavoritosApi(token) {
  return requisicaoExplorar(
    token,
    '/favoritos/lugares'
  );
}

// ============================================================
// VERIFICAR FAVORITO
// ============================================================

export async function verificarFavoritoLocalApi(
  token,
  id
) {
  return requisicaoExplorar(
    token,
    `/favoritos/lugares/${encodeURIComponent(id)}`
  );
}

// ============================================================
// ADICIONAR FAVORITO
// ============================================================

export async function adicionarFavoritoLocalApi(
  token,
  id
) {
  return requisicaoExplorar(
    token,
    `/favoritos/lugares/${encodeURIComponent(id)}`,
    'POST'
  );
}

// ============================================================
// REMOVER FAVORITO
// ============================================================

export async function removerFavoritoLocalApi(
  token,
  id
) {
  return requisicaoExplorar(
    token,
    `/favoritos/lugares/${encodeURIComponent(id)}`,
    'DELETE'
  );
}



// ============================================================
// ATIVIDADES — REQUISIÇÕES AUTENTICADAS
// ============================================================

async function requisicaoAtividades(
  token,
  rota,
  metodo = 'GET',
  dados
) {
  const resposta = await fetch(
    `${API_URL}${rota}`,
    {
      method: metodo,

      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },

      ...(dados !== undefined
        ? { body: JSON.stringify(dados) }
        : {}),
    }
  );

  return processarResposta(resposta);
}

// ============================================================
// LISTAR CATEGORIAS DE ATIVIDADES
// ============================================================

export async function obterCategoriasAtividadeApi(token) {
  return requisicaoAtividades(
    token,
    '/categorias-atividade'
  );
}

// ============================================================
// LISTAR ATIVIDADES
// ============================================================

export async function obterAtividadesApi(
  token,
  ordenacao = 'recentes'
) {
  return requisicaoAtividades(
    token,
    `/atividades?ordenacao=${encodeURIComponent(ordenacao)}`
  );
}

// ============================================================
// OBTER ATIVIDADE POR ID
// ============================================================

export async function obterAtividadeApi(
  token,
  id
) {
  return requisicaoAtividades(
    token,
    `/atividades/${encodeURIComponent(id)}`
  );
}

// ============================================================
// CRIAR ATIVIDADE
// ============================================================

export async function criarAtividadeApi(
  token,
  dados
) {
  return requisicaoAtividades(
    token,
    '/atividades',
    'POST',
    dados
  );
}

// ============================================================
// ATUALIZAR ATIVIDADE
// ============================================================

export async function atualizarAtividadeApi(
  token,
  id,
  dados
) {
  return requisicaoAtividades(
    token,
    `/atividades/${encodeURIComponent(id)}`,
    'PUT',
    dados
  );
}

// ============================================================
// EXCLUIR ATIVIDADE
// ============================================================

export async function excluirAtividadeApi(
  token,
  id
) {
  return requisicaoAtividades(
    token,
    `/atividades/${encodeURIComponent(id)}`,
    'DELETE'
  );
}

// ============================================================
// VERIFICAR INTERESSE
// ============================================================

export async function verificarInteresseAtividadeApi(
  token,
  id
) {
  return requisicaoAtividades(
    token,
    `/atividades/${encodeURIComponent(id)}/interesse`
  );
}

// ============================================================
// ADICIONAR INTERESSE
// ============================================================

export async function adicionarInteresseAtividadeApi(
  token,
  id
) {
  return requisicaoAtividades(
    token,
    `/atividades/${encodeURIComponent(id)}/interesse`,
    'POST'
  );
}

// ============================================================
// REMOVER INTERESSE
// ============================================================

export async function removerInteresseAtividadeApi(
  token,
  id
) {
  return requisicaoAtividades(
    token,
    `/atividades/${encodeURIComponent(id)}/interesse`,
    'DELETE'
  );
}

// ============================================================
// LISTAR ATIVIDADES FAVORITAS
// ============================================================

export async function obterAtividadesFavoritasApi(token) {
  return requisicaoAtividades(
    token,
    '/favoritos/atividades'
  );
}

// ============================================================
// VERIFICAR FAVORITO
// ============================================================

export async function verificarFavoritoAtividadeApi(
  token,
  id
) {
  return requisicaoAtividades(
    token,
    `/favoritos/atividades/${encodeURIComponent(id)}`
  );
}

// ============================================================
// ADICIONAR FAVORITO
// ============================================================

export async function adicionarFavoritoAtividadeApi(
  token,
  id
) {
  return requisicaoAtividades(
    token,
    `/favoritos/atividades/${encodeURIComponent(id)}`,
    'POST'
  );
}

// ============================================================
// REMOVER FAVORITO
// ============================================================

export async function removerFavoritoAtividadeApi(
  token,
  id
) {
  return requisicaoAtividades(
    token,
    `/favoritos/atividades/${encodeURIComponent(id)}`,
    'DELETE'
  );
}


// Atualizar foto da atividade
export async function atualizarFotoAtividadeApi(token, id, imagem) {
  return enviarFotoApi(
    token,
    `/atividades/${encodeURIComponent(id)}/foto`,
    imagem
  );
}

// Remover foto da atividade
export async function removerFotoAtividadeApi(token, id) {
  return requisicaoAtividades(
    token,
    `/atividades/${encodeURIComponent(id)}/foto`,
    'DELETE'
  );
}
