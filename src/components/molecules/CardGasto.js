// MOLECULE — CardGasto (avatar + conceito + "categoria · data" + valor)
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { AvatarIcone } from '../atoms/AvatarIcone';
import { Card } from '../atoms/Card';
import { cores, tipografia } from '../../theme';

export function CardGasto({ conceito, detalhe, valor, icone, aoPressionar }) {
  return (
    <Pressable
      onPress={aoPressionar}
      accessibilityRole="button"
      style={({ pressed }) => pressed && estilos.pressionado}
    >
      <Card style={estilos.card}>
        <AvatarIcone icone={icone} />

        <View style={estilos.textos}>
          <Text style={estilos.conceito} numberOfLines={1}>
            {conceito}
          </Text>
          <Text style={estilos.detalhe} numberOfLines={1}>
            {detalhe}
          </Text>
        </View>

        <Text style={estilos.valor}>{valor}</Text>
      </Card>
    </Pressable>
  );
}

const estilos = StyleSheet.create({
  card: {
    minHeight: 74,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 5,
    paddingRight: 12,
  },
  textos: { flex: 1 },
  conceito: {
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
  valor: {
    fontSize: tipografia.corpo,
    color: cores.textoSecundario,
  },
  pressionado: { opacity: 0.7 },
});