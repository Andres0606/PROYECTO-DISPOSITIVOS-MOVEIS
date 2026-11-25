// ATOM — FotoLocal

import {
  Image,
  StyleSheet,
  View,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { useTema } from '../../theme/useTema';

export function FotoLocal({
  imagem,
  style,
  icone = 'image-outline',
}) {
  const { cores } = useTema();

  if (imagem) {
    return (
      <Image
        source={imagem}
        style={style}
        resizeMode="cover"
      />
    );
  }

  return (
    <View
      style={[
        estilos.semFoto,
        {
          backgroundColor: cores.decoracaoClara,
        },
        style,
      ]}
    >
      <Ionicons
        name={icone}
        size={28}
        color={cores.decoracao}
      />
    </View>
  );
}

const estilos = StyleSheet.create({
  semFoto: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});