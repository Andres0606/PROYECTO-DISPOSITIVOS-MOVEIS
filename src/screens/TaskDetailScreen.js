// SCREEN — Detalhe da tarefa

import {
  useCallback,
  useMemo,
  useRef,
  useState,
} from 'react';

import { useFocusEffect } from '@react-navigation/native';

import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { ScreenTemplate } from '../components/templates/ScreenTemplate';
import { DetalheTarefa } from '../components/organisms/DetalheTarefa';
import { BotaoIcone } from '../components/atoms/BotaoIcone';
import { Button } from '../components/atoms/Button';

import {
  alternarTarefa,
  excluirTarefa,
  obterTarefa,
} from '../services/tarefas';

import { espacamentos, tipografia } from '../theme';
import { useTema } from '../theme/useTema';

export function TaskDetailScreen({
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

  const [erro, setErro] =
    useState('');

  const [ocupado, setOcupado] =
    useState('');

  const jaCarregou = useRef(false);

  // ==========================================================
  // CARREGAR TAREFA
  // ==========================================================

  const carregar = useCallback(async () => {
    const primeira = !jaCarregou.current;

    if (primeira) {
      setCarregando(true);
    }

    setErro('');

    try {
      setTarefa(await obterTarefa(tarefaId));

      jaCarregou.current = true;

    } catch (e) {
      if (primeira) {
        setErro(
          'Não foi possível carregar esta tarefa. Tente novamente.'
        );
      }

    } finally {
      setCarregando(false);
    }
  }, [tarefaId]);

  useFocusEffect(
    useCallback(() => {
      carregar();
    }, [carregar])
  );

  // ==========================================================
  // ALTERNAR TAREFA
  // ==========================================================

  async function alternar() {
    setOcupado('alternar');

    try {
      await alternarTarefa(tarefa.id);

      setTarefa(
        await obterTarefa(tarefa.id)
      );

    } catch (e) {
      Alert.alert(
        'Tarefa',
        'Não foi possível atualizar a tarefa.'
      );

    } finally {
      setOcupado('');
    }
  }

  // ==========================================================
  // EXCLUIR TAREFA
  // ==========================================================

  async function excluir() {
    setOcupado('excluir');

    try {
      await excluirTarefa(tarefa.id);

      navigation.goBack();

    } catch (e) {
      setOcupado('');

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

  function editarTarefa() {
    navigation.navigate('EditarTarefa', {
      tarefaId: tarefa.id,
    });
  }

  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <ScreenTemplate
      titulo="Detalhe da tarefa"
      aoVoltar={() => navigation.goBack()}
      acaoCabecalho={
        tarefa ? (
          <BotaoIcone
            nome="pencil-outline"
            rotulo="Editar tarefa"
            tamanho={18}
            aoPressionar={editarTarefa}
          />
        ) : undefined
      }
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

      {!carregando && !erro && tarefa && (
        <DetalheTarefa
          tarefa={tarefa}
          ocupado={ocupado}
          aoAlternar={alternar}
          aoExcluir={confirmarExclusao}
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