// ORGANISM — ResumoInicio

import { Pressable, StyleSheet, View } from 'react-native';
import { Chip } from '../atoms/Chip';
import { CardInfo } from '../molecules/CardInfo';
import { espacamentos } from '../../theme';
import { formatarReais } from '../../utils/formatacao';

const ATALHOS = [
  { chave: 'portugues', titulo: 'Português' },
  { chave: 'conselhos', titulo: 'Conselhos' },
  { chave: 'atividades', titulo: 'Atividades' },
];

function calcularProporcao(parte, total) {
  return total > 0 ? parte / total : 0;
}

export function ResumoInicio({ resumo, aoAbrirAtalho }) {
  const { tarefas, gastos, conselhoDestaque, proximaAtividade } = resumo;

  const temOrcamento = gastos.orcamento !== null;
  const excedido = temOrcamento && gastos.disponivel < 0;

  return (
    <View style={estilos.lista}>

      <Pressable onPress={() => aoAbrirAtalho('tarefas')}
        accessibilityRole="button">
        <CardInfo
          titulo="Seu intercâmbio em Chapecó"
          progresso={calcularProporcao(tarefas.concluidas, tarefas.total)}
          legenda={tarefas.total
            ? `${tarefas.concluidas} de ${tarefas.total} tarefas concluídas`
            : 'Nenhuma tarefa cadastrada.'}
        />
      </Pressable>

      <Pressable onPress={() => aoAbrirAtalho('gastos')}
        accessibilityRole="button">
        <CardInfo
          titulo={`Gastos — ${gastos.periodo}`}
          detalhe={formatarReais(gastos.gasto)}
          progresso={temOrcamento
            ? calcularProporcao(gastos.gasto, gastos.orcamento)
            : undefined}
          alerta={excedido}
          legenda={!temOrcamento
            ? 'Orçamento ainda não definido.'
            : `Orçamento: ${formatarReais(gastos.orcamento)}`}
          texto={temOrcamento
            ? excedido
              ? `Orçamento excedido em ${formatarReais(-gastos.disponivel)}.`
              : `Disponível: ${formatarReais(gastos.disponivel)}`
            : 'Toque para definir seu orçamento.'}
        />
      </Pressable>

      <View style={estilos.atalhos}>
        {ATALHOS.map(atalho => (
          <Chip key={atalho.chave}
            titulo={atalho.titulo}
            aoPressionar={() => aoAbrirAtalho(atalho.chave)} />
        ))}
      </View>

      <Pressable accessibilityRole="button"
        onPress={() => aoAbrirAtalho(
          'conselhoDetalhe', conselhoDestaque?.id
        )}>
        <CardInfo
          titulo="Conselho em destaque"
          texto={conselhoDestaque
            ? `“${conselhoDestaque.texto}” — ${[
              conselhoDestaque.autor,
              conselhoDestaque.pais,
            ].filter(Boolean).join(', ')}.`
            : 'Nenhum conselho publicado.'}
        />
      </Pressable>

      <Pressable accessibilityRole="button"
        onPress={() => aoAbrirAtalho(
          'atividadeDetalhe', proximaAtividade?.id
        )}>
        <CardInfo
          titulo="Próxima atividade"
          detalhe={proximaAtividade?.data}
          texto={proximaAtividade?.titulo
            ?? 'Nenhuma atividade próxima disponível.'}
        />
      </Pressable>

    </View>
  );
}

const estilos = StyleSheet.create({
  lista: { gap: espacamentos.md },
  atalhos: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    columnGap: espacamentos.sm,
    rowGap: espacamentos.md,
  },
});