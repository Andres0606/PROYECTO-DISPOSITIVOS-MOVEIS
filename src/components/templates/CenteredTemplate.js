// TEMPLATE — CenteredTemplate
// Fundo em degradê com círculos decorativos.

import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';

import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';

import { espacamentos } from '../../theme';
import { useTema } from '../../theme/useTema';

// ============================================================
// CÍRCULOS DECORATIVOS
// ============================================================

const circulos = [
  {
    id: 'topo-esq',
    largura: 220,
    altura: 220,
    clara: false,
    opacidade: 0.35,
  },
  {
    id: 'topo-esq-2',
    largura: 114,
    altura: 127,
    clara: true,
    opacidade: 0.25,
  },
  {
    id: 'topo-dir',
    largura: 120,
    altura: 120,
    clara: false,
    opacidade: 0.3,
  },
  {
    id: 'base-dir',
    largura: 240,
    altura: 240,
    clara: false,
    opacidade: 0.4,
  },
  {
    id: 'base-dir-2',
    largura: 180,
    altura: 180,
    clara: true,
    opacidade: 0.25,
  },
  {
    id: 'base-esq',
    largura: 140,
    altura: 140,
    clara: false,
    opacidade: 0.3,
  },
];

// ============================================================
// POSIÇÕES — FIGMA
// ============================================================

const posicoes = {
  login: {
    'topo-esq': { left: -117, top: -51 },
    'topo-esq-2': { left: -41, top: 6 },
    'topo-dir': { right: -41, top: 59 },
    'base-dir': { right: -70, bottom: -57 },
    'base-dir-2': { right: -50, bottom: -37 },
    'base-esq': { left: -45, bottom: -17 },
  },

  cadastro: {
    'topo-esq': { left: -100, top: -77 },
    'topo-esq-2': { left: -24, top: -20 },
    'topo-dir': { right: -37, top: 50 },
    'base-dir': { right: -85, bottom: -50 },
    'base-dir-2': { right: -65, bottom: -30 },
    'base-esq': { left: -30, bottom: -10 },
  },

  recuperar: {
    'topo-esq': { left: -80, top: -80 },
    'topo-esq-2': {
      left: -63,
      top: -65,
      width: 180,
      height: 180,
    },
    'topo-dir': { right: -45, top: 50 },
    'base-dir': { right: -85, bottom: -48 },
    'base-dir-2': { right: -65, bottom: -28 },
    'base-esq': { left: -30, bottom: -8 },
  },
};

// ============================================================
// TEMPLATE
// ============================================================

export function CenteredTemplate({
  children,
  variante = 'login',
}) {
  const { cores, gradientes } = useTema();

  const posicaoDaTela =
    posicoes[variante] ?? posicoes.login;

  return (
    <View
      style={[
        estilos.tela,
        { backgroundColor: cores.fundoFim },
      ]}
    >
      <LinearGradient
        colors={gradientes.fundo.cores}
        locations={gradientes.fundo.locais}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      <View
        pointerEvents="none"
        style={estilos.decoracao}
      >
        {circulos.map((c) => (
          <View
            key={c.id}
            style={[
              estilos.circulo,
              {
                width: c.largura,
                height: c.altura,

                backgroundColor: c.clara
                  ? cores.decoracaoClara
                  : cores.decoracao,

                opacity: c.opacidade,
              },
              posicaoDaTela[c.id],
            ]}
          />
        ))}
      </View>

      <SafeAreaView style={estilos.area}>
        <KeyboardAvoidingView
          style={estilos.area}
          behavior={
            Platform.OS === 'ios'
              ? 'padding'
              : undefined
          }
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

// ============================================================
// ESTILOS
// ============================================================

const estilos = StyleSheet.create({
  tela: {
    flex: 1,
  },

  area: {
    flex: 1,
  },

  decoracao: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },

  circulo: {
    position: 'absolute',
    borderRadius: '50%',
  },

  conteudo: {
    flexGrow: 1,
    paddingHorizontal: espacamentos.lg,
    paddingTop: espacamentos.xl,
    paddingBottom: espacamentos.lg,
  },
});