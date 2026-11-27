// SERVICE — Armazenamento local e seguro

import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';

// CHAVES DE ARMAZENAMENTO

const CHAVE_TOKEN = 'interchapeco_token';
const CHAVE_USUARIO = 'interchapeco_usuario';
const CHAVE_FOTO = 'interchapeco_foto';
const CHAVE_LOCALIZACAO = 'interchapeco_localizacao';

// ARMAZENAMENTO SEGURO

async function salvarDado(chave, valor) {
  await SecureStore.setItemAsync(chave, valor);
  await AsyncStorage.removeItem(chave);
}

async function obterDado(chave) {
  const valor = await SecureStore.getItemAsync(chave);

  if (valor !== null) {
    return valor;
  }

  // Migrar dados das versões anteriores

  const valorAnterior = await AsyncStorage.getItem(chave);

  if (valorAnterior !== null) {
    await salvarDado(chave, valorAnterior);
  }

  return valorAnterior;
}

async function removerDado(chave) {
  await Promise.all([
    SecureStore.deleteItemAsync(chave),
    AsyncStorage.removeItem(chave),
  ]);
}

// TOKEN

export async function salvarToken(token) {
  await SecureStore.setItemAsync(CHAVE_TOKEN, token);
}

export async function obterToken() {
  return SecureStore.getItemAsync(CHAVE_TOKEN);
}

export async function removerToken() {
  await removerDado(CHAVE_TOKEN);
}

// USUÁRIO

export async function salvarUsuario(usuario) {
  await salvarDado(
    CHAVE_USUARIO,
    JSON.stringify(usuario)
  );
}

export async function obterUsuario() {
  const usuario = await obterDado(CHAVE_USUARIO);

  return usuario ? JSON.parse(usuario) : null;
}

export async function removerUsuario() {
  await removerDado(CHAVE_USUARIO);
}

// FOTO LOCAL

export async function salvarFotoLocal(uri) {
  await salvarDado(CHAVE_FOTO, uri);
}

export async function obterFotoLocal() {
  return obterDado(CHAVE_FOTO);
}

export async function removerFotoLocal() {
  await removerDado(CHAVE_FOTO);
}

// LOCALIZAÇÃO

export async function salvarLocalizacao(localizacao) {
  await salvarDado(
    CHAVE_LOCALIZACAO,
    JSON.stringify(localizacao)
  );
}

export async function obterLocalizacaoSalva() {
  const localizacao = await obterDado(CHAVE_LOCALIZACAO);

  return localizacao ? JSON.parse(localizacao) : null;
}

export async function removerLocalizacao() {
  await removerDado(CHAVE_LOCALIZACAO);
}

// PERFIL LOCAL

export async function limparPerfilLocal() {
  await Promise.all([
    removerFotoLocal(),
    removerLocalizacao(),
  ]);
}

// SESSÃO

export async function limparSessao() {
  await Promise.all([
    removerToken(),
    removerUsuario(),
    limparPerfilLocal(),
  ]);
}