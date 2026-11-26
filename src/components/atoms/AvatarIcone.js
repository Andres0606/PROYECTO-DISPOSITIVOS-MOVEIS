
// ATOM — AvatarIcone

import { useState } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTema } from '../../theme/useTema';

export function AvatarIcone({ icone, tamanho = 62, uri }) {
  const { cores } = useTema();
  const [uriComErro, setUriComErro] = useState(null);

  return (
    <View style={[
      estilos.avatar,
      {
        width: tamanho,
        height: tamanho,
        borderRadius: tamanho / 2,
        backgroundColor: cores.decoracaoClara,
      },
    ]}>
      {uri && uri !== uriComErro ? (
        <Image
          source={{ uri }}
          style={estilos.imagem}
          resizeMode="cover"
          onError={() => setUriComErro(uri)}
        />
      ) : (
        <Ionicons name={icone} size={tamanho * 0.4}
          color={cores.primaria} />
      )}
    </View>
  );
}

const estilos = StyleSheet.create({
  avatar: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  imagem: {
    width: '100%',
    height: '100%',
  },
});
