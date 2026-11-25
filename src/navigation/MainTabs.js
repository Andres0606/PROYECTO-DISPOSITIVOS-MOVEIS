// NAVIGATION — MainTabs
// Menu inferior com 5 abas

import { StyleSheet } from 'react-native';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { Ionicons } from '@expo/vector-icons';

import { PerfilStack } from './PerfilStack';
import { InicioStack } from './InicioStack';
import { ExploreStack } from './ExploreStack';
import { IntercambioStack } from './IntercambioStack';
import { GastosStack } from './GastosStack';

import { tipografia } from '../theme';
import { useTema } from '../theme/useTema';

const Tab = createBottomTabNavigator();

// ============================================================
// ÍCONES DAS ABAS
// ============================================================

const ICONES = {
  Inicio: 'home-outline',
  Explorar: 'radio-button-on-outline',
  Intercambio: 'checkmark-outline',
  Gastos: 'logo-usd',
  Perfil: 'contrast-outline',
};

// ============================================================
// CONFIGURAÇÕES DAS ABAS
// ============================================================

function opcoesAba(rotulo, nomeRota) {
  return {
    title: rotulo,

    tabBarLabel: rotulo,

    tabBarIcon: ({ color }) => (
      <Ionicons
        name={ICONES[nomeRota]}
        size={24}
        color={color}
      />
    ),
  };
}

// ============================================================
// NAVEGAÇÃO PRINCIPAL
// ============================================================

export function MainTabs({ route }) {
  const usuario = route.params?.usuario;

  const { cores } = useTema();

  return (
    <Tab.Navigator
      initialRouteName="Inicio"
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
        name="Inicio"
        component={InicioStack}
        initialParams={{ usuario }}
        options={opcoesAba(
          'Início',
          'Inicio'
        )}
      />

      <Tab.Screen
        name="Explorar"
        component={ExploreStack}
        options={opcoesAba(
          'Explorar',
          'Explorar'
        )}
      />

      <Tab.Screen
        name="Intercambio"
        component={IntercambioStack}
        options={opcoesAba(
          'Intercâmbio',
          'Intercambio'
        )}
      />

      <Tab.Screen
        name="Gastos"
        component={GastosStack}
        options={opcoesAba(
          'Gastos',
          'Gastos'
        )}
      />

      <Tab.Screen
        name="Perfil"
        component={PerfilStack}
        initialParams={{ usuario }}
        options={opcoesAba(
          'Perfil',
          'Perfil'
        )}
      />

    </Tab.Navigator>
  );
}

// ============================================================
// ESTILOS
// ============================================================

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