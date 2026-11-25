// SCREEN — Sobrevive em Português

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

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

import { espacamentos, tipografia } from '../theme';
import { useTema } from '../theme/useTema';

export function SurviveScreen({ navigation }) {
  const { cores } = useTema();

  const estilos = useMemo(
    () => criarEstilos(cores),
    [cores]
  );

  const [categorias, setCategorias] =
    useState([]);

  const [carregando, setCarregando] =
    useState(true);

  const [erro, setErro] =
    useState('');

  // ==========================================================
  // CARREGAR CATEGORIAS
  // ==========================================================

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

  // ==========================================================
  // ABRIR CATEGORIA
  // ==========================================================

  function abrirCategoria(categoria) {
    navigation.navigate('ListaFrases', {
      categoria,
    });
  }

  // ==========================================================
  // RENDER
  // ==========================================================

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

function criarEstilos(cores) {
  return StyleSheet.create({
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
}