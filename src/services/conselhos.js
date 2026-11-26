
// SERVICE — Conselhos de intercambistas

import { obterToken } from './storage';
import { formatarConselho, formatarComentario } from '../utils/conselhos';

import {
  obterCategoriasConselhoApi,
  obterConselhosApi,
  obterConselhoApi,
  criarConselhoApi,
  atualizarConselhoApi,
  excluirConselhoApi,
  verificarCurtidaConselhoApi,
  adicionarCurtidaConselhoApi,
  removerCurtidaConselhoApi,
  obterComentariosConselhoApi,
  criarComentarioConselhoApi,
  atualizarComentarioConselhoApi,
  excluirComentarioConselhoApi,
  atualizarFotoConselhoApi,
  removerFotoConselhoApi,
} from './api';

async function obterTokenSessao() {
  const token = await obterToken();

  if (!token) {
    throw new Error('Sessão não encontrada.');
  }

  return token;
}

// Compatibilidade temporária com os formulários atuais
async function resolverCategoria(token, categoriaId, categoria) {
  if (categoriaId) return categoriaId;

  if (typeof categoria === 'string' && categoria.trim()) {
    const categorias = await obterCategoriasConselhoApi(token);

    const encontrada = categorias.find(
      (item) => item.nome.toLowerCase() === categoria.trim().toLowerCase()
    );

    if (encontrada) return encontrada.id;
  }

  throw new Error('Selecione uma categoria válida.');
}

// ============================================================
// CONSELHOS E CATEGORIAS
// ============================================================

export async function obterCategoriasConselho() {
  const token = await obterTokenSessao();
  return obterCategoriasConselhoApi(token);
}

export async function obterConselhos(
  ordenacao = 'recentes', categoriaId
) {
  const token = await obterTokenSessao();
  const conselhos = await obterConselhosApi(token, ordenacao, categoriaId);

  return conselhos.map(formatarConselho);
}

export async function obterConselhoPorId(id) {
  const token = await obterTokenSessao();
  const conselho = await obterConselhoApi(token, id);

  return formatarConselho(conselho);
}

export async function criarConselho({
  titulo, categoria, categoriaId, conteudo,
}) {
  const token = await obterTokenSessao();
  const idCategoria = await resolverCategoria(token, categoriaId, categoria);

  const conselho = await criarConselhoApi(token, {
    titulo, categoriaId: idCategoria, conteudo,
  });

  return formatarConselho(conselho);
}

export async function atualizarConselho(
  id, { titulo, categoria, categoriaId, conteudo }
) {
  const token = await obterTokenSessao();
  const dados = {};

  if (titulo !== undefined) dados.titulo = titulo;
  if (conteudo !== undefined) dados.conteudo = conteudo;

  if (categoriaId !== undefined || categoria !== undefined) {
    dados.categoriaId = await resolverCategoria(token, categoriaId, categoria);
  }

  const conselho = await atualizarConselhoApi(token, id, dados);

  return formatarConselho(conselho);
}

export async function excluirConselho(id) {
  const token = await obterTokenSessao();
  await excluirConselhoApi(token, id);

  return true;
}

// ============================================================
// CURTIDAS
// ============================================================

export async function verificarCurtidaConselho(id) {
  const token = await obterTokenSessao();
  return verificarCurtidaConselhoApi(token, id);
}

export async function adicionarCurtidaConselho(id) {
  const token = await obterTokenSessao();
  return adicionarCurtidaConselhoApi(token, id);
}

export async function removerCurtidaConselho(id) {
  const token = await obterTokenSessao();
  return removerCurtidaConselhoApi(token, id);
}

// ============================================================
// COMENTÁRIOS
// ============================================================

export async function obterComentariosConselho(id) {
  const token = await obterTokenSessao();
  const comentarios = await obterComentariosConselhoApi(token, id);

  return comentarios.map(formatarComentario);
}

export async function criarComentarioConselho(id, conteudo) {
  const token = await obterTokenSessao();
  const resultado = await criarComentarioConselhoApi(token, id, { conteudo });

  return {
    ...resultado,
    comentario: formatarComentario(resultado.comentario),
  };
}

export async function atualizarComentarioConselho(
  id, comentarioId, conteudo
) {
  const token = await obterTokenSessao();

  const resultado = await atualizarComentarioConselhoApi(
    token, id, comentarioId, { conteudo }
  );

  return {
    ...resultado,
    comentario: formatarComentario(resultado.comentario),
  };
}

export async function excluirComentarioConselho(id, comentarioId) {
  const token = await obterTokenSessao();
  return excluirComentarioConselhoApi(token, id, comentarioId);
}

// ============================================================
// FOTOGRAFIAS
// ============================================================

export async function atualizarFotoConselho(id, imagem) {
  const token = await obterTokenSessao();
  const resultado = await atualizarFotoConselhoApi(token, id, imagem);

  return resultado.imagemUrl;
}

export async function removerFotoConselho(id) {
  const token = await obterTokenSessao();
  const resultado = await removerFotoConselhoApi(token, id);

  return resultado.imagemUrl;
}
