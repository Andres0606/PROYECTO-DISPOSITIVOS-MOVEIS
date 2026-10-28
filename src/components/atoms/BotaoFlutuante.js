// ATOM — BotaoFlutuante (botão "+" circular; a posição é dada pelo ScreenTemplate)
import { Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { cores } from '../../theme';

export function BotaoFlutuante({ aoPressionar, rotulo = 'Adicionar' }) {
  return (
    <Pressable
      onPress={aoPressionar}
      hitSlop={8}
      accessibilityRole="button"
      accessibilityLabel={rotulo}
      style={({ pressed }) => pressed && estilos.pressionado}
    >
      <Ionicons name="add-circle-outline" size={38} color={cores.texto} />
    </Pressable>
  );
}

const estilos = StyleSheet.create({
  pressionado: { opacity: 0.6 },
});