// NAVIGATION — PerfilStack
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { PerfilScreen } from '../screens/PerfilScreen';
import { RecursosScreen } from '../screens/RecursosScreen';

const Stack = createNativeStackNavigator();

export function PerfilStack({ route }) {
  const usuario = route.params?.usuario;

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="PerfilPrincipal"
        component={PerfilScreen}
        initialParams={{ usuario }}
      />

      <Stack.Screen
        name="Recursos"
        component={RecursosScreen}
      />
    </Stack.Navigator>
  );
}