// TEMPLATE — ScreenTemplate
// Fundo em degradê, cabeçalho e conteúdo rolável.

import {
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Divider } from '../molecules/Divider';
import { CabecalhoInterno } from '../molecules/CabecalhoInterno';

import { espacamentos, tipografia } from '../../theme';
import { useTema } from '../../theme/useTema';

export function ScreenTemplate({
  titulo,
  aoVoltar,
  acaoCabecalho,
  flutuante,
  children,
}) {
  const { cores, gradientes } = useTema();

  return (
    <LinearGradient
      colors={gradientes.fundo.cores}
      locations={gradientes.fundo.locais}
      style={estilos.tela}
    >
      <SafeAreaView
        style={estilos.area}
        edges={['top', 'left', 'right']}
      >
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
                <CabecalhoInterno
                  titulo={titulo}
                  aoVoltar={aoVoltar}
                  acaoDireita={acaoCabecalho}
                />
              ) : (
                <>
                  <Text
                    style={[
                      estilos.titulo,
                      { color: cores.texto },
                    ]}
                  >
                    {titulo}
                  </Text>

                  <Divider />
                </>
              )}
            </View>
          )}

          {children}

        </ScrollView>

        {!!flutuante && (
          <View style={estilos.flutuante}>
            {flutuante}
          </View>
        )}

      </SafeAreaView>
    </LinearGradient>
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

  conteudo: {
    flexGrow: 1,
    paddingHorizontal: espacamentos.lg,
    paddingTop: espacamentos.sm,
    paddingBottom: espacamentos.lg,
  },

  comFlutuante: {
    paddingBottom: 80,
  },

  cabecalho: {
    marginBottom: espacamentos.lg,
  },

  titulo: {
    marginBottom: espacamentos.md,
    textAlign: 'center',
    fontSize: tipografia.titulo,
    fontWeight: '600',
  },

  flutuante: {
    position: 'absolute',
    right: espacamentos.md,
    bottom: espacamentos.md,
  },
});