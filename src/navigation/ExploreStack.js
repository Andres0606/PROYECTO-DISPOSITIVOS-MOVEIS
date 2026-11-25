// NAVIGATION — ExploreStack

import {
  createNativeStackNavigator,
} from '@react-navigation/native-stack';

import { ExploreScreen } from '../screens/ExploreScreen';
import { PlaceDetailScreen } from '../screens/PlaceDetailScreen';

import { useTema } from '../theme/useTema';

const Stack = createNativeStackNavigator();

export function ExploreStack() {
  const { cores } = useTema();

  return (
    <Stack.Navigator
      initialRouteName="ExplorarLista"
      screenOptions={{
        headerShown: false,

        contentStyle: {
          backgroundColor: cores.fundo,
        },
      }}
    >

      <Stack.Screen
        name="ExplorarLista"
        component={ExploreScreen}
      />

      <Stack.Screen
        name="DetalheLocal"
        component={PlaceDetailScreen}
      />

    </Stack.Navigator>
  );
}