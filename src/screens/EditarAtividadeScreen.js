
// SCREEN — Editar atividade

import { useState } from 'react';

import {
  Alert,
  StyleSheet,
  Text,
} from 'react-native';

import {
  ScreenTemplate,
} from '../components/templates/ScreenTemplate';

import {
  FormularioAtividade,
} from '../components/organisms/FormularioAtividade';

import {
  atualizarAtividade,
  excluirAtividade,
} from '../services/atividades';

import {
  espacamentos,
  tipografia,
} from '../theme';

import {
  useTema,
} from '../theme/useTema';

export function EditarAtividadeScreen({
  navigation,
  route,
}) {
  const { cores } = useTema();

  const atividade = route.params?.atividade;

  const [
    salvando,
    setSalvando,
  ] = useState(false);

  const [
    excluindo,
    setExcluindo,
  ] = useState(false);

  const [
    erro,
    setErro,
  ] = useState('');

  // ==========================================================
  // VALIDAR ATIVIDADE E PERMISSÃO
  // ==========================================================

  if (!atividade || !atividade.minhaAtividade) {
    return (
      <ScreenTemplate
        titulo="Editar atividade"
        aoVoltar={() => navigation.goBack()}
      >

        <Text
          style={[
            estilos.erro,
            { color: cores.perigo },
          ]}
        >
          {!atividade
            ? 'Atividade não encontrada.'
            : 'Você não tem permissão para editar esta atividade.'}
        </Text>

      </ScreenTemplate>
    );
  }

  // ==========================================================
  // ATUALIZAR ATIVIDADE
  // ==========================================================

  async function salvarAlteracoes(dados) {
    if (salvando || excluindo) return;

    try {
      setSalvando(true);
      setErro('');

      await atualizarAtividade(
        atividade.id,
        dados
      );

      navigation.goBack();

    } catch (erro) {
      setErro(
        'Não foi possível atualizar a atividade. Tente novamente.'
      );

    } finally {
      setSalvando(false);
    }
  }

  // ==========================================================
  // CONFIRMAR EXCLUSÃO
  // ==========================================================

  function confirmarExclusao() {
    if (salvando || excluindo) return;

    Alert.alert(
      'Excluir atividade',

      'Tem certeza que deseja excluir esta atividade?',

      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },

        {
          text: 'Excluir',
          style: 'destructive',
          onPress: excluirAtividadeAtual,
        },
      ]
    );
  }

  // ==========================================================
  // EXCLUIR ATIVIDADE
  // ==========================================================

  async function excluirAtividadeAtual() {
    if (salvando || excluindo) return;

    try {
      setExcluindo(true);
      setErro('');

      await excluirAtividade(
        atividade.id
      );

      navigation.pop(2);

    } catch (erro) {
      setErro(
        'Não foi possível excluir a atividade. Tente novamente.'
      );

    } finally {
      setExcluindo(false);
    }
  }

  // ==========================================================
  // INTERFACE
  // ==========================================================

  return (
    <ScreenTemplate
      titulo="Editar atividade"
      aoVoltar={() => navigation.goBack()}
    >

      <FormularioAtividade
        key={atividade.id}

        valoresIniciais={atividade}

        rotuloEnviar="Guardar alterações"

        aoEnviar={salvarAlteracoes}

        aoExcluir={confirmarExclusao}

        carregando={salvando}

        excluindo={excluindo}

        erroGeral={erro}
      />

    </ScreenTemplate>
  );
}

// ============================================================
// ESTILOS
// ============================================================

const estilos = StyleSheet.create({

  erro: {
    marginTop: espacamentos.xl,
    textAlign: 'center',
    fontSize: tipografia.corpo,
  },

});
