// SCREEN — Detalhes do conselho

import {
  useCallback,
  useState,
} from 'react';

import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {
  useFocusEffect,
} from '@react-navigation/native';

import { Ionicons } from '@expo/vector-icons';

import { ScreenTemplate } from '../components/templates/ScreenTemplate';

import {
  obterConselhoPorId,
} from '../services/conselhos';

import {
  cores,
  espacamentos,
  raios,
  tipografia,
} from '../theme';

export function ConselhoDetalheScreen({
  navigation,
  route,
}) {
  const conselhoInicial =
    route.params?.conselho;

  const [conselho, setConselho] =
    useState(conselhoInicial);

  const [curtido, setCurtido] =
    useState(false);

  useFocusEffect(
    useCallback(() => {
      async function carregarConselho() {
        if (!conselhoInicial?.id) {
          return;
        }

        const resultado =
          await obterConselhoPorId(
            conselhoInicial.id
          );

        if (resultado) {
          setConselho(resultado);
        }
      }

      carregarConselho();
    }, [conselhoInicial?.id])
  );

  if (!conselho) {
    return (
      <ScreenTemplate
        titulo="Conselhos"
        aoVoltar={() =>
          navigation.goBack()
        }
      >
        <Text style={estilos.erro}>
          Conselho não encontrado.
        </Text>
      </ScreenTemplate>
    );
  }

  function alternarCurtida() {
    setCurtido(
      (atual) => !atual
    );
  }

  function editarConselho() {
    navigation.navigate(
      'EditarConselho',
      {
        conselho,
      }
    );
  }

  return (
    <ScreenTemplate
      titulo="Conselhos"
      aoVoltar={() =>
        navigation.goBack()
      }
    >
      {/* AUTOR */}
      <View
        style={
          estilos.cartaoAutor
        }
      >
        <View style={estilos.avatar}>
          <Ionicons
            name="person-outline"
            size={22}
            color={cores.texto}
          />
        </View>

        <View>
          <Text style={estilos.autor}>
            {conselho.autor}
          </Text>

          <View
            style={
              estilos.dadosAutor
            }
          >
            <Text style={estilos.pais}>
              {conselho.pais}
            </Text>

            <Text style={estilos.data}>
              {conselho.tempo ??
                '27 ago'}
            </Text>
          </View>
        </View>
      </View>

      {/* TÍTULO */}
      <Text style={estilos.titulo}>
        {conselho.texto}
      </Text>

      {/* CATEGORIAS */}
      <View
        style={
          estilos.categorias
        }
      >
        <View
          style={estilos.categoria}
        >
          <Text
            style={
              estilos.categoriaTexto
            }
          >
            {conselho.categoria}
          </Text>
        </View>

        {conselho.tag && (
          <View
            style={
              estilos.categoria
            }
          >
            <Text
              style={
                estilos.categoriaTexto
              }
            >
              {conselho.tag}
            </Text>
          </View>
        )}
      </View>

      {/* CONTEÚDO */}
      <Text
        style={estilos.descricao}
      >
        {conselho.descricao}
      </Text>

      {/* IMAGEM */}
      {!!conselho.imagem && (
        <Image
          source={{
            uri: conselho.imagem,
          }}
          style={estilos.imagem}
          resizeMode="cover"
        />
      )}

      {/* EDITAR */}
      <View
        style={estilos.areaEditar}
      >
        <Pressable
          onPress={editarConselho}
          style={({ pressed }) => [
            estilos.botaoEditar,

            pressed &&
              estilos.pressionado,
          ]}
        >
          <Text
            style={
              estilos.botaoEditarTexto
            }
          >
            Editar
          </Text>
        </Pressable>
      </View>

      {/* INTERAÇÕES */}
      <View style={estilos.rodape}>
        <Pressable
          onPress={alternarCurtida}
          hitSlop={12}
          style={({ pressed }) => [
            estilos.curtidas,

            pressed &&
              estilos.pressionado,
          ]}
          accessibilityRole="button"
        >
          <Ionicons
            name={
              curtido
                ? 'heart'
                : 'heart-outline'
            }
            size={20}
            color={cores.texto}
          />

          <Text style={estilos.numero}>
            {conselho.curtidas +
              (curtido ? 1 : 0)}
          </Text>
        </Pressable>

        <Text
          style={
            estilos.comentarios
          }
        >
          {conselho.comentarios ??
            0}{' '}
          Comentários
        </Text>
      </View>
    </ScreenTemplate>
  );
}

