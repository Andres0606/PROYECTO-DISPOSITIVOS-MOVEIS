
// SCREEN — Editar tarefa

import { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, View } from 'react-native';
import { ScreenTemplate } from '../components/templates/ScreenTemplate';
import { FormularioTarefa } from '../components/organisms/FormularioTarefa';
import { Button } from '../components/atoms/Button';
import {
  atualizarTarefa, excluirTarefa, obterTarefa,
} from '../services/tarefas';
import { espacamentos, tipografia } from '../theme';
import { useTema } from '../theme/useTema';

export function TaskEditScreen({ navigation, route }) {
  const { cores } = useTema();
  const { tarefaId } = route.params;
  const [tarefa, setTarefa] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erroCarga, setErroCarga] = useState('');
  const [ocupado, setOcupado] = useState('');
  const [erro, setErro] = useState('');

  const consultaAtual = useRef(0);
  const bloqueio = useRef(false);

  const carregar = useCallback(async () => {
    const consulta = ++consultaAtual.current;

    setCarregando(true);
    setErroCarga('');

    try {
      const resultado = await obterTarefa(tarefaId);

      if (consulta === consultaAtual.current) setTarefa(resultado);
    } catch {
      if (consulta === consultaAtual.current) {
        setErroCarga('Não foi possível carregar esta tarefa.');
      }
    } finally {
      if (consulta === consultaAtual.current) setCarregando(false);
    }
  }, [tarefaId]);

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

      if (navigation.isFocused()) {
        if (operacao === 'excluir') navigation.popToTop();
        else navigation.goBack();
      }
    } catch (e) {
      setErro(e.message || 'Não foi possível concluir a operação.');
    } finally {
      bloqueio.current = false;
      setOcupado('');
    }
  }

  function salvar(dados) {
    executar(() => atualizarTarefa(tarefaId, dados), 'salvar');
  }

  function confirmarExclusao() {
    if (bloqueio.current) return;

    Alert.alert(
      'Excluir tarefa',
      'Esta ação não pode ser desfeita. Deseja continuar?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir', style: 'destructive',
          onPress: () => executar(() => excluirTarefa(tarefaId), 'excluir'),
        },
      ]
    );
  }

  return (
    <ScreenTemplate titulo="Editar tarefa"
      aoVoltar={() => { if (!bloqueio.current) navigation.goBack(); }}>

      {carregando ? (
        <ActivityIndicator color={cores.primaria} style={estilos.centro} />
      ) : erroCarga || !tarefa ? (
        <View style={estilos.centro}>
          <Text style={[estilos.erro, { color: cores.perigo }]}>
            {erroCarga || 'Tarefa não encontrada.'}
          </Text>
          <Button titulo="Tentar novamente" variante="secundario"
            aoPressionar={carregar} />
        </View>
      ) : (
        <FormularioTarefa
          valoresIniciais={tarefa}
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
