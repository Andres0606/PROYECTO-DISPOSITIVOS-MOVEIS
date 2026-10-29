// MOLECULE — CardConselho
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import {
  cores,
  espacamentos,
  raios,
  tipografia,
} from '../../theme';

export function CardConselho({
  conselho,
  curtido = false,
  aoCurtir,
}) {
  return (
    <View style={estilos.cartao}>
      <View style={estilos.cabecalho}>
        <View style={estilos.avatar}>
          <Ionicons
            name="person-outline"
            size={21}
            color={cores.texto}
          />
        </View>

        <Text style={estilos.autor}>
          {conselho.autor}
        </Text>

        <Text style={estilos.pais}>
          {conselho.pais}
        </Text>
      </View>

      <Text style={estilos.texto}>
        {conselho.texto}
      </Text>

      <View style={estilos.rodape}>
        <View style={estilos.categoria}>
          <Text style={estilos.categoriaTexto}>
            {conselho.categoria}
          </Text>
        </View>

        <Pressable
          onPress={aoCurtir}
          style={({ pressed }) => [
            estilos.curtidas,
            pressed && estilos.pressionado,
          ]}
          accessibilityRole="button"
        >
          <Ionicons
            name={curtido ? 'heart' : 'heart-outline'}
            size={18}
            color={cores.texto}
          />

          <Text style={estilos.numeroCurtidas}>
            {conselho.curtidas + (curtido ? 1 : 0)}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const estilos = StyleSheet.create({
  cartao: {
    backgroundColor: cores.superficie,
    borderWidth: 1,
    borderColor: cores.borda,
    borderRadius: raios.sm,
    padding: espacamentos.sm,
  },

  cabecalho: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: espacamentos.sm,
  },

  avatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#AAA8AE',
    borderWidth: 1,
    borderColor: cores.texto,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: espacamentos.md,
  },

  autor: {
    fontSize: tipografia.subtitulo,
    fontWeight: '600',
    color: cores.texto,
  },

  pais: {
    marginLeft: espacamentos.md,
    fontSize: tipografia.legenda,
    color: cores.textoSecundario,
  },

  texto: {
    fontSize: tipografia.legenda,
    fontWeight: '600',
    color: cores.texto,
    marginBottom: espacamentos.sm,
  },

  rodape: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  categoria: {
    minWidth: 94,
    height: 27,
    paddingHorizontal: espacamentos.md,
    borderRadius: raios.pill,
    borderWidth: 1,
    borderColor: cores.borda,
    alignItems: 'center',
    justifyContent: 'center',
  },

  categoriaTexto: {
    fontSize: 11,
    color: cores.texto,
  },

  curtidas: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: espacamentos.xs,
    padding: espacamentos.xs,
  },

  numeroCurtidas: {
    fontSize: tipografia.legenda,
    color: cores.textoSecundario,
  },

  pressionado: {
    opacity: 0.5,
  },
});