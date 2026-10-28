// MOLECULE — ItemTarefa (checkbox + título + lápis, com linha inferior)
// aoAbrir e aoEditar são opcionais: serão ligados às telas Detalhes e Editar tarefa.
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Checkbox } from '../atoms/Checkbox';
import { cores, espacamentos, tipografia } from '../../theme';

export function ItemTarefa({
  titulo,
  concluida,
  aoAlternar,
  aoAbrir,
  aoEditar,
}) {
  return (
    <View style={estilos.linha}>
      <Checkbox marcado={concluida} aoAlternar={aoAlternar} />

      <Pressable
        onPress={aoAbrir}
        accessibilityRole="button"
        style={estilos.texto}
      >
        <Text
          style={[estilos.titulo, concluida && estilos.tituloConcluida]}
          numberOfLines={2}
        >
          {titulo}
        </Text>
      </Pressable>

      <Pressable
        onPress={aoEditar}
        hitSlop={10}
        accessibilityRole="button"
        accessibilityLabel="Editar tarefa"
      >
        <Ionicons name="pencil-outline" size={16} color={cores.texto} />
      </Pressable>
    </View>
  );
}

const estilos = StyleSheet.create({
  linha: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: espacamentos.md - 4,
    paddingVertical: espacamentos.sm - 2,
    borderBottomWidth: 1,
    borderBottomColor: cores.bordaForte,
  },
  texto: { flex: 1 },
  titulo: {
    fontSize: tipografia.subtitulo,
    lineHeight: 24,
    color: cores.texto,
  },
  tituloConcluida: { color: cores.textoSecundario },
});