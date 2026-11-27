import { usePreferencias } from '../contexts/PreferenciasContext';

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
  const { t } = usePreferencias();
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
            t('grupo3.g067'),
            t('grupo3.g068'),
            [{ text: 'OK', onPress: () => navigation.goBack() }],
            { cancelable: false }
          );
          return;
        }
      }

      navigation.goBack();
    } catch (erro) {
      setErro(t('grupo3.g069'));
    } finally {
      setCriando(false);
    }
  }

  return (
    <ScreenTemplate
      titulo={t('grupo3.g070')}
      aoVoltar={() => {
        if (!criando) navigation.goBack();
      }}
    >
      <FormularioAtividade
        rotuloEnviar={t('grupo3.g060')}
        aoEnviar={salvarAtividade}
        carregando={criando}
        erroGeral={erro}
      />
    </ScreenTemplate>
  );
}
