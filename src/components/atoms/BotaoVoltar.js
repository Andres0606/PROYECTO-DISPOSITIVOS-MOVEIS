// ATOM — BotaoVoltar (chevron "voltar" das telas internas)
import { Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { cores } from '../../theme';

export function BotaoVoltar({ aoPressionar, style }) {
  return (
    <Pressable
      onPress={aoPressionar}
      hitSlop={12}
      accessibilityRole="button"
      accessibilityLabel="Voltar"
      style={({ pressed }) => [estilos.botao, pressed && estilos.pressionado, style]}
    >
      <Ionicons name="chevron-back" size={24} color={cores.texto} />
    </Pressable>
  );
}

const estilos = StyleSheet.create({
  botao: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressionado: { opacity: 0.6 },
});