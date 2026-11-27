import { usePreferencias } from '../../contexts/PreferenciasContext';

// ORGANISM — DetalheLocal

import { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Card } from '../atoms/Card';
import { Chip } from '../atoms/Chip';
import { FotoLocal } from '../atoms/FotoLocal';
import { MapaLocais } from './MapaLocais';

import { espacamentos, tipografia } from '../../theme';
import { useTema } from '../../theme/useTema';

export function DetalheLocal({
  local,
  guardado,
  salvando = false,
  aoAlternarGuardado,
  aoVerMapa,
}) {
  const { t } = usePreferencias();
  const { cores } = useTema();
  const estilos = useMemo(() => criarEstilos(cores), [cores]);
  const locaisMapa = useMemo(() => [local], [local]);

  const temEndereco = !!(local.endereco || local.bairro);

  const temInformacoes = !!(
    local.horario ||
    local.telefone ||
    local.siteUrl
  );

  const temCoordenadas =
    Number.isFinite(local.latitude) &&
    Number.isFinite(local.longitude) &&
    Math.abs(local.latitude) <= 90 &&
    Math.abs(local.longitude) <= 180;

  return (
    <View>

      <FotoLocal
        imagem={
          local.imagemUrl
            ? { uri: local.imagemUrl }
            : undefined
        }
        style={estilos.foto}
      />

      <Text style={estilos.nome}>{local.nome}</Text>

      <Text style={estilos.subtitulo}>
        {local.categoria}
      </Text>

      {!!local.descricao && (
        <Text style={estilos.descricao}>
          {local.descricao}
        </Text>
      )}

      {temEndereco && (
        <Card style={estilos.endereco}>
          <Text style={estilos.tituloSecao}>
            {t('grupo2.g064')}
          </Text>

          {!!local.endereco && (
            <Text style={estilos.rua}>
              {local.endereco}
            </Text>
          )}

          {!!local.bairro && (
            <Text style={estilos.informacao}>
              {local.bairro}
            </Text>
          )}
        </Card>
      )}

      {temInformacoes && (
        <Card style={estilos.endereco}>
          <Text style={estilos.tituloSecao}>
            {t('grupo2.g065')}
          </Text>

          {!!local.horario && (
            <Text style={estilos.informacao}>
              {t('grupo2.g066')} {local.horario}
            </Text>
          )}

          {!!local.telefone && (
            <Text style={estilos.informacao}>
              {t('grupo2.g067')} {local.telefone}
            </Text>
          )}

          {!!local.siteUrl && (
            <Text style={estilos.informacao}>
              {t('grupo2.g068')} {local.siteUrl}
            </Text>
          )}
        </Card>
      )}

      <View style={estilos.mapa}>
        <Text style={estilos.tituloSecao}>
          {t('grupo2.g069')}
        </Text>

        {temCoordenadas ? (
          <MapaLocais
            locais={locaisMapa}
            altura={210}
          />
        ) : (
          <Text style={estilos.informacao}>
            {t('grupo2.g070')}
          </Text>
        )}
      </View>

      <View style={estilos.acoes}>
        <Chip
          titulo={t('grupo2.g071')}
          aoPressionar={aoVerMapa}
        />

        <Chip
          titulo={
            salvando
              ? t('grupo2.g072')
              : guardado
                ? t('grupo2.g073')
                : t('grupo2.g074')
          }
          variante={guardado ? 'selecionado' : 'suave'}
          aoPressionar={
            salvando ? undefined : aoAlternarGuardado
          }
        />
      </View>

    </View>
  );
}

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

    informacao: {
      fontSize: tipografia.corpo,
      color: cores.textoSecundario,
    },

    mapa: {
      marginTop: espacamentos.lg,
      gap: espacamentos.xs,
    },

    acoes: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: espacamentos.lg,
      marginTop: espacamentos.lg,
    },
  });
}
