// CONTEXT — Preferências globais do usuário

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
} from 'react';

import {
  atualizarConfiguracoes,
} from '../services/auth';

import {
  IDIOMA_PADRAO,
  normalizarIdioma,
  traduzir,
} from '../i18n';

// CONFIGURAÇÕES PADRÃO

const preferenciasPadrao = {
  idioma: IDIOMA_PADRAO,
  tema: 'claro',
};

const PreferenciasContext = createContext(null);

// PROVIDER

export function PreferenciasProvider({ children }) {
  const [preferencias, setPreferencias] =
    useState(preferenciasPadrao);

  // CARREGAR PREFERÊNCIAS

  const carregarPreferencias = useCallback((usuario) => {
    setPreferencias({
      idioma: normalizarIdioma(usuario?.idioma),
      tema: usuario?.tema ?? 'claro',
    });
  }, []);

  // ALTERAR IDIOMA

  const alterarIdioma = useCallback(async (idioma) => {
    const resultado =
      await atualizarConfiguracoes({
        idioma: normalizarIdioma(idioma),
      });

    setPreferencias({
      idioma: normalizarIdioma(resultado.idioma),
      tema: resultado.tema,
    });

    return resultado;
  }, []);

  // ALTERAR TEMA

  const alterarTema = useCallback(async (tema) => {
    const resultado =
      await atualizarConfiguracoes({
        tema,
      });

    setPreferencias({
      idioma: normalizarIdioma(resultado.idioma),
      tema: resultado.tema,
    });

    return resultado;
  }, []);

  // RESTAURAR PREFERÊNCIAS

  const restaurarPreferencias = useCallback(() => {
    setPreferencias(preferenciasPadrao);
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

    alterarTema,

    restaurarPreferencias,

    t,
  }), [
    preferencias,
    carregarPreferencias,
    alterarIdioma,
    alterarTema,
    restaurarPreferencias,
    t,
  ]);

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