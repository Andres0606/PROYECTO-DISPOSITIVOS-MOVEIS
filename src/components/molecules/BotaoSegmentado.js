// MOLECULE — BotaoSegmentado (alterna entre 2 ou mais visões)
// opcoes: [{ valor: 'lista', titulo: 'Lista' }, ...]
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { cores, raios, tipografia } from '../../theme';

export function BotaoSegmentado({ opcoes, valor, aoMudar }) {
  return (
    <View style={estilos.grupo}>
      {opcoes.map((opcao, indice) => {
        const selecionado = opcao.valor === valor;

        return (
          <Pressable
            key={opcao.valor}
            onPress={() => aoMudar(opcao.valor)}
            accessibilityRole="button"
            accessibilityState={{ selected: selecionado }}
            style={[
              estilos.segmento,
              indice > 0 && estilos.separador,
              selecionado && estilos.selecionado,
            ]}
          >
            <Text style={estilos.titulo}>{opcao.titulo}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const estilos = StyleSheet.create({
  grupo: {
    height: 40,
    flexDirection: 'row',
    overflow: 'hidden',
    borderRadius: raios.pill,
    borderWidth: 1,
    borderColor: cores.segmentoBorda,
  },
  segmento: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  separador: {
    borderLeftWidth: 1,
    borderLeftColor: cores.segmentoBorda,
  },
  selecionado: { backgroundColor: cores.segmentoSelecionado },
  titulo: {
    fontSize: tipografia.corpo,
    fontWeight: '500',
    color: cores.chipTexto,
  },
});