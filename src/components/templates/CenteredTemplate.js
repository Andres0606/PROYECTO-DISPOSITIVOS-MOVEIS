// TEMPLATE — CenteredTemplate (fundo em degradê com círculos decorativos,
// conteúdo centralizado horizontalmente; usado em Login/Cadastro)
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { cores, espacamentos, gradientes } from '../../theme';

// Posições e opacidades retiradas do frame Login do Figma (375x812).
// Os de baixo são ancorados no rodapé para funcionar em qualquer altura.
const circulos = [
  { id: 'topo-esq', largura: 220, altura: 220, posicao: { left: -117, top: -51 }, clara: false, opacidade: 0.35 },
  { id: 'topo-esq-2', largura: 114, altura: 127, posicao: { left: -41, top: 6 }, clara: true, opacidade: 0.25 },
  { id: 'topo-dir', largura: 120, altura: 120, posicao: { right: -41, top: 59 }, clara: false, opacidade: 0.3 },
  { id: 'base-dir', largura: 240, altura: 240, posicao: { right: -70, bottom: -57 }, clara: false, opacidade: 0.4 },
  { id: 'base-dir-2', largura: 180, altura: 180, posicao: { right: -50, bottom: -37 }, clara: true, opacidade: 0.25 },
  { id: 'base-esq', largura: 140, altura: 140, posicao: { left: -45, bottom: -17 }, clara: false, opacidade: 0.3 },
];

export function CenteredTemplate({ children }) {
  return (
    <View style={estilos.tela}>
      <LinearGradient
        colors={gradientes.fundo.cores}
        locations={gradientes.fundo.locais}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      <View pointerEvents="none" style={estilos.decoracao}>
        {circulos.map((c) => (
          <View
            key={c.id}
            style={[
              estilos.circulo,
              {
                width: c.largura,
                height: c.altura,
                backgroundColor: c.clara ? cores.decoracaoClara : cores.decoracao,
                opacity: c.opacidade,
              },
              c.posicao,
            ]}
          />
        ))}
      </View>

      <SafeAreaView style={estilos.area}>
        <KeyboardAvoidingView
          style={estilos.area}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <ScrollView
            contentContainerStyle={estilos.conteudo}
            keyboardShouldPersistTaps="handled"
          >
            {children}
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

const estilos = StyleSheet.create({
  tela: { flex: 1, backgroundColor: cores.fundoFim },
  area: { flex: 1 },
  decoracao: { ...StyleSheet.absoluteFillObject, overflow: 'hidden' },
  circulo: { position: 'absolute', borderRadius: '50%' },
  conteudo: {
    flexGrow: 1,
    paddingHorizontal: espacamentos.lg,
    paddingTop: espacamentos.xl,
    paddingBottom: espacamentos.lg,
  },
});