import { File } from 'expo-file-system';
import { fetch as expoFetch } from 'expo/fetch';
import { invalidarSessao } from './sessao';
const API_URL = 'http://10.0.2.2:3000';

// ============================================================
// PROCESSAR RESPOSTA
// ============================================================

async function processarResposta(resposta, token) {
  const dados = await resposta.json();

  if (!resposta.ok) {
    const sessaoInvalida =
      resposta.status === 401 ||
      (
        resposta.status === 403 &&
        [
          'Usuário inativo.',
          'Perfil de acesso inválido.',
        ].includes(dados.mensagem)
      );

    if (token && sessaoInvalida) {
      await invalidarSessao(token);
    }

    const erro = new Error(
      dados.mensagem ||
      'Erro ao comunicar com o servidor.'
    );

    erro.status = resposta.status;

    throw erro;
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
  idioma = 'pt-BR',
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
        idioma,
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

async function requisicaoAutenticada(
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
  return requisicaoAutenticada(
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
  return requisicaoAutenticada(
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
  return requisicaoAutenticada(
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
  return requisicaoAutenticada(
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
  return requisicaoAutenticada(
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
  return requisicaoAutenticada(
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
  return requisicaoAutenticada(
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
  return requisicaoAutenticada(
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
  return requisicaoAutenticada(
    token,
    `/atividades/${encodeURIComponent(id)}/interesse`,
    'DELETE'
  );
}

// ============================================================
// LISTAR ATIVIDADES FAVORITAS
// ============================================================

export async function obterAtividadesFavoritasApi(token) {
  return requisicaoAutenticada(
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
  return requisicaoAutenticada(
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
  return requisicaoAutenticada(
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
  return requisicaoAutenticada(
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
  return requisicaoAutenticada(
    token,
    `/atividades/${encodeURIComponent(id)}/foto`,
    'DELETE'
  );
}



// ============================================================
// CONSELHOS DE INTERCAMBISTAS
// ============================================================

// Categorias
export async function obterCategoriasConselhoApi(token) {
  return requisicaoAutenticada(token, '/categorias-conselho');
}

// Listar conselhos
export async function obterConselhosApi(
  token, ordenacao = 'recentes', categoriaId
) {
  const parametros = [
    `ordenacao=${encodeURIComponent(ordenacao)}`,
  ];

  if (categoriaId) {
    parametros.push(`categoriaId=${encodeURIComponent(categoriaId)}`);
  }

  return requisicaoAutenticada(
    token, `/conselhos?${parametros.join('&')}`
  );
}

// Obter conselho
export async function obterConselhoApi(token, id) {
  return requisicaoAutenticada(
    token, `/conselhos/${encodeURIComponent(id)}`
  );
}

// Criar conselho
export async function criarConselhoApi(token, dados) {
  return requisicaoAutenticada(
    token, '/conselhos', 'POST', dados
  );
}

// Atualizar conselho
export async function atualizarConselhoApi(token, id, dados) {
  return requisicaoAutenticada(
    token, `/conselhos/${encodeURIComponent(id)}`, 'PUT', dados
  );
}

// Excluir conselho
export async function excluirConselhoApi(token, id) {
  return requisicaoAutenticada(
    token, `/conselhos/${encodeURIComponent(id)}`, 'DELETE'
  );
}

// ============================================================
// CURTIDAS
// ============================================================

export async function verificarCurtidaConselhoApi(token, id) {
  return requisicaoAutenticada(
    token, `/conselhos/${encodeURIComponent(id)}/curtida`
  );
}

export async function adicionarCurtidaConselhoApi(token, id) {
  return requisicaoAutenticada(
    token, `/conselhos/${encodeURIComponent(id)}/curtida`, 'POST'
  );
}

export async function removerCurtidaConselhoApi(token, id) {
  return requisicaoAutenticada(
    token, `/conselhos/${encodeURIComponent(id)}/curtida`, 'DELETE'
  );
}

// ============================================================
// COMENTÁRIOS
// ============================================================

export async function obterComentariosConselhoApi(token, id) {
  return requisicaoAutenticada(
    token, `/conselhos/${encodeURIComponent(id)}/comentarios`
  );
}

export async function criarComentarioConselhoApi(token, id, dados) {
  return requisicaoAutenticada(
    token, `/conselhos/${encodeURIComponent(id)}/comentarios`, 'POST', dados
  );
}

export async function atualizarComentarioConselhoApi(
  token, id, comentarioId, dados
) {
  return requisicaoAutenticada(
    token,
    `/conselhos/${encodeURIComponent(id)}/comentarios/${encodeURIComponent(comentarioId)}`,
    'PUT', dados
  );
}

export async function excluirComentarioConselhoApi(
  token, id, comentarioId
) {
  return requisicaoAutenticada(
    token,
    `/conselhos/${encodeURIComponent(id)}/comentarios/${encodeURIComponent(comentarioId)}`,
    'DELETE'
  );
}

// ============================================================
// FOTOGRAFIAS
// ============================================================

export async function atualizarFotoConselhoApi(token, id, imagem) {
  return enviarFotoApi(
    token, `/conselhos/${encodeURIComponent(id)}/foto`, imagem
  );
}

export async function removerFotoConselhoApi(token, id) {
  return requisicaoAutenticada(
    token, `/conselhos/${encodeURIComponent(id)}/foto`, 'DELETE'
  );
}


// TAREFAS DO INTERCÂMBIO

export async function obterEtapasTarefaApi(token) {
  return requisicaoAutenticada(token, '/tarefas/etapas');
}

export async function obterEstadosTarefaApi(token) {
  return requisicaoAutenticada(token, '/tarefas/estados');
}

export async function obterPrioridadesTarefaApi(token) {
  return requisicaoAutenticada(token, '/tarefas/prioridades');
}

export async function obterTarefasApi(token, etapaId) {
  const rota = etapaId
    ? `/tarefas?etapaId=${encodeURIComponent(etapaId)}`
    : '/tarefas';

  return requisicaoAutenticada(token, rota);
}

export async function obterTarefaApi(token, id) {
  return requisicaoAutenticada(
    token, `/tarefas/${encodeURIComponent(id)}`
  );
}

export async function criarTarefaApi(token, dados) {
  return requisicaoAutenticada(token, '/tarefas', 'POST', dados);
}

export async function atualizarTarefaApi(token, id, dados) {
  return requisicaoAutenticada(
    token, `/tarefas/${encodeURIComponent(id)}`, 'PUT', dados
  );
}

export async function atualizarEstadoTarefaApi(token, id, estadoId) {
  return requisicaoAutenticada(
    token, `/tarefas/${encodeURIComponent(id)}/estado`, 'PATCH', { estadoId }
  );
}

export async function excluirTarefaApi(token, id) {
  return requisicaoAutenticada(
    token, `/tarefas/${encodeURIComponent(id)}`, 'DELETE'
  );
}

// MEUS GASTOS

function rotaGastos(caminho = '', ano, mes) {
  const rota = `/gastos${caminho}`;

  if (ano === undefined && mes === undefined) return rota;

  return `${rota}?ano=${encodeURIComponent(ano)}&mes=${encodeURIComponent(mes)}`;
}

// Categorias

export async function obterCategoriasGastoApi(token) {
  return requisicaoAutenticada(token, '/gastos/categorias');
}

// CRUD

export async function obterGastosApi(token, ano, mes) {
  return requisicaoAutenticada(token, rotaGastos('', ano, mes));
}

export async function obterGastoApi(token, id) {
  return requisicaoAutenticada(
    token, `/gastos/${encodeURIComponent(id)}`
  );
}

export async function criarGastoApi(token, dados) {
  return requisicaoAutenticada(token, '/gastos', 'POST', dados);
}

export async function atualizarGastoApi(token, id, dados) {
  return requisicaoAutenticada(
    token, `/gastos/${encodeURIComponent(id)}`, 'PUT', dados
  );
}

export async function excluirGastoApi(token, id) {
  return requisicaoAutenticada(
    token, `/gastos/${encodeURIComponent(id)}`, 'DELETE'
  );
}

// Orçamento

export async function obterOrcamentoApi(token, ano, mes) {
  return requisicaoAutenticada(
    token, rotaGastos('/orcamento', ano, mes)
  );
}

export async function atualizarOrcamentoApi(token, valor, ano, mes) {
  return requisicaoAutenticada(
    token, rotaGastos('/orcamento', ano, mes), 'PUT', { valor }
  );
}

// Resumo e estatísticas

export async function obterResumoGastosApi(token, ano, mes) {
  return requisicaoAutenticada(
    token, rotaGastos('/resumo', ano, mes)
  );
}

export async function obterEstatisticasGastosApi(token, ano, mes) {
  return requisicaoAutenticada(
    token, rotaGastos('/estatisticas', ano, mes)
  );
}

// SOBREVIVE EM PORTUGUÊS

export async function obterCategoriasFrasesApi(token) {
  return requisicaoAutenticada(token, '/frases/categorias');
}

export async function obterFrasesApi(token, categoriaId, busca) {
  const parametros = [];

  if (categoriaId) {
    parametros.push(`categoriaId=${encodeURIComponent(categoriaId)}`);
  }

  if (busca?.trim()) {
    parametros.push(`busca=${encodeURIComponent(busca.trim())}`);
  }

  const rota = parametros.length
    ? `/frases?${parametros.join('&')}`
    : '/frases';

  return requisicaoAutenticada(token, rota);
}

export async function obterFraseApi(token, id) {
  return requisicaoAutenticada(
    token, `/frases/${encodeURIComponent(id)}`
  );
}

// FAVORITOS DE FRASES

export async function obterFrasesFavoritasApi(token) {
  return requisicaoAutenticada(token, '/favoritos/frases');
}

export async function verificarFavoritoFraseApi(token, id) {
  return requisicaoAutenticada(
    token, `/favoritos/frases/${encodeURIComponent(id)}`
  );
}

export async function adicionarFavoritoFraseApi(token, id) {
  return requisicaoAutenticada(
    token, `/favoritos/frases/${encodeURIComponent(id)}`, 'POST'
  );
}

export async function removerFavoritoFraseApi(token, id) {
  return requisicaoAutenticada(
    token, `/favoritos/frases/${encodeURIComponent(id)}`, 'DELETE'
  );
}

// Requisições compartilhadas com os serviços administrativos
export { requisicaoAutenticada, enviarFotoApi };