// ORGANISM — ListaLocais (cards de locais ou mensagem de lista vazia)
import { StyleSheet, Text, View } from 'react-native';
import { CardLocal } from '../molecules/CardLocal';
import { imagensLocais } from '../../constants/locais';
import { formatarDistancia } from '../../utils/formatacao';
import { cores, espacamentos, tipografia } from '../../theme';

// aoAbrirLocal(local) é opcional: será ligado à tela Detalhes do local.
export function ListaLocais({ locais, aoAbrirLocal }) {
  if (locais.length === 0) {
    return <Text style={estilos.vazio}>Nenhum local encontrado.</Text>;
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
  lista: { gap: espacamentos.lg },
  vazio: {
    marginTop: espacamentos.lg,
    textAlign: 'center',
    fontSize: tipografia.corpo,
    color: cores.textoSecundario,
  },
});