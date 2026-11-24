// SCREEN — Perfil

import { useCallback, useState } from 'react';

import {
  Alert,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

import { ScreenTemplate } from '../components/templates/ScreenTemplate';

import { logout } from '../services/auth';

import {
  obterFotoLocal,
  obterUsuario,
} from '../services/storage';

import {
  cores,
  espacamentos,
  raios,
  tipografia,
} from '../theme';

// ============================================================
// SCREEN — PERFIL
// ============================================================

export function PerfilScreen({ navigation, route }) {
  const usuarioInicial = route.params?.usuario;

  const [usuario, setUsuario] = useState(usuarioInicial);
  const [fotoUri, setFotoUri] = useState(null);

  // ==========================================================
  // CARREGAR PERFIL
  // ==========================================================

  useFocusEffect(
    useCallback(() => {
      async function carregarPerfil() {
        try {
          const [usuarioSalvo, fotoSalva] = await Promise.all([
            obterUsuario(),
            obterFotoLocal(),
          ]);

          if (usuarioSalvo) {
            setUsuario(usuarioSalvo);
          }

          setFotoUri(fotoSalva ?? null);
        } catch (erro) {
          console.log('Erro ao carregar perfil:', erro);
        }
      }

      carregarPerfil();
    }, [])
  );

  // ==========================================================
  // DADOS DO USUÁRIO
  // ==========================================================

  const nome =
    usuario?.nome ?? 'Usuário';

  const pais =
    usuario?.paisOrigem?.nome ?? 'Não informado';

  const universidadeOrigem =
    usuario?.universidadeOrigem?.nome ?? 'Não informada';

  const universidadeDestino =
    usuario?.universidadeDestino?.nome ?? 'Não informada';

  const email =
    usuario?.email ?? 'Não informado';

  // ==========================================================
  // NAVEGAÇÃO
  // ==========================================================

  function abrirEditarPerfil() {
    navigation.navigate('EditarPerfil', {
      usuario,
    });
  }

  function abrirFavoritos() {
    navigation.navigate('Favoritos');
  }

  function abrirConfiguracao() {
    navigation.navigate('Configuracoes');
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

  // ==========================================================
  // LOGOUT
  // ==========================================================

  function confirmarLogout() {
    Alert.alert(
      'Encerrar sessão',
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

      const navegacaoRaiz = navigation
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
      console.log('Erro ao encerrar sessão:', erro);
    }
  }

  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <ScreenTemplate titulo="Perfil">

      {/* CARTÃO DO USUÁRIO */}

      <View style={estilos.cartaoUsuario}>

        {fotoUri ? (
          <Image
            source={{ uri: fotoUri }}
            style={estilos.avatarFoto}
          />
        ) : (
          <View style={estilos.avatar}>
            <Ionicons
              name="person-outline"
              size={28}
              color="#000000"
            />
          </View>
        )}

        <View style={estilos.dadosUsuario}>

          <Text style={estilos.nomeUsuario}>
            {nome}
          </Text>

          <Text style={estilos.informacao}>
            {email}
          </Text>

          <Text style={estilos.informacao}>
            País de origem: {pais}
          </Text>

          <Text style={estilos.informacao}>
            Universidade de origem: {universidadeOrigem}
          </Text>

          <Text style={estilos.informacao}>
            Universidade em Chapecó: {universidadeDestino}
          </Text>

        </View>
      </View>

      {/* MENU DO PERFIL */}

      <View style={estilos.menu}>

        <OpcaoPerfil
          titulo="Editar perfil"
          aoPressionar={abrirEditarPerfil}
        />

        <OpcaoPerfil
          titulo="Favoritos"
          aoPressionar={abrirFavoritos}
        />

        <OpcaoPerfil
          titulo="Configuração"
          aoPressionar={abrirConfiguracao}
        />

        <OpcaoPerfil
          titulo="Meus conselhos"
          aoPressionar={abrirMeusConselhos}
        />

        <OpcaoPerfil
          titulo="Minhas atividades"
          aoPressionar={abrirMinhasAtividades}
        />

      </View>

      {/* ENCERRAR SESSÃO */}

      <View style={estilos.areaLogout}>
        <Pressable
          onPress={confirmarLogout}
          style={({ pressed }) => [
            estilos.botaoLogout,
            pressed && estilos.pressionado,
          ]}
        >
          <Text style={estilos.botaoLogoutTexto}>
            Encerrar sessão
          </Text>
        </Pressable>
      </View>

    </ScreenTemplate>
  );
}

// ============================================================
// OPÇÃO DO MENU
// ============================================================

function OpcaoPerfil({ titulo, aoPressionar }) {
  return (
    <Pressable
      onPress={aoPressionar}
      style={({ pressed }) => [
        estilos.opcao,
        pressed && estilos.opcaoPressionada,
      ]}
    >
      <Text style={estilos.opcaoTexto}>
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

// ============================================================
// ESTILOS
// ============================================================

const estilos = StyleSheet.create({
  cartaoUsuario: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: espacamentos.lg,
    padding: espacamentos.md,
    backgroundColor: cores.superficie,
    borderWidth: 1,
    borderColor: cores.borda,
    borderRadius: raios.sm,
  },

  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: espacamentos.md,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#A9A6AF',
  },

  avatarFoto: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: espacamentos.md,
  },

  dadosUsuario: {
    flex: 1,
    gap: 4,
  },

  nomeUsuario: {
    fontSize: 18,
    fontWeight: '700',
    color: cores.texto,
    marginBottom: 4,
  },

  informacao: {
    fontSize: tipografia.legenda,
    color: cores.textoSecundario,
  },

  menu: {
    marginTop: espacamentos.md,
  },

  opcao: {
    minHeight: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 2,
    borderBottomWidth: 1,
    borderBottomColor: cores.borda,
  },

  opcaoTexto: {
    fontSize: tipografia.corpo,
    fontWeight: '600',
    color: cores.texto,
  },

  opcaoPressionada: {
    opacity: 0.5,
  },

  areaLogout: {
    marginTop: espacamentos.xl,
    paddingHorizontal: espacamentos.sm,
    marginBottom: espacamentos.md,
  },

  botaoLogout: {
    minHeight: 48,
    borderWidth: 1,
    borderColor: cores.borda,
    borderRadius: raios.sm,
    backgroundColor: cores.superficie,
    alignItems: 'center',
    justifyContent: 'center',
  },

  botaoLogoutTexto: {
    fontSize: tipografia.legenda,
    fontWeight: '700',
    color: cores.texto,
  },

  pressionado: {
    opacity: 0.6,
  },
});