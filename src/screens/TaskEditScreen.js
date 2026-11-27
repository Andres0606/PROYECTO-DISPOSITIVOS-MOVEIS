import { usePreferencias } from '../contexts/PreferenciasContext';

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
  const { t } = usePreferencias();
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
        setErroCarga(t('grupo2.g019'));
      }
    } finally {
      if (consulta === consultaAtual.current) setCarregando(false);
    }
  }, [t, tarefaId]);

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
      setErro(e.message || t('grupo2.g020'));
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
    <ScreenTemplate titulo={t('grupo2.g025')}
      aoVoltar={() => { if (!bloqueio.current) navigation.goBack(); }}>

      {carregando ? (
        <ActivityIndicator color={cores.primaria} style={estilos.centro} />
      ) : erroCarga || !tarefa ? (
        <View style={estilos.centro}>
          <Text style={[estilos.erro, { color: cores.perigo }]}>
            {erroCarga || t('grupo2.g026')}
          </Text>
          <Button titulo={t('grupo2.g006')} variante="secundario"
            aoPressionar={carregar} />
        </View>
      ) : (
        <FormularioTarefa
          valoresIniciais={tarefa}
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
