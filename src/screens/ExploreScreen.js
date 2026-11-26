// SCREEN — Explorar Chapecó

import {
  useCallback,
  useMemo,
  useState,
} from 'react';

import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { useFocusEffect } from '@react-navigation/native';

import { ScreenTemplate } from '../components/templates/ScreenTemplate';
import { FiltrosExplorar } from '../components/organisms/FiltrosExplorar';
import { ListaLocais } from '../components/organisms/ListaLocais';
import { Button } from '../components/atoms/Button';

import {
  obterLocais,
  obterCategoriasLugar,
} from '../services/locais';

import { filtrarLocais } from '../utils/locais';
import { CATEGORIA_TODOS } from '../constants/locais';

import {
  espacamentos,
  tipografia,
} from '../theme';

import { useTema } from '../theme/useTema';

export function ExploreScreen({ navigation }) {
  const { cores } = useTema();

  const estilos = useMemo(
    () => criarEstilos(cores),
    [cores]
  );

  const [locais, setLocais] = useState([]);
  const [categorias, setCategorias] = useState([]);

  const [carregando, setCarregando] =
    useState(true);

  const [erro, setErro] = useState('');

  const [busca, setBusca] = useState('');

  const [categoria, setCategoria] =
    useState(CATEGORIA_TODOS);

  const [visao, setVisao] =
    useState('lista');

  // ==========================================================
  // CARREGAR LOCAIS E CATEGORIAS
  // ==========================================================

  const carregar = useCallback(async () => {
    setCarregando(true);
    setErro('');

    try {
      const [
        dadosLocais,
        dadosCategorias,
      ] = await Promise.all([
        obterLocais(),
        obterCategoriasLugar(),
      ]);

      setLocais(dadosLocais);

      setCategorias(dadosCategorias);

      // Verificar se a categoria selecionada ainda existe.

      setCategoria((atual) => {
        if (
          atual === CATEGORIA_TODOS ||
          dadosCategorias.some(
            (item) => item.id === atual
          )
        ) {
          return atual;
        }

        return CATEGORIA_TODOS;
      });

    } catch (e) {
      setErro(
        e.message ||
        'Não foi possível carregar os locais.'
      );

    } finally {
      setCarregando(false);
    }
  }, []);

  // Atualizar dados ao retornar à tela.

  useFocusEffect(
    useCallback(() => {
      carregar();
    }, [carregar])
  );

  // ==========================================================
  // FILTRAR LOCAIS
  // ==========================================================

  const locaisFiltrados = useMemo(
    () =>
      filtrarLocais(
        locais,
        busca,
        categoria
      ),

    [locais, busca, categoria]
  );

  // ==========================================================
  // NAVEGAÇÃO
  // ==========================================================

  function abrirFiltros() {
    // Implementação futura dos filtros avançados.
  }

  function abrirLocal(local) {
    navigation.navigate('DetalheLocal', {
      localId: local.id,
    });
  }

  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <ScreenTemplate titulo="Explorar Chapecó">

      <View style={estilos.filtros}>

        <FiltrosExplorar
          busca={busca}
          aoMudarBusca={setBusca}
          aoFiltrar={abrirFiltros}
          visao={visao}
          aoMudarVisao={setVisao}
          categoria={categoria}
          aoMudarCategoria={setCategoria}
          categorias={categorias}
        />

      </View>

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

      {!carregando &&
        !erro &&
        visao === 'lista' && (

          <ListaLocais
            locais={locaisFiltrados}
            aoAbrirLocal={abrirLocal}
          />
      )}

      {!carregando &&
        !erro &&
        visao === 'mapa' && (

          <Text style={estilos.aviso}>
            O mapa estará disponível em breve.
          </Text>
      )}

    </ScreenTemplate>
  );
}

// ============================================================
// ESTILOS
// ============================================================

function criarEstilos(cores) {
  return StyleSheet.create({
    filtros: {
      marginBottom: espacamentos.lg,
    },

    centro: {
      marginTop: espacamentos.xl,
      gap: espacamentos.md,
    },

    erro: {
      fontSize: tipografia.corpo,
      textAlign: 'center',
      color: cores.perigo,
    },

    aviso: {
      marginTop: espacamentos.lg,
      textAlign: 'center',
      fontSize: tipografia.corpo,
      color: cores.textoSecundario,
    },
  });
}