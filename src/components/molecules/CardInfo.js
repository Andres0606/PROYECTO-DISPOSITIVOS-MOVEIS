// MOLECULE — CardInfo

import { useMemo } from 'react';

import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { Card } from '../atoms/Card';
import { ProgressBar } from '../atoms/ProgressBar';

import {
  espacamentos,
  tipografia,
} from '../../theme';

import { useTema } from '../../theme/useTema';

export function CardInfo({
  titulo,
  detalhe,
  progresso,
  legenda,
  texto,
}) {
  const { cores } = useTema();

  const estilos = useMemo(
    () => criarEstilos(cores),
    [cores]
  );

  return (
    <Card>

      <View style={estilos.cabecalho}>

        <Text style={estilos.titulo}>
          {titulo}
        </Text>

        {!!detalhe && (
          <Text style={estilos.detalhe}>
            {detalhe}
          </Text>
        )}

      </View>

      {progresso !== undefined && (
        <View style={estilos.barra}>
          <ProgressBar valor={progresso} />
        </View>
      )}

      {!!legenda && (
        <Text style={estilos.legenda}>
          {legenda}
        </Text>
      )}

      {!!texto && (
        <Text style={estilos.texto}>
          {texto}
        </Text>
      )}

    </Card>
  );
}

// ============================================================
// ESTILOS DINÂMICOS
// ============================================================

function criarEstilos(cores) {
  return StyleSheet.create({
    cabecalho: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: espacamentos.sm,
    },

    titulo: {
      flexShrink: 1,
      fontSize: tipografia.subtitulo,
      lineHeight: 24,
      fontWeight: '600',
      color: cores.texto,
    },

    detalhe: {
      fontSize: tipografia.corpo,
      color: cores.textoSecundario,
    },

    barra: {
      marginTop: espacamentos.sm,
    },

    legenda: {
      marginTop: espacamentos.sm,
      fontSize: tipografia.legenda,
      color: cores.textoSecundario,
    },

    texto: {
      marginTop: espacamentos.xs,
      fontSize: tipografia.corpo,
      lineHeight: 21,
      color: cores.textoSecundario,
    },
  });
}