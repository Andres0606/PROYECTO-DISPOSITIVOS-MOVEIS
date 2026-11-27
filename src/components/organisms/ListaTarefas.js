import { rotuloCatalogo } from '../../i18n/catalogosGrupo2';
import { usePreferencias } from '../../contexts/PreferenciasContext';
// ORGANISM — ListaTarefas

import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Pill } from '../atoms/Pill';
import { ProgressBar } from '../atoms/ProgressBar';
import { ItemTarefa } from '../molecules/ItemTarefa';
import { espacamentos, tipografia } from '../../theme';
import { useTema } from '../../theme/useTema';

export function ListaTarefas({
  concluidas,
  total,
  etapas,
  etapa,
  aoMudarEtapa,
  tarefas,
  ocupado = false,
  aoAlternar,
  aoAbrir,
  aoEditar,
}) {
  const { t } = usePreferencias();
  const { cores } = useTema();
  const progresso = total > 0 ? concluidas / total : 0;

  return (
    <View>
      <ProgressBar valor={progresso} altura={8} />

      <Text style={[estilos.legenda, { color: cores.textoSecundario }]}>
        {t('grupo2.g152', { v0: concluidas, v1: total })}
      </Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={estilos.pillsScroll}
        contentContainerStyle={estilos.pills}
      >
        {etapas.map(nome => (
          <Pill
            key={nome}
            titulo={rotuloCatalogo(nome, t)}
            selecionado={nome === etapa}
            aoPressionar={() => aoMudarEtapa(nome)}
          />
        ))}
      </ScrollView>

      <Text style={[estilos.secao, { color: cores.texto }]}>
        {rotuloCatalogo(etapa, t)}
      </Text>

      {tarefas.length === 0 ? (
        <Text style={[estilos.vazio, { color: cores.textoSecundario }]}>
          {t('grupo2.g077')}
        </Text>
      ) : (
        <View>
          {tarefas.map(tarefa => (
            <ItemTarefa
              key={tarefa.id}
              titulo={tarefa.titulo}
              concluida={tarefa.concluida}
              estado={tarefa.estado}
              ocupado={ocupado}
              aoAlternar={() => aoAlternar(tarefa)}
              aoAbrir={() => aoAbrir?.(tarefa)}
              aoEditar={() => aoEditar?.(tarefa)}
            />
          ))}
        </View>
      )}
    </View>
  );
}

const estilos = StyleSheet.create({
  legenda: {
    marginTop: espacamentos.sm,
    fontSize: tipografia.corpo,
    fontWeight: '600',
  },
  pillsScroll: {
    marginTop: espacamentos.lg,
    marginHorizontal: -espacamentos.lg,
  },
  pills: {
    paddingHorizontal: espacamentos.lg,
    gap: 12,
  },
  secao: {
    marginTop: espacamentos.lg - 4,
    marginBottom: espacamentos.md,
    fontSize: tipografia.subtitulo,
    fontWeight: '600',
  },
  vazio: {
    marginTop: espacamentos.md,
    textAlign: 'center',
    fontSize: tipografia.corpo,
  },
});