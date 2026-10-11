// SCREEN — Home (provisória: apenas saudação e botão de sair)
import { StyleSheet, Text } from 'react-native';
import { ScreenTemplate } from '../components/templates/ScreenTemplate';
import { Button } from '../components/atoms/Button';
import { cores, espacamentos, tipografia } from '../theme';

export function HomeScreen({ navigation, route }) {
  const usuario = route.params?.usuario;

  return (
    <ScreenTemplate titulo="Início">
      <Text style={estilos.saudacao}>Olá, {usuario?.nome ?? 'estudante'}!</Text>
      <Text style={estilos.texto}>
        Bem-vindo(a) ao InterChapecó. Em breve você verá aqui suas tarefas,
        gastos e dicas da cidade.
      </Text>

      <Button
        titulo="Sair"
        variante="secundario"
        aoPressionar={() => navigation.replace('Login')}
      />
    </ScreenTemplate>
  );
}

const estilos = StyleSheet.create({
  saudacao: {
    fontSize: tipografia.subtitulo,
    fontWeight: '600',
    color: cores.texto,
    marginBottom: espacamentos.sm,
  },
  texto: {
    fontSize: tipografia.corpo,
    color: cores.textoSecundario,
    marginBottom: espacamentos.xl,
  },
});