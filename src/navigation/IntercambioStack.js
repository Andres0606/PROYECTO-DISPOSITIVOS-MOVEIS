// NAVIGATION — IntercambioStack (pilha interna da aba Intercâmbio)
// Mantém a barra de abas visível ao abrir telas a partir da lista de tarefas.
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { TaskListScreen } from '../screens/TaskListScreen';
import { TaskDetailScreen } from '../screens/TaskDetailScreen';
import { TaskCreateScreen } from '../screens/TaskCreateScreen';
import { TaskEditScreen } from '../screens/TaskEditScreen';
import { cores } from '../theme';

const Stack = createNativeStackNavigator();

export function IntercambioStack() {
  return (
    <Stack.Navigator
      initialRouteName="TarefasLista"
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: cores.fundo },
      }}
    >
      <Stack.Screen name="TarefasLista" component={TaskListScreen} />
      <Stack.Screen name="DetalheTarefa" component={TaskDetailScreen} />
      <Stack.Screen name="CriarTarefa" component={TaskCreateScreen} />
      <Stack.Screen name="EditarTarefa" component={TaskEditScreen} />
    </Stack.Navigator>
  );
}