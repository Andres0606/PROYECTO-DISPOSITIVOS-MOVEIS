// ATOM — BotaoFlutuante

import { Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { useTema } from '../../theme/useTema';

export function BotaoFlutuante({
  aoPressionar,
  rotulo = 'Adicionar',
}) {
  const { cores } = useTema();

  return (
    <Pressable
      onPress={aoPressionar}
      hitSlop={8}
      accessibilityRole="button"
      accessibilityLabel={rotulo}
      style={({ pressed }) =>
        pressed && estilos.pressionado
      }
    >
      <Ionicons
        name="add-circle-outline"
        size={38}
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