// NAVIGATION — IntercambioStack (pilha interna da aba Intercâmbio)
// Mantém a barra de abas visível ao abrir telas a partir da lista de tarefas.
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { TaskListScreen } from '../screens/TaskListScreen';
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
      {/* Próximas: DetalheTarefa, CriarTarefa, EditarTarefa */}
    </Stack.Navigator>
  );
}