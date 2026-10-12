// TEMPLATE — ScreenTemplate (tela interna padrão: fundo em degradê,
// título centralizado, divisor e conteúdo rolável)
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Divider } from '../molecules/Divider';
import { espacamentos, gradientes, tipografia, cores } from '../../theme';

export function ScreenTemplate({ titulo, children }) {
  return (
    <LinearGradient
      colors={gradientes.fundo.cores}
      locations={gradientes.fundo.locais}
      style={estilos.tela}
    >
      <SafeAreaView style={estilos.area}>
        <ScrollView
          contentContainerStyle={estilos.conteudo}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {!!titulo && (
            <View style={estilos.cabecalho}>
              <Text style={estilos.titulo}>{titulo}</Text>
              <Divider />
            </View>
          )}
          {children}
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const estilos = StyleSheet.create({
  tela: { flex: 1 },
  area: { flex: 1 },
  conteudo: {
    flexGrow: 1,
    paddingHorizontal: espacamentos.lg,
    paddingTop: espacamentos.sm,
    paddingBottom: espacamentos.lg,
  },
  cabecalho: { marginBottom: espacamentos.lg },
  titulo: {
    marginBottom: espacamentos.md,
    textAlign: 'center',
    fontSize: tipografia.titulo,
    fontWeight: '600',
    color: cores.texto,
  },
});