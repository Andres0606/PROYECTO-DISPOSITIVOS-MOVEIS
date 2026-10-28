// MOLECULE — ItemTarefa (checkbox + título + lápis, com linha inferior)
// aoAbrir e aoEditar são opcionais.
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Checkbox } from '../atoms/Checkbox';
import { BotaoIcone } from '../atoms/BotaoIcone';
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

      <BotaoIcone
        nome="pencil-outline"
        rotulo="Editar tarefa"
        aoPressionar={aoEditar}
      />
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