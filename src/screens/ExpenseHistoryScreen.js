// SCREEN — Histórico de gastos
import { useCallback, useMemo, useRef, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { ScreenTemplate } from '../components/templates/ScreenTemplate';
import { HistoricoGastos } from '../components/organisms/HistoricoGastos';
import { Button } from '../components/atoms/Button';
import { obterGastos } from '../services/gastos';
import { filtrarGastos } from '../utils/gastos';
import { cores, espacamentos, tipografia } from '../theme';

export function ExpenseHistoryScreen({ navigation }) {
  const [gastos, setGastos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');
  const [busca, setBusca] = useState('');

  // Depois da primeira carga, as recargas (ao voltar de Editar gasto) são
  // silenciosas: sem indicador de carregamento e sem apagar a lista.
  const jaCarregou = useRef(false);

  const carregar = useCallback(async () => {
    const primeira = !jaCarregou.current;

    if (primeira) {
      setCarregando(true);
    }
    setErro('');

    try {
      setGastos(await obterGastos());
      jaCarregou.current = true;
    } catch (e) {
      if (primeira) {
        setErro('Não foi possível carregar o histórico. Tente novamente.');
      }
    } finally {
      setCarregando(false);
    }
  }, []);

  // Recarrega sempre que a tela volta a ficar em foco.
  useFocusEffect(
    useCallback(() => {
      carregar();
    }, [carregar])
  );

  const gastosFiltrados = useMemo(
    () => filtrarGastos(gastos, busca),
    [gastos, busca]
  );

  function abrirGasto(gasto) {
    navigation.navigate('EditarGasto', { gastoId: gasto.id });
  }

  return (
    <ScreenTemplate titulo="Histórico" aoVoltar={() => navigation.goBack()}>
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

      {!carregando && !erro && (
        <HistoricoGastos
          gastos={gastosFiltrados}
          busca={busca}
          aoMudarBusca={setBusca}
          aoAbrirGasto={abrirGasto}
        />
      )}
    </ScreenTemplate>
  );
}

const estilos = StyleSheet.create({
  centro: { marginTop: espacamentos.xl, gap: espacamentos.md },
  erro: {
    fontSize: tipografia.corpo,
    textAlign: 'center',
    color: cores.perigo,
  },
});