// MOLECULE — ItemFrase
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { cores, espacamentos, tipografia } from '../../theme';

export function ItemFrase({
  frase,
  favorita = false,
  aoAbrir,
  aoAlternarFavorita,
}) {
  return (
    <View style={estilos.container}>
      <Pressable
        onPress={aoAbrir}
        style={({ pressed }) => [
          estilos.conteudo,
          pressed && estilos.pressionado,
        ]}
        accessibilityRole="button"
      >
        <Text style={estilos.portugues}>
          {frase.portugues}
        </Text>

        <Text style={estilos.espanhol}>
          {frase.espanhol}
        </Text>
      </Pressable>

      <Pressable
        onPress={aoAlternarFavorita}
        style={({ pressed }) => [
          estilos.botaoFavorito,
          pressed && estilos.pressionado,
        ]}
        hitSlop={8}
        accessibilityRole="button"
        accessibilityLabel={
          favorita
            ? 'Remover dos favoritos'
            : 'Adicionar aos favoritos'
        }
      >
        <Ionicons
          name={favorita ? 'star' : 'star-outline'}
          size={21}
          color={cores.texto}
        />
      </Pressable>
    </View>
  );
}

const estilos = StyleSheet.create({
  container: {
    minHeight: 62,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: cores.bordaForte,
  },

  conteudo: {
    flex: 1,
    paddingVertical: espacamentos.sm,
    paddingRight: espacamentos.md,
  },

  portugues: {
    fontSize: tipografia.corpo,
    fontWeight: '600',
    color: cores.texto,
    marginBottom: espacamentos.xs,
  },

  espanhol: {
    fontSize: tipografia.legenda,
    color: cores.textoSecundario,
  },

  botaoFavorito: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },

  pressionado: {
    opacity: 0.5,
  },
});