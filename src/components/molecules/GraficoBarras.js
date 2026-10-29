// MOLECULE — GraficoBarras (colunas com altura proporcional ao valor)
// dados: [{ rotulo: 'Alimentação', valor: 520 }, ...]
import { StyleSheet, Text, View } from 'react-native';
import { formatarReais } from '../../utils/formatacao';
import { cores, espacamentos, tipografia } from '../../theme';

const ALTURA_MINIMA = 8; // para que valores pequenos continuem visíveis

export function GraficoBarras({ dados, alturaMaxima = 87 }) {
  const maior = Math.max(...dados.map((item) => item.valor), 0);

  return (
    <View style={estilos.grafico}>
      {dados.map((item) => {
        const proporcao = maior > 0 ? item.valor / maior : 0;
        const altura = Math.max(proporcao * alturaMaxima, ALTURA_MINIMA);

        return (
          <View key={item.rotulo} style={estilos.coluna}>
            <View style={[estilos.area, { height: alturaMaxima }]}>
              <View
                accessible
                accessibilityLabel={`${item.rotulo}: ${formatarReais(item.valor)}`}
                style={[estilos.barra, { height: altura }]}
              />
            </View>

            <Text
              style={estilos.rotulo}
              numberOfLines={1}
              adjustsFontSizeToFit
              minimumFontScale={0.8}
            >
              {item.rotulo}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

const estilos = StyleSheet.create({
  grafico: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  coluna: {
    flex: 1,
    alignItems: 'center',
    gap: espacamentos.xs + 2,
  },
  // Área de altura fixa: as barras crescem a partir da base.
  area: {
    justifyContent: 'flex-end',
  },
  barra: {
    width: 28,
    borderRadius: 6,
    backgroundColor: cores.texto,
  },
  rotulo: {
    fontSize: tipografia.legenda,
    color: cores.textoSecundario,
  },
});