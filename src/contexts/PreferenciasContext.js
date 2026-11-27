// CONTEXT — Preferências globais do usuário

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  useEffect,
} from 'react';

import { ActivityIndicator, View } from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  atualizarConfiguracoes,
} from '../services/auth';

import {
  IDIOMA_PADRAO,
  normalizarIdioma,
  traduzir,
} from '../i18n';

// CONFIGURAÇÕES PADRÃO

const CHAVE_IDIOMA = 'interchapeco_idioma';

const preferenciasPadrao = {
  idioma: IDIOMA_PADRAO,
  tema: 'claro',
};

const PreferenciasContext = createContext(null);

// ARMAZENAMENTO DO IDIOMA

let filaIdioma = Promise.resolve();

function salvarIdiomaLocal(idioma) {
  filaIdioma = filaIdioma
    .then(() =>
      AsyncStorage.setItem(
        CHAVE_IDIOMA,
        normalizarIdioma(idioma)
      )
    )
    .catch(() => {
      console.warn('Não foi possível salvar o idioma local.');
    });

  return filaIdioma;
}

// PROVIDER

export function PreferenciasProvider({ children }) {
  const [preferencias, setPreferencias] =
    useState(preferenciasPadrao);

  const [inicializado, setInicializado] =
    useState(false);

  // CARREGAR IDIOMA LOCAL

  useEffect(() => {
    let ativo = true;

    async function carregarIdiomaLocal() {
      try {
        const idiomaSalvo =
          await AsyncStorage.getItem(CHAVE_IDIOMA);

        if (ativo && idiomaSalvo) {
          setPreferencias(atual => ({
            ...atual,
            idioma: normalizarIdioma(idiomaSalvo),
          }));
        }
      } catch {
        console.warn('Não foi possível carregar o idioma local.');
      } finally {
        if (ativo) {
          setInicializado(true);
        }
      }
    }

    carregarIdiomaLocal();

    return () => {
      ativo = false;
    };
  }, []);

  // ALTERAR IDIOMA ANTES DO LOGIN

  const alterarIdiomaLocal = useCallback(async (idioma) => {
    const idiomaValido = normalizarIdioma(idioma);

    setPreferencias(atual => ({
      ...atual,
      idioma: idiomaValido,
    }));

    await salvarIdiomaLocal(idiomaValido);
  }, []);

  // CARREGAR PREFERÊNCIAS DA CONTA

  const carregarPreferencias = useCallback((usuario) => {
    const idioma = normalizarIdioma(usuario?.idioma);

    setPreferencias({
      idioma,
      tema: usuario?.tema ?? 'claro',
    });

    salvarIdiomaLocal(idioma);
  }, []);

  // ALTERAR IDIOMA DA CONTA

  const alterarIdioma = useCallback(async (idioma) => {
    const resultado =
      await atualizarConfiguracoes({
        idioma: normalizarIdioma(idioma),
      });

    const idiomaValido =
      normalizarIdioma(resultado.idioma);

    setPreferencias({
      idioma: idiomaValido,
      tema: resultado.tema,
    });

    await salvarIdiomaLocal(idiomaValido);

    return resultado;
  }, []);

  // ALTERAR TEMA

  const alterarTema = useCallback(async (tema) => {
    const resultado =
      await atualizarConfiguracoes({
        tema,
      });

    const idiomaValido =
      normalizarIdioma(resultado.idioma);

    setPreferencias({
      idioma: idiomaValido,
      tema: resultado.tema,
    });

    await salvarIdiomaLocal(idiomaValido);

    return resultado;
  }, []);

  // RESTAURAR PREFERÊNCIAS SEM PERDER O IDIOMA

  const restaurarPreferencias = useCallback(() => {
    setPreferencias(atual => ({
      ...preferenciasPadrao,
      idioma: atual.idioma,
    }));
  }, []);

  // TRADUÇÃO

  const t = useCallback(
    (chave, parametros) =>
      traduzir(
        preferencias.idioma,
        chave,
        parametros
      ),
    [preferencias.idioma]
  );

  // VALORES DO CONTEXTO

  const valor = useMemo(() => ({
    idioma: preferencias.idioma,

    tema: preferencias.tema,

    temaEscuro:
      preferencias.tema === 'escuro',

    carregarPreferencias,

    alterarIdioma,

    alterarIdiomaLocal,

    alterarTema,

    restaurarPreferencias,

    t,
  }), [
    preferencias,
    carregarPreferencias,
    alterarIdioma,
    alterarIdiomaLocal,
    alterarTema,
    restaurarPreferencias,
    t,
  ]);

  // AGUARDAR O CARREGAMENTO INICIAL

  if (!inicializado) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#FFFFFF',
        }}
      >
        <ActivityIndicator
          size="large"
          color="#333333"
        />
      </View>
    );
  }

  return (
    <PreferenciasContext.Provider value={valor}>
      {children}
    </PreferenciasContext.Provider>
  );
}

// HOOK — UTILIZAR PREFERÊNCIAS

export function usePreferencias() {
  const contexto = useContext(PreferenciasContext);

  if (!contexto) {
    throw new Error(
      'usePreferencias deve ser utilizado dentro de PreferenciasProvider.'
    );
  }

  return contexto;
}