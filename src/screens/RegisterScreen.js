// SCREEN — Cadastro
import { useState } from 'react';
import { StyleSheet } from 'react-native';
import { CenteredTemplate } from '../components/templates/CenteredTemplate';
import { CabecalhoAcesso } from '../components/molecules/CabecalhoAcesso';
import { RegisterForm } from '../components/organisms/RegisterForm';
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
      <CabecalhoAcesso
        aoVoltar={() => navigation.goBack()}
        style={estilos.cabecalho}
      />

      <RegisterForm
        aoEnviar={cadastrar}
        carregando={carregando}
        erroGeral={erro}
      />
    </CenteredTemplate>
  );
}

const estilos = StyleSheet.create({
  cabecalho: { marginBottom: espacamentos.xl + espacamentos.xs },
});