// ATOM — AvatarIcone

import { StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { useTema } from '../../theme/useTema';

export function AvatarIcone({
  icone,
  tamanho = 62,
}) {
  const { cores } = useTema();

  return (
    <View
      style={[
        estilos.avatar,
        {
          width: tamanho,
          height: tamanho,
          borderRadius: tamanho / 2,
          backgroundColor: cores.decoracaoClara,
        },
      ]}
    >
      <Ionicons
        name={icone}
        size={tamanho * 0.4}
        color={cores.primaria}
      />
    </View>
  );
}

const estilos = StyleSheet.create({
  avatar: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});