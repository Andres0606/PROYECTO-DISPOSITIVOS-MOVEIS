// ATOM — Logo (wordmark do InterChapecó)
// PROVISÓRIO: card com texto. Quando exportar o PNG do Figma (nó 66:128)
// para assets/logo.png, troque o conteúdo do componente por:
//
//   import { Image } from 'react-native';
//   <Image
//     source={require('../../../assets/logo.png')}
//     style={[estilos.card, style]}
//     resizeMode="cover"
//   />
import { StyleSheet, Text, View } from 'react-native';
import { cores, raios, sombras } from '../../theme';

export function Logo({ style }) {
  return (
    <View style={[estilos.card, style]}>
      <Text style={estilos.texto}>InterChapecó</Text>
    </View>
  );
}

const estilos = StyleSheet.create({
  card: {
    width: 241,
    height: 60,
    borderRadius: raios.lg,
    backgroundColor: cores.superficie,
    alignItems: 'center',
    justifyContent: 'center',
    ...sombras.logo,
  },
  texto: {
    fontSize: 24,
    fontWeight: '800',
    color: cores.texto,
    letterSpacing: -0.5,
  },
});