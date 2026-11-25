// NAVIGATION — Administração
import { StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { AdminHomeScreen } from '../screens/AdminHomeScreen';
import { AdminPerfilScreen } from '../screens/AdminPerfilScreen';
import { ConfiguracoesScreen } from '../screens/ConfiguracoesScreen';
import { PlaceholderScreen } from '../screens/PlaceholderScreen';
import { tipografia } from '../theme';
import { useTema } from '../theme/useTema';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const ICONES = {
  Painel: 'home-outline',
  Usuarios: 'people-outline',
  Conteudos: 'folder-outline',
  Moderacao: 'shield-checkmark-outline',
  Perfil: 'person-outline',
};

function opcoesAba(rotulo, nome) {
  return {
    title: rotulo,
    tabBarLabel: rotulo,
    tabBarIcon: ({ color }) => (
      <Ionicons name={ICONES[nome]} size={24} color={color} />
    ),
  };
}

function AdminPerfilStack({ route }) {
  const { cores } = useTema();
  return (
    <Stack.Navigator screenOptions={{
      headerShown: false,
      contentStyle: { backgroundColor: cores.fundo },
    }}>
      <Stack.Screen
        name="AdminPerfilPrincipal"
        component={AdminPerfilScreen}
        initialParams={{ usuario: route.params?.usuario }}
      />
      <Stack.Screen name="Configuracoes" component={ConfiguracoesScreen} />
    </Stack.Navigator>
  );
}

export function AdminTabs({ route }) {
  const usuario = route.params?.usuario;
  const { cores } = useTema();

  return (
    <Tab.Navigator
      initialRouteName="Painel"
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: cores.texto,
        tabBarInactiveTintColor: cores.textoSecundario,
        tabBarLabelStyle: estilos.rotulo,
        tabBarStyle: [estilos.barra, {
          backgroundColor: cores.superficie,
          borderTopColor: cores.borda,
        }],
        tabBarHideOnKeyboard: true,
      }}
    >
      <Tab.Screen name="Painel" component={AdminHomeScreen}
        initialParams={{ usuario }} options={opcoesAba('Painel', 'Painel')} />
      <Tab.Screen name="Usuarios" component={PlaceholderScreen}
        initialParams={{ titulo: 'Usuários' }} options={opcoesAba('Usuários', 'Usuarios')} />
      <Tab.Screen name="Conteudos" component={PlaceholderScreen}
        initialParams={{ titulo: 'Conteúdos' }} options={opcoesAba('Conteúdos', 'Conteudos')} />
      <Tab.Screen name="Moderacao" component={PlaceholderScreen}
        initialParams={{ titulo: 'Moderação' }} options={opcoesAba('Moderação', 'Moderacao')} />
      <Tab.Screen name="Perfil" component={AdminPerfilStack}
        initialParams={{ usuario }} options={opcoesAba('Perfil', 'Perfil')} />
    </Tab.Navigator>
  );
}

const estilos = StyleSheet.create({
  barra: { borderTopWidth: StyleSheet.hairlineWidth, elevation: 0, paddingTop: 6 },
  rotulo: { fontSize: tipografia.legenda, fontWeight: '500' },
});
