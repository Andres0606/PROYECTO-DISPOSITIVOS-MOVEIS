// SCREEN — Editar tarefa

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

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

import { espacamentos, tipografia } from '../theme';
import { useTema } from '../theme/useTema';

export function TaskEditScreen({
  navigation,
  route,
}) {
  const { cores } = useTema();

  const estilos = useMemo(
    () => criarEstilos(cores),
    [cores]
  );

  const { tarefaId } = route.params;

  const [tarefa, setTarefa] =
    useState(null);

  const [carregando, setCarregando] =
    useState(true);

  const [erroCarga, setErroCarga] =
    useState('');

  const [salvando, setSalvando] =
    useState(false);

  const [excluindo, setExcluindo] =
    useState(false);

  const [erro, setErro] =
    useState('');

  // ==========================================================
  // CARREGAR TAREFA
  // ==========================================================

  const carregar = useCallback(async () => {
    setCarregando(true);

    setErroCarga('');

    try {
      setTarefa(await obterTarefa(tarefaId));

    } catch (e) {
      setErroCarga(
        'Não foi possível carregar esta tarefa. Tente novamente.'
      );

    } finally {
      setCarregando(false);
    }
  }, [tarefaId]);

  useEffect(() => {
    carregar();
  }, [carregar]);

  // ==========================================================
  // SALVAR
  // ==========================================================

  async function salvar(dados) {
    setErro('');

    setSalvando(true);

    try {
      await atualizarTarefa(tarefaId, dados);

      navigation.goBack();

    } catch (e) {
      setErro(
        'Não foi possível salvar as alterações. Tente novamente.'
      );

      setSalvando(false);
    }
  }

  // ==========================================================
  // EXCLUIR
  // ==========================================================

  async function excluir() {
    setExcluindo(true);

    try {
      await excluirTarefa(tarefaId);

      navigation.popToTop();

    } catch (e) {
      setExcluindo(false);

      Alert.alert(
        'Tarefa',
        'Não foi possível excluir a tarefa.'
      );
    }
  }

  function confirmarExclusao() {
    Alert.alert(
      'Excluir tarefa',
      'Esta ação não pode ser desfeita. Deseja continuar?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: excluir,
        },
      ]
    );
  }

  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <ScreenTemplate
      titulo="Editar tarefa"
      aoVoltar={() => navigation.goBack()}
    >

      {carregando && (
        <ActivityIndicator
          color={cores.primaria}
          style={estilos.centro}
        />
      )}

      {!carregando && !!erroCarga && (
        <View style={estilos.centro}>

          <Text style={estilos.erro}>
            {erroCarga}
          </Text>

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