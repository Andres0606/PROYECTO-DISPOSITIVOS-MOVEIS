// SCREEN — Editar gasto
import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { ScreenTemplate } from '../components/templates/ScreenTemplate';
import { FormularioGasto } from '../components/organisms/FormularioGasto';
import { Button } from '../components/atoms/Button';
import { atualizarGasto, excluirGasto, obterGasto } from '../services/gastos';
import { cores, espacamentos, tipografia } from '../theme';

export function ExpenseEditScreen({ navigation, route }) {
  const { gastoId } = route.params;

  const [gasto, setGasto] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erroCarga, setErroCarga] = useState('');
  const [salvando, setSalvando] = useState(false);
  const [excluindo, setExcluindo] = useState(false);
  const [erro, setErro] = useState('');

  const carregar = useCallback(async () => {
    setCarregando(true);
    setErroCarga('');
    try {
      setGasto(await obterGasto(gastoId));
    } catch (e) {
      setErroCarga('Não foi possível carregar este gasto. Tente novamente.');
    } finally {
      setCarregando(false);
    }
  }, [gastoId]);

  useEffect(() => {
    carregar();
  }, [carregar]);

  async function salvar(dados) {
    setErro('');
    setSalvando(true);

    try {
      await atualizarGasto(gastoId, dados);
      navigation.goBack();
    } catch (e) {
      setErro('Não foi possível salvar as alterações. Tente novamente.');
      setSalvando(false);
    }
  }

  async function excluir() {
    setExcluindo(true);

    try {
      await excluirGasto(gastoId);
      navigation.goBack();
    } catch (e) {
      setExcluindo(false);
      Alert.alert('Gasto', 'Não foi possível excluir o gasto.');
    }
  }

  function confirmarExclusao() {
    Alert.alert(
      'Excluir gasto',
      'Esta ação não pode ser desfeita. Deseja continuar?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Excluir', style: 'destructive', onPress: excluir },
      ]
    );
  }

  return (
    <ScreenTemplate titulo="Editar gasto" aoVoltar={() => navigation.goBack()}>
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

      {!carregando && !erroCarga && gasto && (
        <FormularioGasto
          valoresIniciais={gasto}
          semDescricao
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