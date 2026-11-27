
// ORGANISM — DetalheFrase

import { StyleSheet, Text, View } from 'react-native';
import { Card } from '../atoms/Card';
import { Etiqueta } from '../atoms/Etiqueta';
import { BotaoIcone } from '../atoms/BotaoIcone';
import { Button } from '../atoms/Button';
import { espacamentos, tipografia } from '../../theme';
import { useTema } from '../../theme/useTema';

export function DetalheFrase({
  frase, favorita, ocupado, falando,
  aoAlternarFavorita, aoPronunciar,
}) {
  const { cores } = useTema();

  return (
    <View style={estilos.tela}>
      <View style={estilos.cabecalho}>
        <Etiqueta titulo={frase.categoria?.nome ?? 'Português'} />

        <BotaoIcone
          nome={favorita ? 'star' : 'star-outline'}
          tamanho={24}
          rotulo={favorita ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
          aoPressionar={ocupado ? undefined : aoAlternarFavorita}
        />
      </View>

      <Card>
        <Text style={[estilos.idioma, { color: cores.textoSecundario }]}>
          Português
        </Text>

        <Text style={[estilos.frase, { color: cores.texto }]}>
          {frase.portugues}
        </Text>

        <View style={[estilos.divisor, { backgroundColor: cores.borda }]} />

        <Text style={[estilos.idioma, { color: cores.textoSecundario }]}>
          Español
        </Text>

        <Text style={[estilos.traducao, { color: cores.texto }]}>
          {frase.espanhol}
        </Text>
      </Card>

      <Button
        titulo={falando ? 'Parar pronúncia' : 'Ouvir pronúncia'}
        variante="contorno"
        aoPressionar={aoPronunciar}
      />

      {!!frase.explicacao && (
        <Card>
          <Text style={[estilos.titulo, { color: cores.texto }]}>
            Contexto de uso
          </Text>

          <Text style={[estilos.explicacao, { color: cores.textoSecundario }]}>
            {frase.explicacao}
          </Text>
        </Card>
      )}
    </View>
  );
}

const estilos = StyleSheet.create({
  tela: { gap: espacamentos.lg },
  cabecalho: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  idioma: {
    fontSize: tipografia.legenda,
    marginBottom: espacamentos.xs,
  },
  frase: {
    fontSize: tipografia.subtitulo,
    fontWeight: '700',
  },
  traducao: { fontSize: tipografia.subtitulo },
  divisor: {
    height: StyleSheet.hairlineWidth,
    marginVertical: espacamentos.md,
  },
  titulo: {
    fontSize: tipografia.corpo,
    fontWeight: '600',
    marginBottom: espacamentos.sm,
  },
  explicacao: {
    fontSize: tipografia.corpo,
    lineHeight: 22,
  },
});
