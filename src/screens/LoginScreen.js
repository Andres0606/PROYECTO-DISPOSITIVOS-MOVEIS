// SCREEN — Login
import { useState } from 'react';
import { Alert, StyleSheet } from 'react-native';
import { CenteredTemplate } from '../components/templates/CenteredTemplate';
import { LoginForm } from '../components/organisms/LoginForm';
import { Logo } from '../components/atoms/Logo';
import { fazerLogin } from '../services/auth';
import { espacamentos } from '../theme';

export function LoginScreen({ navigation }) {
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState('');

  async function entrar(email, senha) {
    setErro('');
    setCarregando(true);
    try {
      const { usuario } = await fazerLogin(email, senha);
      navigation.replace('Home', { usuario });
    } catch (e) {
      setErro(e.message);
      setCarregando(false);
    }
  }

  // Provisório: o login social ainda não existe.
  function emBreve() {
    Alert.alert('Em breve', 'Esta função estará disponível em uma próxima etapa.');
  }

  return (
    <CenteredTemplate>
      <Logo style={estilos.logo} />

      <LoginForm
        aoEnviar={entrar}
        aoIrParaCadastro={() => navigation.navigate('Cadastro')}
        aoEsquecerSenha={() => navigation.navigate('RecuperarSenha')}
        aoEntrarComRedeSocial={emBreve}
        carregando={carregando}
        erroGeral={erro}
      />
    </CenteredTemplate>
  );
}

const estilos = StyleSheet.create({
  logo: {
    alignSelf: 'center',
    marginBottom: espacamentos.xl + espacamentos.xs,
  },
});