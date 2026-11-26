
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
  const { cores } = useTema();
  const conselho = route.params?.conselho;
  const [salvando, setSalvando] = useState(false);
  const [excluindo, setExcluindo] = useState(false);
  const [erro, setErro] = useState('');
  const bloqueio = useRef(false);

  if (!conselho || !conselho.meuConselho) {
    return (
      <ScreenTemplate titulo="Editar conselho" aoVoltar={() => navigation.goBack()}>
        <Text style={[estilos.erro, { color: cores.perigo }]}>
          {!conselho
            ? 'Conselho não encontrado.'
            : 'Você não tem permissão para editar este conselho.'}
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
        setErro('Os dados foram salvos, mas não foi possível atualizar a foto. Tente novamente.');
        return;
      }

      navigation.goBack();
    } catch (erro) {
      setErro(erro.message || 'Não foi possível atualizar o conselho.');
    } finally {
      bloqueio.current = false;
      setSalvando(false);
    }
  }

  function confirmarExclusao() {
    if (bloqueio.current) return;

    Alert.alert(
      'Excluir conselho',
      'Tem certeza que deseja excluir este conselho?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Excluir', style: 'destructive', onPress: excluirConselhoAtual },
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
      setErro(erro.message || 'Não foi possível excluir o conselho.');
    } finally {
      bloqueio.current = false;
      setExcluindo(false);
    }
  }

  return (
    <ScreenTemplate titulo="Editar conselho"
      aoVoltar={() => { if (!bloqueio.current) navigation.goBack(); }}>

      <FormularioConselho
        key={conselho.id}
        valoresIniciais={conselho}
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

const estilos = StyleSheet.create({
  erro: {
    marginTop: espacamentos.xl,
    textAlign: 'center',
    fontSize: tipografia.corpo,
  },
});
