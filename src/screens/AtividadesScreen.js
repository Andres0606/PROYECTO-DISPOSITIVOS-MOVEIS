// SCREEN — Atividades e planos

import {
  useCallback,
  useState,
} from 'react';

import {
  ActivityIndicator,
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
import { CardAtividade } from '../components/molecules/CardAtividade';

import {
  obterAtividades,
} from '../services/atividades';

import {
  cores,
  espacamentos,
  raios,
  tipografia,
} from '../theme';

export function AtividadesScreen({
  navigation,
}) {
  const [ordenacao, setOrdenacao] =
    useState('recentes');

  const [atividades, setAtividades] =
    useState([]);

  const [carregando, setCarregando] =
    useState(true);

  const [erro, setErro] =
    useState('');

  const carregar =
    useCallback(async () => {
      setCarregando(true);
      setErro('');

      try {
        const resultado =
          await obterAtividades(
            ordenacao
          );

        setAtividades(resultado);
      } catch (e) {
        setErro(
          'Não foi possível carregar as atividades.'
        );
      } finally {
        setCarregando(false);
      }
    }, [ordenacao]);

  useFocusEffect(
    useCallback(() => {
      carregar();
    }, [carregar])
  );

  function abrirAtividade(
    atividade
  ) {
    navigation.navigate(
      'AtividadeDetalhe',
      {
        atividade,
        ordenacao,
      }
    );
  }

  function criarAtividade() {
    navigation.navigate(
      'CriarAtividade'
    );
  }

  const botaoFlutuante = (
    <Pressable
      onPress={criarAtividade}
      style={({ pressed }) => [
        estilos.botaoAdicionar,

        pressed &&
          estilos.pressionado,
      ]}
      accessibilityRole="button"
      accessibilityLabel="Adicionar atividade"
    >
      <Ionicons
        name="add"
        size={28}
        color="#FFFFFF"
      />
    </Pressable>
  );

  return (
    <ScreenTemplate
      titulo="Atividades e planos"
      aoVoltar={() =>
        navigation.goBack()
      }
      flutuante={
        botaoFlutuante
      }
    >
      {/* RECENTES / POPULARES */}
      <View
        style={
          estilos.segmentado
        }
      >
        <Pressable
          onPress={() =>
            setOrdenacao(
              'recentes'
            )
          }
          style={[
            estilos.segmento,

            ordenacao ===
              'recentes' &&
              estilos.segmentoAtivo,
          ]}
        >
          <Text
            style={
              estilos.segmentoTexto
            }
          >
            Recentes
          </Text>
        </Pressable>

        <Pressable
          onPress={() =>
            setOrdenacao(
              'populares'
            )
          }
          style={[
            estilos.segmento,

            ordenacao ===
              'populares' &&
              estilos.segmentoAtivo,
          ]}
        >
          <Text
            style={
              estilos.segmentoTexto
            }
          >
            Populares
          </Text>
        </Pressable>
      </View>

      {/* CARREGANDO */}
      {carregando && (
        <ActivityIndicator
          color={
            cores.primaria
          }
          style={
            estilos.carregando
          }
        />
      )}

      {/* ERRO */}
      {!carregando &&
        !!erro && (
          <Text
            style={estilos.erro}
          >
            {erro}
          </Text>
        )}

      {/* LISTA */}
      {!carregando &&
        !erro && (
          <View
            style={estilos.lista}
          >
            {atividades.map(
              (atividade) => (
                <CardAtividade
                  key={
                    atividade.id
                  }
                  atividade={
                    atividade
                  }
                  aoAbrir={() =>
                    abrirAtividade(
                      atividade
                    )
                  }
                />
              )
            )}
          </View>
        )}
    </ScreenTemplate>
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

      marginBottom:
        espacamentos.lg,
    },

    segmento: {
      flex: 1,

      alignItems:
        'center',

      justifyContent:
        'center',
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

    lista: {
      gap:
        espacamentos.md,
    },

    carregando: {
      marginTop:
        espacamentos.xl,
    },

    erro: {
      marginTop:
        espacamentos.xl,

      textAlign:
        'center',

      fontSize:
        tipografia.corpo,

      color:
        cores.perigo,
    },

    botaoAdicionar: {
      width: 44,
      height: 44,

      borderRadius: 22,

      backgroundColor:
        '#000000',

      alignItems:
        'center',

      justifyContent:
        'center',
    },

    pressionado: {
      opacity: 0.6,
    },
  });