// ATOM — BotaoIcone

import { Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { useTema } from '../../theme/useTema';

export function BotaoIcone({
  nome,
  aoPressionar,
  rotulo,
  tamanho = 16,
}) {
  const { cores } = useTema();

  return (
    <Pressable
      onPress={aoPressionar}
      hitSlop={10}
      accessibilityRole="button"
      accessibilityLabel={rotulo}
      style={({ pressed }) =>
        pressed && estilos.pressionado
      }
    >
      <Ionicons
        name={nome}
        size={tamanho}
        color={cores.texto}
      />
    </Pressable>
  );
}

const estilos = StyleSheet.create({
  pressionado: {
    opacity: 0.6,
  },
});