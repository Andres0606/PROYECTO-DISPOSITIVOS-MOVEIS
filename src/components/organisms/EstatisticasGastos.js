
// ORGANISM — EstatisticasGastos

import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { BotaoSegmentado } from '../molecules/BotaoSegmentado';
import { CampoSelecao } from '../molecules/CampoSelecao';
import { CardInfo } from '../molecules/CardInfo';
import { formatarReais } from '../../utils/formatacao';
import { espacamentos, tipografia } from '../../theme';
import { useTema } from '../../theme/useTema';

const VISOES = [
  { valor: 'mes', titulo: 'Mês' },
  { valor: 'categoria', titulo: 'Categoria' },
];

function textoComparacao(variacao) {
  if (variacao === null) {
    return 'Sem gastos no mês anterior para comparar.';
  }

  return `Comparado com o mês anterior: ${variacao > 0 ? '+' : ''}${variacao} %.`;
}

function porcentagem(valor) {
  return `${(valor * 100).toFixed(1).replace('.', ',')}% dos gastos do mês`;
}

export function EstatisticasGastos({
  estatisticas, categoriasDisponiveis, visao, aoMudarVisao,
}) {
  const { cores } = useTema();
  const [categoria, setCategoria] = useState('');

  const { categorias, variacao, gasto, gastoAnterior } = estatisticas;

  const nomes = Array.from(new Set([
    ...categoriasDisponiveis.map(item => item.nome),
    ...categorias.map(item => item.categoria),
  ])).sort((a, b) => a.localeCompare(b, 'pt-BR'));

  const selecionada = nomes.includes(categoria)
    ? categoria
    : categorias[0]?.categoria ?? nomes[0] ?? '';

  const dadosCategoria = categorias.find(
    item => item.categoria === selecionada
  ) ?? { valor: 0, participacao: 0 };

  return (
    <View style={estilos.tela}>
      <BotaoSegmentado opcoes={VISOES}
        valor={visao} aoMudar={aoMudarVisao} />

      {visao === 'mes' ? (
        <>
          <CardInfo titulo="Total do mês" detalhe={formatarReais(gasto)}
            texto={`Mês anterior: ${formatarReais(gastoAnterior)}`} />

          {categorias.length === 0 ? (
            <Text style={[estilos.aviso, { color: cores.textoSecundario }]}>
              Nenhum gasto neste mês.
            </Text>
          ) : (
            categorias.map(item => (
              <CardInfo key={item.categoria}
                titulo={item.categoria}
                detalhe={formatarReais(item.valor)}
                progresso={item.participacao}
                legenda={porcentagem(item.participacao)} />
            ))
          )}

          <Text style={[estilos.aviso, { color: cores.textoSecundario }]}>
            {textoComparacao(variacao)}
          </Text>
        </>
      ) : (
        nomes.length > 0 ? (
          <>
            <CampoSelecao rotulo="Categoria" opcoes={nomes}
              valor={selecionada} aoMudar={setCategoria} />

            <CardInfo
              titulo={selecionada}
              detalhe={formatarReais(dadosCategoria.valor)}
              progresso={dadosCategoria.participacao}
              legenda={porcentagem(dadosCategoria.participacao)}
              texto={`Total do mês: ${formatarReais(gasto)}`}
            />

            {dadosCategoria.valor === 0 && (
              <Text style={[estilos.aviso, { color: cores.textoSecundario }]}>
                Nenhum gasto nesta categoria durante o mês.
              </Text>
            )}
          </>
        ) : (
          <Text style={[estilos.aviso, { color: cores.textoSecundario }]}>
            Nenhuma categoria disponível.
          </Text>
        )
      )}
    </View>
  );
}

const estilos = StyleSheet.create({
  tela: { gap: espacamentos.md },
  aviso: { textAlign: 'center', fontSize: tipografia.corpo },
});
