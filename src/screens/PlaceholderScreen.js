// SCREEN — Placeholder

import { StyleSheet, Text } from 'react-native';

import { ScreenTemplate } from '../components/templates/ScreenTemplate';

import { tipografia } from '../theme';
import { useTema } from '../theme/useTema';

export function PlaceholderScreen({ route }) {
  const { cores } = useTema();

  return (
    <ScreenTemplate
      titulo={route.params?.titulo ?? route.name}
    >
      <Text
        style={[
          estilos.texto,
          { color: cores.textoSecundario },
        ]}
      >
        Em breve.
      </Text>
    </ScreenTemplate>
  );
}

const estilos = StyleSheet.create({
  texto: {
    textAlign: 'center',
    fontSize: tipografia.corpo,
  },
});