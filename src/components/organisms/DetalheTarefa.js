import { rotuloCatalogo } from '../../i18n/catalogosGrupo2';
import { usePreferencias } from '../../contexts/PreferenciasContext';
// ORGANISM — DetalheTarefa

import { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Button } from '../atoms/Button';
import { Card } from '../atoms/Card';
import { Etiqueta } from '../atoms/Etiqueta';

import { formatarDataCurta } from '../../utils/formatacao';

import { espacamentos, tipografia } from '../../theme';
import { useTema } from '../../theme/useTema';
import { CampoSelecao } from '../molecules/CampoSelecao';

export function DetalheTarefa({
  tarefa,
  estados,
  ocupado,
  aoMudarEstado,
  aoAlternar,
  aoExcluir,
}) {
  const { t } = usePreferencias();
  const { cores } = useTema();

  const estilos = useMemo(
    () => criarEstilos(cores),
    [cores]
  );

  const prazo = tarefa.prazo
    ? formatarDataCurta(tarefa.prazo)
    : '';

  return (
    <View style={estilos.tela}>

      <View>

        <Text style={estilos.etapa}>
          {rotuloCatalogo(tarefa.etapa, t)}
        </Text>

        <Text style={estilos.titulo}>
          {tarefa.titulo}
        </Text>

        {(!!tarefa.prioridade || !!prazo) && (
          <View style={estilos.etiquetas}>

            {!!tarefa.prioridade && (
              <Etiqueta
                titulo={t('grupo2.g157', { v0: rotuloCatalogo(tarefa.prioridade, t) })}
              />
            )}

            {!!prazo && (
              <Etiqueta titulo={t('grupo2.g158', { v0: prazo })} />
            )}

          </View>
        )}

        {!!tarefa.descricao && (
          <Card style={estilos.descricao}>

            <Text style={estilos.rotulo}>
              {t('grupo2.g087')}
            </Text>

            <Text style={estilos.texto}>
              {tarefa.descricao}
            </Text>

          </Card>
        )}

      </View>

      <View style={estilos.acoes}>

        <CampoSelecao formatarOpcao={valor => rotuloCatalogo(valor, t)}
  rotulo={t('grupo2.g093')}
  opcoes={estados.map(item => item.nome)}
  valor={tarefa.estado}
  aoMudar={nome => {
    const estado = estados.find(item => item.nome === nome);

    if (estado && estado.id !== tarefa.estadoId) {
      aoMudarEstado(estado.id);
    }
  }}
  desabilitado={!!ocupado}
  margemInferior={espacamentos.md}
/>  

        <Button
          titulo={
            tarefa.concluida
              ? t('grupo2.g094')
              : t('grupo2.g095')
          }
          variante="escuro"
          aoPressionar={aoAlternar}
          carregando={ocupado === 'alternar'}
          desabilitado={!!ocupado}
        />

        <Button
          titulo={t('grupo2.g021')}
          variante="contorno"
          aoPressionar={aoExcluir}
          carregando={ocupado === 'excluir'}
          desabilitado={!!ocupado}
        />

      </View>

    </View>
  );
}

function criarEstilos(cores) {
  return StyleSheet.create({
    tela: {
      flexGrow: 1,
      justifyContent: 'space-between',
      gap: espacamentos.lg,
    },

    etapa: {
      fontSize: tipografia.corpo,
      fontWeight: '600',
      color: cores.textoSecundario,
    },

    titulo: {
      marginTop: espacamentos.sm,
      fontSize: tipografia.titulo,
      lineHeight: 34,
      fontWeight: '600',
      color: cores.texto,
    },

    etiquetas: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 12,
      marginTop: 12,
    },

    descricao: {
      marginTop: espacamentos.md,
    },

    rotulo: {
      fontSize: tipografia.subtitulo,
      color: cores.texto,
    },

    texto: {
      marginTop: espacamentos.sm,
      fontSize: tipografia.corpo,
      lineHeight: 21,
      color: cores.textoSecundario,
    },

    acoes: {
      gap: 6,
    },
  });
}