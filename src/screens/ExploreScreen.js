// SCREEN — Explorar Chapecó

import { useCallback, useMemo, useState } from 'react';

import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

import { usePreferencias } from '../contexts/PreferenciasContext';
import { usePosicaoExplorar } from '../hooks/usePosicaoExplorar';

import { ScreenTemplate } from '../components/templates/ScreenTemplate';
import { FiltrosExplorar } from '../components/organisms/FiltrosExplorar';
import { ListaLocais } from '../components/organisms/ListaLocais';
import { MapaLocais } from '../components/organisms/MapaLocais';
import { Button } from '../components/atoms/Button';
import { Pill } from '../components/atoms/Pill';

import {
  obterLocais,
  obterCategoriasLugar,
} from '../services/locais';

import {
  adicionarDistanciasLocais,
  ordenarLocaisPorDistancia,
} from '../utils/geolocalizacao';

import {
  textosGeolocalizacao,
} from '../i18n/catalogosGeolocalizacao';

import { filtrarLocais } from '../utils/locais';
import { CATEGORIA_TODOS } from '../constants/locais';

import { espacamentos, tipografia } from '../theme';
import { useTema } from '../theme/useTema';

export function ExploreScreen({ navigation }) {
  const { t, idioma } = usePreferencias();
  const { cores } = useTema();

  const textos = textosGeolocalizacao(idioma);

  const estilos = useMemo(
    () => criarEstilos(cores),
    [cores]
  );

  const {
    posicao,
    obtendoPosicao,
  } = usePosicaoExplorar();

  const [locais, setLocais] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  const [busca, setBusca] = useState('');
  const [categoria, setCategoria] = useState(CATEGORIA_TODOS);
  const [visao, setVisao] = useState('lista');

  const [ordenarProximidade, setOrdenarProximidade] =
    useState(false);

  // CARREGAR LOCAIS E CATEGORIAS

  const carregar = useCallback(async () => {
    setCarregando(true);
    setErro('');

    try {
      const [dadosLocais, dadosCategorias] =
        await Promise.all([
          obterLocais(),
          obterCategoriasLugar(),
        ]);

      setLocais(dadosLocais);
      setCategorias(dadosCategorias);

      setCategoria(atual => {
        if (
          atual === CATEGORIA_TODOS ||
          dadosCategorias.some(item => item.id === atual)
        ) {
          return atual;
        }

        return CATEGORIA_TODOS;
      });

    } catch (e) {
      setErro(
        t('mensagens.servidor', {
          mensagem: e.message,
          opcional: true,
        }) || t('grupo2.g015')
      );
    } finally {
      setCarregando(false);
    }
  }, [t]);

  useFocusEffect(useCallback(() => {
    carregar();
  }, [carregar]));

  // CALCULAR DISTÂNCIAS

  const locaisComDistancia = useMemo(
    () => adicionarDistanciasLocais(locais, posicao),
    [locais, posicao]
  );

  // FILTRAR E ORDENAR LOCAIS

  const locaisFiltrados = useMemo(() => {
    const resultado = filtrarLocais(
      locaisComDistancia,
      busca,
      categoria
    );

    if (ordenarProximidade && posicao) {
      return ordenarLocaisPorDistancia(resultado);
    }

    return resultado;

  }, [
    locaisComDistancia,
    busca,
    categoria,
    ordenarProximidade,
    posicao,
  ]);

  // ABRIR DETALHE

  function abrirLocal(local) {
    navigation.navigate('DetalheLocal', {
      localId: local.id,
    });
  }

  // RENDER

  return (
    <ScreenTemplate titulo={t('grupo2.g016')}>

      <View style={estilos.filtros}>
        <FiltrosExplorar
          busca={busca}
          aoMudarBusca={setBusca}
          visao={visao}
          aoMudarVisao={setVisao}
          categoria={categoria}
          aoMudarCategoria={setCategoria}
          categorias={categorias}
        />

        <View style={estilos.localizacao}>

          <Ionicons
            name={posicao
              ? 'location'
              : 'location-outline'}
            size={18}
            color={cores.textoSecundario}
          />

          <Text style={estilos.textoLocalizacao}>
            {obtendoPosicao
              ? textos.obtendo
              : posicao
                ? textos.disponivel
                : textos.indisponivel}
          </Text>

        </View>

        {!!posicao && visao === 'lista' && (
          <View style={estilos.ordenacao}>

            <Pill
              titulo={textos.ordemPadrao}
              selecionado={!ordenarProximidade}
              aoPressionar={() =>
                setOrdenarProximidade(false)
              }
            />

            <Pill
              titulo={textos.proximidade}
              selecionado={ordenarProximidade}
              aoPressionar={() =>
                setOrdenarProximidade(true)
              }
            />

          </View>
        )}

      </View>

      {carregando && (
        <ActivityIndicator
          color={cores.primaria}
          style={estilos.centro}
        />
      )}

      {!carregando && !!erro && (
        <View style={estilos.centro}>
          <Text style={estilos.erro}>{erro}</Text>

          <Button
            titulo={t('grupo2.g006')}
            variante="secundario"
            aoPressionar={carregar}
          />
        </View>
      )}

      {!carregando && !erro && visao === 'lista' && (
        <ListaLocais
          locais={locaisFiltrados}
          aoAbrirLocal={abrirLocal}
        />
      )}

      {!carregando && !erro && visao === 'mapa' && (
        <MapaLocais
          locais={locaisFiltrados}
          posicaoUsuario={posicao}
          aoAbrirLocal={abrirLocal}
          altura={350}
        />
      )}

    </ScreenTemplate>
  );
}

function criarEstilos(cores) {
  return StyleSheet.create({
    filtros: {
      marginBottom: espacamentos.lg,
    },

    localizacao: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: espacamentos.xs,
      marginTop: espacamentos.md,
    },

    textoLocalizacao: {
      fontSize: tipografia.legenda,
      color: cores.textoSecundario,
      flex: 1,
    },

    ordenacao: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: espacamentos.sm,
      marginTop: espacamentos.sm,
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
  });
}