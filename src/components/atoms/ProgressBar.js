// ATOM — ProgressBar (barra de progresso de 0 a 1)
import { StyleSheet, View } from 'react-native';
import { cores } from '../../theme';

export function ProgressBar({ valor = 0, altura = 6 }) {
  const numero = Number.isFinite(valor) ? valor : 0;
  const proporcao = Math.min(Math.max(numero, 0), 1);

  return (
    <View
      accessibilityRole="progressbar"
      accessibilityValue={{ min: 0, max: 100, now: Math.round(proporcao * 100) }}
      style={[estilos.trilha, { height: altura, borderRadius: altura / 2 }]}
    >
      <View
        style={[
          estilos.preenchimento,
          { width: `${proporcao * 100}%`, borderRadius: altura / 2 },
        ]}
      />
    </View>
  );
}

const estilos = StyleSheet.create({
  trilha: {
    width: '100%',
    overflow: 'hidden',
    backgroundColor: cores.superficieSecundaria,
  },
  preenchimento: {
    height: '100%',
    backgroundColor: cores.texto,
  },
});