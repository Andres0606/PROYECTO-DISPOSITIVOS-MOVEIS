// SCREEN — Meus gastos (resumo do orçamento e distribuição por categoria)
import { useCallback, useRef, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { ScreenTemplate } from '../components/templates/ScreenTemplate';
import { ResumoGastos } from '../components/organisms/ResumoGastos';
import { Button } from '../components/atoms/Button';
import { obterResumoGastos } from '../services/gastos';
import { cores, espacamentos, tipografia } from '../theme';

export function ExpenseSummaryScreen({ navigation }) {
  const [resumo, setResumo] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  // Depois da primeira carga, as recargas (ao voltar de outra tela) são
  // silenciosas: sem indicador de carregamento e sem apagar o resumo.
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
        setErro('Não foi possível carregar seus gastos. Tente novamente.');
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

const estilos = StyleSheet.create({
  centro: { marginTop: espacamentos.xl, gap: espacamentos.md },
  erro: {
    fontSize: tipografia.corpo,
    textAlign: 'center',
    color: cores.perigo,
  },
});