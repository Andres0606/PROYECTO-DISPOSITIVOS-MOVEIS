// MOLECULE — LinhaValor

import { StyleSheet, Text, View } from 'react-native';

import { tipografia } from '../../theme';
import { useTema } from '../../theme/useTema';

export function LinhaValor({
  rotulo,
  valor,
}) {
  const { cores } = useTema();

  return (
    <View style={estilos.linha}>

      <Text
        style={[
          estilos.rotulo,
          { color: cores.textoSecundario },
        ]}
      >
        {rotulo}
      </Text>

      <Text
        style={[
          estilos.valor,
          { color: cores.texto },
        ]}
      >
        {valor}
      </Text>

    </View>
  );
}

const estilos = StyleSheet.create({
  linha: {
    minHeight: 25,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  rotulo: {
    fontSize: tipografia.legenda,
  },

  valor: {
    fontSize: tipografia.corpo,
    fontWeight: '600',
  },
});