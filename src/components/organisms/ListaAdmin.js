
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
  filtrarEstado = true, placeholder = 'Buscar...',
}) {
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
        aoMudar={setBusca} placeholder={placeholder} />

      {filtrarEstado && (
        <BotaoSegmentado opcoes={ESTADOS}
          valor={estado} aoMudar={setEstado} />
      )}

      {carregando ? (
        <ActivityIndicator color={cores.primaria} />
      ) : erro ? (
        <View style={estilos.estado}>
          <Text style={{ color: cores.perigo }}>{erro}</Text>

          <Button titulo="Tentar novamente" variante="contorno"
            aoPressionar={aoRecarregar} />
        </View>
      ) : (
        <>
          <Text style={[estilos.contagem, { color: cores.textoSecundario }]}>
            {filtrados.length} registro(s)
          </Text>

          {filtrados.length === 0 ? (
            <Text style={[estilos.vazio, { color: cores.textoSecundario }]}>
              Nenhum registro encontrado.
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
