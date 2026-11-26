// MOLECULE — BotaoSegmentado

import { useMemo } from 'react';

import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { raios, tipografia } from '../../theme';
import { useTema } from '../../theme/useTema';

export function BotaoSegmentado({
  opcoes,
  valor,
  aoMudar,
}) {
  const { cores } = useTema();

  const estilos = useMemo(
    () => criarEstilos(cores),
    [cores]
  );

  return (
    <View style={estilos.grupo}>

      {opcoes.map((opcao, indice) => {
        const selecionado = opcao.valor === valor;

        return (
          <Pressable
            key={opcao.valor}
            onPress={() => aoMudar(opcao.valor)}
            accessibilityRole="button"
            accessibilityState={{ selected: selecionado }}
            style={[
              estilos.segmento,
              indice > 0 && estilos.separador,
              selecionado && estilos.selecionado,
            ]}
          >
            <Text
              style={estilos.titulo}
              numberOfLines={1}
              adjustsFontSizeToFit
              minimumFontScale={0.75}
            >
              {opcao.titulo}
            </Text>
          </Pressable>
        );
      })}

    </View>
  );
}

function criarEstilos(cores) {
  return StyleSheet.create({
    grupo: {
      height: 40,
      flexDirection: 'row',
      overflow: 'hidden',
      borderRadius: raios.pill,
      borderWidth: 1,
      borderColor: cores.segmentoBorda,
    },

    segmento: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 4,
    },

    separador: {
      borderLeftWidth: 1,
      borderLeftColor: cores.segmentoBorda,
    },

    selecionado: {
      backgroundColor: cores.segmentoSelecionado,
    },

    titulo: {
      fontSize: tipografia.corpo,
      fontWeight: '500',
      color: cores.chipTexto,
      textAlign: 'center',
    },
  });
}