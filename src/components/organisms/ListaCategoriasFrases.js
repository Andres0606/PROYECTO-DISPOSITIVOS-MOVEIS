import { rotuloCatalogo3 } from '../../i18n/catalogosGrupo3';
import { usePreferencias } from '../../contexts/PreferenciasContext';
// ORGANISM — ListaCategoriasFrases

import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { CardLinha } from '../molecules/CardLinha';

import { espacamentos, tipografia } from '../../theme';
import { useTema } from '../../theme/useTema';

function rotuloFrases(total, t) {
  return `${total} ${total === 1 ? t('grupo3.g142') : t('grupo3.g143')}`;
}

export function ListaCategoriasFrases({
  categorias,
  aoAbrirCategoria,
}) {
  const { t } = usePreferencias();
  const { cores } = useTema();

  if (categorias.length === 0) {
    return (
      <Text
        style={[
          estilos.vazio,
          { color: cores.textoSecundario },
        ]}
      >
        {t('grupo3.g077')}
      </Text>
    );
  }

  return (
    <View style={estilos.lista}>

      {categorias.map((categoria) => (
        <CardLinha
          key={categoria.id}
          titulo={rotuloCatalogo3(categoria.nome, t)}
          detalhe={
            rotuloFrases(categoria.totalFrases, t)
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