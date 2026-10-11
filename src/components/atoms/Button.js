// ATOM — Button
import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';
import { cores, espacamentos, raios, tipografia } from '../../theme';

export function Button({
  titulo,
  aoPressionar,
  variante = 'primario', // 'primario' | 'secundario' | 'link'
  carregando = false,
  desabilitado = false,
}) {
  const inativo = carregando || desabilitado;
  const corTexto = variante === 'primario' ? cores.superficie : cores.primaria;

  return (
    <Pressable
      onPress={aoPressionar}
      disabled={inativo}
      style={({ pressed }) => [
        estilos.base,
        estilos[variante],
        pressed && estilos.pressionado,
        inativo && estilos.inativo,
      ]}
    >
      {carregando ? (
        <ActivityIndicator color={corTexto} />
      ) : (
        <Text style={[estilos.texto, { color: corTexto }]}>{titulo}</Text>
      )}
    </Pressable>
  );
}

const estilos = StyleSheet.create({
  base: {
    minHeight: 48,
    paddingHorizontal: espacamentos.md,
    borderRadius: raios.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primario: { backgroundColor: cores.primaria },
  secundario: {
    backgroundColor: cores.superficie,
    borderWidth: 1,
    borderColor: cores.primaria,
  },
  link: { backgroundColor: 'transparent' },
  pressionado: { opacity: 0.8 },
  inativo: { opacity: 0.5 },
  texto: { fontSize: tipografia.corpo, fontWeight: '600' },
});