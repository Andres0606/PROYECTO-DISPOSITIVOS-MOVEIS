import { usePreferencias } from '../contexts/PreferenciasContext';

// SCREEN — Detalhe da tarefa

import { useCallback, useRef, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { ActivityIndicator, Alert, StyleSheet, Text, View } from 'react-native';
import { ScreenTemplate } from '../components/templates/ScreenTemplate';
import { DetalheTarefa } from '../components/organisms/DetalheTarefa';
import { BotaoIcone } from '../components/atoms/BotaoIcone';
import { Button } from '../components/atoms/Button';
import {
  alternarTarefa, excluirTarefa, obterTarefa,
  obterEstadosTarefa, atualizarEstadoTarefa,
} from '../services/tarefas';
import { espacamentos, tipografia } from '../theme';
import { useTema } from '../theme/useTema';

export function TaskDetailScreen({ navigation, route }) {
  const { t } = usePreferencias();
  const { cores } = useTema();
  const { tarefaId } = route.params;
  const [tarefa, setTarefa] = useState(null);
  const [estados, setEstados] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');
  const [ocupado, setOcupado] = useState('');
  const [revisao, setRevisao] = useState(0);

  const consultaAtual = useRef(0);
  const bloqueio = useRef(false);

  const carregar = useCallback(async () => {
    const consulta = ++consultaAtual.current;

    setCarregando(true);
    setErro('');

    try {
      const [resultado, listaEstados] = await Promise.all([
        obterTarefa(tarefaId),
        obterEstadosTarefa(),
      ]);

      if (consulta !== consultaAtual.current) return;

      setTarefa(resultado);
      setEstados(listaEstados);
    } catch {
      if (consulta === consultaAtual.current) {
        setErro(t('grupo2.g019'));
        setTarefa(null);
      }
    } finally {
      if (consulta === consultaAtual.current) setCarregando(false);
    }
  }, [t, tarefaId]);

  useFocusEffect(
    useCallback(() => {
      carregar();
      return () => { consultaAtual.current += 1; };
    }, [carregar, revisao])
  );

  async function executar(acao, operacao) {
    if (bloqueio.current || carregando || !tarefa) return;

    bloqueio.current = true;
    setOcupado(operacao);

    const consulta = consultaAtual.current;

    try {
      const resultado = await acao();

      if (consulta !== consultaAtual.current) {
        setRevisao(atual => atual + 1);
        return;
      }

      if (operacao === 'excluir') {
        navigation.goBack();
      } else {
        setTarefa(resultado);
      }
    } catch {
      if (consulta === consultaAtual.current) {
        Alert.alert(t('grupo2.g032'), t('grupo2.g020'));
      }

      setRevisao(atual => atual + 1);
    } finally {
      bloqueio.current = false;
      setOcupado('');
    }
  }

  function alternar() {
    executar(() => alternarTarefa(tarefa, estados), 'alternar');
  }

  function mudarEstado(estadoId) {
    executar(() => atualizarEstadoTarefa(tarefaId, estadoId), 'estado');
  }

  function confirmarExclusao() {
    if (bloqueio.current) return;

    Alert.alert(
      t('grupo2.g021'),
      t('grupo2.g022'),
      [
        { text: t('grupo2.g023'), style: 'cancel' },
        {
          text: t('grupo2.g024'), style: 'destructive',
          onPress: () => executar(() => excluirTarefa(tarefaId), 'excluir'),
        },
      ]
    );
  }

  return (
    <ScreenTemplate titulo={t('grupo2.g033')}
      aoVoltar={() => { if (!bloqueio.current) navigation.goBack(); }}
      acaoCabecalho={!carregando && !erro && tarefa && !ocupado ? (
        <BotaoIcone nome="pencil-outline" rotulo={t('grupo2.g025')}
          tamanho={18} aoPressionar={() => {
            if (!bloqueio.current) {
              navigation.navigate('EditarTarefa', { tarefaId });
            }
          }} />
      ) : undefined}>

      {carregando ? (
        <ActivityIndicator color={cores.primaria} style={estilos.centro} />
      ) : erro || !tarefa ? (
        <View style={estilos.centro}>
          <Text style={[estilos.erro, { color: cores.perigo }]}>
            {erro || t('grupo2.g026')}
          </Text>
          <Button titulo={t('grupo2.g006')} variante="secundario"
            aoPressionar={carregar} />
        </View>
      ) : (
        <DetalheTarefa
          tarefa={tarefa}
          estados={estados}
          ocupado={ocupado}
          aoMudarEstado={mudarEstado}
          aoAlternar={alternar}
          aoExcluir={confirmarExclusao}
        />
      )}
    </ScreenTemplate>
  );
}

const estilos = StyleSheet.create({
  centro: { marginTop: espacamentos.xl, gap: espacamentos.md },
  erro: { fontSize: tipografia.corpo, textAlign: 'center' },
});
