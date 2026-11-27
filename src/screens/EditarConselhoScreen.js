import { usePreferencias } from '../contexts/PreferenciasContext';

// SCREEN — Editar conselho

import { useRef, useState } from 'react';
import { Alert, StyleSheet, Text } from 'react-native';
import { ScreenTemplate } from '../components/templates/ScreenTemplate';
import { FormularioConselho } from '../components/organisms/FormularioConselho';
import {
  atualizarConselho, excluirConselho,
  atualizarFotoConselho, removerFotoConselho,
} from '../services/conselhos';
import { espacamentos, tipografia } from '../theme';
import { useTema } from '../theme/useTema';

export function EditarConselhoScreen({ navigation, route }) {
  const { t } = usePreferencias();
  const { cores } = useTema();
  const conselho = route.params?.conselho;
  const [salvando, setSalvando] = useState(false);
  const [excluindo, setExcluindo] = useState(false);
  const [erro, setErro] = useState('');
  const bloqueio = useRef(false);

  if (!conselho || !conselho.meuConselho) {
    return (
      <ScreenTemplate titulo={t('grupo3.g044')} aoVoltar={() => navigation.goBack()}>
        <Text style={[estilos.erro, { color: cores.perigo }]}>
          {!conselho
            ? t('grupo3.g034')
            : t('grupo3.g045')}
        </Text>
      </ScreenTemplate>
    );
  }

  async function salvarAlteracoes({ imagem, ...dados }) {
    if (bloqueio.current) return;

    bloqueio.current = true;
    setSalvando(true);
    setErro('');

    try {
      await atualizarConselho(conselho.id, dados);

      try {
        if (imagem?.uri) {
          await atualizarFotoConselho(conselho.id, imagem);
        } else if (imagem === null) {
          await removerFotoConselho(conselho.id);
        }
      } catch (erro) {
        setErro(t('grupo3.g046'));
        return;
      }

      navigation.goBack();
    } catch (erro) {
      setErro(erro.message || t('grupo3.g047'));
    } finally {
      bloqueio.current = false;
      setSalvando(false);
    }
  }

  function confirmarExclusao() {
    if (bloqueio.current) return;

    Alert.alert(
      t('grupo3.g048'),
      t('grupo3.g049'),
      [
        { text: t('grupo3.g040'), style: 'cancel' },
        { text: t('grupo3.g041'), style: 'destructive', onPress: excluirConselhoAtual },
      ]
    );
  }

  async function excluirConselhoAtual() {
    if (bloqueio.current) return;

    bloqueio.current = true;
    setExcluindo(true);
    setErro('');

    try {
      await excluirConselho(conselho.id);
      navigation.pop(2);
    } catch (erro) {
      setErro(erro.message || t('grupo3.g050'));
    } finally {
      bloqueio.current = false;
      setExcluindo(false);
    }
  }

  return (
    <ScreenTemplate titulo={t('grupo3.g044')}
      aoVoltar={() => { if (!bloqueio.current) navigation.goBack(); }}>

      <FormularioConselho
        key={conselho.id}
        valoresIniciais={conselho}
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

const estilos = StyleSheet.create({
  erro: {
    marginTop: espacamentos.xl,
    textAlign: 'center',
    fontSize: tipografia.corpo,
  },
});
