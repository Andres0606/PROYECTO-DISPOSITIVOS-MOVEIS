
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
        setErroCarga('Não foi possível carregar este gasto.');
      }
    } finally {
      if (consulta === consultaAtual.current) setCarregando(false);
    }
  }, [gastoId]);

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
      setErro(e.message || 'Não foi possível concluir a operação.');
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
      'Excluir gasto',
      'Esta ação não pode ser desfeita. Deseja continuar?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir', style: 'destructive',
          onPress: () => executar(() => excluirGasto(gastoId), 'excluir'),
        },
      ]
    );
  }

  return (
    <ScreenTemplate titulo="Editar gasto"
      aoVoltar={() => { if (!bloqueio.current) navigation.goBack(); }}>

      {carregando ? (
        <ActivityIndicator color={cores.primaria} style={estilos.centro} />
      ) : erroCarga || !gasto ? (
        <View style={estilos.centro}>
          <Text style={[estilos.erro, { color: cores.perigo }]}>
            {erroCarga || 'Gasto não encontrado.'}
          </Text>
          <Button titulo="Tentar novamente" variante="secundario"
            aoPressionar={carregar} />
        </View>
      ) : (
        <FormularioGasto
          valoresIniciais={gasto}
          rotuloEnviar="Guardar alterações"
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
