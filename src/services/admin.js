// SERVICE — Administração

import { requisicaoAutenticada, enviarFotoApi } from './api';
import { obterToken } from './storage';

async function obterTokenSessao() {
  const token = await obterToken();
  if (!token) throw new Error('Sessão não encontrada.');
  return token;
}

async function requisicao(rota, metodo = 'GET', dados) {
  const token = await obterTokenSessao();
  return requisicaoAutenticada(token, `/admin${rota}`, metodo, dados);
}

const codificar = encodeURIComponent;

function rotaCategoria(grupo) {
  if (grupo === 'lugares') return '/categorias-lugar';
  if (['frases', 'conselhos', 'atividades'].includes(grupo)) {
    return `/categorias/${grupo}`;
  }
  throw new Error('Tipo de categoria inválido.');
}

function rotaConteudo(tipo) {
  if (!['lugares', 'frases'].includes(tipo)) {
    throw new Error('Tipo de conteúdo inválido.');
  }
  return `/${tipo}`;
}

function rotaModeracao(tipo) {
  if (!['conselhos', 'atividades'].includes(tipo)) {
    throw new Error('Tipo de moderação inválido.');
  }
  return `/moderacao/${tipo}`;
}

// Painel

export function obterResumoAdmin() {
  return requisicao('/resumo');
}

// Usuários

export function obterUsuariosAdmin() {
  return requisicao('/usuarios');
}

export function obterUsuarioAdmin(id) {
  return requisicao(`/usuarios/${codificar(id)}`);
}

export function alterarEstadoUsuarioAdmin(id, ativo) {
  return requisicao(`/usuarios/${codificar(id)}/estado`, 'PATCH', { ativo });
}

// Conteúdos e categorias

export function obterConteudosAdmin(tipo) {
  return requisicao(rotaConteudo(tipo));
}

export function obterCategoriasAdmin(grupo) {
  return requisicao(rotaCategoria(grupo));
}

export async function obterGestaoConteudosAdmin() {
  const [lugares, frases, categoriasLugar, categoriasFrase,
    categoriasConselho, categoriasAtividade] = await Promise.all([
    obterConteudosAdmin('lugares'),
    obterConteudosAdmin('frases'),
    obterCategoriasAdmin('lugares'),
    obterCategoriasAdmin('frases'),
    obterCategoriasAdmin('conselhos'),
    obterCategoriasAdmin('atividades'),
  ]);

  return {
    lugares, frases,
    categorias: {
      lugares: categoriasLugar,
      frases: categoriasFrase,
      conselhos: categoriasConselho,
      atividades: categoriasAtividade,
    },
  };
}

export function alterarEstadoConteudoAdmin(tipo, id, ativo) {
  return requisicao(`${rotaConteudo(tipo)}/${codificar(id)}`, 'PUT', { ativo });
}

export function excluirCategoriaAdmin(grupo, id) {
  return requisicao(`${rotaCategoria(grupo)}/${codificar(id)}`, 'DELETE');
}

export async function salvarConteudoAdmin({ tipo, grupo, id, dados, foto }) {
  const base = tipo === 'categorias' ? rotaCategoria(grupo) : rotaConteudo(tipo);
  const rota = id ? `${base}/${codificar(id)}` : base;
  const registro = await requisicao(rota, id ? 'PUT' : 'POST', dados);

  // A gravação do conteúdo e a fotografia são operações independentes.
  let aviso = '';
  if (tipo === 'lugares' && (foto?.imagem || (id && foto?.removerImagem))) {
    const rotaFoto = `/lugares/${codificar(registro.id)}/foto`;
    try {
      if (foto.imagem) {
        const token = await obterTokenSessao();
        await enviarFotoApi(token, `/admin${rotaFoto}`, foto.imagem);
      } else {
        await requisicao(rotaFoto, 'DELETE');
      }
    } catch (erro) {
      aviso = `Conteúdo salvo, mas não foi possível atualizar a foto. ${erro.message || ''}`.trim();
    }
  }
  return { registro, aviso };
}

// Moderação

export function obterModeracaoAdmin(tipo) {
  return requisicao(rotaModeracao(tipo));
}

export async function obterGestaoModeracaoAdmin() {
  const [conselhos, atividades] = await Promise.all([
    obterModeracaoAdmin('conselhos'),
    obterModeracaoAdmin('atividades'),
  ]);
  return { conselhos, atividades };
}

export function alterarEstadoModeracaoAdmin(tipo, id, ativo) {
  return requisicao(`${rotaModeracao(tipo)}/${codificar(id)}/estado`, 'PATCH', { ativo });
}

export function obterComentariosAdmin(id) {
  return requisicao(`/conselhos/${codificar(id)}/comentarios`);
}

export function excluirComentarioAdmin(id, comentarioId) {
  return requisicao(`/conselhos/${codificar(id)}/comentarios/${codificar(comentarioId)}`, 'DELETE');
}
