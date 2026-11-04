// SCREEN — Favoritos

import {
  useCallback,
  useState,
} from 'react';

import {
  ActivityIndicator,
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
  obterFavoritos,
  removerFavorito,
} from '../services/favoritos';

import {
  cores,
  espacamentos,
  raios,
  tipografia,
} from '../theme';

export function FavoritosScreen({
  navigation,
}) {
  const [tipo, setTipo] =
    useState('lugares');

  const [favoritos, setFavoritos] =
    useState([]);

  const [carregando, setCarregando] =
    useState(true);

  const carregar =
    useCallback(async () => {
      setCarregando(true);

      try {
        const resultado =
          await obterFavoritos(
            tipo
          );

        setFavoritos(
          resultado
        );
      } finally {
        setCarregando(false);
      }
    }, [tipo]);

  useFocusEffect(
    useCallback(() => {
      carregar();
    }, [carregar])
  );

  async function remover(item) {
    await removerFavorito(
      tipo,
      item.id
    );

    setFavoritos(
      (atuais) =>
        atuais.filter(
          (favorito) =>
            favorito.id !==
            item.id
        )
    );
  }

  return (
    <ScreenTemplate
      titulo="Favoritos"
      aoVoltar={() =>
        navigation.goBack()
      }
    >
      {/* ABAS */}
      <View
        style={
          estilos.segmentado
        }
      >
        <Pressable
          onPress={() =>
            setTipo('lugares')
          }
          style={[
            estilos.segmento,

            tipo ===
              'lugares' &&
              estilos.segmentoAtivo,
          ]}
        >
          <Text
            style={
              estilos.segmentoTexto
            }
          >
            Lugares
          </Text>
        </Pressable>

        <Pressable
          onPress={() =>
            setTipo('frases')
          }
          style={[
            estilos.segmento,

            tipo ===
              'frases' &&
              estilos.segmentoAtivo,
          ]}
        >
          <Text
            style={
              estilos.segmentoTexto
            }
          >
            Frases
          </Text>
        </Pressable>

        <Pressable
          onPress={() =>
            setTipo('atividades')
          }
          style={[
            estilos.segmento,

            tipo ===
              'atividades' &&
              estilos.segmentoAtivo,
          ]}
        >
          <Text
            style={
              estilos.segmentoTexto
            }
          >
            Atividades
          </Text>
        </Pressable>
      </View>

      {/* CARREGANDO */}
      {carregando ? (
        <ActivityIndicator
          color={cores.primaria}
          style={
            estilos.carregando
          }
        />
      ) : (
        <>
          {favoritos.length === 0 ? (
            <View
              style={
                estilos.vazio
              }
            >
              <Ionicons
                name="heart-outline"
                size={34}
                color={
                  cores.textoSecundario
                }
              />

              <Text
                style={
                  estilos.vazioTexto
                }
              >
                Nenhum favorito nesta categoria.
              </Text>
            </View>
          ) : (
            <View
              style={
                estilos.lista
              }
            >
              {favoritos.map(
                (item) => (
                  <ItemFavorito
                    key={
                      item.id
                    }
                    item={item}
                    tipo={tipo}
                    aoRemover={() =>
                      remover(
                        item
                      )
                    }
                  />
                )
              )}
            </View>
          )}
        </>
      )}
    </ScreenTemplate>
  );
}

function ItemFavorito({
  item,
  tipo,
  aoRemover,
}) {
  const titulo =
    item.nome ??
    item.titulo;

  return (
    <View
      style={
        estilos.item
      }
    >
      {tipo === 'lugares' ? (
        item.imagem ? (
          <Image
            source={{
              uri: item.imagem,
            }}
            style={
              estilos.imagem
            }
          />
        ) : (
          <View
            style={
              estilos.imagemVazia
            }
          >
            <Ionicons
              name="location-outline"
              size={22}
              color={
                cores.textoSecundario
              }
            />
          </View>
        )
      ) : (
        <View
          style={
            estilos.iconeCategoria
          }
        >
          <Ionicons
            name={
              tipo ===
              'frases'
                ? 'chatbubble-outline'
                : 'calendar-outline'
            }
            size={22}
            color={
              cores.texto
            }
          />
        </View>
      )}

      <View
        style={
          estilos.conteudo
        }
      >
        <Text
          style={
            estilos.titulo
          }
          numberOfLines={1}
        >
          {titulo}
        </Text>

        {!!item.descricao && (
          <Text
            style={
              estilos.descricao
            }
            numberOfLines={1}
          >
            {item.descricao}
          </Text>
        )}
      </View>

      <Pressable
        onPress={
          aoRemover
        }
        hitSlop={12}
        style={({
          pressed,
        }) => [
          estilos.coracao,

          pressed &&
            estilos.pressionado,
        ]}
      >
        <Ionicons
          name="heart-outline"
          size={22}
          color={cores.texto}
        />
      </Pressable>
    </View>
  );
}

const estilos =
  StyleSheet.create({
    segmentado: {
      height: 38,

      flexDirection:
        'row',

      borderWidth: 1,

      borderColor:
        cores.segmentoBorda,

      borderRadius:
        raios.pill,

      overflow:
        'hidden',

      marginTop:
        espacamentos.lg,

      marginBottom:
        espacamentos.md,
    },

    segmento: {
      flex: 1,

      alignItems:
        'center',

      justifyContent:
        'center',

      borderRightWidth: 1,

      borderRightColor:
        cores.segmentoBorda,
    },

    segmentoAtivo: {
      backgroundColor:
        cores.segmentoSelecionado,
    },

    segmentoTexto: {
      fontSize:
        tipografia.legenda,

      color:
        cores.texto,
    },

    carregando: {
      marginTop:
        espacamentos.xl,
    },

    lista: {
      width: '100%',
    },

    item: {
      minHeight: 72,

      flexDirection:
        'row',

      alignItems:
        'center',

      borderBottomWidth: 1,

      borderBottomColor:
        cores.borda,

      paddingVertical:
        espacamentos.sm,

      paddingHorizontal:
        espacamentos.xs,
    },

    imagem: {
      width: 54,
      height: 54,

      borderRadius:
        raios.sm,

      marginRight:
        espacamentos.sm,

      backgroundColor:
        cores.superficie,
    },

    imagemVazia: {
      width: 54,
      height: 54,

      borderRadius:
        raios.sm,

      marginRight:
        espacamentos.sm,

      alignItems:
        'center',

      justifyContent:
        'center',

      backgroundColor:
        '#ECECEC',
    },

    iconeCategoria: {
      width: 54,
      height: 54,

      borderRadius:
        raios.sm,

      marginRight:
        espacamentos.sm,

      alignItems:
        'center',

      justifyContent:
        'center',

      backgroundColor:
        '#ECECEC',
    },

    conteudo: {
      flex: 1,

      paddingRight:
        espacamentos.sm,
    },

    titulo: {
      fontSize:
        tipografia.corpo,

      fontWeight:
        '700',

      color:
        cores.texto,
    },

    descricao: {
      marginTop: 3,

      fontSize:
        tipografia.legenda,

      color:
        cores.textoSecundario,
    },

    coracao: {
      width: 38,
      height: 38,

      alignItems:
        'center',

      justifyContent:
        'center',
    },

    vazio: {
      marginTop: 80,

      alignItems:
        'center',

      gap:
        espacamentos.sm,
    },

    vazioTexto: {
      fontSize:
        tipografia.legenda,

      color:
        cores.textoSecundario,
    },

    pressionado: {
      opacity: 0.5,
    },
  });