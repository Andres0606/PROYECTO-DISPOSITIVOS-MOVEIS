// NAVIGATION — PerfilStack

import {
  createNativeStackNavigator,
} from '@react-navigation/native-stack';

import { PerfilScreen } from '../screens/PerfilScreen';
import { EditarPerfilScreen } from '../screens/EditarPerfilScreen';
import { ConfiguracoesScreen } from '../screens/ConfiguracoesScreen';
import { RecursosScreen } from '../screens/RecursosScreen';
import { FavoritosScreen } from '../screens/FavoritosScreen';

const Stack =
  createNativeStackNavigator();

export function PerfilStack({
  route,
}) {
  const usuario =
    route.params?.usuario;

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="PerfilPrincipal"
        component={
          PerfilScreen
        }
        initialParams={{
          usuario,
        }}
      />

      <Stack.Screen
        name="EditarPerfil"
        component={
          EditarPerfilScreen
        }
      />

      <Stack.Screen
        name="Configuracoes"
        component={
          ConfiguracoesScreen
        }
      />

      <Stack.Screen
        name="Favoritos"
        component={
          FavoritosScreen
        }
      />

      <Stack.Screen
        name="Recursos"
        component={
          RecursosScreen
        }
      />
    </Stack.Navigator>
  );
}