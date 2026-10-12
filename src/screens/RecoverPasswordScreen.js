// SCREEN — Recuperar senha
import { useState } from 'react';
import { StyleSheet } from 'react-native';
import { CenteredTemplate } from '../components/templates/CenteredTemplate';
import { CabecalhoAcesso } from '../components/molecules/CabecalhoAcesso';
import { RecoverPasswordForm } from '../components/organisms/RecoverPasswordForm';
import { recuperarSenha } from '../services/auth';
import { espacamentos } from '../theme';

export function RecoverPasswordScreen({ navigation }) {
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState('');
  const [mensagem, setMensagem] = useState('');

  async function enviar(email) {
    setErro('');
    setMensagem('');
    setCarregando(true);
    try {
      await recuperarSenha(email);
      setMensagem(
        'Enviamos um link de recuperação para o seu e-mail. Verifique sua caixa de entrada.'
      );
    } catch (e) {
      setErro(e.message);
    } finally {
      setCarregando(false);
    }
  }

  return (
    <CenteredTemplate variante="recuperar">
      <CabecalhoAcesso
        aoVoltar={() => navigation.goBack()}
        style={estilos.cabecalho}
      />

      <RecoverPasswordForm
        aoEnviar={enviar}
        carregando={carregando}
        erroGeral={erro}
        mensagemSucesso={mensagem}
      />
    </CenteredTemplate>
  );
}

const estilos = StyleSheet.create({
  // Figma: o cartão começa 55 px abaixo do logo.
  cabecalho: { marginBottom: espacamentos.xl + espacamentos.lg },
});