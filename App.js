
// APP — Ponto de entrada da aplicação

import { useEffect } from 'react';
import { Alert } from 'react-native';

import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
  createNavigationContainerRef,
} from '@react-navigation/native';

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';

import { LoginScreen } from './src/screens/LoginScreen';
import { RegisterScreen } from './src/screens/RegisterScreen';
import { RecoverPasswordScreen } from './src/screens/RecoverPasswordScreen';

import { MainTabs } from './src/navigation/MainTabs';
import { AdminTabs } from './src/navigation/AdminTabs';

import {
  PreferenciasProvider,
  usePreferencias,
} from './src/contexts/PreferenciasContext';

import { useTema } from './src/theme/useTema';
import { configurarSessao } from './src/services/sessao';

const Stack = createNativeStackNavigator();
const navegacaoRef = createNavigationContainerRef();

// NAVEGAÇÃO POR PERFIL

function NavegacaoPorPerfil(props) {
  const usuario = props.route.params?.usuario;

  if (usuario?.rol?.nome === 'Administrador') {
    return <AdminTabs {...props} />;
  }

  if (usuario?.rol?.nome === 'Estudante') {
    return <MainTabs {...props} />;
  }

  return <LoginScreen navigation={props.navigation} />;
}

// NAVEGAÇÃO PRINCIPAL

function NavegacaoPrincipal() {
  const {
    temaEscuro,
    restaurarPreferencias,
  } = usePreferencias();

  const { cores } = useTema();

  useEffect(() => {
    return configurarSessao(() => {
      restaurarPreferencias();

      if (!navegacaoRef.isReady()) return;

      const estado = navegacaoRef.getRootState();
      const rota = estado?.routes[estado.index]?.name;

      if (rota !== 'Home') return;

      navegacaoRef.resetRoot({
        index: 0,
        routes: [{ name: 'Login' }],
      });

      Alert.alert(
        'Sessão encerrada',
        'Sua sessão não está mais válida. Faça login novamente.'
      );
    });
  }, [restaurarPreferencias]);

  const temaBase = temaEscuro
    ? DarkTheme
    : DefaultTheme;

  const temaNavegacao = {
    ...temaBase,

    colors: {
      ...temaBase.colors,
      primary: cores.primaria,
      background: cores.fundo,
      card: cores.superficie,
      text: cores.texto,
      border: cores.borda,
      notification: cores.perigo,
    },
  };

  return (
    <NavigationContainer
      ref={navegacaoRef}
      theme={temaNavegacao}
    >
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
          component={NavegacaoPorPerfil}
        />

      </Stack.Navigator>

    </NavigationContainer>
  );
}

// APP

export default function App() {
  return (
    <PreferenciasProvider>
      <NavegacaoPrincipal />
    </PreferenciasProvider>
  );
}
