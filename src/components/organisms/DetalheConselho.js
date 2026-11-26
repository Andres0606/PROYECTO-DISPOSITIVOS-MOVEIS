
// ORGANISM — DetalheConselho

import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AvatarIcone } from '../atoms/AvatarIcone';
import { FotoLocal } from '../atoms/FotoLocal';
import { Etiqueta } from '../atoms/Etiqueta';
import { Button } from '../atoms/Button';
import { espacamentos, raios, tipografia } from '../../theme';
import { useTema } from '../../theme/useTema';

export function DetalheConselho({
  conselho, aoCurtir, aoEditar, ocupado = false,
}) {
  const { cores } = useTema();

  return (
    <View style={estilos.container}>
      <View style={[
        estilos.cabecalho,
        { backgroundColor: cores.superficie, borderColor: cores.borda },
      ]}>
        <AvatarIcone icone="person-outline" tamanho={46}
          uri={conselho.fotoAutor} />

        <View style={estilos.autor}>
          <Text style={[estilos.nome, { color: cores.texto }]}>
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

      <Text style={[estilos.descricao, { color: cores.texto }]}>
        {conselho.descricao}
      </Text>

      {!!conselho.imagem && (
        <FotoLocal imagem={{ uri: conselho.imagem }} style={estilos.imagem} />
      )}

      {conselho.meuConselho && (
        <Button titulo="Editar" variante="secundario"
          aoPressionar={aoEditar} desabilitado={ocupado} />
      )}

      <View style={estilos.rodape}>
        <Pressable onPress={aoCurtir} disabled={ocupado}
          hitSlop={10} accessibilityRole="button"
          accessibilityLabel={conselho.curtido ? 'Remover curtida' : 'Curtir conselho'}
          accessibilityState={{ selected: conselho.curtido, disabled: ocupado }}
          style={({ pressed }) => [
            estilos.interacao,
            (pressed || ocupado) && estilos.pressionado,
          ]}>

          <Ionicons
            name={conselho.curtido ? 'heart' : 'heart-outline'}
            size={23}
            color={conselho.curtido ? cores.perigo : cores.texto}
          />

          <Text style={[estilos.legenda, { color: cores.textoSecundario }]}>
            {conselho.curtidas}
          </Text>
        </Pressable>

        <View style={estilos.interacao}>
          <Ionicons name="chatbubble-outline" size={20} color={cores.texto} />

          <Text style={[estilos.legenda, { color: cores.textoSecundario }]}>
            {conselho.comentarios}{' '}
            {conselho.comentarios === 1 ? 'Comentário' : 'Comentários'}
          </Text>
        </View>
      </View>
    </View>
  );
}

const estilos = StyleSheet.create({
  container: { gap: espacamentos.md },
  cabecalho: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: espacamentos.sm,
    padding: espacamentos.md,
    borderWidth: 1,
    borderRadius: raios.sm,
  },
  autor: { flex: 1 },
  nome: { fontSize: tipografia.subtitulo, fontWeight: '600' },
  legenda: { fontSize: tipografia.legenda },
  titulo: { fontSize: 19, fontWeight: '700' },
  categoria: { alignSelf: 'flex-start' },
  descricao: { fontSize: tipografia.corpo, lineHeight: 23 },
  imagem: { width: '100%', height: 220, borderRadius: raios.md },
  rodape: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: espacamentos.sm,
  },
  interacao: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: espacamentos.xs,
    paddingVertical: espacamentos.xs,
  },
  pressionado: { opacity: 0.5 },
});
