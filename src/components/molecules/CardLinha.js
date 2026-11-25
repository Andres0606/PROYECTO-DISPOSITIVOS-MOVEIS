// MOLECULE — CardLinha

import { useMemo } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';

import { Card } from '../atoms/Card';

import { espacamentos, tipografia } from '../../theme';
import { useTema } from '../../theme/useTema';

export function CardLinha({
  titulo,
  detalhe,
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
      style={({ pressed }) =>
        pressed && estilos.pressionado
      }
    >
      <Card style={estilos.card}>

        <Text
          style={estilos.titulo}
          numberOfLines={1}
        >
          {titulo}
        </Text>

        {!!detalhe && (
          <Text style={estilos.detalhe}>
            {detalhe} ›
          </Text>
        )}

      </Card>
    </Pressable>
  );
}

function criarEstilos(cores) {
  return StyleSheet.create({
    card: {
      minHeight: 48,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: espacamentos.sm,
      paddingVertical: 0,
      paddingHorizontal: 12,
    },

    titulo: {
      flexShrink: 1,
      fontSize: tipografia.botao,
      fontWeight: '600',
      color: cores.texto,
    },

    detalhe: {
      fontSize: tipografia.subtitulo,
      color: cores.textoSecundario,
    },

    pressionado: {
      opacity: 0.7,
    },
  });
}