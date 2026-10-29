// MOLECULE — LinhaValor (rótulo cinza à esquerda e valor em destaque à direita)
import { StyleSheet, Text, View } from 'react-native';
import { cores, tipografia } from '../../theme';

export function LinhaValor({ rotulo, valor }) {
  return (
    <View style={estilos.linha}>
      <Text style={estilos.rotulo}>{rotulo}</Text>
      <Text style={estilos.valor}>{valor}</Text>
    </View>
  );
}

const estilos = StyleSheet.create({
  linha: {
    minHeight: 25,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rotulo: {
    fontSize: tipografia.legenda,
    color: cores.textoSecundario,
  },
  valor: {
    fontSize: tipografia.corpo,
    fontWeight: '600',
    color: cores.texto,
  },
});