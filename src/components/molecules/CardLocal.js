// MOLECULE — CardLocal (foto + nome + categoria · distância)
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '../atoms/Card';
import { cores, tipografia } from '../../theme';

export function CardLocal({ nome, detalhe, imagem, aoPressionar }) {
  return (
    <Pressable
      onPress={aoPressionar}
      accessibilityRole="button"
      style={({ pressed }) => pressed && estilos.pressionado}
    >
      <Card style={estilos.card}>
        {imagem ? (
          <Image source={imagem} style={estilos.foto} resizeMode="cover" />
        ) : (
          <View style={[estilos.foto, estilos.semFoto]}>
            <Ionicons name="image-outline" size={28} color={cores.decoracao} />
          </View>
        )}

        <View style={estilos.textos}>
          <Text style={estilos.nome} numberOfLines={2}>
            {nome}
          </Text>
          <Text style={estilos.detalhe} numberOfLines={1}>
            {detalhe}
          </Text>
        </View>
      </Card>
    </Pressable>
  );
}

const estilos = StyleSheet.create({
  card: {
    minHeight: 112,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 11,
    padding: 5,
  },
  foto: {
    width: 120,
    height: 94,
    borderRadius: 4,
  },
  semFoto: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: cores.decoracaoClara,
  },
  textos: { flex: 1 },
  nome: {
    fontSize: tipografia.subtitulo,
    lineHeight: 24,
    fontWeight: '600',
    color: cores.texto,
  },
  detalhe: {
    fontSize: tipografia.corpo,
    lineHeight: 21,
    color: cores.textoSecundario,
  },
  pressionado: { opacity: 0.7 },
});