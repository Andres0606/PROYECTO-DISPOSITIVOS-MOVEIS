// ORGANISM — ListaCategoriasFrases (categorias de frases com contagem)
import { StyleSheet, Text, View } from 'react-native';
import { CardLinha } from '../molecules/CardLinha';
import { cores, espacamentos, tipografia } from '../../theme';

function rotuloFrases(total) {
  return `${total} ${total === 1 ? 'frase' : 'frases'}`;
}

// aoAbrirCategoria(categoria) é opcional: será ligado à tela Lista de frases.
export function ListaCategoriasFrases({ categorias, aoAbrirCategoria }) {
  if (categorias.length === 0) {
    return <Text style={estilos.vazio}>Nenhuma categoria disponível.</Text>;
  }

  return (
    <View style={estilos.lista}>
      {categorias.map((categoria) => (
        <CardLinha
          key={categoria.id}
          titulo={categoria.nome}
          detalhe={rotuloFrases(categoria.totalFrases)}
          aoPressionar={() => aoAbrirCategoria?.(categoria)}
        />
      ))}
    </View>
  );
}

const estilos = StyleSheet.create({
  lista: { gap: espacamentos.md + espacamentos.xs },
  vazio: {
    marginTop: espacamentos.lg,
    textAlign: 'center',
    fontSize: tipografia.corpo,
    color: cores.textoSecundario,
  },
});