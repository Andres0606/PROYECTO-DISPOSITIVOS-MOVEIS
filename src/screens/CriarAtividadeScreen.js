
// SCREEN — Criar atividade

import { useState } from 'react';
import { Alert } from 'react-native';

import { ScreenTemplate } from '../components/templates/ScreenTemplate';
import { FormularioAtividade } from '../components/organisms/FormularioAtividade';

import {
  criarAtividade,
  atualizarFotoAtividade,
} from '../services/atividades';

export function CriarAtividadeScreen({ navigation }) {
  const [criando, setCriando] = useState(false);
  const [erro, setErro] = useState('');

  async function salvarAtividade({ imagem, ...dados }) {
    if (criando) return;

    try {
      setCriando(true);
      setErro('');

      const atividade = await criarAtividade(dados);

      if (imagem?.uri) {
        try {
          await atualizarFotoAtividade(atividade.id, imagem);
        } catch (erro) {
          Alert.alert(
            'Atividade criada',
            'A atividade foi criada, mas não foi possível enviar a foto. Você pode adicioná-la ao editar a atividade.',
            [{ text: 'OK', onPress: () => navigation.goBack() }],
            { cancelable: false }
          );
          return;
        }
      }

      navigation.goBack();
    } catch (erro) {
      setErro('Não foi possível criar a atividade. Tente novamente.');
    } finally {
      setCriando(false);
    }
  }

  return (
    <ScreenTemplate
      titulo="Nova atividade"
      aoVoltar={() => {
        if (!criando) navigation.goBack();
      }}
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
