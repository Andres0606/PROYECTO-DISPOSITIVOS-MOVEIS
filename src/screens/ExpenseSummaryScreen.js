import { usePreferencias } from '../contexts/PreferenciasContext';

// SCREEN — Meus gastos

import { useCallback, useRef, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { ScreenTemplate } from '../components/templates/ScreenTemplate';
import { ResumoGastos } from '../components/organisms/ResumoGastos';
import { SeletorMes } from '../components/molecules/SeletorMes';
import { Button } from '../components/atoms/Button';
import { obterResumoGastos, atualizarOrcamento } from '../services/gastos';
import { agoraChapeco, periodoAtual } from '../utils/datas';
import { espacamentos, tipografia } from '../theme';
import { useTema } from '../theme/useTema';

export function ExpenseSummaryScreen({ navigation }) {
  const { t } = usePreferencias();
  const { cores } = useTema();
  const [periodo, setPeriodo] = useState(periodoAtual);
  const [resumo, setResumo] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');
  const [editando, setEditando] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [erroOrcamento, setErroOrcamento] = useState('');
  const [revisao, setRevisao] = useState(0);

  const consultaAtual = useRef(0);
  const bloqueio = useRef(false);

  const carregar = useCallback(async () => {
    const consulta = ++consultaAtual.current;
    setCarregando(true);
    setErro('');

    try {
      const resultado = await obterResumoGastos(periodo.ano, periodo.mes);

      if (consulta === consultaAtual.current) setResumo(resultado);
    } catch {
      if (consulta === consultaAtual.current) {
        setErro(t('grupo2.g028'));
      }
    } finally {
      if (consulta === consultaAtual.current) setCarregando(false);
    }
  }, [t, periodo.ano, periodo.mes]);

  useFocusEffect(
    useCallback(() => {
      carregar();
      return () => { consultaAtual.current += 1; };
    }, [carregar, revisao])
  );

  function mudarPeriodo(novoPeriodo) {
    if (bloqueio.current) return;

    consultaAtual.current += 1;
    setResumo(null);
    setCarregando(true);
    setEditando(false);
    setErroOrcamento('');
    setPeriodo(novoPeriodo);
  }

  async function salvarOrcamento(valor) {
    if (bloqueio.current || carregando) return;

    bloqueio.current = true;
    setSalvando(true);
    setErroOrcamento('');

    try {
      await atualizarOrcamento(valor, periodo.ano, periodo.mes);
      setEditando(false);
      setRevisao(atual => atual + 1);
    } catch (e) {
      setErroOrcamento(t('mensagens.servidor', { mensagem: e.message, opcional: true }) || t('grupo2.g029'));
    } finally {
      bloqueio.current = false;
      setSalvando(false);
    }
  }

  function navegar(rota, parametros) {
    if (!bloqueio.current) navigation.navigate(rota, parametros);
  }

  function registrarGasto() {
    const atual = periodoAtual();
    const mesmoMes = atual.ano === periodo.ano && atual.mes === periodo.mes;

    const dataInicial = mesmoMes
      ? agoraChapeco().data
      : `${periodo.ano}-${String(periodo.mes).padStart(2, '0')}-01`;

    navegar('RegistrarGasto', { dataInicial });
  }

  return (
    <ScreenTemplate titulo={t('grupo2.g030')}>
      <SeletorMes periodo={periodo} aoMudar={mudarPeriodo}
        desabilitado={salvando || carregando} />

      {carregando ? (
        <ActivityIndicator color={cores.primaria} style={estilos.centro} />
      ) : erro || !resumo ? (
        <View style={estilos.centro}>
          <Text style={[estilos.erro, { color: cores.perigo }]}>
            {erro || t('grupo2.g031')}
          </Text>
          <Button titulo={t('grupo2.g006')} variante="secundario"
            aoPressionar={carregar} />
        </View>
      ) : (
        <ResumoGastos
          resumo={resumo}
          editando={editando}
          salvando={salvando}
          erroOrcamento={erroOrcamento}
          aoEditarOrcamento={() => {
            setErroOrcamento('');
            setEditando(atual => !atual);
          }}
          aoSalvarOrcamento={salvarOrcamento}
          aoCancelarOrcamento={() => setEditando(false)}
          aoRegistrar={registrarGasto}
          aoAbrirHistorico={() => navegar('Historico', { periodo })}
          aoAbrirEstatisticas={() => navegar('Estatisticas', { periodo })}
        />
      )}
    </ScreenTemplate>
  );
}

const estilos = StyleSheet.create({
  centro: { marginTop: espacamentos.xl, gap: espacamentos.md },
  erro: { fontSize: tipografia.corpo, textAlign: 'center' },
});
