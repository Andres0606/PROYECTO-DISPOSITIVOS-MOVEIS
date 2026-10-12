// SCREEN — Cadastro
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { CenteredTemplate } from '../components/templates/CenteredTemplate';
import { RegisterForm } from '../components/organisms/RegisterForm';
import { Logo } from '../components/atoms/Logo';
import { BotaoVoltar } from '../components/atoms/BotaoVoltar';
import { fazerCadastro } from '../services/auth';
import { espacamentos } from '../theme';

export function RegisterScreen({ navigation }) {
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState('');

  async function cadastrar(dados) {
    setErro('');
    setCarregando(true);
    try {
      const { usuario } = await fazerCadastro(dados);
      navigation.replace('Home', { usuario });
    } catch (e) {
      setErro(e.message);
      setCarregando(false);
    }
  }

  return (
    <CenteredTemplate variante="cadastro">
      <View style={estilos.cabecalho}>
        <BotaoVoltar
          aoPressionar={() => navigation.goBack()}
          style={estilos.voltar}
        />
        <Logo />
      </View>

      <RegisterForm
        aoEnviar={cadastrar}
        carregando={carregando}
        erroGeral={erro}
      />
    </CenteredTemplate>
  );
}

const estilos = StyleSheet.create({
  // Ocupa a largura toda da tela (anula o padding do template) para que o
  // chevron, posicionado em x=13 como no Figma, fique dentro da área tocável.
  cabecalho: {
    marginHorizontal: -espacamentos.lg,
    marginBottom: espacamentos.xl + espacamentos.xs,
    alignItems: 'center',
  },
  voltar: {
    position: 'absolute',
    left: 13,
    top: 20,
  },
});