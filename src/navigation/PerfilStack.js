
// NAVIGATION — PerfilStack

import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { PerfilScreen } from '../screens/PerfilScreen';
import { EditarPerfilScreen } from '../screens/EditarPerfilScreen';
import { ConfiguracoesScreen } from '../screens/ConfiguracoesScreen';
import { RecursosScreen } from '../screens/RecursosScreen';
import { FavoritosScreen } from '../screens/FavoritosScreen';

import { AtividadesScreen } from '../screens/AtividadesScreen';
import { AtividadeDetalheScreen } from '../screens/AtividadeDetalheScreen';
import { CriarAtividadeScreen } from '../screens/CriarAtividadeScreen';
import { EditarAtividadeScreen } from '../screens/EditarAtividadeScreen';

import { ConselhosScreen } from '../screens/ConselhosScreen';
import { ConselhoDetalheScreen } from '../screens/ConselhoDetalheScreen';
import { CriarConselhoScreen } from '../screens/CriarConselhoScreen';
import { EditarConselhoScreen } from '../screens/EditarConselhoScreen';

import { FraseDetalheScreen } from '../screens/FraseDetalheScreen';

const Stack = createNativeStackNavigator();

export function PerfilStack({ route }) {
  const usuario = route.params?.usuario;

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>

      <Stack.Screen name="PerfilPrincipal"
        component={PerfilScreen}
        initialParams={{ usuario }} />

      <Stack.Screen name="EditarPerfil"
        component={EditarPerfilScreen} />

      <Stack.Screen name="Configuracoes"
        component={ConfiguracoesScreen} />

      <Stack.Screen name="Favoritos"
        component={FavoritosScreen} />

      <Stack.Screen name="MeusConselhos"
        component={ConselhosScreen}
        initialParams={{ apenasMeus: true }} />

      <Stack.Screen name="ConselhoDetalhe"
        component={ConselhoDetalheScreen} />

      <Stack.Screen name="CriarConselho"
        component={CriarConselhoScreen} />

      <Stack.Screen name="EditarConselho"
        component={EditarConselhoScreen} />

      <Stack.Screen name="MinhasAtividades"
        component={AtividadesScreen}
        initialParams={{ apenasMinhas: true }} />

      <Stack.Screen name="AtividadeDetalhe"
        component={AtividadeDetalheScreen} />

      <Stack.Screen name="CriarAtividade"
        component={CriarAtividadeScreen} />

      <Stack.Screen name="EditarAtividade"
        component={EditarAtividadeScreen} />

      <Stack.Screen name="FraseDetalhe"
        component={FraseDetalheScreen} />

      <Stack.Screen name="Recursos"
        component={RecursosScreen} />

    </Stack.Navigator>
  );
}
