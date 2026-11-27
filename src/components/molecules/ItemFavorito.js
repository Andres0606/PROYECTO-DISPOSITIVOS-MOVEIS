/* grupo5.1 */
import { formatarDataNumerica } from '../../utils/formatacao';
// MOLECULE — ItemFavorito

import { useMemo } from 'react';

import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { FotoLocal } from '../atoms/FotoLocal';
import { BotaoIcone } from '../atoms/BotaoIcone';
import { Etiqueta } from '../atoms/Etiqueta';

import { espacamentos, raios, tipografia } from '../../theme';
import { useTema } from '../../theme/useTema';

import { usePreferencias } from '../../contexts/PreferenciasContext';
import { obterTraducaoFrase } from '../../utils/frases';

const ICONES = {
  lugares: 'location-outline',
  frases: 'chatbubble-outline',
  atividades: 'calendar-outline',
};

export function ItemFavorito({
  item,
  tipo,
  aoAbrir,
  aoRemover,
  removendo = false,
}) {
  const {
    t: grupo1Traducao,
    idioma,
  } = usePreferencias();

  const { cores } = useTema();

  const estilos = useMemo(
    () => criarEstilos(cores),
    [cores]
  );

  const titulo = item.nome ?? item.titulo;

  // CONTEÚDO CONFORME O TIPO DE FAVORITO

  const descricao =
    tipo === 'frases'
      ? obterTraducaoFrase(item, idioma)
      : tipo === 'atividades'
        ? [formatarDataNumerica(item.dataAtividade, idioma), item.horario]
            .filter(Boolean)
            .join(' · ')
        : item.descricao;

  return (
    <View style={estilos.item}>

      <Pressable
        onPress={aoAbrir}
        disabled={!aoAbrir || removendo}
        accessibilityRole={aoAbrir ? 'button' : undefined}
        style={({ pressed }) => [
          estilos.conteudo,
          pressed && estilos.pressionado,
        ]}
      >

        <FotoLocal
          imagem={
            item.imagem
              ? { uri: item.imagem }
              : undefined
          }
          icone={ICONES[tipo]}
          style={estilos.imagem}
        />

        <View style={estilos.informacoes}>

          <Text
            style={estilos.titulo}
            numberOfLines={1}
          >
            {titulo}
          </Text>

          {!!descricao && (
            <Text
              style={estilos.descricao}
              numberOfLines={1}
            >
              {descricao}
            </Text>
          )}

          {tipo === 'atividades' && item.vencida && (
            <View style={estilos.estado}>
              <Etiqueta
                titulo={grupo1Traducao('grupo1.encerrada')}
              />
            </View>
          )}

        </View>

      </Pressable>

      <View style={estilos.coracao}>

        <BotaoIcone
          nome="heart-outline"
          tamanho={22}
          rotulo={
            grupo1Traducao('grupo1.remover_dos_favoritos')
          }
          aoPressionar={
            removendo ? undefined : aoRemover
          }
        />

      </View>

    </View>
  );
}

// ESTILOS

function criarEstilos(cores) {
  return StyleSheet.create({

    item: {
      minHeight: 72,
      flexDirection: 'row',
      alignItems: 'center',
      borderBottomWidth: 1,
      borderBottomColor: cores.borda,
      paddingVertical: espacamentos.sm,
      paddingHorizontal: espacamentos.xs,
    },

    conteudo: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      paddingRight: espacamentos.sm,
    },

    imagem: {
      width: 54,
      height: 54,
      borderRadius: raios.sm,
      marginRight: espacamentos.sm,
      backgroundColor: cores.superficie,
    },

    informacoes: {
      flex: 1,
    },

    titulo: {
      fontSize: tipografia.corpo,
      fontWeight: '700',
      color: cores.texto,
    },

    descricao: {
      marginTop: 3,
      fontSize: tipografia.legenda,
      color: cores.textoSecundario,
    },

    estado: {
      alignSelf: 'flex-start',
      marginTop: 4,
    },

    coracao: {
      width: 38,
      height: 38,
      alignItems: 'center',
      justifyContent: 'center',
    },

    pressionado: {
      opacity: 0.6,
    },

  });
}