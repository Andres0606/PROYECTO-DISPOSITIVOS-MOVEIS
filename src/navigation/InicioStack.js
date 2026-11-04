// NAVIGATION — InicioStack
// Mantém a barra de abas visível ao abrir telas a partir do Início.

import {
  createNativeStackNavigator,
} from '@react-navigation/native-stack';

import { HomeScreen } from '../screens/HomeScreen';
import { SurviveScreen } from '../screens/SurviveScreen';
import { ListaFrasesScreen } from '../screens/ListaFrasesScreen';
import { FraseDetalheScreen } from '../screens/FraseDetalheScreen';
import { ConselhosScreen } from '../screens/ConselhosScreen';
import { ConselhoDetalheScreen } from '../screens/ConselhoDetalheScreen';
import { CriarConselhoScreen } from '../screens/CriarConselhoScreen';
import { EditarConselhoScreen } from '../screens/EditarConselhoScreen';
import { AtividadesScreen } from '../screens/AtividadesScreen';

import { cores } from '../theme';

const Stack =
  createNativeStackNavigator();

export function InicioStack({
  route,
}) {
  const usuario =
    route.params?.usuario;

  return (
    <Stack.Navigator
      initialRouteName="InicioHome"
      screenOptions={{
        headerShown: false,

        contentStyle: {
          backgroundColor:
            cores.fundo,
        },
      }}
    >
      <Stack.Screen
        name="InicioHome"
        component={HomeScreen}
        initialParams={{
          usuario,
        }}
      />

      <Stack.Screen
        name="Sobrevive"
        component={SurviveScreen}
      />

      <Stack.Screen
        name="ListaFrases"
        component={
          ListaFrasesScreen
        }
      />

      <Stack.Screen
        name="FraseDetalhe"
        component={
          FraseDetalheScreen
        }
      />

      <Stack.Screen
        name="Conselhos"
        component={
          ConselhosScreen
        }
      />

      <Stack.Screen
        name="ConselhoDetalhe"
        component={
          ConselhoDetalheScreen
        }
      />

      <Stack.Screen
        name="CriarConselho"
        component={
          CriarConselhoScreen
        }
      />

      <Stack.Screen
        name="EditarConselho"
        component={
          EditarConselhoScreen
        }
      />

      <Stack.Screen
        name="Atividades"
        component={
          AtividadesScreen
        }
      />
    </Stack.Navigator>
  );
}