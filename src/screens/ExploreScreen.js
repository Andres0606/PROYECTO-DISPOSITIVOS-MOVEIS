// SCREEN — Explorar Chapecó (lista de locais com busca e filtros)
import { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { ScreenTemplate } from '../components/templates/ScreenTemplate';
import { FiltrosExplorar } from '../components/organisms/FiltrosExplorar';
import { ListaLocais } from '../components/organisms/ListaLocais';
import { Button } from '../components/atoms/Button';
import { obterLocais } from '../services/locais';
import { filtrarLocais } from '../utils/locais';
import { CATEGORIA_TODOS } from '../constants/locais';
import { cores, espacamentos, tipografia } from '../theme';

export function ExploreScreen({ navigation }) {
  const [locais, setLocais] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  const [busca, setBusca] = useState('');
  const [categoria, setCategoria] = useState(CATEGORIA_TODOS);
  const [visao, setVisao] = useState('lista');

  const carregar = useCallback(async () => {
    setCarregando(true);
    setErro('');
    try {
      setLocais(await obterLocais());
    } catch (e) {
      setErro('Não foi possível carregar os locais. Tente novamente.');
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    carregar();
  }, [carregar]);

  const locaisFiltrados = useMemo(
    () => filtrarLocais(locais, busca, categoria),
    [locais, busca, categoria]
  );

  // TODO: abrir a tela Filtros quando ela existir.
  function abrirFiltros() {}

  function abrirLocal(local) {
    navigation.navigate('DetalheLocal', { localId: local.id });
  }

  return (
    <ScreenTemplate titulo="Explorar Chapecó">
      <View style={estilos.filtros}>
        <FiltrosExplorar
          busca={busca}
          aoMudarBusca={setBusca}
          aoFiltrar={abrirFiltros}
          visao={visao}
          aoMudarVisao={setVisao}
          categoria={categoria}
          aoMudarCategoria={setCategoria}
        />
      </View>

      {carregando && (
        <ActivityIndicator color={cores.primaria} style={estilos.centro} />
      )}

      {!carregando && !!erro && (
        <View style={estilos.centro}>
          <Text style={estilos.erro}>{erro}</Text>
          <Button
            titulo="Tentar novamente"
            variante="secundario"
            aoPressionar={carregar}
          />
        </View>
      )}

      {!carregando && !erro && visao === 'lista' && (
        <ListaLocais locais={locaisFiltrados} aoAbrirLocal={abrirLocal} />
      )}

      {!carregando && !erro && visao === 'mapa' && (
        <Text style={estilos.aviso}>O mapa estará disponível em breve.</Text>
      )}
    </ScreenTemplate>
  );
}

const estilos = StyleSheet.create({
  filtros: { marginBottom: espacamentos.lg },
  centro: { marginTop: espacamentos.xl, gap: espacamentos.md },
  erro: {
    fontSize: tipografia.corpo,
    textAlign: 'center',
    color: cores.perigo,
  },
  aviso: {
    marginTop: espacamentos.lg,
    textAlign: 'center',
    fontSize: tipografia.corpo,
    color: cores.textoSecundario,
  },
});