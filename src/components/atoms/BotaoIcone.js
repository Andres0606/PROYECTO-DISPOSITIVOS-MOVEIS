// ATOM — BotaoIcone (ícone de ação, ex.: lápis de editar)
import { Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { cores } from '../../theme';

export function BotaoIcone({ nome, aoPressionar, rotulo, tamanho = 16 }) {
  return (
    <Pressable
      onPress={aoPressionar}
      hitSlop={10}
      accessibilityRole="button"
      accessibilityLabel={rotulo}
      style={({ pressed }) => pressed && estilos.pressionado}
    >
      <Ionicons name={nome} size={tamanho} color={cores.texto} />
    </Pressable>
  );
}

const estilos = StyleSheet.create({
  pressionado: { opacity: 0.6 },
});