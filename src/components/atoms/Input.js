// ATOM — Input

import { useState } from 'react';

import {
  StyleSheet,
  TextInput,
} from 'react-native';

import {
  espacamentos,
  raios,
  tipografia,
} from '../../theme';

import { useTema } from '../../theme/useTema';

export function Input({
  erro = false,
  variante = 'padrao',
  ...resto
}) {
  const { cores } = useTema();

  const [focado, setFocado] = useState(false);

  return (
    <TextInput
      placeholderTextColor={cores.textoSecundario}

      onFocus={() => setFocado(true)}

      onBlur={() => setFocado(false)}

      style={[
        estilos.input,

        {
          borderColor: cores.borda,
          backgroundColor: cores.superficie,
          color: cores.texto,
        },

        variante === 'cartao' && [
          estilos.cartao,
          {
            borderColor: cores.bordaCartao,
            backgroundColor: cores.campoCartao,
          },
        ],

        focado && {
          borderColor: cores.bordaFoco,
        },

        erro && {
          borderColor: cores.perigo,
        },
      ]}

      {...resto}
    />
  );
}

// ============================================================
// ESTILOS
// ============================================================

const estilos = StyleSheet.create({
  input: {
    minHeight: 40,
    paddingHorizontal: espacamentos.md,
    paddingVertical: espacamentos.sm,
    borderWidth: 1,
    borderRadius: raios.sm,
    fontSize: tipografia.corpo,
  },

  cartao: {
    minHeight: 48,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: raios.md,
  },
});