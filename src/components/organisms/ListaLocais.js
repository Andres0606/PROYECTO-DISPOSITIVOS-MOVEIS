import { usePreferencias } from '../../contexts/PreferenciasContext';
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
  const { t } = usePreferencias();
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
        {t('grupo2.g060')}
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