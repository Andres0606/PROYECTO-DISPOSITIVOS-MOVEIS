// SCREEN — Perfil
import { StyleSheet, Text, View } from 'react-native';
import { ScreenTemplate } from '../components/templates/ScreenTemplate';
import { Button } from '../components/atoms/Button';
import { logout } from '../services/auth';
import { cores, espacamentos, tipografia } from '../theme';

export function PerfilScreen({ navigation, route }) {
  const usuario = route.params?.usuario;

  function abrirRecursos() {
    navigation.navigate('Recursos');
  }

  async function sair() {
    try {
      // Remove token do SecureStore e usuário do AsyncStorage.
      await logout();

      // PerfilScreen está dentro de:
      // PerfilStack → MainTabs → Stack raiz.
      const navegacaoRaiz =
        navigation.getParent()?.getParent();

      navegacaoRaiz?.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    } catch (e) {
      console.log('Erro ao encerrar sessão:', e);
    }
  }

  return (
    <ScreenTemplate titulo="Perfil">
      {!!usuario && (
        <View style={estilos.dados}>
          <Text style={estilos.nome}>{usuario.nome}</Text>
          <Text style={estilos.detalhe}>{usuario.email}</Text>

          {!!usuario.pais && (
            <Text style={estilos.detalhe}>{usuario.pais}</Text>
          )}

          {!!usuario.universidade && (
            <Text style={estilos.detalhe}>
              {usuario.universidade}
            </Text>
          )}
        </View>
      )}

      <View style={estilos.acoes}>
        <Button
          titulo="Recursos nativos"
          aoPressionar={abrirRecursos}
        />

        <Button
          titulo="Sair"
          variante="secundario"
          aoPressionar={sair}
        />
      </View>
    </ScreenTemplate>
  );
}

const estilos = StyleSheet.create({
  dados: {
    marginBottom: espacamentos.xl,
    alignItems: 'center',
  },

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

  acoes: {
    gap: espacamentos.md,
  },
});