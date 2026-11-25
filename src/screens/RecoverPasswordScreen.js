// SCREEN — Recuperar senha
import { useRef, useState } from 'react';
import { StyleSheet } from 'react-native';
import { CenteredTemplate } from '../components/templates/CenteredTemplate';
import { CabecalhoAcesso } from '../components/molecules/CabecalhoAcesso';
import { RecoverPasswordForm } from '../components/organisms/RecoverPasswordForm';
import { recuperarSenha, redefinirSenha } from '../services/auth';
import { espacamentos } from '../theme';

export function RecoverPasswordScreen({ navigation }) {
  const [etapa, setEtapa] = useState('email');
  const [email, setEmail] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState('');
  const [mensagem, setMensagem] = useState('');
  const ocupado = useRef(false);

  async function enviar(endereco) {
    if (ocupado.current) return;
    ocupado.current = true;
    setCarregando(true);
    setErro('');
    setMensagem('');
    try {
      const resultado = await recuperarSenha(endereco);
      setEmail(endereco.trim().toLowerCase());
      setMensagem(resultado.mensagem || 'Se o e-mail estiver cadastrado, você receberá um código.');
      setEtapa('codigo');
    } catch (e) {
      setErro(e.message || 'Não foi possível solicitar a recuperação.');
    } finally {
      ocupado.current = false;
      setCarregando(false);
    }
  }

  async function confirmar(token, novaSenha) {
    if (ocupado.current) return;
    ocupado.current = true;
    setCarregando(true);
    setErro('');
    setMensagem('');
    try {
      await redefinirSenha(token, novaSenha);
      setEtapa('sucesso');
    } catch (e) {
      setErro(e.message || 'Não foi possível redefinir a senha.');
    } finally {
      ocupado.current = false;
      setCarregando(false);
    }
  }

  function voltarAoEmail() {
    if (ocupado.current) return;
    setErro('');
    setMensagem('');
    setEtapa('email');
  }

  function voltarAoLogin() {
    if (ocupado.current) return;
    navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
  }

  function voltar() {
    if (ocupado.current) return;
    if (etapa === 'codigo') voltarAoEmail();
    else if (etapa === 'sucesso') voltarAoLogin();
    else navigation.goBack();
  }

  return (
    <CenteredTemplate variante="recuperar">
      <CabecalhoAcesso aoVoltar={voltar} style={estilos.cabecalho} />
      <RecoverPasswordForm
        key={etapa}
        etapa={etapa}
        emailInicial={email}
        aoEnviar={enviar}
        aoRedefinir={confirmar}
        aoReenviar={() => enviar(email)}
        aoAlterarEmail={voltarAoEmail}
        aoVoltarLogin={voltarAoLogin}
        carregando={carregando}
        erroGeral={erro}
        mensagemSucesso={mensagem}
      />
    </CenteredTemplate>
  );
}

const estilos = StyleSheet.create({
  cabecalho: { marginBottom: espacamentos.xl + espacamentos.lg },
});
