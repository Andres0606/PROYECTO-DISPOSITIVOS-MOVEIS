// MOLECULE — CardAtividade

import {
  Image,
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

export function CardAtividade({
  atividade,
  aoAbrir,
}) {
  return (
    <Pressable
      onPress={aoAbrir}
      style={({ pressed }) => [
        estilos.cartao,
        pressed && estilos.pressionado,
      ]}
      accessibilityRole="button"
    >
      {atividade.imagem ? (
        <Image
          source={{
            uri: atividade.imagem,
          }}
          style={estilos.imagem}
          resizeMode="cover"
        />
      ) : (
        <View style={estilos.imagemVazia}>
          <Ionicons
            name="image-outline"
            size={32}
            color={cores.textoSecundario}
          />
        </View>
      )}

      <View style={estilos.conteudo}>
        <View style={estilos.linhaPrincipal}>
          <View style={estilos.informacoes}>
            <Text
              style={estilos.titulo}
              numberOfLines={1}
            >
              {atividade.titulo}
            </Text>

            <Text style={estilos.detalhes}>
              {atividade.data}
              {' · '}
              {atividade.horario}
              {' · '}
              {atividade.interessados}{' '}
              interessados
            </Text>
          </View>

          <View style={estilos.categoria}>
            <Text
              style={
                estilos.categoriaTexto
              }
            >
              {atividade.categoria}
            </Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

const estilos = StyleSheet.create({
  cartao: {
    backgroundColor: cores.superficie,

    borderWidth: 1,
    borderColor: cores.borda,

    borderRadius: raios.sm,

    padding: espacamentos.sm,

    gap: espacamentos.sm,
  },

  imagem: {
    width: '100%',
    height: 125,

    borderRadius: raios.sm,

    backgroundColor:
      cores.superficie,
  },

  imagemVazia: {
    width: '100%',
    height: 125,

    borderRadius: raios.sm,

    backgroundColor: '#ECECEC',

    alignItems: 'center',
    justifyContent: 'center',
  },

  conteudo: {
    width: '100%',
  },

  linhaPrincipal: {
    flexDirection: 'row',

    alignItems: 'center',
    justifyContent: 'space-between',

    gap: espacamentos.sm,
  },

  informacoes: {
    flex: 1,
  },

  titulo: {
    fontSize: tipografia.legenda,

    fontWeight: '700',

    color: cores.texto,

    marginBottom: 3,
  },

  detalhes: {
    fontSize: 11,

    color:
      cores.textoSecundario,
  },

  categoria: {
    minWidth: 70,

    paddingHorizontal:
      espacamentos.sm,

    paddingVertical: 5,

    borderWidth: 1,
    borderColor: cores.borda,

    borderRadius: raios.pill,

    alignItems: 'center',
    justifyContent: 'center',
  },

  categoriaTexto: {
    fontSize: 10,

    color: cores.texto,
  },

  pressionado: {
    opacity: 0.65,
  },
});