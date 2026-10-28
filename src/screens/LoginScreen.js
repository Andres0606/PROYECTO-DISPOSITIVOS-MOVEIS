// SCREEN — Login
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { CenteredTemplate } from '../components/templates/CenteredTemplate';
import { LoginForm } from '../components/organisms/LoginForm';
import { Logo } from '../components/atoms/Logo';

import {
  fazerLogin,
  obterSessao,
  sessaoAtiva,
} from '../services/auth';

import {
  cores,
  espacamentos,
  tipografia,
} from '../theme';

export function LoginScreen({ navigation }) {
  const [carregando, setCarregando] = useState(false);
  const [verificandoSessao, setVerificandoSessao] = useState(true);
  const [erro, setErro] = useState('');

  useEffect(() => {
    async function verificarSessao() {
      try {
        const ativa = await sessaoAtiva();

        if (ativa) {
          const usuario = await obterSessao();

          navigation.replace('Home', {
            usuario,
          });

          return;
        }
      } catch (e) {
        console.log('Erro ao verificar sessão:', e);
      } finally {
        setVerificandoSessao(false);
      }
    }

    verificarSessao();
  }, [navigation]);

  async function entrar(email, senha) {
    setErro('');
    setCarregando(true);

    try {
      const { usuario } = await fazerLogin(email, senha);

      navigation.replace('Home', {
        usuario,
      });
    } catch (e) {
      setErro(e.message);
    } finally {
      setCarregando(false);
    }
  }

  // Provisório: login social ainda não implementado.
  function emBreve() {
    Alert.alert(
      'Em breve',
      'Esta função estará disponível em uma próxima etapa.'
    );
  }

  if (verificandoSessao) {
    return (
      <CenteredTemplate>
        <View style={estilos.verificacao}>
          <Logo />

          <ActivityIndicator
            size="large"
            color={cores.primaria}
            style={estilos.indicador}
          />

          <Text style={estilos.textoVerificacao}>
            Verificando sessão...
          </Text>
        </View>
      </CenteredTemplate>
    );
  }

  return (
    <CenteredTemplate>
      <Logo style={estilos.logo} />

      <LoginForm
        aoEnviar={entrar}
        aoIrParaCadastro={() => navigation.navigate('Cadastro')}
        aoEsquecerSenha={() =>
          navigation.navigate('RecuperarSenha')
        }
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

  verificacao: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  indicador: {
    marginTop: espacamentos.xl,
  },

  textoVerificacao: {
    marginTop: espacamentos.md,
    fontSize: tipografia.corpo,
    color: cores.textoSecundario,
  },
});