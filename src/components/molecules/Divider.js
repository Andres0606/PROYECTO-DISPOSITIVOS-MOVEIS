// MOLECULE — Divider

import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { espacamentos, tipografia } from '../../theme';
import { useTema } from '../../theme/useTema';

export function Divider({ texto = '' }) {
  const { cores } = useTema();

  const estiloTraco = [
    estilos.traco,
    { backgroundColor: cores.divisor },
  ];

  if (!texto) {
    return <View style={estiloTraco} />;
  }

  return (
    <View style={estilos.linha}>

      <View
        style={[
          estiloTraco,
          estilos.flexivel,
        ]}
      />

      <Text
        style={[
          estilos.texto,
          { color: cores.textoSecundario },
        ]}
      >
        {texto}
      </Text>

      <View
        style={[
          estiloTraco,
          estilos.flexivel,
        ]}
      />

    </View>
  );
}

const estilos = StyleSheet.create({
  linha: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: espacamentos.sm,
  },

  traco: {
    height: 1,
  },

  flexivel: {
    flex: 1,
  },

  texto: {
    fontSize: tipografia.corpo,
  },
});