// SCREEN — Placeholder (aba ainda não construída; será substituída por cada tela real)
import { StyleSheet, Text } from 'react-native';
import { ScreenTemplate } from '../components/templates/ScreenTemplate';
import { cores, tipografia } from '../theme';

export function PlaceholderScreen({ route }) {
  return (
    <ScreenTemplate titulo={route.params?.titulo ?? route.name}>
      <Text style={estilos.texto}>Em breve.</Text>
    </ScreenTemplate>
  );
}

const estilos = StyleSheet.create({
  texto: {
    textAlign: 'center',
    fontSize: tipografia.corpo,
    color: cores.textoSecundario,
  },
});