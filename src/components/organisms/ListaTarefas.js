// ORGANISM — ListaTarefas (progresso, etapas e lista de tarefas da etapa)
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Pill } from '../atoms/Pill';
import { ProgressBar } from '../atoms/ProgressBar';
import { ItemTarefa } from '../molecules/ItemTarefa';
import { cores, espacamentos, tipografia } from '../../theme';

// aoAbrir(tarefa) e aoEditar(tarefa) são opcionais.
export function ListaTarefas({
  concluidas,
  total,
  etapas,
  etapa,
  aoMudarEtapa,
  tarefas,
  aoAlternar,
  aoAbrir,
  aoEditar,
}) {
  const progresso = total > 0 ? concluidas / total : 0;

  return (
    <View>
      <ProgressBar valor={progresso} altura={8} />
      <Text style={estilos.legenda}>
        {`${concluidas} de ${total} tarefas concluídas`}
      </Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={estilos.pillsScroll}
        contentContainerStyle={estilos.pills}
      >
        {etapas.map((nome) => (
          <Pill
            key={nome}
            titulo={nome}
            selecionado={nome === etapa}
            aoPressionar={() => aoMudarEtapa(nome)}
          />
        ))}
      </ScrollView>

      <Text style={estilos.secao}>{etapa}</Text>

      {tarefas.length === 0 ? (
        <Text style={estilos.vazio}>Nenhuma tarefa nesta etapa.</Text>
      ) : (
        <View>
          {tarefas.map((tarefa) => (
            <ItemTarefa
              key={tarefa.id}
              titulo={tarefa.titulo}
              concluida={tarefa.concluida}
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
    color: cores.textoSecundario,
  },
  // Sangra até as bordas da tela para a rolagem horizontal das pills.
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
    color: cores.texto,
  },
  vazio: {
    marginTop: espacamentos.md,
    textAlign: 'center',
    fontSize: tipografia.corpo,
    color: cores.textoSecundario,
  },
});