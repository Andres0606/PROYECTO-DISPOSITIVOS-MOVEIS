// SCREEN — Perfil
import { traduzirPais } from '../i18n/catalogosPaises';
import {
  useCallback,
  useMemo,
  useState,
} from 'react';

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
import { obterUsuario } from '../services/storage';

import { usePreferencias } from '../contexts/PreferenciasContext';
import { useTema } from '../theme/useTema';

import {
  espacamentos,
  raios,
  tipografia,
} from '../theme';

// SCREEN

export function PerfilScreen({ navigation, route }) {
  const { cores } = useTema();

  const {
    restaurarPreferencias,
    t,
    idioma,
  } = usePreferencias();

  const estilos = useMemo(
    () => criarEstilos(cores),
    [cores]
  );

  const [usuario, setUsuario] =
    useState(route.params?.usuario);

  // CARREGAR PERFIL

  useFocusEffect(
    useCallback(() => {
      let ativo = true;

      async function carregarPerfil() {
        try {
          const usuarioSalvo =
            await obterUsuario();

          if (ativo && usuarioSalvo) {
            setUsuario(usuarioSalvo);
          }
        } catch (erro) {
          console.log(
            'Erro ao carregar perfil:',
            erro.name
          );
        }
      }

      carregarPerfil();

      return () => {
        ativo = false;
      };
    }, [])
  );

  // DADOS DO USUÁRIO

  const nome =
    usuario?.nome ??
    t('grupo1.usuario');

  const pais =
    traduzirPais(usuario?.paisOrigem?.nome, idioma) ??
    t('grupo1.nao_informado');

  const universidadeOrigem =
    usuario?.universidadeOrigem?.nome ??
    t('grupo1.nao_informada');

  const universidadeDestino =
    usuario?.universidadeDestino?.nome ??
    t('grupo1.nao_informada');

  const email =
    usuario?.email ??
    t('grupo1.nao_informado');

  const fotoUri =
    usuario?.fotoUrl ?? null;

  // NAVEGAÇÃO

  function abrirEditarPerfil() {
    navigation.navigate(
      'EditarPerfil',
      { usuario }
    );
  }

  function abrirFavoritos() {
    navigation.navigate('Favoritos');
  }

  function abrirConfiguracao() {
    navigation.navigate('Configuracoes');
  }

  function abrirMeusConselhos() {
    navigation.navigate('MeusConselhos');
  }

  function abrirMinhasAtividades() {
    navigation.navigate('MinhasAtividades');
  }

  // ENCERRAR SESSÃO

  function confirmarLogout() {
    Alert.alert(
      t('grupo1.encerrar_sessao'),
      t('grupo1.tem_certeza_que_deseja_sair_da_sua_conta'),
      [
        {
          text: t('comum.cancelar'),
          style: 'cancel',
        },
        {
          text: t('comum.sair'),
          style: 'destructive',
          onPress: sair,
        },
      ]
    );
  }

  async function sair() {
    try {
      await logout();

      restaurarPreferencias();

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
        erro.name
      );
    }
  }

  // RENDER

  return (
    <ScreenTemplate
      titulo={t('navegacao.perfil')}
    >

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
              color={cores.texto}
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
            {t('grupo1.pais_de_origem')}{' '}
            {pais}
          </Text>

          <Text style={estilos.informacao}>
            {t('grupo1.universidade_de_origem')}{' '}
            {universidadeOrigem}
          </Text>

          <Text style={estilos.informacao}>
            {t('grupo1.universidade_em_chapeco')}{' '}
            {universidadeDestino}
          </Text>

        </View>

      </View>

      <View style={estilos.menu}>

        <OpcaoPerfil
          titulo={t('grupo1.editar_perfil')}
          aoPressionar={abrirEditarPerfil}
        />

        <OpcaoPerfil
          titulo={t('modulos.favoritos')}
          aoPressionar={abrirFavoritos}
        />

        <OpcaoPerfil
          titulo={t('modulos.configuracoes')}
          aoPressionar={abrirConfiguracao}
        />

        <OpcaoPerfil
          titulo={t('grupo1.meus_conselhos')}
          aoPressionar={abrirMeusConselhos}
        />

        <OpcaoPerfil
          titulo={t('grupo1.minhas_atividades')}
          aoPressionar={abrirMinhasAtividades}
        />

      </View>

      <View style={estilos.areaLogout}>

        <Pressable
          onPress={confirmarLogout}
          style={({ pressed }) => [
            estilos.botaoLogout,
            pressed && estilos.pressionado,
          ]}
        >
          <Text style={estilos.botaoLogoutTexto}>
            {t('grupo1.encerrar_sessao')}
          </Text>
        </Pressable>

      </View>

    </ScreenTemplate>
  );
}

// OPÇÃO DO PERFIL

function OpcaoPerfil({
  titulo,
  aoPressionar,
}) {
  const { cores } = useTema();

  const estilos = useMemo(
    () => criarEstilos(cores),
    [cores]
  );

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

// ESTILOS

function criarEstilos(cores) {
  return StyleSheet.create({
    cartaoUsuario: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: cores.superficie,
      borderWidth: 1,
      borderColor: cores.borda,
      borderRadius: raios.md,
      padding: espacamentos.md,
      marginTop: espacamentos.xl,
      gap: espacamentos.md,
    },

    avatar: {
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: cores.decoracaoClara,
      alignItems: 'center',
      justifyContent: 'center',
    },

    avatarFoto: {
      width: 56,
      height: 56,
      borderRadius: 28,
    },

    dadosUsuario: {
      flex: 1,
      gap: 4,
    },

    nomeUsuario: {
      fontSize: tipografia.subtitulo,
      fontWeight: '700',
      color: cores.texto,
      marginBottom: espacamentos.xs,
    },

    informacao: {
      fontSize: tipografia.legenda,
      color: cores.textoSecundario,
    },

    menu: {
      marginTop: espacamentos.lg,
    },

    opcao: {
      minHeight: 58,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderBottomWidth: 1,
      borderBottomColor: cores.borda,
    },

    opcaoTexto: {
      fontSize: tipografia.corpo,
      color: cores.texto,
      fontWeight: '600',
    },

    opcaoPressionada: {
      opacity: 0.6,
    },

    areaLogout: {
      marginTop: espacamentos.xl,
      paddingHorizontal: espacamentos.sm,
    },

    botaoLogout: {
      minHeight: 52,
      backgroundColor: cores.superficie,
      borderWidth: 1,
      borderColor: cores.borda,
      borderRadius: raios.md,
      alignItems: 'center',
      justifyContent: 'center',
    },

    botaoLogoutTexto: {
      fontSize: tipografia.legenda,
      color: cores.texto,
      fontWeight: '700',
    },

    pressionado: {
      opacity: 0.6,
    },
  });
}