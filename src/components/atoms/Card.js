// ATOM — Card (contêiner branco com borda, usado nas telas internas)
import { StyleSheet, View } from 'react-native';
import { cores, espacamentos, raios } from '../../theme';

export function Card({ children, style }) {
  return <View style={[estilos.card, style]}>{children}</View>;
}

const estilos = StyleSheet.create({
  card: {
    minHeight: 74,
    padding: espacamentos.md,
    borderRadius: raios.sm,
    borderWidth: 1,
    borderColor: cores.borda,
    backgroundColor: cores.superficie,
  },
});