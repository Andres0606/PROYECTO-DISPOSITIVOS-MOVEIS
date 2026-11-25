// MOLECULE — CardLocal

import { useMemo } from 'react';

import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { Card } from '../atoms/Card';
import { FotoLocal } from '../atoms/FotoLocal';

import { tipografia } from '../../theme';
import { useTema } from '../../theme/useTema';

export function CardLocal({
  nome,
  detalhe,
  imagem,
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

        <FotoLocal
          imagem={imagem}
          style={estilos.foto}
        />

        <View style={estilos.textos}>

          <Text
            style={estilos.nome}
            numberOfLines={2}
          >
            {nome}
          </Text>

          <Text
            style={estilos.detalhe}
            numberOfLines={1}
          >
            {detalhe}
          </Text>

        </View>

      </Card>
    </Pressable>
  );
}

function criarEstilos(cores) {
  return StyleSheet.create({
    card: {
      minHeight: 112,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 11,
      padding: 5,
    },

    foto: {
      width: 120,
      height: 94,
      borderRadius: 4,
    },

    textos: {
      flex: 1,
    },

    nome: {
      fontSize: tipografia.subtitulo,
      lineHeight: 24,
      fontWeight: '600',
      color: cores.texto,
    },

    detalhe: {
      fontSize: tipografia.corpo,
      lineHeight: 21,
      color: cores.textoSecundario,
    },

    pressionado: {
      opacity: 0.7,
    },
  });
}