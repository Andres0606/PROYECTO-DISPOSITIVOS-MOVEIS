
// SCREEN — Histórico de gastos

import { useCallback, useRef, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { ScreenTemplate } from '../components/templates/ScreenTemplate';
import { HistoricoGastos } from '../components/organisms/HistoricoGastos';
import { BotaoSegmentado } from '../components/molecules/BotaoSegmentado';
import { SeletorMes } from '../components/molecules/SeletorMes';
import { Button } from '../components/atoms/Button';
import { obterGastos } from '../services/gastos';
import { filtrarGastos } from '../utils/gastos';
import { periodoAtual } from '../utils/datas';
import { espacamentos, tipografia } from '../theme';
import { useTema } from '../theme/useTema';

const FILTROS = [
  { titulo: 'Todos', valor: 'todos' },
  { titulo: 'Por mês', valor: 'mes' },
];

export function ExpenseHistoryScreen({ navigation, route }) {
  const { cores } = useTema();
  const [periodo, setPeriodo] = useState(
    () => route.params?.periodo ?? periodoAtual()
  );
  const [filtro, setFiltro] = useState('todos');
  const [gastos, setGastos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');
  const [busca, setBusca] = useState('');

  const consultaAtual = useRef(0);

  const carregar = useCallback(async () => {
    const consulta = ++consultaAtual.current;
    setCarregando(true);
    setErro('');

    try {
      const lista = filtro === 'mes'
        ? await obterGastos(periodo.ano, periodo.mes)
        : await obterGastos();

      if (consulta === consultaAtual.current) setGastos(lista);
    } catch {
      if (consulta === consultaAtual.current) {
        setErro('Não foi possível carregar o histórico.');
      }
    } finally {
      if (consulta === consultaAtual.current) setCarregando(false);
    }
  }, [filtro, periodo.ano, periodo.mes]);

  useFocusEffect(
    useCallback(() => {
      carregar();
      return () => { consultaAtual.current += 1; };
    }, [carregar])
  );

  function mudarFiltro(valor) {
    if (valor === filtro) return;

    consultaAtual.current += 1;
    setCarregando(true);
    setFiltro(valor);
  }

  function mudarPeriodo(novoPeriodo) {
    consultaAtual.current += 1;
    setCarregando(true);
    setPeriodo(novoPeriodo);
  }

  return (
    <ScreenTemplate titulo="Histórico"
      aoVoltar={() => navigation.goBack()}>

      <View style={estilos.filtros}>
        <BotaoSegmentado opcoes={FILTROS} valor={filtro}
          aoMudar={mudarFiltro} />

        {filtro === 'mes' && (
          <SeletorMes periodo={periodo} aoMudar={mudarPeriodo}
            desabilitado={carregando} />
        )}
      </View>

      {carregando ? (
        <ActivityIndicator color={cores.primaria} style={estilos.centro} />
      ) : erro ? (
        <View style={estilos.centro}>
          <Text style={[estilos.erro, { color: cores.perigo }]}>{erro}</Text>
          <Button titulo="Tentar novamente" variante="secundario"
            aoPressionar={carregar} />
        </View>
      ) : (
        <HistoricoGastos
          gastos={filtrarGastos(gastos, busca)}
          busca={busca}
          aoMudarBusca={setBusca}
          aoAbrirGasto={gasto =>
            navigation.navigate('EditarGasto', { gastoId: gasto.id })
          }
        />
      )}
    </ScreenTemplate>
  );
}

const estilos = StyleSheet.create({
  filtros: { gap: espacamentos.md, marginBottom: espacamentos.md },
  centro: { marginTop: espacamentos.xl, gap: espacamentos.md },
  erro: { fontSize: tipografia.corpo, textAlign: 'center' },
});
