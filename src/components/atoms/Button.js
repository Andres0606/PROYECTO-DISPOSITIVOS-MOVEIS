// ATOM — Button

import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
} from 'react-native';

import { LinearGradient } from 'expo-linear-gradient';

import {
  espacamentos,
  raios,
  tipografia,
} from '../../theme';

import { useTema } from '../../theme/useTema';

export function Button({
  titulo,
  aoPressionar,
  variante = 'primario',
  carregando = false,
  desabilitado = false,
  icone = null,
  grande = false,
}) {
  const { cores, gradientes } = useTema();

  const inativo = carregando || desabilitado;

  const coresTexto = {
    primario: cores.textoSobrePrimaria,
    secundario: cores.texto,
    escuro: cores.textoBotaoPrincipal,
    contorno: cores.texto,
    link: cores.textoSecundario,
  };

  const coresBotao = {
    secundario: {
      backgroundColor: cores.superficieSecundaria,
    },

    escuro: {
      backgroundColor: cores.botaoPrincipal,
    },

    contorno: {
      borderColor: cores.bordaForte,
      backgroundColor: cores.superficie,
    },
  };

  const corCarregando =
    variante === 'primario' ||
    variante === 'escuro'
      ? coresTexto[variante]
      : cores.texto;

  return (
    <Pressable
      onPress={aoPressionar}
      disabled={inativo}
      hitSlop={variante === 'link' ? 8 : 0}
      style={({ pressed }) => [
        estilos.base,
        estilos[variante],
        coresBotao[variante],

        variante === 'primario' &&
          grande &&
          estilos.grande,

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
        <ActivityIndicator
          color={corCarregando}
        />
      ) : (
        <>
          {icone}

          <Text
            style={[
              estilos.texto,
              estilosTexto[variante],
              { color: coresTexto[variante] },
            ]}
          >
            {titulo}
          </Text>
        </>
      )}
    </Pressable>
  );
}

// ============================================================
// ESTILOS DOS BOTÕES
// ============================================================

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

  grande: {
    minHeight: 53,
  },

  secundario: {
    borderRadius: raios.sm,
  },

  escuro: {
    borderRadius: raios.sm,
  },

  contorno: {
    borderRadius: raios.sm,
    borderWidth: 1,
  },

  link: {
    minHeight: 0,
    paddingHorizontal: 0,
    paddingVertical: espacamentos.xs,
    alignSelf: 'flex-start',
    backgroundColor: 'transparent',
  },

  pressionado: {
    opacity: 0.8,
  },

  inativo: {
    opacity: 0.5,
  },
});

// ============================================================
// ESTILOS DOS TEXTOS
// ============================================================

const estilosTexto = StyleSheet.create({
  primario: {
    fontSize: tipografia.botao,
    fontWeight: '700',
    textShadowColor: 'rgba(0, 0, 0, 0.25)',
    textShadowOffset: {
      width: 0,
      height: 2,
    },
    textShadowRadius: 4,
  },

  secundario: {
    fontSize: tipografia.corpo,
    fontWeight: '500',
  },

  escuro: {
    fontSize: tipografia.corpo,
    fontWeight: '700',
  },

  contorno: {
    fontSize: tipografia.corpo,
    fontWeight: '700',
  },

  link: {
    fontSize: tipografia.legenda,
    fontWeight: '400',
    lineHeight: 18,
  },
});