import { usePreferencias } from '../contexts/PreferenciasContext';

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
  atualizarFotoAtividade,
  removerFotoAtividade,
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
  const { t } = usePreferencias();
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
        titulo={t('grupo3.g071')}
        aoVoltar={() => {
          if (!salvando && !excluindo) navigation.goBack();
        }}
      >

        <Text
          style={[
            estilos.erro,
            { color: cores.perigo },
          ]}
        >
          {!atividade
            ? t('grupo3.g061')
            : t('grupo3.g072')}
        </Text>

      </ScreenTemplate>
    );
  }

  // ==========================================================
  // ATUALIZAR ATIVIDADE
  // ==========================================================

  async function salvarAlteracoes({ imagem, ...dados }) {
      if (salvando || excluindo) return;

  try {
    setSalvando(true);
    setErro('');

    await atualizarAtividade(atividade.id, dados);

    try {
      if (imagem?.uri) {
        await atualizarFotoAtividade(atividade.id, imagem);
      } else if (imagem === null) {
        await removerFotoAtividade(atividade.id);
      }
    } catch (erro) {
      setErro(
        t('grupo3.g046')
      );
      return;
    }

    navigation.goBack();
  } catch (erro) {
    setErro(t('grupo3.g073'));
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
      t('grupo3.g074'),

      t('grupo3.g075'),

      [
        {
          text: t('grupo3.g040'),
          style: 'cancel',
        },

        {
          text: t('grupo3.g041'),
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
        t('grupo3.g076')
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
      titulo={t('grupo3.g071')}
      aoVoltar={() => navigation.goBack()}
    >

      <FormularioAtividade
        key={atividade.id}

        valoresIniciais={atividade}

        rotuloEnviar={t('grupo3.g051')}

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
