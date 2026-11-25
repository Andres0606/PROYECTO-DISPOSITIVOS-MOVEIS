// APP — Ponto de entrada da aplicação

import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from '@react-navigation/native';

import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { StatusBar } from 'expo-status-bar';

import { LoginScreen } from './src/screens/LoginScreen';
import { RegisterScreen } from './src/screens/RegisterScreen';
import { RecoverPasswordScreen } from './src/screens/RecoverPasswordScreen';

import { MainTabs } from './src/navigation/MainTabs';

import {
  PreferenciasProvider,
  usePreferencias,
} from './src/contexts/PreferenciasContext';

import { useTema } from './src/theme/useTema';

const Stack = createNativeStackNavigator();

// ============================================================
// NAVEGAÇÃO PRINCIPAL
// ============================================================

function NavegacaoPrincipal() {
  const { temaEscuro } = usePreferencias();

  const { cores } = useTema();

  const temaBase = temaEscuro
    ? DarkTheme
    : DefaultTheme;

  const temaNavegacao = {
    ...temaBase,

    colors: {
      ...temaBase.colors,

      primary:
        cores.primaria,

      background:
        cores.fundo,

      card:
        cores.superficie,

      text:
        cores.texto,

      border:
        cores.borda,

      notification:
        cores.perigo,
    },
  };

  return (
    <NavigationContainer theme={temaNavegacao}>

      <StatusBar
        style={temaEscuro ? 'light' : 'dark'}
      />

      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{
          headerShown: false,

          contentStyle: {
            backgroundColor: cores.fundo,
          },
        }}
      >

        <Stack.Screen
          name="Login"
          component={LoginScreen}
        />

        <Stack.Screen
          name="Cadastro"
          component={RegisterScreen}
        />

        <Stack.Screen
          name="RecuperarSenha"
          component={RecoverPasswordScreen}
        />

        <Stack.Screen
          name="Home"
          component={MainTabs}
        />

      </Stack.Navigator>

    </NavigationContainer>
  );
}

// ============================================================
// APP
// ============================================================

export default function App() {
  return (
    <PreferenciasProvider>

      <NavegacaoPrincipal />

    </PreferenciasProvider>
  );
}