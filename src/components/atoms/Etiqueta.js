// ATOM — Etiqueta

import { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { raios, tipografia } from '../../theme';
import { useTema } from '../../theme/useTema';

export function Etiqueta({ titulo }) {
  const { cores } = useTema();

  const estilos = useMemo(
    () => criarEstilos(cores),
    [cores]
  );

  return (
    <View style={estilos.etiqueta}>
      <Text style={estilos.titulo}>
        {titulo}
      </Text>
    </View>
  );
}

function criarEstilos(cores) {
  return StyleSheet.create({
    etiqueta: {
      height: 32,
      justifyContent: 'center',
      paddingHorizontal: 14,
      borderRadius: raios.pill,
      borderWidth: 1,
      borderColor: cores.divisor,
      backgroundColor: cores.superficie,
    },

    titulo: {
      fontSize: tipografia.corpo,
      fontWeight: '500',
      color: cores.texto,
    },
  });
}