const estilos = StyleSheet.create({
  cartaoAutor: {
    flexDirection: 'row',
    alignItems: 'center',

    backgroundColor:
      cores.superficie,

    borderWidth: 1,
    borderColor: cores.borda,

    borderRadius: raios.sm,

    padding: espacamentos.sm,

    marginTop:
      espacamentos.lg,

    marginBottom:
      espacamentos.md,
  },

  avatar: {
    width: 40,
    height: 40,

    borderRadius: 20,

    backgroundColor:
      '#B7B5BB',

    alignItems: 'center',
    justifyContent: 'center',

    marginRight:
      espacamentos.md,
  },

  autor: {
    fontSize:
      tipografia.subtitulo,

    fontWeight: '600',

    color: cores.texto,
  },

  dadosAutor: {
    flexDirection: 'row',

    gap: espacamentos.sm,

    marginTop: 2,
  },

  pais: {
    fontSize:
      tipografia.legenda,

    color:
      cores.textoSecundario,
  },

  data: {
    fontSize:
      tipografia.legenda,

    color:
      cores.textoSecundario,
  },

  titulo: {
    marginHorizontal:
      espacamentos.sm,

    marginBottom:
      espacamentos.md,

    fontSize: 18,
    fontWeight: '700',

    color: cores.texto,
  },

  categorias: {
    flexDirection: 'row',

    gap: espacamentos.sm,

    marginHorizontal:
      espacamentos.sm,

    marginBottom:
      espacamentos.lg,
  },

  categoria: {
    minWidth: 95,

    paddingHorizontal:
      espacamentos.md,

    paddingVertical: 6,

    borderWidth: 1,
    borderColor: cores.borda,

    borderRadius: raios.pill,

    backgroundColor:
      cores.superficie,

    alignItems: 'center',
  },

  categoriaTexto: {
    fontSize: 11,

    color: cores.texto,
  },

  descricao: {
    marginHorizontal:
      espacamentos.sm,

    fontSize:
      tipografia.legenda,

    lineHeight: 20,

    color: cores.texto,
  },

  imagem: {
    width: '100%',
    height: 180,

    marginTop:
      espacamentos.lg,

    borderRadius: raios.sm,

    backgroundColor:
      cores.superficie,
  },

  areaEditar: {
    alignItems: 'flex-end',

    marginTop: 40,

    marginHorizontal:
      espacamentos.sm,
  },

  botaoEditar: {
    backgroundColor:
      '#272727',

    paddingHorizontal: 16,
    paddingVertical: 10,

    borderRadius: raios.sm,
  },

  botaoEditarTexto: {
    fontSize:
      tipografia.legenda,

    color: '#FFFFFF',
  },

  rodape: {
    flexDirection: 'row',

    justifyContent:
      'space-between',

    alignItems: 'center',

    marginTop:
      espacamentos.md,

    marginHorizontal:
      espacamentos.sm,
  },

  curtidas: {
    flexDirection: 'row',
    alignItems: 'center',

    gap: espacamentos.xs,

    paddingHorizontal:
      espacamentos.xs,

    paddingVertical:
      espacamentos.xs,
  },

  numero: {
    fontSize:
      tipografia.legenda,

    color:
      cores.textoSecundario,
  },

  comentarios: {
    fontSize:
      tipografia.legenda,

    color:
      cores.textoSecundario,
  },

  pressionado: {
    opacity: 0.5,
  },

  erro: {
    marginTop:
      espacamentos.xl,

    textAlign: 'center',

    fontSize:
      tipografia.corpo,

    color: cores.perigo,
  },
});