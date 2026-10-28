// ATOM — Etiqueta (tag estática de 32 px, sem ação de toque)
import { StyleSheet, Text, View } from 'react-native';
import { cores, raios, tipografia } from '../../theme';

export function Etiqueta({ titulo }) {
  return (
    <View style={estilos.etiqueta}>
      <Text style={estilos.titulo}>{titulo}</Text>
    </View>
  );
}

const estilos = StyleSheet.create({
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