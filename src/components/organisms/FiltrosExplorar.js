// ORGANISM — FiltrosExplorar (busca + Lista/Mapa + pills de categoria)
import { StyleSheet, View } from 'react-native';
import { Pill } from '../atoms/Pill';
import { BarraBusca } from '../molecules/BarraBusca';
import { BotaoSegmentado } from '../molecules/BotaoSegmentado';
import { CATEGORIAS_EXPLORAR } from '../../constants/locais';
import { espacamentos } from '../../theme';

const VISOES = [
  { valor: 'lista', titulo: 'Lista' },
  { valor: 'mapa', titulo: 'Mapa' },
];

export function FiltrosExplorar({
  busca,
  aoMudarBusca,
  aoFiltrar,
  visao,
  aoMudarVisao,
  categoria,
  aoMudarCategoria,
}) {
  return (
    <View style={estilos.bloco}>
      <BarraBusca
        valor={busca}
        aoMudar={aoMudarBusca}
        placeholder="Buscar lugares..."
        aoFiltrar={aoFiltrar}
      />

      <BotaoSegmentado opcoes={VISOES} valor={visao} aoMudar={aoMudarVisao} />

      <View style={estilos.pills}>
        {CATEGORIAS_EXPLORAR.map((nome) => (
          <Pill
            key={nome}
            titulo={nome}
            selecionado={nome === categoria}
            aoPressionar={() => aoMudarCategoria(nome)}
          />
        ))}
      </View>
    </View>
  );
}

const estilos = StyleSheet.create({
  bloco: { gap: espacamentos.md },
  pills: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    columnGap: 12,
    rowGap: 12,
  },
});