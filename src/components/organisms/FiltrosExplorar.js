import { usePreferencias } from '../../contexts/PreferenciasContext';

// ORGANISM — FiltrosExplorar

import { StyleSheet, View } from 'react-native';

import { Pill } from '../atoms/Pill';
import { BarraBusca } from '../molecules/BarraBusca';
import { BotaoSegmentado } from '../molecules/BotaoSegmentado';

import { CATEGORIA_TODOS } from '../../constants/locais';
import { espacamentos } from '../../theme';

const VISOES = [
  { valor: 'lista', titulo: 'Lista' },
  { valor: 'mapa', titulo: 'Mapa' },
];

export function FiltrosExplorar({
  busca,
  aoMudarBusca,
  visao,
  aoMudarVisao,
  categoria,
  aoMudarCategoria,
  categorias = [],
}) {
  const { t } = usePreferencias();
  const opcoes = [
    { id: CATEGORIA_TODOS, nome: 'Todos' },
    ...categorias,
  ];

  return (
    <View style={estilos.bloco}>
      <BarraBusca
        valor={busca}
        aoMudar={aoMudarBusca}
        placeholder={t('grupo2.g076')}
      />

      <BotaoSegmentado
        opcoes={VISOES.map(item => ({ ...item, titulo: item.valor === 'lista' ? t('grupo2.g075') : t('grupo2.g012') }))}
        valor={visao}
        aoMudar={aoMudarVisao}
      />

      <View style={estilos.pills}>
        {opcoes.map(item => (
          <Pill
            key={item.id}
            titulo={item.id === CATEGORIA_TODOS ? t('grupo2.g041') : item.nome}
            selecionado={item.id === categoria}
            aoPressionar={() => aoMudarCategoria(item.id)}
          />
        ))}
      </View>
    </View>
  );
}

const estilos = StyleSheet.create({
  bloco: {
    gap: espacamentos.md,
  },

  pills: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    columnGap: 12,
    rowGap: 12,
  },
});
