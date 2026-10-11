// ATOM — Input
import { useState } from 'react';
import { StyleSheet, TextInput } from 'react-native';
import { cores, espacamentos, raios, tipografia } from '../../theme';

export function Input({ erro = false, ...resto }) {
  const [focado, setFocado] = useState(false);

  return (
    <TextInput
      placeholderTextColor={cores.textoSecundario}
      onFocus={() => setFocado(true)}
      onBlur={() => setFocado(false)}
      style={[
        estilos.input,
        focado && estilos.focado,
        erro && estilos.erro,
      ]}
      {...resto}
    />
  );
}

const estilos = StyleSheet.create({
  input: {
    minHeight: 40,
    paddingHorizontal: espacamentos.md,
    paddingVertical: espacamentos.sm,
    borderWidth: 1,
    borderColor: cores.borda,
    borderRadius: raios.sm,
    backgroundColor: cores.superficie,
    color: cores.texto,
    fontSize: tipografia.corpo,
  },
  focado: { borderColor: cores.bordaFoco },
  erro: { borderColor: cores.perigo },
});