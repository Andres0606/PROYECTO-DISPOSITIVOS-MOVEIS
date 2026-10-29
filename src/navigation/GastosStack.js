// NAVIGATION — GastosStack (pilha interna da aba Gastos)
// Mantém a barra de abas visível ao abrir telas a partir do resumo.
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ExpenseSummaryScreen } from '../screens/ExpenseSummaryScreen';
import { ExpenseCreateScreen } from '../screens/ExpenseCreateScreen';
import { cores } from '../theme';

const Stack = createNativeStackNavigator();

export function GastosStack() {
  return (
    <Stack.Navigator
      initialRouteName="GastosResumo"
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: cores.fundo },
      }}
    >
      <Stack.Screen name="GastosResumo" component={ExpenseSummaryScreen} />
      <Stack.Screen name="RegistrarGasto" component={ExpenseCreateScreen} />
      {/* Próximas: Historico, Estatisticas, EditarGasto */}
    </Stack.Navigator>
  );
}