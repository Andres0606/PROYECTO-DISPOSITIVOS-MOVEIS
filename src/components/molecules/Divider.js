// MOLECULE — Divider (linha, texto opcional e linha)
import { StyleSheet, Text, View } from 'react-native';
import { cores, espacamentos, tipografia } from '../../theme';

export function Divider({ texto = '' }) {
  if (!texto) {
    return <View style={estilos.traco} />;
  }

  return (
    <View style={estilos.linha}>
      <View style={[estilos.traco, estilos.flexivel]} />
      <Text style={estilos.texto}>{texto}</Text>
      <View style={[estilos.traco, estilos.flexivel]} />
    </View>
  );
}

const estilos = StyleSheet.create({
  linha: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: espacamentos.sm,
  },
  traco: { height: 1, backgroundColor: cores.divisor },
  flexivel: { flex: 1 },
  texto: {
    fontSize: tipografia.corpo,
    color: cores.textoSecundario,
  },
});