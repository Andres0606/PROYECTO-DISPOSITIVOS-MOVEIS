// SCREEN — Perfil (provisória: apenas dados básicos e botão de sair)
import { StyleSheet, Text, View } from 'react-native';
import { ScreenTemplate } from '../components/templates/ScreenTemplate';
import { Button } from '../components/atoms/Button';
import { cores, espacamentos, tipografia } from '../theme';

export function PerfilScreen({ navigation, route }) {
  const usuario = route.params?.usuario;

  function sair() {
    // O Stack raiz é o "pai" do navegador de abas.
    navigation.getParent()?.replace('Login');
  }

  return (
    <ScreenTemplate titulo="Perfil">
      {!!usuario && (
        <View style={estilos.dados}>
          <Text style={estilos.nome}>{usuario.nome}</Text>
          <Text style={estilos.detalhe}>{usuario.email}</Text>
        </View>
      )}

      <Button titulo="Sair" variante="secundario" aoPressionar={sair} />
    </ScreenTemplate>
  );
}

const estilos = StyleSheet.create({
  dados: { marginBottom: espacamentos.xl, alignItems: 'center' },
  nome: {
    fontSize: tipografia.subtitulo,
    fontWeight: '600',
    color: cores.texto,
  },
  detalhe: {
    marginTop: espacamentos.xs,
    fontSize: tipografia.corpo,
    color: cores.textoSecundario,
  },
});