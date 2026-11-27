import { usePreferencias } from '../contexts/PreferenciasContext';

// SCREEN — Editar gasto

import { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, View } from 'react-native';
import { ScreenTemplate } from '../components/templates/ScreenTemplate';
import { FormularioGasto } from '../components/organisms/FormularioGasto';
import { Button } from '../components/atoms/Button';
import { atualizarGasto, excluirGasto, obterGasto } from '../services/gastos';
import { espacamentos, tipografia } from '../theme';
import { useTema } from '../theme/useTema';

export function ExpenseEditScreen({ navigation, route }) {
  const { t } = usePreferencias();
  const { cores } = useTema();
  const { gastoId } = route.params;

  const [gasto, setGasto] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erroCarga, setErroCarga] = useState('');
  const [ocupado, setOcupado] = useState('');
  const [erro, setErro] = useState('');

  const bloqueio = useRef(false);
  const consultaAtual = useRef(0);

  const carregar = useCallback(async () => {
    const consulta = ++consultaAtual.current;
    setCarregando(true);
    setErroCarga('');

    try {
      const resultado = await obterGasto(gastoId);

      if (consulta === consultaAtual.current) setGasto(resultado);
    } catch {
      if (consulta === consultaAtual.current) {
        setErroCarga(t('grupo2.g037'));
      }
    } finally {
      if (consulta === consultaAtual.current) setCarregando(false);
    }
  }, [t, gastoId]);

  useEffect(() => {
    carregar();
    return () => { consultaAtual.current += 1; };
  }, [carregar]);

  async function executar(acao, operacao) {
    if (bloqueio.current || carregando) return;

    bloqueio.current = true;
    setOcupado(operacao);
    setErro('');

    try {
      await acao();

      if (navigation.isFocused()) navigation.goBack();
    } catch (e) {
      setErro(e.message || t('grupo2.g020'));
    } finally {
      bloqueio.current = false;
      setOcupado('');
    }
  }

  function salvar(dados) {
    executar(() => atualizarGasto(gastoId, dados), 'salvar');
  }

  function confirmarExclusao() {
    if (bloqueio.current) return;

    Alert.alert(
      t('grupo2.g038'),
      t('grupo2.g022'),
      [
        { text: t('grupo2.g023'), style: 'cancel' },
        {
          text: t('grupo2.g024'), style: 'destructive',
          onPress: () => executar(() => excluirGasto(gastoId), 'excluir'),
        },
      ]
    );
  }

  return (
    <ScreenTemplate titulo={t('grupo2.g039')}
      aoVoltar={() => { if (!bloqueio.current) navigation.goBack(); }}>

      {carregando ? (
        <ActivityIndicator color={cores.primaria} style={estilos.centro} />
      ) : erroCarga || !gasto ? (
        <View style={estilos.centro}>
          <Text style={[estilos.erro, { color: cores.perigo }]}>
            {erroCarga || t('grupo2.g040')}
          </Text>
          <Button titulo={t('grupo2.g006')} variante="secundario"
            aoPressionar={carregar} />
        </View>
      ) : (
        <FormularioGasto
          valoresIniciais={gasto}
          rotuloEnviar={t('grupo2.g027')}
          aoEnviar={salvar}
          aoExcluir={confirmarExclusao}
          carregando={ocupado === 'salvar'}
          excluindo={ocupado === 'excluir'}
          erroGeral={erro}
        />
      )}
    </ScreenTemplate>
  );
}

const estilos = StyleSheet.create({
  centro: { marginTop: espacamentos.xl, gap: espacamentos.md },
  erro: { fontSize: tipografia.corpo, textAlign: 'center' },
});
