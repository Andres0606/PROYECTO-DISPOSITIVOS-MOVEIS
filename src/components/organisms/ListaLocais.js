// ORGANISM — ListaLocais

import { StyleSheet, Text, View } from 'react-native';

import { CardLocal } from '../molecules/CardLocal';
import { imagensLocais } from '../../constants/locais';
import { formatarDistancia } from '../../utils/formatacao';

import { espacamentos, tipografia } from '../../theme';
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
          { color: cores.textoSecundario },
        ]}
      >
        Nenhum local encontrado.
      </Text>
    );
  }

  return (
    <View style={estilos.lista}>

      {locais.map((local) => (
        <CardLocal
          key={local.id}
          nome={local.nome}
          detalhe={`${local.categoria} · ${formatarDistancia(local.distanciaKm)}`}
          imagem={imagensLocais[local.id]}
          aoPressionar={() => aoAbrirLocal?.(local)}
        />
      ))}

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