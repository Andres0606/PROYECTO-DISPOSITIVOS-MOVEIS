// ATOM — Chip

import { useMemo } from 'react';

import {
  Pressable,
  StyleSheet,
  Text,
} from 'react-native';

import {
  espacamentos,
  raios,
  tipografia,
} from '../../theme';

import { useTema } from '../../theme/useTema';

export function Chip({
  titulo,
  aoPressionar,
  variante = 'contorno',
}) {
  const { cores } = useTema();

  const estilos = useMemo(
    () => criarEstilos(cores),
    [cores]
  );

  return (
    <Pressable
      onPress={aoPressionar}

      accessibilityRole="button"

      style={({ pressed }) => [
        estilos.chip,
        estilos[variante],
        pressed && estilos.pressionado,
      ]}
    >
      <Text
        style={[
          estilos.titulo,

          variante === 'suave' &&
            estilos.tituloSuave,

          variante === 'selecionado' &&
            estilos.tituloSelecionado,
        ]}
      >
        {titulo}
      </Text>
    </Pressable>
  );
}

// ============================================================
// ESTILOS DINÂMICOS
// ============================================================

function criarEstilos(cores) {
  return StyleSheet.create({
    chip: {
      height: 32,
      justifyContent: 'center',
      paddingHorizontal: espacamentos.md - 2,
      borderRadius: raios.sm,
      borderWidth: 1,
    },

    contorno: {
      borderColor: cores.chipBorda,
      backgroundColor: 'transparent',
    },

    suave: {
      borderColor: cores.decoracaoClara,
      backgroundColor: cores.decoracaoClara,
    },

    selecionado: {
      borderColor: cores.pillSelecionado,
      backgroundColor: cores.pillSelecionado,
    },

    pressionado: {
      opacity: 0.6,
    },

    titulo: {
      fontSize: tipografia.corpo,
      fontWeight: '500',
      color: cores.chipTexto,
    },

    tituloSuave: {
      color: cores.textoSecundario,
    },

    tituloSelecionado: {
      color: cores.textoBotaoPrincipal,
    },
  });
}