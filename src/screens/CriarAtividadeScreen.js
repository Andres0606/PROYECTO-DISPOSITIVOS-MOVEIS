
// SCREEN — Criar atividade

import { useState } from 'react';

import {
  ScreenTemplate,
} from '../components/templates/ScreenTemplate';

import {
  FormularioAtividade,
} from '../components/organisms/FormularioAtividade';

import {
  criarAtividade,
} from '../services/atividades';

export function CriarAtividadeScreen({
  navigation,
}) {
  const [
    criando,
    setCriando,
  ] = useState(false);

  const [
    erro,
    setErro,
  ] = useState('');

  // ==========================================================
  // CRIAR ATIVIDADE
  // ==========================================================

  async function salvarAtividade(dados) {
    if (criando) return;

    try {
      setCriando(true);
      setErro('');

      await criarAtividade(dados);

      navigation.goBack();

    } catch (erro) {
      setErro(
        'Não foi possível criar a atividade. Tente novamente.'
      );

    } finally {
      setCriando(false);
    }
  }

  // ==========================================================
  // INTERFACE
  // ==========================================================

  return (
    <ScreenTemplate
      titulo="Nova atividade"
      aoVoltar={() => navigation.goBack()}
    >

      <FormularioAtividade
        rotuloEnviar="Criar atividade"

        aoEnviar={salvarAtividade}

        carregando={criando}

        erroGeral={erro}
      />

    </ScreenTemplate>
  );
}
