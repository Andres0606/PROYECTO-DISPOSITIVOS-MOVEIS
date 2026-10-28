// ATOM — Button
import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { cores, espacamentos, gradientes, raios, tipografia } from '../../theme';

export function Button({
  titulo,
  aoPressionar,
  // 'primario' (degradê, telas de acesso) | 'secundario' | 'link'
  // 'escuro' (preto) | 'contorno' (branco com borda), usados nas telas internas
  variante = 'primario',
  carregando = false,
  desabilitado = false,
  icone = null,
  grande = false, // só para 'primario': altura de 53 (Cadastro, Recuperar senha)
}) {
  const inativo = carregando || desabilitado;
  const corCarregando =
    variante === 'primario' || variante === 'escuro'
      ? cores.superficie
      : cores.texto;

  return (
    <Pressable
      onPress={aoPressionar}
      disabled={inativo}
      hitSlop={variante === 'link' ? 8 : 0}
      style={({ pressed }) => [
        estilos.base,
        estilos[variante],
        variante === 'primario' && grande && estilos.grande,
        pressed && estilos.pressionado,
        inativo && estilos.inativo,
      ]}
    >
      {variante === 'primario' && (
        <LinearGradient
          colors={gradientes.botao.cores}
          locations={gradientes.botao.locais}
          start={{ x: 0.49, y: 0 }}
          end={{ x: 0.51, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
      )}

      {carregando ? (
        <ActivityIndicator color={corCarregando} />
      ) : (
        <>
          {icone}
          <Text style={[estilos.texto, estilosTexto[variante]]}>{titulo}</Text>
        </>
      )}
    </Pressable>
  );
}

const estilos = StyleSheet.create({
  base: {
    minHeight: 40,
    paddingHorizontal: espacamentos.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: espacamentos.sm,
  },
  primario: {
    minHeight: 41,
    borderRadius: raios.md,
    overflow: 'hidden',
  },
  grande: { minHeight: 53 },
  secundario: {
    borderRadius: raios.sm,
    backgroundColor: cores.superficieSecundaria,
  },
  escuro: {
    borderRadius: raios.sm,
    backgroundColor: cores.texto,
  },
  contorno: {
    borderRadius: raios.sm,
    borderWidth: 1,
    borderColor: cores.bordaForte,
    backgroundColor: cores.superficie,
  },
  link: {
    minHeight: 0,
    paddingHorizontal: 0,
    paddingVertical: espacamentos.xs,
    alignSelf: 'flex-start',
    backgroundColor: 'transparent',
  },
  pressionado: { opacity: 0.8 },
  inativo: { opacity: 0.5 },
});

const estilosTexto = StyleSheet.create({
  primario: {
    color: cores.superficie,
    fontSize: tipografia.botao,
    fontWeight: '700',
    textShadowColor: 'rgba(0, 0, 0, 0.25)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  secundario: {
    color: cores.texto,
    fontSize: tipografia.corpo,
    fontWeight: '500',
  },
  escuro: {
    color: cores.superficie,
    fontSize: tipografia.corpo,
    fontWeight: '700',
  },
  contorno: {
    color: cores.texto,
    fontSize: tipografia.corpo,
    fontWeight: '700',
  },
  link: {
    color: cores.textoSecundario,
    fontSize: tipografia.legenda,
    fontWeight: '400',
    lineHeight: 18,
  },
});