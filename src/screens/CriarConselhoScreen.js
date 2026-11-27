import { usePreferencias } from '../contexts/PreferenciasContext';

// SCREEN — Criar conselho

import { useRef, useState } from 'react';
import { Alert } from 'react-native';
import { ScreenTemplate } from '../components/templates/ScreenTemplate';
import { FormularioConselho } from '../components/organisms/FormularioConselho';
import { criarConselho, atualizarFotoConselho } from '../services/conselhos';

export function CriarConselhoScreen({ navigation }) {
  const { t } = usePreferencias();
  const [publicando, setPublicando] = useState(false);
  const [erro, setErro] = useState('');
  const bloqueio = useRef(false);

  async function publicarConselho({ imagem, ...dados }) {
    if (bloqueio.current) return;

    bloqueio.current = true;
    setPublicando(true);
    setErro('');

    let publicou = false;

    try {
      const conselho = await criarConselho(dados);
      publicou = true;

      if (imagem?.uri) {
        try {
          await atualizarFotoConselho(conselho.id, imagem);
        } catch (erro) {
          Alert.alert(
            t('grupo3.g017'),
            t('grupo3.g018'),
            [{ text: 'OK', onPress: () => navigation.goBack() }],
            { cancelable: false }
          );
          return;
        }
      }

      navigation.goBack();
    } catch (erro) {
      setErro(erro.message || t('grupo3.g019'));
    } finally {
      if (!publicou) {
        bloqueio.current = false;
        setPublicando(false);
      }
    }
  }

  return (
    <ScreenTemplate titulo={t('grupo3.g020')}
      aoVoltar={() => { if (!bloqueio.current) navigation.goBack(); }}>

      <FormularioConselho
        rotuloEnviar={t('grupo3.g021')}
        aoEnviar={publicarConselho}
        carregando={publicando}
        erroGeral={erro}
      />

    </ScreenTemplate>
  );
}
