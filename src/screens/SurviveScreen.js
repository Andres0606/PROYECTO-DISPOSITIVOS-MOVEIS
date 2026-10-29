// SCREEN — Sobrevive em Português (categorias de frases)
import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { ScreenTemplate } from '../components/templates/ScreenTemplate';
import { ListaCategoriasFrases } from '../components/organisms/ListaCategoriasFrases';
import { Button } from '../components/atoms/Button';

import { obterCategoriasFrases } from '../services/frases';

import {
  cores,
  espacamentos,
  tipografia,
} from '../theme';

export function SurviveScreen({ navigation }) {
  const [categorias, setCategorias] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  const carregar = useCallback(async () => {
    setCarregando(true);
    setErro('');

    try {
      setCategorias(
        await obterCategoriasFrases()
      );
    } catch (e) {
      setErro(
        'Não foi possível carregar as categorias. Tente novamente.'
      );
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    carregar();
  }, [carregar]);

  function abrirCategoria(categoria) {
    navigation.navigate('ListaFrases', {
      categoria,
    });
  }

  return (
    <ScreenTemplate
      titulo="Sobrevive em Português"
      aoVoltar={() => navigation.goBack()}
    >
      {carregando && (
        <ActivityIndicator
          color={cores.primaria}
          style={estilos.centro}
        />
      )}

      {!carregando && !!erro && (
        <View style={estilos.centro}>
          <Text style={estilos.erro}>
            {erro}
          </Text>

          <Button
            titulo="Tentar novamente"
            variante="secundario"
            aoPressionar={carregar}
          />
        </View>
      )}

      {!carregando && !erro && (
        <ListaCategoriasFrases
          categorias={categorias}
          aoAbrirCategoria={abrirCategoria}
        />
      )}
    </ScreenTemplate>
  );
}

const estilos = StyleSheet.create({
  centro: {
    marginTop: espacamentos.xl,
    gap: espacamentos.md,
  },

  erro: {
    fontSize: tipografia.corpo,
    textAlign: 'center',
    color: cores.perigo,
  },
});