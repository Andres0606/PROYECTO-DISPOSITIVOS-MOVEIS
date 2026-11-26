// ORGANISM — DetalheLocal

import { useMemo } from 'react';

import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { Card } from '../atoms/Card';
import { Chip } from '../atoms/Chip';
import { FotoLocal } from '../atoms/FotoLocal';

import {
  espacamentos,
  raios,
  tipografia,
} from '../../theme';

import { useTema } from '../../theme/useTema';

export function DetalheLocal({
  local,
  guardado,
  salvando = false,
  aoAlternarGuardado,
  aoVerMapa,
}) {
  const { cores } = useTema();

  const estilos = useMemo(
    () => criarEstilos(cores),
    [cores]
  );

  const temEndereco =
    !!(local.endereco || local.bairro);

  const temInformacoes =
    !!(
      local.horario ||
      local.telefone ||
      local.siteUrl
    );

  return (
    <View>

      {/* FOTO DO LUGAR */}

      <FotoLocal
        imagem={
          local.imagemUrl
            ? { uri: local.imagemUrl }
            : undefined
        }
        style={estilos.foto}
      />

      {/* NOME E CATEGORIA */}

      <Text style={estilos.nome}>
        {local.nome}
      </Text>

      <Text style={estilos.subtitulo}>
        {local.categoria}
      </Text>

      {/* DESCRIÇÃO */}

      {!!local.descricao && (
        <Text style={estilos.descricao}>
          {local.descricao}
        </Text>
      )}

      {/* ENDEREÇO */}

      {temEndereco && (
        <Card style={estilos.endereco}>

          <Text style={estilos.tituloSecao}>
            Endereço
          </Text>

          {!!local.endereco && (
            <Text style={estilos.rua}>
              {local.endereco}
            </Text>
          )}

          {!!local.bairro && (
            <Text style={estilos.bairro}>
              {local.bairro}
            </Text>
          )}

        </Card>
      )}

      {/* INFORMAÇÕES DO LUGAR */}

      {temInformacoes && (
        <Card style={estilos.endereco}>

          <Text style={estilos.tituloSecao}>
            Informações
          </Text>

          {!!local.horario && (
            <Text style={estilos.informacao}>
              Horário: {local.horario}
            </Text>
          )}

          {!!local.telefone && (
            <Text style={estilos.informacao}>
              Telefone: {local.telefone}
            </Text>
          )}

          {!!local.siteUrl && (
            <Text style={estilos.informacao}>
              Site: {local.siteUrl}
            </Text>
          )}

        </Card>
      )}

      {/* MAPA — VISUALIZAÇÃO FUTURA */}

      <FotoLocal
        icone="map-outline"
        style={estilos.mapa}
      />

      {/* AÇÕES */}

      <View style={estilos.acoes}>

        <Chip
          titulo="Ver no mapa"
          aoPressionar={aoVerMapa}
        />

        <Chip
          titulo={
            salvando
              ? 'Aguarde...'
              : guardado
                ? 'Guardado'
                : 'Guardar'
          }

          variante={
            guardado
              ? 'selecionado'
              : 'suave'
          }

          aoPressionar={
            salvando
              ? undefined
              : aoAlternarGuardado
          }
        />

      </View>

    </View>
  );
}

// ============================================================
// ESTILOS
// ============================================================

function criarEstilos(cores) {
  return StyleSheet.create({
    foto: {
      width: '100%',
      height: 183,
      borderRadius: 16,
    },

    nome: {
      marginTop: espacamentos.md - 4,
      fontSize: tipografia.titulo,
      lineHeight: 34,
      fontWeight: '600',
      color: cores.texto,
    },

    subtitulo: {
      marginTop: espacamentos.xs,
      fontSize: tipografia.corpo,
      fontWeight: '600',
      color: cores.textoSecundario,
    },

    descricao: {
      marginTop: espacamentos.md,
      fontSize: tipografia.corpo,
      lineHeight: 23,
      color: cores.texto,
    },

    endereco: {
      marginTop: espacamentos.lg - 4,
      justifyContent: 'center',
      gap: espacamentos.xs,
      borderColor: cores.bordaForte,
    },

    tituloSecao: {
      fontSize: tipografia.corpo,
      fontWeight: '700',
      color: cores.texto,
      marginBottom: espacamentos.xs,
    },

    rua: {
      fontSize: tipografia.subtitulo,
      color: cores.texto,
    },

    bairro: {
      fontSize: tipografia.corpo,
      color: cores.textoSecundario,
    },

    informacao: {
      fontSize: tipografia.corpo,
      color: cores.textoSecundario,
    },

    mapa: {
      width: '100%',
      height: 134,
      marginTop: espacamentos.md,
      borderRadius: raios.sm,
    },

    acoes: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: espacamentos.lg,
      marginTop: espacamentos.lg,
    },
  });
}