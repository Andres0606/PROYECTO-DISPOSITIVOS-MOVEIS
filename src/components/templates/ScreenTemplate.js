// TEMPLATE — ScreenTemplate (tela padrão com título opcional)
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { cores, espacamentos, tipografia } from '../../theme';

export function ScreenTemplate({ titulo, children }) {
  return (
    <SafeAreaView style={estilos.tela}>
      <View style={estilos.conteudo}>
        {!!titulo && <Text style={estilos.titulo}>{titulo}</Text>}
        {children}
      </View>
    </SafeAreaView>
  );
}

const estilos = StyleSheet.create({
  tela: { flex: 1, backgroundColor: cores.fundo },
  conteudo: { flex: 1, padding: espacamentos.lg },
  titulo: {
    marginBottom: espacamentos.md,
    fontSize: tipografia.titulo,
    fontWeight: '700',
    color: cores.texto,
  },
});