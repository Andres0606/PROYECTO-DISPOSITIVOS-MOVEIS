// MOLECULE — ItemFrase

import { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { espacamentos, tipografia } from '../../theme';
import { useTema } from '../../theme/useTema';

export function ItemFrase({
  frase, favorita = false, ocupado = false,
  aoAbrir, aoAlternarFavorita,
}) {
  const { cores } = useTema();
  const estilos = useMemo(() => criarEstilos(cores), [cores]);

  return (
    <View style={estilos.container}>
      <Pressable onPress={aoAbrir} disabled={ocupado}
        accessibilityRole="button"
        style={({ pressed }) => [
          estilos.conteudo, pressed && estilos.pressionado,
        ]}>
        <Text style={estilos.portugues}>{frase.portugues}</Text>
        <Text style={estilos.espanhol}>{frase.espanhol}</Text>
      </Pressable>

      <Pressable onPress={aoAlternarFavorita}
        disabled={ocupado} hitSlop={8}
        accessibilityRole="button"
        accessibilityState={{ selected: favorita, disabled: ocupado }}
        accessibilityLabel={favorita
          ? 'Remover dos favoritos'
          : 'Adicionar aos favoritos'}
        style={({ pressed }) => [
          estilos.botaoFavorito,
          (pressed || ocupado) && estilos.pressionado,
        ]}>
        <Ionicons name={favorita ? 'star' : 'star-outline'}
          size={21} color={cores.texto} />
      </Pressable>
    </View>
  );
}

function criarEstilos(cores) {
  return StyleSheet.create({
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
    pressionado: { opacity: 0.5 },
  });
}