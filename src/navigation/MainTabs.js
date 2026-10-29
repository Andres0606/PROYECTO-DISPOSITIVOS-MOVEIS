// NAVIGATION — MainTabs (menu inferior com 5 abas, conforme o Figma)
import { StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { PerfilStack } from './PerfilStack';
import { InicioStack } from './InicioStack';
import { ExploreStack } from './ExploreStack';
import { IntercambioStack } from './IntercambioStack';
import { GastosStack } from './GastosStack';
import { cores, tipografia } from '../theme';

const Tab = createBottomTabNavigator();

// Ícones das abas (trocar aqui, se necessário)
const ICONES = {
  Inicio: 'home-outline',
  Explorar: 'radio-button-on-outline',
  Intercambio: 'checkmark-outline',
  Gastos: 'logo-usd',
  Perfil: 'contrast-outline',
};

function opcoesAba(rotulo, nomeRota) {
  return {
    title: rotulo,
    tabBarLabel: rotulo,
    tabBarIcon: ({ color }) => (
      <Ionicons name={ICONES[nomeRota]} size={24} color={color} />
    ),
  };
}

// A rota "Home" do Stack abre este navegador. Os dados do usuário chegam
// em route.params.usuario e são repassados às abas que precisam deles.
export function MainTabs({ route }) {
  const usuario = route.params?.usuario;

  return (
    <Tab.Navigator
      initialRouteName="Inicio"
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: cores.texto,
        tabBarInactiveTintColor: cores.textoSecundario,
        tabBarLabelStyle: estilos.rotulo,
        tabBarStyle: estilos.barra,
        // Esconde a barra enquanto o teclado está aberto (formulários).
        tabBarHideOnKeyboard: true,
      }}
    >
      <Tab.Screen
        name="Inicio"
        component={InicioStack}
        initialParams={{ usuario }}
        options={opcoesAba('Início', 'Inicio')}
      />

      <Tab.Screen
        name="Explorar"
        component={ExploreStack}
        options={opcoesAba('Explorar', 'Explorar')}
      />

      <Tab.Screen
        name="Intercambio"
        component={IntercambioStack}
        options={opcoesAba('Intercâmbio', 'Intercambio')}
      />

      <Tab.Screen
        name="Gastos"
        component={GastosStack}
        options={opcoesAba('Gastos', 'Gastos')}
      />

      <Tab.Screen
        name="Perfil"
        component={PerfilStack}
        initialParams={{ usuario }}
        options={opcoesAba('Perfil', 'Perfil')}
      />
    </Tab.Navigator>
  );
}

const estilos = StyleSheet.create({
  barra: {
    backgroundColor: cores.superficie,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(0, 0, 0, 0.1)',
    elevation: 0,
    paddingTop: 6,
  },

  rotulo: {
    fontSize: tipografia.legenda,
    fontWeight: '500',
  },
});