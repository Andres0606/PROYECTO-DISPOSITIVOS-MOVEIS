// ATOM — Chip (atalho outlined, 32 px de altura)
import { Pressable, StyleSheet, Text } from 'react-native';
import { cores, espacamentos, raios, tipografia } from '../../theme';

export function Chip({ titulo, aoPressionar }) {
  return (
    <Pressable
      onPress={aoPressionar}
      accessibilityRole="button"
      style={({ pressed }) => [estilos.chip, pressed && estilos.pressionado]}
    >
      <Text style={estilos.titulo}>{titulo}</Text>
    </Pressable>
  );
}

const estilos = StyleSheet.create({
  chip: {
    height: 32,
    justifyContent: 'center',
    paddingHorizontal: espacamentos.md - 2,
    borderRadius: raios.sm,
    borderWidth: 1,
    borderColor: cores.chipBorda,
    backgroundColor: 'transparent',
  },
  pressionado: { opacity: 0.6 },
  titulo: {
    fontSize: tipografia.corpo,
    fontWeight: '500',
    color: cores.chipTexto,
  },
});