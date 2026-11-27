/* grupo5.1 */
import { formatarDataNumerica } from '../../utils/formatacao';
import { rotuloCatalogo } from '../../i18n/catalogosGrupo2';
import { usePreferencias } from '../../contexts/PreferenciasContext';
// ORGANISM — HistoricoGastos

import { StyleSheet, Text, View } from 'react-native';

import { BarraBusca } from '../molecules/BarraBusca';
import { CardGasto } from '../molecules/CardGasto';

import {
  ICONES_CATEGORIA_GASTO,
  ICONE_GASTO_PADRAO,
} from '../../constants/gastos';

import {
  formatarReais,
} from '../../utils/formatacao';

import { espacamentos, tipografia } from '../../theme';
import { useTema } from '../../theme/useTema';

export function HistoricoGastos({
  gastos,
  busca,
  aoMudarBusca,
  aoAbrirGasto,
}) {
  const { t, idioma } = usePreferencias();
  const { cores } = useTema();

  const buscando = busca.trim() !== '';

  return (
    <View style={estilos.tela}>

      <BarraBusca
        valor={busca}
        aoMudar={aoMudarBusca}
        placeholder={t('grupo2.g109')}
      />

      {gastos.length === 0 ? (
        <Text
          style={[
            estilos.vazio,
            { color: cores.textoSecundario },
          ]}
        >
          {buscando
            ? t('grupo2.g110')
            : t('grupo2.g111')}
        </Text>
      ) : (
        <View style={estilos.lista}>

          {gastos.map((gasto) => (
            <CardGasto
              key={gasto.id}
              conceito={gasto.conceito}
              detalhe={`${rotuloCatalogo(gasto.categoria, t)} · ${formatarDataNumerica(gasto.data, idioma)}`}
              valor={formatarReais(gasto.valor, idioma)}
              icone={
                ICONES_CATEGORIA_GASTO[gasto.categoria]
                ?? ICONE_GASTO_PADRAO
              }
              aoPressionar={() => aoAbrirGasto?.(gasto)}
            />
          ))}

        </View>
      )}

    </View>
  );
}

const estilos = StyleSheet.create({
  tela: {
    gap: espacamentos.md,
  },

  lista: {
    gap: espacamentos.md,
  },

  vazio: {
    marginTop: espacamentos.md,
    textAlign: 'center',
    fontSize: tipografia.corpo,
  },
});