// SCREEN — Estatísticas de gastos

import {
  useCallback,
  useMemo,
  useRef,
  useState,
} from 'react';

import { useFocusEffect } from '@react-navigation/native';

import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { ScreenTemplate } from '../components/templates/ScreenTemplate';
import { EstatisticasGastos } from '../components/organisms/EstatisticasGastos';
import { Button } from '../components/atoms/Button';

import { obterEstatisticasGastos } from '../services/gastos';

import { espacamentos, tipografia } from '../theme';
import { useTema } from '../theme/useTema';

export function ExpenseStatsScreen({ navigation }) {
  const { cores } = useTema();

  const estilos = useMemo(
    () => criarEstilos(cores),
    [cores]
  );

  const [estatisticas, setEstatisticas] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');
  const [visao, setVisao] = useState('mes');

  const jaCarregou = useRef(false);

  const carregar = useCallback(async () => {
    const primeira = !jaCarregou.current;

    if (primeira) {
      setCarregando(true);
    }

    setErro('');

    try {
      setEstatisticas(
        await obterEstatisticasGastos()
      );

      jaCarregou.current = true;

    } catch (e) {
      if (primeira) {
        setErro(
          'Não foi possível carregar as estatísticas. Tente novamente.'
        );
      }

    } finally {
      setCarregando(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      carregar();
    }, [carregar])
  );

  return (
    <ScreenTemplate
      titulo="Estatísticas"
      aoVoltar={() => navigation.goBack()}
    >

      {carregando && (
        <ActivityIndicator
          color={cores.primaria}
          style={estilos.centro}
        />
      )}

      {!carregando && !!erro && (
        <View style={estilos.centro}>

          <Text style={estilos.erro}>
            {erro}
          </Text>

          <Button
            titulo="Tentar novamente"
            variante="secundario"
            aoPressionar={carregar}
          />

        </View>
      )}

      {!carregando && !erro && estatisticas && (
        <EstatisticasGastos
          estatisticas={estatisticas}
          visao={visao}
          aoMudarVisao={setVisao}
        />
      )}

    </ScreenTemplate>
  );
}

function criarEstilos(cores) {
  return StyleSheet.create({
    centro: {
      marginTop: espacamentos.xl,
      gap: espacamentos.md,
    },

    erro: {
      fontSize: tipografia.corpo,
      textAlign: 'center',
      color: cores.perigo,
    },
  });
}