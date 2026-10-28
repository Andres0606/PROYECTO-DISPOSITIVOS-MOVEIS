// SERVICE — Armazenamento local e seguro

import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';

// CHAVES DE ARMAZENAMENTO

const CHAVE_TOKEN = 'interchapeco_token';
const CHAVE_USUARIO = 'interchapeco_usuario';
const CHAVE_FOTO = 'interchapeco_foto';
const CHAVE_LOCALIZACAO = 'interchapeco_localizacao';

// TOKEN — dado sensível: SecureStore

export async function salvarToken(token) {
  await SecureStore.setItemAsync(CHAVE_TOKEN, token);
}

export async function obterToken() {
  return SecureStore.getItemAsync(CHAVE_TOKEN);
}

export async function removerToken() {
  await SecureStore.deleteItemAsync(CHAVE_TOKEN);
}

// USUÁRIO — dado local não secreto: AsyncStorage

export async function salvarUsuario(usuario) {
  await AsyncStorage.setItem(
    CHAVE_USUARIO,
    JSON.stringify(usuario)
  );
}

export async function obterUsuario() {
  const usuarioSalvo = await AsyncStorage.getItem(
    CHAVE_USUARIO
  );

  if (!usuarioSalvo) {
    return null;
  }

  return JSON.parse(usuarioSalvo);
}

export async function removerUsuario() {
  await AsyncStorage.removeItem(CHAVE_USUARIO);
}

// FOTO — persistência local

export async function salvarFotoLocal(uri) {
  await AsyncStorage.setItem(
    CHAVE_FOTO,
    uri
  );
}

export async function obterFotoLocal() {
  return AsyncStorage.getItem(
    CHAVE_FOTO
  );
}

export async function removerFotoLocal() {
  await AsyncStorage.removeItem(
    CHAVE_FOTO
  );
}

// LOCALIZAÇÃO — persistência local

export async function salvarLocalizacao(localizacao) {
  await AsyncStorage.setItem(
    CHAVE_LOCALIZACAO,
    JSON.stringify(localizacao)
  );
}

export async function obterLocalizacaoSalva() {
  const localizacaoSalva =
    await AsyncStorage.getItem(
      CHAVE_LOCALIZACAO
    );

  if (!localizacaoSalva) {
    return null;
  }

  return JSON.parse(localizacaoSalva);
}

export async function removerLocalizacao() {
  await AsyncStorage.removeItem(
    CHAVE_LOCALIZACAO
  );
}

// PERFIL LOCAL — foto e localização

export async function limparPerfilLocal() {
  await Promise.all([
    removerFotoLocal(),
    removerLocalizacao(),
  ]);
}

// SESSÃO — remove autenticação e dados locais do perfil

export async function limparSessao() {
  await Promise.all([
    removerToken(),
    removerUsuario(),
    limparPerfilLocal(),
  ]);
}