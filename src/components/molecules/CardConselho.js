
// MOLECULE — CardConselho

import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AvatarIcone } from '../atoms/AvatarIcone';
import { Etiqueta } from '../atoms/Etiqueta';
import { espacamentos, raios, tipografia } from '../../theme';
import { useTema } from '../../theme/useTema';

export function CardConselho({
  conselho, aoCurtir, aoAbrir, desabilitado = false,
}) {
  const { cores } = useTema();

  return (
    <View style={[
      estilos.cartao,
      { backgroundColor: cores.superficie, borderColor: cores.borda },
    ]}>
      <Pressable onPress={aoAbrir}
        style={({ pressed }) => pressed && estilos.pressionado}
        accessibilityRole="button">

        <View style={estilos.cabecalho}>
          <AvatarIcone icone="person-outline" tamanho={40}
            uri={conselho.fotoAutor} />

          <View style={estilos.dadosAutor}>
            <Text style={[estilos.autor, { color: cores.texto }]}>
              {conselho.autor}
            </Text>

            <Text style={[estilos.legenda, { color: cores.textoSecundario }]}>
              {[conselho.pais, conselho.tempo].filter(Boolean).join(' · ')}
            </Text>
          </View>
        </View>

        <Text style={[estilos.titulo, { color: cores.texto }]}>
          {conselho.texto}
        </Text>

        <View style={estilos.categoria}>
          <Etiqueta titulo={conselho.categoria} />
        </View>
      </Pressable>

      <View style={estilos.rodape}>
        <Pressable
          onPress={aoCurtir}
          disabled={desabilitado}
          hitSlop={10}
          accessibilityRole="button"
          accessibilityLabel={conselho.curtido ? 'Remover curtida' : 'Curtir conselho'}
          accessibilityState={{ selected: conselho.curtido, disabled: desabilitado }}
          style={({ pressed }) => [
            estilos.interacao,
            (pressed || desabilitado) && estilos.pressionado,
          ]}>

          <Ionicons
            name={conselho.curtido ? 'heart' : 'heart-outline'}
            size={21}
            color={conselho.curtido ? cores.perigo : cores.texto}
          />

          <Text style={[estilos.legenda, { color: cores.textoSecundario }]}>
            {conselho.curtidas}
          </Text>
        </Pressable>

        <Pressable onPress={aoAbrir} style={estilos.interacao}
          accessibilityRole="button" accessibilityLabel="Ver comentários">
          <Ionicons name="chatbubble-outline" size={19} color={cores.texto} />
          <Text style={[estilos.legenda, { color: cores.textoSecundario }]}>
            {conselho.comentarios}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const estilos = StyleSheet.create({
  cartao: {
    borderWidth: 1,
    borderRadius: raios.sm,
    padding: espacamentos.md,
  },
  cabecalho: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: espacamentos.sm,
    marginBottom: espacamentos.md,
  },
  dadosAutor: { flex: 1 },
  autor: { fontSize: tipografia.subtitulo, fontWeight: '600' },
  legenda: { fontSize: tipografia.legenda },
  titulo: {
    fontSize: tipografia.corpo,
    fontWeight: '600',
    marginBottom: espacamentos.sm,
  },
  categoria: { alignSelf: 'flex-start' },
  rodape: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: espacamentos.lg,
    marginTop: espacamentos.md,
  },
  interacao: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: espacamentos.xs,
    paddingVertical: espacamentos.xs,
  },
  pressionado: { opacity: 0.5 },
});
