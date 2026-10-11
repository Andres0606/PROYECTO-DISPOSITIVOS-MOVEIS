// SCREEN — Login
import { useState } from 'react';
import { StyleSheet, Text } from 'react-native';
import { CenteredTemplate } from '../components/templates/CenteredTemplate';
import { LoginForm } from '../components/organisms/LoginForm';
import { fazerLogin } from '../services/auth';
import { cores, espacamentos, tipografia } from '../theme';

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

  return (
    <CenteredTemplate>
      <Text style={estilos.titulo}>InterChapecó</Text>
      <Text style={estilos.subtitulo}>
        Seu guia de intercâmbio em Chapecó
      </Text>

      <LoginForm
        aoEnviar={entrar}
        aoIrParaCadastro={() => navigation.navigate('Cadastro')}
        carregando={carregando}
        erroGeral={erro}
      />
    </CenteredTemplate>
  );
}

const estilos = StyleSheet.create({
  titulo: {
    fontSize: tipografia.titulo,
    fontWeight: '700',
    color: cores.primaria,
    textAlign: 'center',
  },
  subtitulo: {
    marginTop: espacamentos.xs,
    marginBottom: espacamentos.xl,
    fontSize: tipografia.corpo,
    color: cores.textoSecundario,
    textAlign: 'center',
  },
});