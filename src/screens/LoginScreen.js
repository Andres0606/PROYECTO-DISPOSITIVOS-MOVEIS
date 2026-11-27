// SCREEN — Login

import { useEffect, useState } from 'react';

import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { usePreferencias } from '../contexts/PreferenciasContext';
import { useTema } from '../theme/useTema';

import { CenteredTemplate } from '../components/templates/CenteredTemplate';
import { LoginForm } from '../components/organisms/LoginForm';
import { Logo } from '../components/atoms/Logo';
import { BotaoSegmentado } from '../components/molecules/BotaoSegmentado';

import {
  fazerLogin,
  obterSessao,
  sessaoAtiva,
} from '../services/auth';

import {
  espacamentos,
  tipografia,
} from '../theme';

// IDIOMAS DISPONÍVEIS

const IDIOMAS_ACESSO = [
  { titulo: 'PT', valor: 'pt-BR' },
  { titulo: 'ES', valor: 'es' },
  { titulo: 'EN', valor: 'en' },
];

export function LoginScreen({ navigation }) {
  const { cores } = useTema();

  const {
    t: grupo1Traducao,
    idioma,
    alterarIdiomaLocal,
    carregarPreferencias,
    restaurarPreferencias,
  } = usePreferencias();

  const [carregando, setCarregando] =
    useState(false);

  const [verificandoSessao, setVerificandoSessao] =
    useState(true);

  const [erro, setErro] =
    useState('');

  // ==========================================================
  // VERIFICAR SESSÃO
  // ==========================================================

  useEffect(() => {
    async function verificarSessao() {
      try {
        const ativa = await sessaoAtiva();

        if (ativa) {
          const usuario = await obterSessao();

          carregarPreferencias(usuario);

          navigation.replace('Home', {
            usuario,
          });

          return;
        }

        restaurarPreferencias();

      } catch (e) {
        console.log(
          'Erro ao verificar sessão:',
          e.name
        );

      } finally {
        setVerificandoSessao(false);
      }
    }

    verificarSessao();

  }, [
    navigation,
    carregarPreferencias,
    restaurarPreferencias,
  ]);

  // ==========================================================
  // ALTERAR IDIOMA
  // ==========================================================

  async function selecionarIdioma(novoIdioma) {
    if (carregando || idioma === novoIdioma) return;

    setErro('');

    await alterarIdiomaLocal(novoIdioma);
  }

  // ==========================================================
  // REALIZAR LOGIN
  // ==========================================================

  async function entrar(email, senha) {
    setErro('');
    setCarregando(true);

    try {
      const { usuario } =
        await fazerLogin(email, senha);

      carregarPreferencias(usuario);

      navigation.replace('Home', {
        usuario,
      });

    } catch (e) {
      setErro(
        grupo1Traducao('mensagens.servidor', {
          mensagem: e.message,
        })
      );

    } finally {
      setCarregando(false);
    }
  }

  // ==========================================================
  // LOGIN SOCIAL — IMPLEMENTAÇÃO FUTURA
  // ==========================================================

  function emBreve() {
    Alert.alert(
      grupo1Traducao('grupo1.em_breve'),
      grupo1Traducao(
        'grupo1.esta_funcao_estara_disponivel_em_uma_proxima_etapa'
      )
    );
  }

  // ==========================================================
  // VERIFICAÇÃO DE SESSÃO
  // ==========================================================

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

          <Text
            style={[
              estilos.textoVerificacao,
              {
                color: cores.textoSecundario,
              },
            ]}
          >
            {grupo1Traducao('grupo1.verificando_sessao')}
          </Text>

        </View>

      </CenteredTemplate>
    );
  }

  // ==========================================================
  // RENDER — LOGIN
  // ==========================================================

  return (
    <CenteredTemplate>

      <Logo style={estilos.logo} />

      <View style={estilos.idiomas}>
        <BotaoSegmentado
          opcoes={IDIOMAS_ACESSO}
          valor={idioma}
          aoMudar={selecionarIdioma}
        />
      </View>

      <LoginForm
        aoEnviar={entrar}

        aoIrParaCadastro={() =>
          navigation.navigate('Cadastro')
        }

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

// ============================================================
// ESTILOS
// ============================================================

const estilos = StyleSheet.create({
  logo: {
    alignSelf: 'center',
    marginBottom: espacamentos.md,
  },

  idiomas: {
    alignSelf: 'center',
    width: '65%',
    marginBottom: espacamentos.lg,
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
  },
});