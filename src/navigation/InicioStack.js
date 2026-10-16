// NAVIGATION — InicioStack (pilha interna da aba Início)
// Mantém a barra de abas visível ao abrir telas a partir do Início.
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HomeScreen } from '../screens/HomeScreen';
import { SurviveScreen } from '../screens/SurviveScreen';
import { cores } from '../theme';

const Stack = createNativeStackNavigator();

// Os dados do usuário chegam pelos params da aba e são repassados ao Início.
export function InicioStack({ route }) {
  const usuario = route.params?.usuario;

  return (
    <Stack.Navigator
      initialRouteName="InicioHome"
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: cores.fundo },
      }}
    >
      <Stack.Screen
        name="InicioHome"
        component={HomeScreen}
        initialParams={{ usuario }}
      />
      <Stack.Screen name="Sobrevive" component={SurviveScreen} />
      {/* Próximas: Conselhos, Atividades */}
    </Stack.Navigator>
  );
}