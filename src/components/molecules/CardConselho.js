// MOLECULE — CardConselho
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import {
  cores,
  espacamentos,
  raios,
  tipografia,
} from '../../theme';

export function CardConselho({
  conselho,
  curtido = false,
  aoCurtir,
  aoAbrir,
}) {
  return (
    <View style={estilos.cartao}>
      <Pressable
        onPress={aoAbrir}
        style={({ pressed }) => [
          estilos.conteudo,
          pressed && estilos.pressionado,
        ]}
        accessibilityRole="button"
      >
        <View style={estilos.cabecalho}>
          <View style={estilos.avatar}>
            <Ionicons
              name="person-outline"
              size={21}
              color={cores.texto}
            />
          </View>

          <Text style={estilos.autor}>
            {conselho.autor}
          </Text>

          <Text style={estilos.pais}>
            {conselho.pais}
          </Text>
        </View>

        <Text style={estilos.texto}>
          {conselho.texto}
        </Text>

        <View style={estilos.categoria}>
          <Text style={estilos.categoriaTexto}>
            {conselho.categoria}
          </Text>
        </View>
      </Pressable>

      <View style={estilos.rodape}>
        <View />

        <Pressable
          onPress={() => {
            if (aoCurtir) {
              aoCurtir();
            }
          }}
          hitSlop={10}
          style={({ pressed }) => [
            estilos.curtidas,
            pressed && estilos.pressionado,
          ]}
          accessibilityRole="button"
          accessibilityLabel="Curtir conselho"
        >
          <Ionicons
            name={curtido ? 'heart' : 'heart-outline'}
            size={20}
            color={curtido ? '#000000' : cores.texto}
          />

          <Text style={estilos.numeroCurtidas}>
            {conselho.curtidas + (curtido ? 1 : 0)}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const estilos = StyleSheet.create({
  cartao: {
    backgroundColor: cores.superficie,
    borderWidth: 1,
    borderColor: cores.borda,
    borderRadius: raios.sm,
    padding: espacamentos.sm,
  },

  conteudo: {
    flex: 1,
  },

  cabecalho: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: espacamentos.sm,
  },

  avatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#AAA8AE',
    borderWidth: 1,
    borderColor: cores.texto,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: espacamentos.md,
  },

  autor: {
    fontSize: tipografia.subtitulo,
    fontWeight: '600',
    color: cores.texto,
  },

  pais: {
    marginLeft: espacamentos.md,
    fontSize: tipografia.legenda,
    color: cores.textoSecundario,
  },

  texto: {
    fontSize: tipografia.legenda,
    fontWeight: '600',
    color: cores.texto,
    marginBottom: espacamentos.sm,
  },

  rodape: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: espacamentos.xs,
  },

  categoria: {
    alignSelf: 'flex-start',
    minWidth: 94,
    height: 27,
    paddingHorizontal: espacamentos.md,
    borderRadius: raios.pill,
    borderWidth: 1,
    borderColor: cores.borda,
    alignItems: 'center',
    justifyContent: 'center',
  },

  categoriaTexto: {
    fontSize: 11,
    color: cores.texto,
  },

  curtidas: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: espacamentos.xs,
    paddingHorizontal: espacamentos.sm,
    paddingVertical: espacamentos.xs,
    zIndex: 10,
  },

  numeroCurtidas: {
    fontSize: tipografia.legenda,
    color: cores.textoSecundario,
  },

  pressionado: {
    opacity: 0.5,
  },
});