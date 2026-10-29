// NAVIGATION — InicioStack
// Mantém a barra de abas visível ao abrir telas a partir do Início.

import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { HomeScreen } from '../screens/HomeScreen';
import { SurviveScreen } from '../screens/SurviveScreen';
import { ListaFrasesScreen } from '../screens/ListaFrasesScreen';
import { FraseDetalheScreen } from '../screens/FraseDetalheScreen';

import { cores } from '../theme';

const Stack = createNativeStackNavigator();

export function InicioStack({ route }) {
  const usuario = route.params?.usuario;

  return (
    <Stack.Navigator
      initialRouteName="InicioHome"
      screenOptions={{
        headerShown: false,
        contentStyle: {
          backgroundColor: cores.fundo,
        },
      }}
    >
      <Stack.Screen
        name="InicioHome"
        component={HomeScreen}
        initialParams={{ usuario }}
      />

      <Stack.Screen
        name="Sobrevive"
        component={SurviveScreen}
      />

      <Stack.Screen
        name="ListaFrases"
        component={ListaFrasesScreen}
      />

      <Stack.Screen
        name="FraseDetalhe"
        component={FraseDetalheScreen}
      />

      {/* Próximas: Conselhos, Atividades */}
    </Stack.Navigator>
  );
}