// ORGANISM — ListaCategoriasFrases

import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { CardLinha } from '../molecules/CardLinha';

import { espacamentos, tipografia } from '../../theme';
import { useTema } from '../../theme/useTema';

function rotuloFrases(total) {
  return `${total} ${total === 1 ? 'frase' : 'frases'}`;
}

export function ListaCategoriasFrases({
  categorias,
  aoAbrirCategoria,
}) {
  const { cores } = useTema();

  if (categorias.length === 0) {
    return (
      <Text
        style={[
          estilos.vazio,
          { color: cores.textoSecundario },
        ]}
      >
        Nenhuma categoria disponível.
      </Text>
    );
  }

  return (
    <View style={estilos.lista}>

      {categorias.map((categoria) => (
        <CardLinha
          key={categoria.id}
          titulo={categoria.nome}
          detalhe={
            rotuloFrases(categoria.totalFrases)
          }
          aoPressionar={() =>
            aoAbrirCategoria?.(categoria)
          }
        />
      ))}

    </View>
  );
}

const estilos = StyleSheet.create({
  lista: {
    gap: espacamentos.md + espacamentos.xs,
  },

  vazio: {
    marginTop: espacamentos.lg,
    textAlign: 'center',
    fontSize: tipografia.corpo,
  },
});