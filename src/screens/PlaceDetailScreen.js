// SCREEN — Detalhe do lugar

import {
  useCallback,
  useEffect,
  useMemo,
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

import { obterLocal } from '../services/locais';

import { espacamentos, tipografia } from '../theme';
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

  const [local, setLocal] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  // TODO: integrar a persistência dos favoritos.
  const [guardado, setGuardado] = useState(false);

  // ==========================================================
  // CARREGAR LOCAL
  // ==========================================================

  const carregar = useCallback(async () => {
    setCarregando(true);
    setErro('');

    try {
      setLocal(await obterLocal(localId));

    } catch (e) {
      setErro(
        'Não foi possível carregar este local. Tente novamente.'
      );

    } finally {
      setCarregando(false);
    }
  }, [localId]);

  useEffect(() => {
    carregar();
  }, [carregar]);

  // ==========================================================
  // ABRIR MAPA
  // ==========================================================

  function verNoMapa() {
    const consulta = [
      local.nome,
      local.endereco,
      'Chapecó, SC',
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
          aoAlternarGuardado={() =>
            setGuardado((atual) => !atual)
          }
          aoVerMapa={verNoMapa}
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