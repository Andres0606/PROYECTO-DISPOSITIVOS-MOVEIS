// SCREEN — Meu intercâmbio (lista de tarefas por etapa)
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { ScreenTemplate } from '../components/templates/ScreenTemplate';
import { ListaTarefas } from '../components/organisms/ListaTarefas';
import { BotaoFlutuante } from '../components/atoms/BotaoFlutuante';
import { Button } from '../components/atoms/Button';
import { alternarTarefa, obterTarefas } from '../services/tarefas';
import { ETAPAS, ETAPA_PADRAO } from '../constants/tarefas';
import { cores, espacamentos, tipografia } from '../theme';

export function TaskListScreen({ navigation, route }) {
  const [tarefas, setTarefas] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');
  const [etapa, setEtapa] = useState(ETAPA_PADRAO);

  // Depois da primeira carga, as recargas (ao voltar de outra tela) são
  // silenciosas: sem indicador de carregamento e sem apagar a lista.
  const jaCarregou = useRef(false);

  const carregar = useCallback(async () => {
    const primeira = !jaCarregou.current;

    if (primeira) {
      setCarregando(true);
    }
    setErro('');

    try {
      setTarefas(await obterTarefas());
      jaCarregou.current = true;
    } catch (e) {
      if (primeira) {
        setErro('Não foi possível carregar as tarefas. Tente novamente.');
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

  // Ao criar uma tarefa, Criar tarefa pede para mostrar a etapa dela.
  const etapaPedida = route.params?.etapa;

  useEffect(() => {
    if (etapaPedida) {
      setEtapa(etapaPedida);
      navigation.setParams({ etapa: undefined });
    }
  }, [etapaPedida, navigation]);

  const concluidas = tarefas.filter((tarefa) => tarefa.concluida).length;

  const tarefasDaEtapa = useMemo(
    () => tarefas.filter((tarefa) => tarefa.etapa === etapa),
    [tarefas, etapa]
  );

  async function alternar(tarefa) {
    try {
      setTarefas(await alternarTarefa(tarefa.id));
    } catch (e) {
      Alert.alert('Tarefas', 'Não foi possível atualizar a tarefa.');
    }
  }

  function abrirTarefa(tarefa) {
    navigation.navigate('DetalheTarefa', { tarefaId: tarefa.id });
  }

  function editarTarefa(tarefa) {
    navigation.navigate('EditarTarefa', { tarefaId: tarefa.id });
  }

  function criarTarefa() {
    navigation.navigate('CriarTarefa');
  }

  return (
    <ScreenTemplate
      titulo="Meu intercâmbio"
      flutuante={
        <BotaoFlutuante rotulo="Nova tarefa" aoPressionar={criarTarefa} />
      }
    >
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

      {!carregando && !erro && (
        <ListaTarefas
          concluidas={concluidas}
          total={tarefas.length}
          etapas={ETAPAS}
          etapa={etapa}
          aoMudarEtapa={setEtapa}
          tarefas={tarefasDaEtapa}
          aoAlternar={alternar}
          aoAbrir={abrirTarefa}
          aoEditar={editarTarefa}
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