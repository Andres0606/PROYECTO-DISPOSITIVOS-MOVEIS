// NAVIGATION — Administração

import { StyleSheet } from 'react-native';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

import { AdminHomeScreen } from '../screens/AdminHomeScreen';
import { AdminUsuariosScreen } from '../screens/AdminUsuariosScreen';
import { AdminConteudosScreen } from '../screens/AdminConteudosScreen';
import { AdminModeracaoScreen } from '../screens/AdminModeracaoScreen';
import { AdminPerfilScreen } from '../screens/AdminPerfilScreen';
import { ConfiguracoesScreen } from '../screens/ConfiguracoesScreen';

import { tipografia } from '../theme';
import { useTema } from '../theme/useTema';
import { usePreferencias } from '../contexts/PreferenciasContext';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// ÍCONES DAS ABAS

const ICONES = {
  Painel: 'home-outline',
  Usuarios: 'people-outline',
  Conteudos: 'folder-outline',
  Moderacao: 'shield-checkmark-outline',
  Perfil: 'person-outline',
};

// CONFIGURAÇÕES DAS ABAS

function opcoesAba(rotulo, nome) {
  return {
    title: rotulo,

    tabBarLabel: rotulo,

    tabBarIcon: ({ color }) => (
      <Ionicons
        name={ICONES[nome]}
        size={24}
        color={color}
      />
    ),
  };
}

// NAVEGAÇÃO DO PERFIL ADMINISTRATIVO

function AdminPerfilStack({ route }) {
  const { cores } = useTema();

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,

        contentStyle: {
          backgroundColor: cores.fundo,
        },
      }}
    >

      <Stack.Screen
        name="AdminPerfilPrincipal"
        component={AdminPerfilScreen}
        initialParams={{
          usuario: route.params?.usuario,
        }}
      />

      <Stack.Screen
        name="Configuracoes"
        component={ConfiguracoesScreen}
      />

    </Stack.Navigator>
  );
}

// NAVEGAÇÃO PRINCIPAL

export function AdminTabs({ route }) {
  const usuario = route.params?.usuario;

  const { cores } = useTema();
  const { t } = usePreferencias();

  return (
    <Tab.Navigator
      initialRouteName="Painel"
      screenOptions={{
        headerShown: false,

        tabBarActiveTintColor:
          cores.texto,

        tabBarInactiveTintColor:
          cores.textoSecundario,

        tabBarLabelStyle:
          estilos.rotulo,

        tabBarStyle: [
          estilos.barra,
          {
            backgroundColor:
              cores.superficie,

            borderTopColor:
              cores.borda,
          },
        ],

        tabBarHideOnKeyboard: true,
      }}
    >

      <Tab.Screen
        name="Painel"
        component={AdminHomeScreen}
        initialParams={{ usuario }}
        options={opcoesAba(
          t('navegacao.painel'),
          'Painel'
        )}
      />

      <Tab.Screen
        name="Usuarios"
        component={AdminUsuariosScreen}
        options={opcoesAba(
          t('navegacao.usuarios'),
          'Usuarios'
        )}
      />

      <Tab.Screen
        name="Conteudos"
        component={AdminConteudosScreen}
        options={opcoesAba(
          t('navegacao.conteudos'),
          'Conteudos'
        )}
      />

      <Tab.Screen
        name="Moderacao"
        component={AdminModeracaoScreen}
        options={opcoesAba(
          t('navegacao.moderacao'),
          'Moderacao'
        )}
      />

      <Tab.Screen
        name="Perfil"
        component={AdminPerfilStack}
        initialParams={{ usuario }}
        options={opcoesAba(
          t('navegacao.perfil'),
          'Perfil'
        )}
      />

    </Tab.Navigator>
  );
}

// ESTILOS

const estilos = StyleSheet.create({
  barra: {
    borderTopWidth:
      StyleSheet.hairlineWidth,

    elevation: 0,

    paddingTop: 6,
  },

  rotulo: {
    fontSize: tipografia.legenda,

    fontWeight: '500',
  },
});