// TEMPLATE — ScreenTemplate (tela interna padrão: fundo em degradê,
// cabeçalho e conteúdo rolável).
// - Sem aoVoltar: título centralizado de aba + divisor.
// - Com aoVoltar: cabeçalho interno (chevron + título + divisor).
// - flutuante (opcional): elemento fixo no canto inferior direito (ex.: botão "+").
// Só a borda superior é protegida: a barra de abas já cuida da inferior.
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Divider } from '../molecules/Divider';
import { CabecalhoInterno } from '../molecules/CabecalhoInterno';
import { cores, espacamentos, gradientes, tipografia } from '../../theme';

export function ScreenTemplate({ titulo, aoVoltar, flutuante, children }) {
  return (
    <LinearGradient
      colors={gradientes.fundo.cores}
      locations={gradientes.fundo.locais}
      style={estilos.tela}
    >
      <SafeAreaView style={estilos.area} edges={['top', 'left', 'right']}>
        <ScrollView
          contentContainerStyle={[
            estilos.conteudo,
            !!flutuante && estilos.comFlutuante,
          ]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {!!titulo && (
            <View style={estilos.cabecalho}>
              {aoVoltar ? (
                <CabecalhoInterno titulo={titulo} aoVoltar={aoVoltar} />
              ) : (
                <>
                  <Text style={estilos.titulo}>{titulo}</Text>
                  <Divider />
                </>
              )}
            </View>
          )}
          {children}
        </ScrollView>

        {!!flutuante && <View style={estilos.flutuante}>{flutuante}</View>}
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
  // Espaço extra para o último item não ficar atrás do botão flutuante.
  comFlutuante: { paddingBottom: 80 },
  cabecalho: { marginBottom: espacamentos.lg },
  titulo: {
    marginBottom: espacamentos.md,
    textAlign: 'center',
    fontSize: tipografia.titulo,
    fontWeight: '600',
    color: cores.texto,
  },
  flutuante: {
    position: 'absolute',
    right: espacamentos.md,
    bottom: espacamentos.md,
  },
});