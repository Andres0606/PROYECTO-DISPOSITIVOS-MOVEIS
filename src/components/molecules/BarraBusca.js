// MOLECULE — BarraBusca

import { useMemo } from 'react';

import {
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import {
  espacamentos,
  raios,
  tipografia,
} from '../../theme';

import { useTema } from '../../theme/useTema';

export function BarraBusca({
  valor,
  aoMudar,
  placeholder = 'Buscar...',
  aoFiltrar,
}) {
  const { cores } = useTema();

  const estilos = useMemo(
    () => criarEstilos(cores),
    [cores]
  );

  return (
    <View style={estilos.linha}>

      <View style={estilos.campo}>

        <Ionicons
          name="search-outline"
          size={22}
          color={cores.textoSecundario}
        />

        <TextInput
          value={valor}
          onChangeText={aoMudar}
          placeholder={placeholder}
          placeholderTextColor={cores.textoSecundario}
          returnKeyType="search"
          autoCorrect={false}
          style={estilos.input}
        />

      </View>

      {!!aoFiltrar && (
        <Pressable
          onPress={aoFiltrar}
          accessibilityRole="button"
          accessibilityLabel="Filtros"
          style={({ pressed }) => [
            estilos.botao,
            pressed && estilos.pressionado,
          ]}
        >
          <Ionicons
            name="filter-outline"
            size={20}
            color={cores.chipTexto}
          />
        </Pressable>
      )}

    </View>
  );
}

function criarEstilos(cores) {
  return StyleSheet.create({
    linha: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: espacamentos.sm,
    },

    campo: {
      flex: 1,
      height: 40,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      paddingLeft: 12,
      paddingRight: espacamentos.md,
      borderRadius: raios.sm,
      backgroundColor: cores.campoBusca,
    },

    input: {
      flex: 1,
      paddingVertical: 0,
      fontSize: tipografia.subtitulo,
      color: cores.texto,
    },

    botao: {
      width: 40,
      height: 40,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: raios.sm,
      borderWidth: 1,
      borderColor: cores.borda,
      backgroundColor: cores.superficie,
    },

    pressionado: {
      opacity: 0.6,
    },
  });
}