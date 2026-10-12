// ORGANISM — ResumoInicio (cards e atalhos da tela Início)
import { StyleSheet, View } from 'react-native';
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

// aoAbrirAtalho(chave) é opcional: será ligado quando as telas de destino existirem.
export function ResumoInicio({ resumo, aoAbrirAtalho }) {
  const { tarefas, gastos, conselhoDestaque, proximaAtividade } = resumo;

  return (
    <View style={estilos.lista}>
      <CardInfo
        titulo="Seu intercâmbio em Chapecó"
        progresso={calcularProporcao(tarefas.concluidas, tarefas.total)}
        legenda={`${tarefas.concluidas} de ${tarefas.total} tarefas concluídas`}
      />

      <CardInfo
        titulo={`Gastos de ${gastos.mes}`}
        detalhe={`${formatarReais(gastos.gasto)} / ${formatarReais(gastos.orcamento)}`}
        progresso={calcularProporcao(gastos.gasto, gastos.orcamento)}
      />

      <View style={estilos.atalhos}>
        {ATALHOS.map((atalho) => (
          <Chip
            key={atalho.chave}
            titulo={atalho.titulo}
            aoPressionar={() => aoAbrirAtalho?.(atalho.chave)}
          />
        ))}
      </View>

      <CardInfo
        titulo="Conselho em destaque"
        texto={`“${conselhoDestaque.texto}” — ${conselhoDestaque.autor}, ${conselhoDestaque.pais}.`}
      />

      <CardInfo
        titulo="Próxima atividade"
        detalhe={proximaAtividade.data}
        texto={proximaAtividade.titulo}
      />
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