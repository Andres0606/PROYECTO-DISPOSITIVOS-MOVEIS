import { usePreferencias } from '../../contexts/PreferenciasContext';

// MOLECULE — ItemComentario

import { StyleSheet, Text, View } from 'react-native';
import { AvatarIcone } from '../atoms/AvatarIcone';
import { BotaoIcone } from '../atoms/BotaoIcone';
import { espacamentos, raios, tipografia } from '../../theme';
import { useTema } from '../../theme/useTema';

export function ItemComentario({
  comentario, aoEditar, aoExcluir, ocupado = false,
}) {
  const { t } = usePreferencias();
  const { cores } = useTema();

  return (
    <View style={[
      estilos.cartao,
      { backgroundColor: cores.superficie, borderColor: cores.borda },
    ]}>
      <View style={estilos.cabecalho}>
        <AvatarIcone icone="person-outline" tamanho={34}
          uri={comentario.fotoAutor} />

        <View style={estilos.autor}>
          <Text style={[estilos.nome, { color: cores.texto }]}>
            {comentario.autor}
          </Text>

          <Text style={[estilos.legenda, { color: cores.textoSecundario }]}>
            {comentario.tempo}{comentario.editado ? t('grupo3.g138') : ''}
          </Text>
        </View>

        {comentario.meuComentario && !ocupado && (
          <View style={estilos.acoes}>
            <BotaoIcone nome="create-outline" tamanho={19}
              rotulo={t('grupo3.g093')} aoPressionar={aoEditar} />

            <BotaoIcone nome="trash-outline" tamanho={19}
              rotulo={t('grupo3.g038')} aoPressionar={aoExcluir} />
          </View>
        )}
      </View>

      <Text style={[estilos.conteudo, { color: cores.texto }]}>
        {comentario.conteudo}
      </Text>
    </View>
  );
}

const estilos = StyleSheet.create({
  cartao: {
    borderWidth: 1,
    borderRadius: raios.sm,
    padding: espacamentos.md,
    gap: espacamentos.sm,
  },
  cabecalho: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: espacamentos.sm,
  },
  autor: { flex: 1 },
  nome: { fontSize: tipografia.corpo, fontWeight: '600' },
  legenda: { fontSize: tipografia.legenda },
  acoes: { flexDirection: 'row', gap: espacamentos.md },
  conteudo: { fontSize: tipografia.corpo, lineHeight: 21 },
});
