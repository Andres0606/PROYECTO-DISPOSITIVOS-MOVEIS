
// SCREEN — Criar conselho

import { useRef, useState } from 'react';
import { Alert } from 'react-native';
import { ScreenTemplate } from '../components/templates/ScreenTemplate';
import { FormularioConselho } from '../components/organisms/FormularioConselho';
import { criarConselho, atualizarFotoConselho } from '../services/conselhos';

export function CriarConselhoScreen({ navigation }) {
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
            'Conselho publicado',
            'O conselho foi publicado, mas não foi possível enviar a foto. Você pode adicioná-la ao editar o conselho.',
            [{ text: 'OK', onPress: () => navigation.goBack() }],
            { cancelable: false }
          );
          return;
        }
      }

      navigation.goBack();
    } catch (erro) {
      setErro(erro.message || 'Não foi possível publicar o conselho.');
    } finally {
      if (!publicou) {
        bloqueio.current = false;
        setPublicando(false);
      }
    }
  }

  return (
    <ScreenTemplate titulo="Novo conselho"
      aoVoltar={() => { if (!bloqueio.current) navigation.goBack(); }}>

      <FormularioConselho
        rotuloEnviar="Publicar conselho"
        aoEnviar={publicarConselho}
        carregando={publicando}
        erroGeral={erro}
      />

    </ScreenTemplate>
  );
}
