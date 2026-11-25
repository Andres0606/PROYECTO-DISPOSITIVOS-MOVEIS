// SCREEN — Meus gastos

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
import { ResumoGastos } from '../components/organisms/ResumoGastos';
import { Button } from '../components/atoms/Button';

import { obterResumoGastos } from '../services/gastos';

import { espacamentos, tipografia } from '../theme';
import { useTema } from '../theme/useTema';

export function ExpenseSummaryScreen({ navigation }) {
  const { cores } = useTema();

  const estilos = useMemo(
    () => criarEstilos(cores),
    [cores]
  );

  const [resumo, setResumo] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  const jaCarregou = useRef(false);

  const carregar = useCallback(async () => {
    const primeira = !jaCarregou.current;

    if (primeira) {
      setCarregando(true);
    }

    setErro('');

    try {
      setResumo(await obterResumoGastos());

      jaCarregou.current = true;

    } catch (e) {
      if (primeira) {
        setErro(
          'Não foi possível carregar seus gastos. Tente novamente.'
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

  function registrarGasto() {
    navigation.navigate('RegistrarGasto');
  }

  function abrirHistorico() {
    navigation.navigate('Historico');
  }

  function abrirEstatisticas() {
    navigation.navigate('Estatisticas');
  }

  return (
    <ScreenTemplate titulo="Meus gastos">

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

      {!carregando && !erro && resumo && (
        <ResumoGastos
          resumo={resumo}
          aoRegistrar={registrarGasto}
          aoAbrirHistorico={abrirHistorico}
          aoAbrirEstatisticas={abrirEstatisticas}
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