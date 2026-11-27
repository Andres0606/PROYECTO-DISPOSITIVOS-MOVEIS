// HOOK — Localização ao acessar os locais

import { useCallback, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';

import {
  obterPosicaoExplorar,
} from '../services/geolocalizacao';

export function usePosicaoExplorar() {
  const [posicao, setPosicao] = useState(null);
  const [obtendoPosicao, setObtendoPosicao] = useState(true);

  useFocusEffect(
    useCallback(() => {
      let ativo = true;

      setPosicao(null);
      setObtendoPosicao(true);

      async function carregarPosicao() {
        try {
          const resultado =
            await obterPosicaoExplorar();

          if (ativo) {
            setPosicao(resultado);
          }
        } finally {
          if (ativo) {
            setObtendoPosicao(false);
          }
        }
      }

      carregarPosicao();

      return () => {
        ativo = false;
      };
    }, [])
  );

  return {
    posicao,
    obtendoPosicao,
  };
}