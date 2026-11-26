// SCREEN — Detalhe do lugar

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import {
  ActivityIndicator,
  Alert,
  Linking,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { ScreenTemplate } from '../components/templates/ScreenTemplate';
import { DetalheLocal } from '../components/organisms/DetalheLocal';
import { Button } from '../components/atoms/Button';

import {
  obterLocal,
  verificarFavoritoLocal,
  adicionarFavoritoLocal,
  removerFavoritoLocal,
} from '../services/locais';

import {
  espacamentos,
  tipografia,
} from '../theme';

import { useTema } from '../theme/useTema';

export function PlaceDetailScreen({
  navigation,
  route,
}) {
  const { cores } = useTema();

  const estilos = useMemo(
    () => criarEstilos(cores),
    [cores]
  );

  const { localId } = route.params;

  const [local, setLocal] =
    useState(null);

  const [carregando, setCarregando] =
    useState(true);

  const [erro, setErro] =
    useState('');

  const [guardado, setGuardado] =
    useState(false);

  const [salvando, setSalvando] =
    useState(false);

  const bloqueio = useRef(false);

  // ==========================================================
  // CARREGAR LOCAL E ESTADO DO FAVORITO
  // ==========================================================

  const carregar = useCallback(async () => {
    setCarregando(true);
    setErro('');

    try {
      const [
        dadosLocal,
        favorito,
      ] = await Promise.all([
        obterLocal(localId),
        verificarFavoritoLocal(localId),
      ]);

      setLocal(dadosLocal);

      setGuardado(favorito);

    } catch (e) {
      setErro(
        e.message ||
        'Não foi possível carregar este local.'
      );

    } finally {
      setCarregando(false);
    }
  }, [localId]);

  useEffect(() => {
    carregar();
  }, [carregar]);

  // ==========================================================
  // ADICIONAR OU REMOVER FAVORITO
  // ==========================================================

  async function alternarGuardado() {
    if (bloqueio.current) {
      return;
    }

    bloqueio.current = true;

    setSalvando(true);

    try {
      const resultado = guardado
        ? await removerFavoritoLocal(localId)
        : await adicionarFavoritoLocal(localId);

      setGuardado(resultado);

    } catch (e) {
      Alert.alert(
        'Favoritos',
        e.message ||
        'Não foi possível atualizar o favorito.'
      );

    } finally {
      bloqueio.current = false;

      setSalvando(false);
    }
  }

  // ==========================================================
  // ABRIR MAPA
  // ==========================================================

  function verNoMapa() {
    if (!local) {
      return;
    }

    const temCoordenadas =
      Number.isFinite(local.latitude) &&
      Number.isFinite(local.longitude);

    const consulta = temCoordenadas
      ? `${local.latitude},${local.longitude}`
      : [
          local.nome,
          local.endereco,
          local.cidade,
          local.estado,
        ].filter(Boolean).join(', ');

    const url =
      `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(consulta)}`;

    Linking.openURL(url).catch(() =>
      Alert.alert(
        'Mapa',
        'Não foi possível abrir o mapa.'
      )
    );
  }

  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <ScreenTemplate
      titulo="Detalhe do lugar"
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

      {!carregando && !erro && local && (
        <DetalheLocal
          local={local}
          guardado={guardado}
          salvando={salvando}
          aoAlternarGuardado={alternarGuardado}
          aoVerMapa={verNoMapa}
        />
      )}

    </ScreenTemplate>
  );
}

// ============================================================
// ESTILOS
// ============================================================

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