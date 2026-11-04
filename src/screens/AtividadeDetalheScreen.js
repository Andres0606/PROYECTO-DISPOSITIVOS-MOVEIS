// SCREEN — Detalhes da atividade

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

import { ScreenTemplate } from '../components/templates/ScreenTemplate';

import {
  obterAtividadePorId,
} from '../services/atividades';

import {
  cores,
  espacamentos,
  raios,
  tipografia,
} from '../theme';

export function AtividadeDetalheScreen({
  navigation,
  route,
}) {
  const atividadeInicial =
    route.params?.atividade;

  const ordenacao =
    route.params?.ordenacao ??
    'recentes';

  const [atividade, setAtividade] =
    useState(
      atividadeInicial
    );

  const [
    interessado,
    setInteressado,
  ] =
    useState(false);

  useFocusEffect(
    useCallback(() => {
      async function carregarAtividade() {
        if (
          !atividadeInicial?.id
        ) {
          return;
        }

        const resultado =
          await obterAtividadePorId(
            atividadeInicial.id
          );

        if (resultado) {
          setAtividade(
            resultado
          );
        }
      }

      carregarAtividade();
    }, [
      atividadeInicial?.id,
    ])
  );

  if (!atividade) {
    return (
      <ScreenTemplate
        titulo="Detalhes"
        aoVoltar={() =>
          navigation.goBack()
        }
      >
        <Text style={estilos.erro}>
          Atividade não encontrada.
        </Text>
      </ScreenTemplate>
    );
  }

  function alternarInteresse() {
    setInteressado(
      (atual) => !atual
    );
  }

  function editarAtividade() {
    navigation.navigate(
      'EditarAtividade',
      {
        atividade,
      }
    );
  }

  return (
    <ScreenTemplate
      titulo="Detalhes"
      aoVoltar={() =>
        navigation.goBack()
      }
    >
      <View
        style={
          estilos.segmentado
        }
      >
        <View
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
        </View>

        <View
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
        </View>
      </View>

      {atividade.imagem ? (
        <Image
          source={{
            uri:
              atividade.imagem,
          }}
          style={estilos.imagem}
          resizeMode="cover"
        />
      ) : (
        <View
          style={
            estilos.imagemVazia
          }
        >
          <Text
            style={
              estilos.imagemVaziaTexto
            }
          >
            Sem imagem
          </Text>
        </View>
      )}

      <Text
        style={estilos.titulo}
      >
        {atividade.titulo}
      </Text>

      <View
        style={estilos.categoria}
      >
        <Text
          style={
            estilos.categoriaTexto
          }
        >
          {atividade.categoria}
        </Text>
      </View>

      <Text
        style={estilos.informacao}
      >
        {atividade.dataCompleta ??
          atividade.data}
        {' · '}
        {atividade.horario}
      </Text>

      <Text
        style={estilos.informacao}
      >
        {atividade.local}
      </Text>

      <Text
        style={
          estilos.interessados
        }
      >
        {atividade.interessados +
          (interessado
            ? 1
            : 0)}{' '}
        pessoas interessadas
      </Text>

      <View
        style={
          estilos.descricaoBox
        }
      >
        <Text
          style={
            estilos.descricao
          }
        >
          {atividade.descricao}
        </Text>
      </View>

      <View
        style={estilos.botoes}
      >
        <Pressable
          onPress={
            alternarInteresse
          }
          style={({
            pressed,
          }) => [
            estilos.botaoInteresse,

            interessado &&
              estilos.botaoInteresseAtivo,

            pressed &&
              estilos.pressionado,
          ]}
        >
          <Text
            style={
              estilos.botaoInteresseTexto
            }
          >
            {interessado
              ? 'Interessado'
              : 'Me interessa'}
          </Text>
        </Pressable>

        <Pressable
          onPress={
            editarAtividade
          }
          style={({
            pressed,
          }) => [
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

    imagem: {
      width: '100%',
      height: 180,

      borderRadius:
        raios.md,

      backgroundColor:
        cores.superficie,
    },

    imagemVazia: {
      width: '100%',
      height: 180,

      borderRadius:
        raios.md,

      backgroundColor:
        '#ECECEC',

      alignItems:
        'center',

      justifyContent:
        'center',
    },

    imagemVaziaTexto: {
      fontSize:
        tipografia.legenda,

      color:
        cores.textoSecundario,
    },

    titulo: {
      marginTop:
        espacamentos.md,

      marginBottom:
        espacamentos.sm,

      fontSize: 19,

      fontWeight:
        '700',

      color:
        cores.texto,
    },

    categoria: {
      alignSelf:
        'flex-start',

      paddingHorizontal:
        espacamentos.md,

      paddingVertical: 7,

      borderWidth: 1,

      borderColor:
        cores.borda,

      borderRadius:
        raios.pill,

      backgroundColor:
        cores.superficie,

      marginBottom:
        espacamentos.md,
    },

    categoriaTexto: {
      fontSize:
        tipografia.legenda,

      color:
        cores.texto,
    },

    informacao: {
      marginBottom:
        espacamentos.sm,

      fontSize:
        tipografia.corpo,

      color:
        cores.textoSecundario,
    },

    interessados: {
      marginTop:
        espacamentos.xs,

      marginBottom:
        espacamentos.sm,

      fontSize:
        tipografia.corpo,

      fontWeight:
        '700',

      color:
        cores.texto,
    },

    descricaoBox: {
      minHeight: 90,

      borderWidth: 1,

      borderColor:
        cores.borda,

      borderRadius:
        raios.sm,

      padding:
        espacamentos.md,

      backgroundColor:
        cores.superficie,

      marginBottom:
        espacamentos.md,
    },

    descricao: {
      fontSize:
        tipografia.legenda,

      lineHeight: 20,

      color:
        cores.textoSecundario,
    },

    botoes: {
      flexDirection:
        'row',

      gap:
        espacamentos.md,

      marginTop:
        espacamentos.sm,
    },

    botaoInteresse: {
      flex: 1,

      minHeight: 48,

      borderRadius:
        raios.sm,

      backgroundColor:
        '#000000',

      alignItems:
        'center',

      justifyContent:
        'center',
    },

    botaoInteresseAtivo: {
      opacity: 0.75,
    },

    botaoInteresseTexto: {
      fontSize:
        tipografia.legenda,

      fontWeight:
        '700',

      color:
        '#FFFFFF',
    },

    botaoEditar: {
      flex: 1,

      minHeight: 48,

      borderRadius:
        raios.sm,

      backgroundColor:
        '#D3D3D3',

      alignItems:
        'center',

      justifyContent:
        'center',
    },

    botaoEditarTexto: {
      fontSize:
        tipografia.legenda,

      fontWeight:
        '700',

      color:
        '#000000',
    },

    pressionado: {
      opacity: 0.6,
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
  });