// SCREEN — Cadastro
import { useState } from 'react';
import { StyleSheet, Text } from 'react-native';
import { CenteredTemplate } from '../components/templates/CenteredTemplate';
import { RegisterForm } from '../components/organisms/RegisterForm';
import { fazerCadastro } from '../services/auth';
import { cores, espacamentos, tipografia } from '../theme';

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
    <CenteredTemplate>
      <Text style={estilos.titulo}>Criar conta</Text>
      <Text style={estilos.subtitulo}>
        Preencha seus dados para começar
      </Text>

      <RegisterForm
        aoEnviar={cadastrar}
        aoVoltarParaLogin={() => navigation.navigate('Login')}
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