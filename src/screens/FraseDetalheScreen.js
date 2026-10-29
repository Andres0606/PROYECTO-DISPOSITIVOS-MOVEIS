// SCREEN — Detalhe de uma frase
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { ScreenTemplate } from '../components/templates/ScreenTemplate';

import {
  cores,
  espacamentos,
  raios,
  tipografia,
} from '../theme';

export function FraseDetalheScreen({ navigation, route }) {
  const frase = route.params?.frase;
  const categoria = route.params?.categoria;

  if (!frase) {
    return (
      <ScreenTemplate
        titulo="Frase"
        aoVoltar={() => navigation.goBack()}
      >
        <Text style={estilos.erro}>
          Frase não encontrada.
        </Text>
      </ScreenTemplate>
    );
  }

  return (
    <ScreenTemplate
      titulo="Frase"
      aoVoltar={() => navigation.goBack()}
    >
      <View style={estilos.espacoSuperior} />

      <View style={estilos.cartao}>
        <Text style={estilos.portugues}>
          {frase.portugues}
        </Text>

        <View style={estilos.divisor} />

        <Text style={estilos.espanhol}>
          {frase.espanhol}
        </Text>
      </View>

      <View style={estilos.categoria}>
        <Text style={estilos.categoriaTexto}>
          {categoria?.nome ?? 'Português'}
        </Text>
      </View>

      <View style={estilos.pronunciacao}>
        <Ionicons
          name="play-circle-outline"
          size={22}
          color={cores.texto}
        />

        <Text style={estilos.pronunciacaoTexto}>
          Escuchar pronunciación
        </Text>
      </View>
    </ScreenTemplate>
  );
}

const estilos = StyleSheet.create({
  espacoSuperior: {
    height: 105,
  },

  cartao: {
    backgroundColor: cores.superficie,
    borderWidth: 1,
    borderColor: cores.borda,
    borderRadius: raios.sm,
    paddingHorizontal: espacamentos.md,
    paddingVertical: espacamentos.sm,
  },

  portugues: {
    fontSize: tipografia.subtitulo,
    fontWeight: '700',
    color: cores.texto,
    paddingVertical: espacamentos.xs,
  },

  divisor: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: cores.bordaForte,
    marginVertical: espacamentos.sm,
  },

  espanhol: {
    fontSize: tipografia.subtitulo,
    color: cores.textoSecundario,
    paddingBottom: espacamentos.xs,
  },

  categoria: {
    alignSelf: 'flex-start',
    marginTop: espacamentos.lg,
    marginLeft: espacamentos.xs,
    paddingHorizontal: espacamentos.md,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: cores.borda,
    borderRadius: raios.pill,
    backgroundColor: cores.superficie,
  },

  categoriaTexto: {
    fontSize: tipografia.legenda,
    fontWeight: '600',
    color: cores.texto,
  },

  pronunciacao: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: espacamentos.xs,
    marginTop: espacamentos.lg,
    paddingVertical: espacamentos.sm,
    paddingHorizontal: espacamentos.xs,
  },

  pronunciacaoTexto: {
    fontSize: tipografia.legenda,
    color: cores.textoSecundario,
  },

  erro: {
    marginTop: espacamentos.xl,
    textAlign: 'center',
    fontSize: tipografia.corpo,
    color: cores.perigo,
  },
});