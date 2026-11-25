// ATOM — Card

import {
  StyleSheet,
  View,
} from 'react-native';

import {
  espacamentos,
  raios,
} from '../../theme';

import { useTema } from '../../theme/useTema';

export function Card({
  children,
  style,
}) {
  const { cores } = useTema();

  return (
    <View
      style={[
        estilos.card,
        {
          borderColor: cores.borda,
          backgroundColor: cores.superficie,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}

const estilos = StyleSheet.create({
  card: {
    minHeight: 74,
    padding: espacamentos.md,
    borderRadius: raios.sm,
    borderWidth: 1,
  },
});