
// SCREEN — Meu intercâmbio

import { useCallback, useEffect, useRef, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { ActivityIndicator, Alert, StyleSheet, Text, View } from 'react-native';
import { ScreenTemplate } from '../components/templates/ScreenTemplate';
import { ListaTarefas } from '../components/organisms/ListaTarefas';
import { BotaoFlutuante } from '../components/atoms/BotaoFlutuante';
import { Button } from '../components/atoms/Button';
import {
  alternarTarefa, obterTarefas, obterEtapasTarefa, obterEstadosTarefa,
} from '../services/tarefas';
import { espacamentos, tipografia } from '../theme';
import { useTema } from '../theme/useTema';

export function TaskListScreen({ navigation, route }) {
  const { cores } = useTema();
  const [tarefas, setTarefas] = useState([]);
  const [etapas, setEtapas] = useState([]);
  const [estados, setEstados] = useState([]);
  const [etapa, setEtapa] = useState('');
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');
  const [ocupado, setOcupado] = useState(false);
  const [revisao, setRevisao] = useState(0);

  const consultaAtual = useRef(0);
  const bloqueio = useRef(false);

  const carregar = useCallback(async () => {
    const consulta = ++consultaAtual.current;

    setCarregando(true);
    setErro('');

    try {
      const [lista, listaEtapas, listaEstados] = await Promise.all([
        obterTarefas(),
        obterEtapasTarefa(),
        obterEstadosTarefa(),
      ]);

      if (consulta !== consultaAtual.current) return;

      setTarefas(lista);
      setEtapas(listaEtapas);
      setEstados(listaEstados);

      setEtapa(atual =>
        listaEtapas.some(item => item.nome === atual)
          ? atual
          : listaEtapas.find(item => item.nome === 'Chegada')?.nome ||
            listaEtapas[0]?.nome || ''
      );
    } catch {
      if (consulta === consultaAtual.current) {
        setErro('Não foi possível carregar as tarefas. Tente novamente.');
      }
    } finally {
      if (consulta === consultaAtual.current) setCarregando(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      carregar();
      return () => { consultaAtual.current += 1; };
    }, [carregar, revisao])
  );

  const etapaPedida = route.params?.etapa;

  useEffect(() => {
    if (etapaPedida && etapas.some(item => item.nome === etapaPedida)) {
      setEtapa(etapaPedida);
      navigation.setParams({ etapa: undefined });
    }
  }, [etapaPedida, etapas, navigation]);

  async function alternar(tarefa) {
    if (bloqueio.current || carregando || erro) return;

    bloqueio.current = true;
    setOcupado(true);

    const consulta = consultaAtual.current;

    try {
      const atualizada = await alternarTarefa(tarefa, estados);

      if (consulta === consultaAtual.current) {
        setTarefas(lista => lista.map(item =>
          item.id === atualizada.id ? atualizada : item
        ));
      } else {
        setRevisao(atual => atual + 1);
      }
    } catch {
      if (consulta === consultaAtual.current) {
        Alert.alert('Tarefas', 'Não foi possível atualizar a tarefa.');
      }

      setRevisao(atual => atual + 1);
    } finally {
      bloqueio.current = false;
      setOcupado(false);
    }
  }

  function navegar(rota, parametros) {
    if (!bloqueio.current) navigation.navigate(rota, parametros);
  }

  const concluidas = tarefas.filter(item => item.concluida).length;
  const tarefasDaEtapa = tarefas.filter(item => item.etapa === etapa);

  return (
    <ScreenTemplate titulo="Meu intercâmbio"
      flutuante={
        <BotaoFlutuante rotulo="Nova tarefa"
          aoPressionar={() => navegar('CriarTarefa')} />
      }>

      {carregando ? (
        <ActivityIndicator color={cores.primaria} style={estilos.centro} />
      ) : erro ? (
        <View style={estilos.centro}>
          <Text style={[estilos.erro, { color: cores.perigo }]}>{erro}</Text>
          <Button titulo="Tentar novamente" variante="secundario"
            aoPressionar={carregar} />
        </View>
      ) : (
        <ListaTarefas
          concluidas={concluidas}
          total={tarefas.length}
          etapas={etapas.map(item => item.nome)}
          etapa={etapa}
          aoMudarEtapa={setEtapa}
          tarefas={tarefasDaEtapa}
          ocupado={ocupado}
          aoAlternar={alternar}
          aoAbrir={tarefa => navegar('DetalheTarefa', { tarefaId: tarefa.id })}
          aoEditar={tarefa => navegar('EditarTarefa', { tarefaId: tarefa.id })}
        />
      )}
    </ScreenTemplate>
  );
}

const estilos = StyleSheet.create({
  centro: { marginTop: espacamentos.xl, gap: espacamentos.md },
  erro: { fontSize: tipografia.corpo, textAlign: 'center' },
});
