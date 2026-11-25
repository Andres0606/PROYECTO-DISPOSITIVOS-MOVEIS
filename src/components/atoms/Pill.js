// ATOM — Pill

import { useMemo } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';

import { raios, tipografia } from '../../theme';
import { useTema } from '../../theme/useTema';

export function Pill({
  titulo,
  selecionado = false,
  aoPressionar,
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
      accessibilityState={{ selected: selecionado }}
      style={({ pressed }) => [
        estilos.pill,
        selecionado && estilos.pillSelecionada,
        pressed && estilos.pressionada,
      ]}
    >
      <Text
        style={[
          estilos.titulo,
          selecionado && estilos.tituloSelecionado,
        ]}
      >
        {titulo}
      </Text>
    </Pressable>
  );
}

function criarEstilos(cores) {
  return StyleSheet.create({
    pill: {
      height: 32,
      justifyContent: 'center',
      paddingHorizontal: 14,
      borderRadius: raios.pill,
      borderWidth: 1,
      borderColor: cores.pillBorda,
      backgroundColor: cores.superficie,
    },

    pillSelecionada: {
      borderColor: cores.pillSelecionado,
      backgroundColor: cores.pillSelecionado,
    },

    pressionada: {
      opacity: 0.7,
    },

    titulo: {
      fontSize: tipografia.corpo,
      fontWeight: '500',
      color: cores.texto,
    },

    tituloSelecionado: {
      color: cores.textoBotaoPrincipal,
    },
  });
}