// NAVIGATION — ExploreStack (pilha interna da aba Explorar)
// Mantém a barra de abas visível ao abrir o detalhe de um local.
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ExploreScreen } from '../screens/ExploreScreen';
import { PlaceDetailScreen } from '../screens/PlaceDetailScreen';
import { cores } from '../theme';

const Stack = createNativeStackNavigator();

export function ExploreStack() {
  return (
    <Stack.Navigator
      initialRouteName="ExplorarLista"
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: cores.fundo },
      }}
    >
      <Stack.Screen name="ExplorarLista" component={ExploreScreen} />
      <Stack.Screen name="DetalheLocal" component={PlaceDetailScreen} />
      {/* Próxima: <Stack.Screen name="Filtros" component={...} /> */}
    </Stack.Navigator>
  );
}