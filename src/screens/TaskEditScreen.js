// SCREEN — Editar tarefa
import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { ScreenTemplate } from '../components/templates/ScreenTemplate';
import { FormularioTarefa } from '../components/organisms/FormularioTarefa';
import { Button } from '../components/atoms/Button';
import {
  atualizarTarefa,
  excluirTarefa,
  obterTarefa,
} from '../services/tarefas';
import { cores, espacamentos, tipografia } from '../theme';

export function TaskEditScreen({ navigation, route }) {
  const { tarefaId } = route.params;

  const [tarefa, setTarefa] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erroCarga, setErroCarga] = useState('');
  const [salvando, setSalvando] = useState(false);
  const [excluindo, setExcluindo] = useState(false);
  const [erro, setErro] = useState('');

  const carregar = useCallback(async () => {
    setCarregando(true);
    setErroCarga('');
    try {
      setTarefa(await obterTarefa(tarefaId));
    } catch (e) {
      setErroCarga('Não foi possível carregar esta tarefa. Tente novamente.');
    } finally {
      setCarregando(false);
    }
  }, [tarefaId]);

  useEffect(() => {
    carregar();
  }, [carregar]);

  async function salvar(dados) {
    setErro('');
    setSalvando(true);

    try {
      await atualizarTarefa(tarefaId, dados);
      navigation.goBack();
    } catch (e) {
      setErro('Não foi possível salvar as alterações. Tente novamente.');
      setSalvando(false);
    }
  }

  async function excluir() {
    setExcluindo(true);

    try {
      await excluirTarefa(tarefaId);
      // O detalhe desta tarefa deixou de existir: volta direto para a lista.
      navigation.popToTop();
    } catch (e) {
      setExcluindo(false);
      Alert.alert('Tarefa', 'Não foi possível excluir a tarefa.');
    }
  }

  function confirmarExclusao() {
    Alert.alert(
      'Excluir tarefa',
      'Esta ação não pode ser desfeita. Deseja continuar?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Excluir', style: 'destructive', onPress: excluir },
      ]
    );
  }

  return (
    <ScreenTemplate titulo="Editar tarefa" aoVoltar={() => navigation.goBack()}>
      {carregando && (
        <ActivityIndicator color={cores.primaria} style={estilos.centro} />
      )}

      {!carregando && !!erroCarga && (
        <View style={estilos.centro}>
          <Text style={estilos.erro}>{erroCarga}</Text>
          <Button
            titulo="Tentar novamente"
            variante="secundario"
            aoPressionar={carregar}
          />
        </View>
      )}

      {!carregando && !erroCarga && tarefa && (
        <FormularioTarefa
          valoresIniciais={tarefa}
          rotuloEnviar="Guardar alterações"
          aoEnviar={salvar}
          aoExcluir={confirmarExclusao}
          carregando={salvando}
          excluindo={excluindo}
          erroGeral={erro}
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