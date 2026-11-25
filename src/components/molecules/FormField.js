// MOLECULE — FormField
// Rótulo, campo de entrada e mensagem de erro.

import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { Input } from '../atoms/Input';

import {
  espacamentos,
  tipografia,
} from '../../theme';

import { useTema } from '../../theme/useTema';

export function FormField({
  rotulo,
  erro = '',
  margemInferior = espacamentos.sm,
  children,
  ...resto
}) {
  const { cores } = useTema();

  return (
    <View
      style={{
        marginBottom: margemInferior,
      }}
    >
      <Text
        style={[
          estilos.rotulo,
          { color: cores.texto },
        ]}
      >
        {rotulo}
      </Text>

      {children ?? (
        <Input
          erro={!!erro}
          {...resto}
        />
      )}

      {!!erro && (
        <Text
          style={[
            estilos.mensagemErro,
            { color: cores.perigo },
          ]}
        >
          {erro}
        </Text>
      )}

    </View>
  );
}

// ============================================================
// ESTILOS
// ============================================================

const estilos = StyleSheet.create({
  rotulo: {
    marginBottom: espacamentos.xs,
    fontSize: tipografia.corpo,
    lineHeight: 21,
    fontWeight: '600',
  },

  mensagemErro: {
    marginTop: espacamentos.xs,
    fontSize: tipografia.legenda,
  },
});