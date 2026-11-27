// ORGANISM — HistoricoGastos

import { StyleSheet, Text, View } from 'react-native';

import { BarraBusca } from '../molecules/BarraBusca';
import { CardGasto } from '../molecules/CardGasto';
import { isoParaBr } from '../../utils/datas';

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
  const { cores } = useTema();

  const buscando = busca.trim() !== '';

  return (
    <View style={estilos.tela}>

      <BarraBusca
        valor={busca}
        aoMudar={aoMudarBusca}
        placeholder="Buscar gasto..."
      />

      {gastos.length === 0 ? (
        <Text
          style={[
            estilos.vazio,
            { color: cores.textoSecundario },
          ]}
        >
          {buscando
            ? 'Nenhum gasto encontrado.'
            : 'Nenhum gasto registrado ainda.'}
        </Text>
      ) : (
        <View style={estilos.lista}>

          {gastos.map((gasto) => (
            <CardGasto
              key={gasto.id}
              conceito={gasto.conceito}
              detalhe={`${gasto.categoria} · ${isoParaBr(gasto.data)}`}
              valor={formatarReais(gasto.valor)}
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