// ORGANISM — ListaLocais

import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { CardLocal } from '../molecules/CardLocal';

import {
  formatarDistancia,
} from '../../utils/formatacao';

import {
  espacamentos,
  tipografia,
} from '../../theme';

import { useTema } from '../../theme/useTema';

export function ListaLocais({
  locais,
  aoAbrirLocal,
}) {
  const { cores } = useTema();

  if (locais.length === 0) {
    return (
      <Text
        style={[
          estilos.vazio,
          {
            color: cores.textoSecundario,
          },
        ]}
      >
        Nenhum local encontrado.
      </Text>
    );
  }

  return (
    <View style={estilos.lista}>

      {locais.map((local) => {

        const detalhe = [
          local.categoria,

          local.distanciaKm != null
            ? formatarDistancia(
                local.distanciaKm
              )
            : null,

        ].filter(Boolean).join(' · ');

        return (
          <CardLocal
            key={local.id}

            nome={local.nome}

            detalhe={detalhe}

            imagem={
              local.imagemUrl
                ? { uri: local.imagemUrl }
                : undefined
            }

            aoPressionar={() =>
              aoAbrirLocal?.(local)
            }
          />
        );
      })}

    </View>
  );
}

const estilos = StyleSheet.create({
  lista: {
    gap: espacamentos.lg,
  },

  vazio: {
    marginTop: espacamentos.lg,
    textAlign: 'center',
    fontSize: tipografia.corpo,
  },
});