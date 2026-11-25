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

// ============================================================
// CONFIGURAÇÕES PADRÃO
// ============================================================

const preferenciasPadrao = {
  idioma: 'pt-BR',
  tema: 'claro',
};

const PreferenciasContext = createContext(null);

// ============================================================
// PROVIDER
// ============================================================

export function PreferenciasProvider({ children }) {
  const [preferencias, setPreferencias] =
    useState(preferenciasPadrao);

  // ==========================================================
  // CARREGAR PREFERÊNCIAS DO USUÁRIO
  // ==========================================================

  const carregarPreferencias = useCallback((usuario) => {
    setPreferencias({
      idioma: usuario?.idioma ?? 'pt-BR',
      tema: usuario?.tema ?? 'claro',
    });
  }, []);

  // ==========================================================
  // ALTERAR IDIOMA
  // ==========================================================

  const alterarIdioma = useCallback(async (idioma) => {
    const resultado =
      await atualizarConfiguracoes({
        idioma,
      });

    setPreferencias({
      idioma: resultado.idioma,
      tema: resultado.tema,
    });

    return resultado;
  }, []);

  // ==========================================================
  // ALTERAR TEMA
  // ==========================================================

  const alterarTema = useCallback(async (tema) => {
    const resultado =
      await atualizarConfiguracoes({
        tema,
      });

    setPreferencias({
      idioma: resultado.idioma,
      tema: resultado.tema,
    });

    return resultado;
  }, []);

  // ==========================================================
  // RESTAURAR PREFERÊNCIAS
  // ==========================================================

  const restaurarPreferencias = useCallback(() => {
    setPreferencias(preferenciasPadrao);
  }, []);

  // ==========================================================
  // VALORES DO CONTEXTO
  // ==========================================================

  const valor = useMemo(() => ({
    idioma: preferencias.idioma,

    tema: preferencias.tema,

    temaEscuro:
      preferencias.tema === 'escuro',

    carregarPreferencias,

    alterarIdioma,

    alterarTema,

    restaurarPreferencias,
  }), [
    preferencias,
    carregarPreferencias,
    alterarIdioma,
    alterarTema,
    restaurarPreferencias,
  ]);

  return (
    <PreferenciasContext.Provider value={valor}>
      {children}
    </PreferenciasContext.Provider>
  );
}

// ============================================================
// HOOK — UTILIZAR PREFERÊNCIAS
// ============================================================

export function usePreferencias() {
  const contexto = useContext(PreferenciasContext);

  if (!contexto) {
    throw new Error(
      'usePreferencias deve ser utilizado dentro de PreferenciasProvider.'
    );
  }

  return contexto;
}