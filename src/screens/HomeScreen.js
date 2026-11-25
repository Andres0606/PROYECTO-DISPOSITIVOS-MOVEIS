// SCREEN — Início (resumo do intercâmbio)

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
import { ResumoInicio } from '../components/organisms/ResumoInicio';
import { Button } from '../components/atoms/Button';

import { obterResumoInicio } from '../services/inicio';

import { useTema } from '../theme/useTema';

import {
  espacamentos,
  tipografia,
} from '../theme';

export function HomeScreen({
  navigation,
  route,
}) {
  const { cores } = useTema();

  const estilos = useMemo(
    () => criarEstilos(cores),
    [cores]
  );

  const usuario =
    route.params?.usuario;

  const primeiroNome =
    usuario?.nome?.split(' ')[0] ??
    'estudante';

  const [resumo, setResumo] =
    useState(null);

  const [carregando, setCarregando] =
    useState(true);

  const [erro, setErro] =
    useState('');

  // ==========================================================
  // CARREGAR RESUMO
  // ==========================================================

  const carregar = useCallback(
    async () => {
      setCarregando(true);
      setErro('');

      try {
        const resultado =
          await obterResumoInicio();

        setResumo(resultado);

      } catch (e) {
        setErro(
          'Não foi possível carregar seu resumo. Tente novamente.'
        );

      } finally {
        setCarregando(false);
      }
    },
    []
  );

  useEffect(() => {
    carregar();
  }, [carregar]);

  // ==========================================================
  // ABRIR ATALHOS
  // ==========================================================

  function abrirAtalho(chave) {
    if (chave === 'portugues') {
      navigation.navigate('Sobrevive');
      return;
    }

    if (chave === 'conselhos') {
      navigation.navigate('Conselhos');
      return;
    }

    if (chave === 'atividades') {
      navigation.navigate('Atividades');
      return;
    }
  }

  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <ScreenTemplate
      titulo={`Olá, ${primeiroNome}`}
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

      {!carregando && !erro && resumo && (
        <ResumoInicio
          resumo={resumo}
          aoAbrirAtalho={abrirAtalho}
        />
      )}

    </ScreenTemplate>
  );
}

// ============================================================
// ESTILOS DINÂMICOS
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