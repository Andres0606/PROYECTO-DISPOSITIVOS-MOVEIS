// SCREEN — Perfil

import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import { ScreenTemplate } from '../components/templates/ScreenTemplate';

import {
  logout,
} from '../services/auth';

import {
  cores,
  espacamentos,
  raios,
  tipografia,
} from '../theme';

export function PerfilScreen({
  navigation,
  route,
}) {
  const usuario =
    route.params?.usuario;

  const nome =
    usuario?.nome ??
    'Laura';

  const pais =
    usuario?.pais ??
    'Colômbia';

  const tempo =
    usuario?.tempo ??
    '27 ago';

  function abrirEditarPerfil() {
    Alert.alert(
      'Editar perfil',
      'A tela de edição do perfil será implementada na próxima etapa.'
    );
  }

  function abrirFavoritos() {
    Alert.alert(
      'Favoritos',
      'A tela de favoritos será implementada na próxima etapa.'
    );
  }

  function abrirConfiguracao() {
    Alert.alert(
      'Configuração',
      'A tela de configuração será implementada na próxima etapa.'
    );
  }

  function abrirMeusConselhos() {
    Alert.alert(
      'Meus conselhos',
      'A tela com os seus conselhos será implementada na próxima etapa.'
    );
  }

  function abrirMinhasAtividades() {
    Alert.alert(
      'Minhas atividades',
      'A tela com as suas atividades será implementada na próxima etapa.'
    );
  }

  function confirmarLogout() {
    Alert.alert(
      'Cerrar sessão',
      'Tem certeza que deseja sair da sua conta?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Sair',
          style: 'destructive',
          onPress: sair,
        },
      ]
    );
  }

  async function sair() {
    try {
      await logout();

      const navegacaoRaiz =
        navigation
          .getParent()
          ?.getParent();

      navegacaoRaiz?.reset({
        index: 0,
        routes: [
          {
            name: 'Login',
          },
        ],
      });
    } catch (erro) {
      console.log(
        'Erro ao encerrar sessão:',
        erro
      );
    }
  }

  return (
    <ScreenTemplate
      titulo="Perfil"
    >
      {/* USUÁRIO */}
      <View
        style={
          estilos.cartaoUsuario
        }
      >
        <View
          style={
            estilos.avatar
          }
        >
          <Ionicons
            name="person-outline"
            size={28}
            color="#000000"
          />
        </View>

        <View
          style={
            estilos.dadosUsuario
          }
        >
          <Text
            style={
              estilos.nomeUsuario
            }
          >
            {nome}
          </Text>

          <View
            style={
              estilos.linhaInformacoes
            }
          >
            <Text
              style={
                estilos.informacao
              }
            >
              {pais}
            </Text>

            <Text
              style={
                estilos.informacao
              }
            >
              {tempo}
            </Text>
          </View>
        </View>
      </View>

      {/* MENU */}
      <View
        style={
          estilos.menu
        }
      >
        <OpcaoPerfil
          titulo="Editar perfil"
          aoPressionar={
            abrirEditarPerfil
          }
        />

        <OpcaoPerfil
          titulo="Favoritos"
          aoPressionar={
            abrirFavoritos
          }
        />

        <OpcaoPerfil
          titulo="Configuração"
          aoPressionar={
            abrirConfiguracao
          }
        />

        <OpcaoPerfil
          titulo="Meus conselhos"
          aoPressionar={
            abrirMeusConselhos
          }
        />

        <OpcaoPerfil
          titulo="Minhas atividades"
          aoPressionar={
            abrirMinhasAtividades
          }
        />
      </View>

      {/* LOGOUT */}
      <View
        style={
          estilos.areaLogout
        }
      >
        <Pressable
          onPress={
            confirmarLogout
          }
          style={({ pressed }) => [
            estilos.botaoLogout,

            pressed &&
              estilos.pressionado,
          ]}
        >
          <Text
            style={
              estilos.botaoLogoutTexto
            }
          >
            Cerrar sessão
          </Text>
        </Pressable>
      </View>
    </ScreenTemplate>
  );
}

function OpcaoPerfil({
  titulo,
  aoPressionar,
}) {
  return (
    <Pressable
      onPress={
        aoPressionar
      }
      style={({ pressed }) => [
        estilos.opcao,

        pressed &&
          estilos.opcaoPressionada,
      ]}
    >
      <Text
        style={
          estilos.opcaoTexto
        }
      >
        {titulo}
      </Text>

      <Ionicons
        name="chevron-forward"
        size={20}
        color={cores.texto}
      />
    </Pressable>
  );
}

const estilos =
  StyleSheet.create({
    cartaoUsuario: {
      flexDirection: 'row',

      alignItems: 'center',

      marginTop:
        espacamentos.lg,

      padding:
        espacamentos.md,

      backgroundColor:
        cores.superficie,

      borderWidth: 1,

      borderColor:
        cores.borda,

      borderRadius:
        raios.sm,
    },

    avatar: {
      width: 48,
      height: 48,

      borderRadius: 24,

      marginRight:
        espacamentos.md,

      alignItems:
        'center',

      justifyContent:
        'center',

      backgroundColor:
        '#A9A6AF',
    },

    dadosUsuario: {
      flex: 1,
    },

    nomeUsuario: {
      fontSize: 18,

      fontWeight:
        '700',

      color:
        cores.texto,

      marginBottom: 4,
    },

    linhaInformacoes: {
      flexDirection:
        'row',

      alignItems:
        'center',

      gap:
        espacamentos.md,
    },

    informacao: {
      fontSize:
        tipografia.legenda,

      color:
        cores.textoSecundario,
    },

    menu: {
      marginTop:
        espacamentos.md,
    },

    opcao: {
      minHeight: 52,

      flexDirection:
        'row',

      alignItems:
        'center',

      justifyContent:
        'space-between',

      paddingHorizontal: 2,

      borderBottomWidth: 1,

      borderBottomColor:
        cores.borda,
    },

    opcaoTexto: {
      fontSize:
        tipografia.corpo,

      fontWeight:
        '600',

      color:
        cores.texto,
    },

    opcaoPressionada: {
      opacity: 0.5,
    },

    areaLogout: {
      marginTop: 135,

      paddingHorizontal:
        espacamentos.sm,

      marginBottom:
        espacamentos.md,
    },

    botaoLogout: {
      minHeight: 48,

      borderWidth: 1,

      borderColor:
        cores.borda,

      borderRadius:
        raios.sm,

      backgroundColor:
        cores.superficie,

      alignItems:
        'center',

      justifyContent:
        'center',
    },

    botaoLogoutTexto: {
      fontSize:
        tipografia.legenda,

      fontWeight:
        '700',

      color:
        cores.texto,
    },

    pressionado: {
      opacity: 0.6,
    },
  });