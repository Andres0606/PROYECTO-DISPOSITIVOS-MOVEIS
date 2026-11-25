// ATOM — Checkbox

import { Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { useTema } from '../../theme/useTema';

export function Checkbox({
  marcado = false,
  aoAlternar,
}) {
  const { cores } = useTema();

  return (
    <Pressable
      onPress={aoAlternar}
      hitSlop={10}
      accessibilityRole="checkbox"
      accessibilityState={{ checked: marcado }}
      style={[
        estilos.caixa,

        {
          borderColor: cores.texto,
          backgroundColor: cores.superficie,
        },

        marcado && {
          backgroundColor: cores.texto,
        },
      ]}
    >
      {marcado && (
        <Ionicons
          name="checkmark"
          size={14}
          color={cores.superficie}
        />
      )}
    </Pressable>
  );
}

const estilos = StyleSheet.create({
  caixa: {
    width: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
});