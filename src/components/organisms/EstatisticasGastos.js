/* grupo5.1 */
import { rotuloCatalogo } from '../../i18n/catalogosGrupo2';
import { usePreferencias } from '../../contexts/PreferenciasContext';

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

function textoComparacao(variacao, t) {
  if (variacao === null) {
    return t('grupo2.g114');
  }

  return t('grupo2.g159', { v0: variacao > 0 ? '+' : '', v1: variacao });
}

function porcentagem(valor, t) {
  return t('grupo2.g160', { v0: (valor * 100).toFixed(1).replace('.', ',') });
}

export function EstatisticasGastos({
  estatisticas, categoriasDisponiveis, visao, aoMudarVisao,
}) {
  const { t, idioma } = usePreferencias();
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
      <BotaoSegmentado opcoes={VISOES.map(item => ({ ...item, titulo: item.valor === 'mes' ? t('grupo2.g112') : t('grupo2.g113') }))}
        valor={visao} aoMudar={aoMudarVisao} />

      {visao === 'mes' ? (
        <>
          <CardInfo titulo={t('grupo2.g115')} detalhe={formatarReais(gasto, idioma)}
            texto={t('grupo2.g161', { v0: formatarReais(gastoAnterior, idioma) })} />

          {categorias.length === 0 ? (
            <Text style={[estilos.aviso, { color: cores.textoSecundario }]}>
              {t('grupo2.g105')}
            </Text>
          ) : (
            categorias.map(item => (
              <CardInfo key={item.categoria}
                titulo={rotuloCatalogo(item.categoria, t)}
                detalhe={formatarReais(item.valor, idioma)}
                progresso={item.participacao}
                legenda={porcentagem(item.participacao, t)} />
            ))
          )}

          <Text style={[estilos.aviso, { color: cores.textoSecundario }]}>
            {textoComparacao(variacao, t)}
          </Text>
        </>
      ) : (
        nomes.length > 0 ? (
          <>
            <CampoSelecao formatarOpcao={valor => rotuloCatalogo(valor, t)} rotulo={t('grupo2.g113')} opcoes={nomes}
              valor={selecionada} aoMudar={setCategoria} />

            <CardInfo
              titulo={rotuloCatalogo(selecionada, t)}
              detalhe={formatarReais(dadosCategoria.valor, idioma)}
              progresso={dadosCategoria.participacao}
              legenda={porcentagem(dadosCategoria.participacao, t)}
              texto={t('grupo2.g162', { v0: formatarReais(gasto, idioma) })}
            />

            {dadosCategoria.valor === 0 && (
              <Text style={[estilos.aviso, { color: cores.textoSecundario }]}>
                {t('grupo2.g116')}
              </Text>
            )}
          </>
        ) : (
          <Text style={[estilos.aviso, { color: cores.textoSecundario }]}>
            {t('grupo2.g117')}
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
