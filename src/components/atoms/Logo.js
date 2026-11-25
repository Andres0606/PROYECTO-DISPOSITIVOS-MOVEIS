// ATOM — Logo
import { StyleSheet, Text, View } from 'react-native';
import { raios, sombras } from '../../theme';
import { useTema } from '../../theme/useTema';

export function Logo({ style }) {
  const { cores } = useTema();
  return (
    <View style={[estilos.card, { backgroundColor: cores.superficie }, style]}>
      <Text style={[estilos.texto, { color: cores.texto }]}>InterChapecó</Text>
    </View>
  );
}

const estilos = StyleSheet.create({
  card: { width: 241, height: 60, borderRadius: raios.lg, alignItems: 'center', justifyContent: 'center', ...sombras.logo },
  texto: { fontSize: 24, fontWeight: '800', letterSpacing: -0.5 },
});
