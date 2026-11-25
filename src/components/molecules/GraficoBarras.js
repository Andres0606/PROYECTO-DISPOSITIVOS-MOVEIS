// MOLECULE — GraficoBarras

import { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { formatarReais } from '../../utils/formatacao';

import { espacamentos, tipografia } from '../../theme';
import { useTema } from '../../theme/useTema';

const ALTURA_MINIMA = 8;

export function GraficoBarras({
  dados,
  alturaMaxima = 87,
}) {
  const { cores } = useTema();

  const estilos = useMemo(
    () => criarEstilos(cores),
    [cores]
  );

  const maior = Math.max(
    ...dados.map((item) => item.valor),
    0
  );

  return (
    <View style={estilos.grafico}>

      {dados.map((item) => {
        const proporcao =
          maior > 0 ? item.valor / maior : 0;

        const altura = Math.max(
          proporcao * alturaMaxima,
          ALTURA_MINIMA
        );

        return (
          <View
            key={item.rotulo}
            style={estilos.coluna}
          >
            <View
              style={[
                estilos.area,
                { height: alturaMaxima },
              ]}
            >
              <View
                accessible
                accessibilityLabel={
                  `${item.rotulo}: ${formatarReais(item.valor)}`
                }
                style={[
                  estilos.barra,
                  { height: altura },
                ]}
              />
            </View>

            <Text
              style={estilos.rotulo}
              numberOfLines={1}
              adjustsFontSizeToFit
              minimumFontScale={0.8}
            >
              {item.rotulo}
            </Text>

          </View>
        );
      })}

    </View>
  );
}

function criarEstilos(cores) {
  return StyleSheet.create({
    grafico: {
      flexDirection: 'row',
      alignItems: 'flex-end',
    },

    coluna: {
      flex: 1,
      alignItems: 'center',
      gap: espacamentos.xs + 2,
    },

    area: {
      justifyContent: 'flex-end',
    },

    barra: {
      width: 28,
      borderRadius: 6,
      backgroundColor: cores.texto,
    },

    rotulo: {
      fontSize: tipografia.legenda,
      color: cores.textoSecundario,
    },
  });
}