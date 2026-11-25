// HOOK — Tema visual da aplicação

import { usePreferencias } from '../contexts/PreferenciasContext';

import { obterTema } from './index';

export function useTema() {
  const { tema } = usePreferencias();

  return obterTema(tema);
}