// ATOM — Checkbox (quadrado de 18 px, preto quando marcado)
import { Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { cores } from '../../theme';

export function Checkbox({ marcado = false, aoAlternar }) {
  return (
    <Pressable
      onPress={aoAlternar}
      hitSlop={10}
      accessibilityRole="checkbox"
      accessibilityState={{ checked: marcado }}
      style={[estilos.caixa, marcado && estilos.marcada]}
    >
      {marcado && <Ionicons name="checkmark" size={14} color={cores.superficie} />}
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
    borderColor: cores.texto,
    backgroundColor: cores.superficie,
  },
  marcada: { backgroundColor: cores.texto },
});