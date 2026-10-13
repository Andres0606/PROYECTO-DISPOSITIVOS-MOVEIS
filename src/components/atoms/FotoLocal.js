// ATOM — FotoLocal (imagem ou quadro cinza de reserva)
import { Image, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { cores } from '../../theme';

export function FotoLocal({ imagem, style, icone = 'image-outline' }) {
  if (imagem) {
    return <Image source={imagem} style={style} resizeMode="cover" />;
  }

  return (
    <View style={[estilos.semFoto, style]}>
      <Ionicons name={icone} size={28} color={cores.decoracao} />
    </View>
  );
}

const estilos = StyleSheet.create({
  semFoto: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: cores.decoracaoClara,
  },
});