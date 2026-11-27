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
          {tarefa.etapa}
        </Text>

        <Text style={estilos.titulo}>
          {tarefa.titulo}
        </Text>

        {(!!tarefa.prioridade || !!prazo) && (
          <View style={estilos.etiquetas}>

            {!!tarefa.prioridade && (
              <Etiqueta
                titulo={`${tarefa.prioridade} prioridade`}
              />
            )}

            {!!prazo && (
              <Etiqueta titulo={`Prazo: ${prazo}`} />
            )}

          </View>
        )}

        {!!tarefa.descricao && (
          <Card style={estilos.descricao}>

            <Text style={estilos.rotulo}>
              Descrição
            </Text>

            <Text style={estilos.texto}>
              {tarefa.descricao}
            </Text>

          </Card>
        )}

      </View>

      <View style={estilos.acoes}>

        <CampoSelecao
  rotulo="Estado da tarefa"
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
              ? 'Marcar como pendente'
              : 'Marcar como concluída'
          }
          variante="escuro"
          aoPressionar={aoAlternar}
          carregando={ocupado === 'alternar'}
          desabilitado={!!ocupado}
        />

        <Button
          titulo="Excluir tarefa"
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