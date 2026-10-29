// ATOM — AvatarIcone (círculo cinza com um ícone no centro)
import { StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { cores } from '../../theme';

export function AvatarIcone({ icone, tamanho = 62 }) {
  return (
    <View
      style={[
        estilos.avatar,
        { width: tamanho, height: tamanho, borderRadius: tamanho / 2 },
      ]}
    >
      <Ionicons name={icone} size={tamanho * 0.4} color={cores.primaria} />
    </View>
  );
}

const estilos = StyleSheet.create({
  avatar: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: cores.decoracaoClara,
  },
});