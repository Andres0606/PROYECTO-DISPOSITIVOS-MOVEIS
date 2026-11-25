// ATOM — ProgressBar

import { StyleSheet, View } from 'react-native';

import { useTema } from '../../theme/useTema';

export function ProgressBar({
  valor = 0,
  altura = 6,
}) {
  const { cores } = useTema();

  const numero =
    Number.isFinite(valor) ? valor : 0;

  const proporcao =
    Math.min(Math.max(numero, 0), 1);

  return (
    <View
      accessibilityRole="progressbar"

      accessibilityValue={{
        min: 0,
        max: 100,
        now: Math.round(proporcao * 100),
      }}

      style={[
        estilos.trilha,
        {
          height: altura,
          borderRadius: altura / 2,
          backgroundColor: cores.superficieSecundaria,
        },
      ]}
    >
      <View
        style={[
          estilos.preenchimento,
          {
            width: `${proporcao * 100}%`,
            borderRadius: altura / 2,
            backgroundColor: cores.texto,
          },
        ]}
      />
    </View>
  );
}

const estilos = StyleSheet.create({
  trilha: {
    width: '100%',
    overflow: 'hidden',
  },

  preenchimento: {
    height: '100%',
  },
});