
// SCREEN — Estatísticas de gastos

import { useCallback, useRef, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { ScreenTemplate } from '../components/templates/ScreenTemplate';
import { EstatisticasGastos } from '../components/organisms/EstatisticasGastos';
import { SeletorMes } from '../components/molecules/SeletorMes';
import { Button } from '../components/atoms/Button';
import {
  obterEstatisticasGastos, obterCategoriasGasto,
} from '../services/gastos';
import { periodoAtual } from '../utils/datas';
import { espacamentos, tipografia } from '../theme';
import { useTema } from '../theme/useTema';

export function ExpenseStatsScreen({ navigation, route }) {
  const { cores } = useTema();

  const [periodo, setPeriodo] = useState(
    () => route.params?.periodo ?? periodoAtual()
  );
  const [estatisticas, setEstatisticas] = useState(null);
  const [categorias, setCategorias] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');
  const [visao, setVisao] = useState('mes');

  const consultaAtual = useRef(0);

  const carregar = useCallback(async () => {
    const consulta = ++consultaAtual.current;
    setCarregando(true);
    setErro('');

    try {
      const [resultado, listaCategorias] = await Promise.all([
        obterEstatisticasGastos(periodo.ano, periodo.mes),
        obterCategoriasGasto(),
      ]);

      if (consulta !== consultaAtual.current) return;

      setEstatisticas(resultado);
      setCategorias(listaCategorias);
    } catch {
      if (consulta === consultaAtual.current) {
        setErro('Não foi possível carregar as estatísticas.');
      }
    } finally {
      if (consulta === consultaAtual.current) setCarregando(false);
    }
  }, [periodo.ano, periodo.mes]);

  useFocusEffect(
    useCallback(() => {
      carregar();
      return () => { consultaAtual.current += 1; };
    }, [carregar])
  );

  function mudarPeriodo(novoPeriodo) {
    consultaAtual.current += 1;
    setCarregando(true);
    setPeriodo(novoPeriodo);
  }

  return (
    <ScreenTemplate titulo="Estatísticas"
      aoVoltar={() => navigation.goBack()}>

      <SeletorMes periodo={periodo} aoMudar={mudarPeriodo}
        desabilitado={carregando} />

      {carregando ? (
        <ActivityIndicator color={cores.primaria} style={estilos.centro} />
      ) : erro || !estatisticas ? (
        <View style={estilos.centro}>
          <Text style={[estilos.erro, { color: cores.perigo }]}>
            {erro || 'Estatísticas não encontradas.'}
          </Text>
          <Button titulo="Tentar novamente" variante="secundario"
            aoPressionar={carregar} />
        </View>
      ) : (
        <EstatisticasGastos
          estatisticas={estatisticas}
          categoriasDisponiveis={categorias}
          visao={visao}
          aoMudarVisao={setVisao}
        />
      )}
    </ScreenTemplate>
  );
}

const estilos = StyleSheet.create({
  centro: { marginTop: espacamentos.xl, gap: espacamentos.md },
  erro: { fontSize: tipografia.corpo, textAlign: 'center' },
});
