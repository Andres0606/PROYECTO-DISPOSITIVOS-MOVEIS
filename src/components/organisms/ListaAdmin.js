import { rotuloAdmin, rotuloCategoriaAdmin } from '../../i18n/catalogosGrupo4';
import { usePreferencias } from '../../contexts/PreferenciasContext';

// ORGANISM — ListaAdmin

import { useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { BarraBusca } from '../molecules/BarraBusca';
import { BotaoSegmentado } from '../molecules/BotaoSegmentado';
import { Button } from '../atoms/Button';
import { normalizarTexto } from '../../utils/texto';
import { espacamentos, tipografia } from '../../theme';
import { useTema } from '../../theme/useTema';

const ESTADOS = [
  { titulo: 'Todos', valor: 'todos' },
  { titulo: 'Ativos', valor: 'ativos' },
  { titulo: 'Inativos', valor: 'inativos' },
];

export function ListaAdmin({
  itens = [], renderItem, camposBusca,
  carregando = false, erro = '', aoRecarregar,
  filtrarEstado = true, placeholder,
}) {
  const { t } = usePreferencias();
  const { cores } = useTema();
  const [busca, setBusca] = useState('');
  const [estado, setEstado] = useState('todos');

  const termo = normalizarTexto(busca.trim());

  const filtrados = itens.filter(item => {
    const correspondeEstado =
      !filtrarEstado || estado === 'todos' ||
      item.ativo === (estado === 'ativos');

    const correspondeBusca = !termo || camposBusca(item).some(valor =>
      normalizarTexto(valor ?? '').includes(termo)
    );

    return correspondeEstado && correspondeBusca;
  });

  return (
    <View style={estilos.container}>
      <BarraBusca valor={busca}
        aoMudar={setBusca} placeholder={placeholder ?? t('grupo4.g105')} />

      {filtrarEstado && (
        <BotaoSegmentado opcoes={ESTADOS.map(item => ({ ...item, titulo: rotuloAdmin(item.titulo, t) }))}
          valor={estado} aoMudar={setEstado} />
      )}

      {carregando ? (
        <ActivityIndicator color={cores.primaria} />
      ) : erro ? (
        <View style={estilos.estado}>
          <Text style={{ color: cores.perigo }}>{erro}</Text>

          <Button titulo={t('grupo4.g023')} variante="contorno"
            aoPressionar={aoRecarregar} />
        </View>
      ) : (
        <>
          <Text style={[estilos.contagem, { color: cores.textoSecundario }]}>
            {t('grupo4.g115', { total: filtrados.length })}
          </Text>

          {filtrados.length === 0 ? (
            <Text style={[estilos.vazio, { color: cores.textoSecundario }]}>
              {t('grupo4.g106')}
            </Text>
          ) : (
            filtrados.map(item => (
              <View key={item.id}>{renderItem(item)}</View>
            ))
          )}
        </>
      )}
    </View>
  );
}

const estilos = StyleSheet.create({
  container: { gap: espacamentos.md },
  estado: { gap: espacamentos.md, alignItems: 'center' },
  contagem: { fontSize: tipografia.legenda },
  vazio: { textAlign: 'center', marginTop: espacamentos.lg },
});
