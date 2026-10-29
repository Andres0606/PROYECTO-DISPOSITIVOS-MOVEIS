// ORGANISM — EstatisticasGastos (visões + gastos por categoria + comparação)
// estatisticas: { categorias: [{ categoria, valor, participacao }], variacao }
import { StyleSheet, Text, View } from 'react-native';
import { BotaoSegmentado } from '../molecules/BotaoSegmentado';
import { CardInfo } from '../molecules/CardInfo';
import { formatarReais } from '../../utils/formatacao';
import { cores, espacamentos, tipografia } from '../../theme';

const VISOES = [
  { valor: 'mes', titulo: 'Mês' },
  { valor: 'categoria', titulo: 'Categoria' },
];

function textoComparacao(variacao) {
  if (variacao === null) {
    return 'Sem gastos no mês anterior para comparar.';
  }

  const sinal = variacao > 0 ? '+' : '';
  return `Comparado com o mês anterior: ${sinal}${variacao} %.`;
}

export function EstatisticasGastos({ estatisticas, visao, aoMudarVisao }) {
  const { categorias, variacao } = estatisticas;

  return (
    <View style={estilos.tela}>
      <BotaoSegmentado opcoes={VISOES} valor={visao} aoMudar={aoMudarVisao} />

      {visao === 'mes' && categorias.length === 0 && (
        <Text style={estilos.aviso}>Nenhum gasto neste mês.</Text>
      )}

      {visao === 'mes' && categorias.length > 0 && (
        <>
          <View style={estilos.lista}>
            {categorias.map((item) => (
              <CardInfo
                key={item.categoria}
                titulo={`${item.categoria} — ${formatarReais(item.valor)}`}
                progresso={item.participacao}
              />
            ))}
          </View>

          <Text style={estilos.comparacao}>{textoComparacao(variacao)}</Text>
        </>
      )}

      {visao === 'categoria' && (
        <Text style={estilos.aviso}>Esta visão estará disponível em breve.</Text>
      )}
    </View>
  );
}

const estilos = StyleSheet.create({
  tela: { gap: espacamentos.lg },
  lista: { gap: espacamentos.md },
  comparacao: {
    paddingHorizontal: espacamentos.sm,
    fontSize: tipografia.corpo,
    color: cores.textoSecundario,
  },
  aviso: {
    textAlign: 'center',
    fontSize: tipografia.corpo,
    color: cores.textoSecundario,
  },
});