// MOLECULE — CardAtividade
import { useMemo } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { espacamentos, raios, tipografia } from '../../theme';
import { useTema } from '../../theme/useTema';

export function CardAtividade({ atividade, aoAbrir }) {
  const { cores } = useTema();
  const estilos = useMemo(() => criarEstilos(cores), [cores]);
  return (
    <Pressable onPress={aoAbrir} accessibilityRole="button" style={({ pressed }) => [estilos.cartao, pressed && estilos.pressionado]}>
      {atividade.imagem ? (
        <Image source={{ uri: atividade.imagem }} style={estilos.imagem} resizeMode="cover" />
      ) : (
        <View style={estilos.imagemVazia}>
          <Ionicons name="image-outline" size={32} color={cores.textoSecundario} />
        </View>
      )}
      <View style={estilos.conteudo}>
        <View style={estilos.linhaPrincipal}>
          <View style={estilos.informacoes}>
            <Text style={estilos.titulo} numberOfLines={1}>{atividade.titulo}</Text>
            <Text style={estilos.detalhes}>{atividade.data}{' · '}{atividade.horario}{' · '}{atividade.interessados}{' '}interessados</Text>
          </View>
          <View style={estilos.categoria}>
            <Text style={estilos.categoriaTexto}>{atividade.categoria}</Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
}
function criarEstilos(cores) {
  return StyleSheet.create({
    cartao: { backgroundColor: cores.superficie, borderWidth: 1, borderColor: cores.borda, borderRadius: raios.sm, padding: espacamentos.sm, gap: espacamentos.sm },
    imagem: { width: '100%', height: 125, borderRadius: raios.sm, backgroundColor: cores.superficie },
    imagemVazia: { width: '100%', height: 125, borderRadius: raios.sm, backgroundColor: cores.superficieSecundaria, alignItems: 'center', justifyContent: 'center' },
    conteudo: { width: '100%' },
    linhaPrincipal: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: espacamentos.sm },
    informacoes: { flex: 1 },
    titulo: { fontSize: tipografia.legenda, fontWeight: '700', color: cores.texto, marginBottom: 3 },
    detalhes: { fontSize: 11, color: cores.textoSecundario },
    categoria: { minWidth: 70, paddingHorizontal: espacamentos.sm, paddingVertical: 5, borderWidth: 1, borderColor: cores.borda, borderRadius: raios.pill, alignItems: 'center', justifyContent: 'center' },
    categoriaTexto: { fontSize: 10, color: cores.texto },
    pressionado: { opacity: 0.65 },
  });
}
