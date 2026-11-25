// NAVIGATION — IntercambioStack

import {
  createNativeStackNavigator,
} from '@react-navigation/native-stack';

import { TaskListScreen } from '../screens/TaskListScreen';
import { TaskDetailScreen } from '../screens/TaskDetailScreen';
import { TaskCreateScreen } from '../screens/TaskCreateScreen';
import { TaskEditScreen } from '../screens/TaskEditScreen';

import { useTema } from '../theme/useTema';

const Stack = createNativeStackNavigator();

export function IntercambioStack() {
  const { cores } = useTema();

  return (
    <Stack.Navigator
      initialRouteName="TarefasLista"
      screenOptions={{
        headerShown: false,

        contentStyle: {
          backgroundColor: cores.fundo,
        },
      }}
    >

      <Stack.Screen
        name="TarefasLista"
        component={TaskListScreen}
      />

      <Stack.Screen
        name="DetalheTarefa"
        component={TaskDetailScreen}
      />

      <Stack.Screen
        name="CriarTarefa"
        component={TaskCreateScreen}
      />

      <Stack.Screen
        name="EditarTarefa"
        component={TaskEditScreen}
      />

    </Stack.Navigator>
  );
}