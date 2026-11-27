
// SCREEN — Detalhe de uma frase

import { useCallback, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { useFocusEffect } from '@react-navigation/native';
import * as Speech from 'expo-speech';

import { ScreenTemplate } from '../components/templates/ScreenTemplate';
import { DetalheFrase } from '../components/organisms/DetalheFrase';
import { Button } from '../components/atoms/Button';

import {
  obterFrasePorId,
  verificarFavoritoFrase,
  adicionarFavoritoFrase,
  removerFavoritoFrase,
} from '../services/frases';

import { espacamentos, tipografia } from '../theme';
import { useTema } from '../theme/useTema';

export function FraseDetalheScreen({ navigation, route }) {
  const { cores } = useTema();

  const fraseId =
    route.params?.fraseId ?? route.params?.frase?.id;

  const [frase, setFrase] = useState(null);
  const [favorita, setFavorita] = useState(false);
  const [carregando, setCarregando] = useState(true);
  const [ocupado, setOcupado] = useState(false);
  const [falando, setFalando] = useState(false);
  const [erro, setErro] = useState('');
  const [revisao, setRevisao] = useState(0);

  const consultaAtual = useRef(0);
  const bloqueio = useRef(false);

  const audioAtual = useRef(0);
  const audioAtivo = useRef(false);
  const audioOcupado = useRef(false);

  // Carregar frase e favorito

  const carregar = useCallback(async () => {
    const consulta = ++consultaAtual.current;

    setCarregando(true);
    setErro('');

    try {
      if (!fraseId) {
        throw new Error('Frase não encontrada.');
      }

      const [resultado, favorito] = await Promise.all([
        obterFrasePorId(fraseId),
        verificarFavoritoFrase(fraseId),
      ]);

      if (consulta !== consultaAtual.current) return;

      setFrase(resultado);
      setFavorita(favorito.guardado);

    } catch {
      if (consulta === consultaAtual.current) {
        setErro('Não foi possível carregar esta frase.');
      }
    } finally {
      if (consulta === consultaAtual.current) {
        setCarregando(false);
      }
    }
  }, [fraseId]);

  // Atualizar ao retornar à tela

  useFocusEffect(
    useCallback(() => {
      carregar();

      return () => {
        consultaAtual.current += 1;
      };
    }, [carregar, revisao])
  );

  // Encerrar áudio ao sair da tela

  useFocusEffect(
    useCallback(() => {
      setFalando(false);

      return () => {
        audioAtual.current += 1;
        audioAtivo.current = false;
        audioOcupado.current = false;

        Speech.stop().catch(() => {});
      };
    }, [fraseId])
  );

  // Adicionar ou remover favorito

  async function alternarFavorita() {
    if (bloqueio.current || carregando) return;

    bloqueio.current = true;
    setOcupado(true);

    const consulta = consultaAtual.current;

    try {
      const resultado = favorita
        ? await removerFavoritoFrase(fraseId)
        : await adicionarFavoritoFrase(fraseId);

      if (consulta === consultaAtual.current) {
        setFavorita(resultado.guardado);
      } else {
        setRevisao(atual => atual + 1);
      }

    } catch {
      if (navigation.isFocused()) {
        Alert.alert(
          'Favoritos',
          'Não foi possível atualizar o favorito.'
        );
      }

      setRevisao(atual => atual + 1);

    } finally {
      bloqueio.current = false;
      setOcupado(false);
    }
  }

  // Reprodução da pronúncia

  async function pronunciar() {
    if (
      carregando ||
      audioOcupado.current ||
      !frase?.portugues ||
      !navigation.isFocused()
    ) {
      return;
    }

    audioOcupado.current = true;

    const reproducao = ++audioAtual.current;

    function finalizarAudio() {
      if (reproducao !== audioAtual.current) return;

      audioAtivo.current = false;

      if (navigation.isFocused()) {
        setFalando(false);
      }
    }

    function erroAudio() {
      if (reproducao !== audioAtual.current) return;

      finalizarAudio();

      if (navigation.isFocused()) {
        Alert.alert(
          'Pronúncia',
          'Não foi possível reproduzir o áudio. Verifique a configuração de voz do dispositivo.'
        );
      }
    }

    try {
      if (audioAtivo.current) {
        await Speech.stop();
        finalizarAudio();
        return;
      }

      await Speech.stop();

      if (
        reproducao !== audioAtual.current ||
        !navigation.isFocused()
      ) {
        return;
      }

      audioAtivo.current = true;
      setFalando(true);

      Speech.speak(frase.portugues, {
        language: 'pt-BR',
        rate: 0.85,
        pitch: 1.0,

        onDone: finalizarAudio,
        onStopped: finalizarAudio,
        onError: erroAudio,
      });

    } catch {
      erroAudio();

    } finally {
      if (reproducao === audioAtual.current) {
        audioOcupado.current = false;
      }
    }
  }

  // Renderização

  return (
    <ScreenTemplate
      titulo="Frase"
      aoVoltar={() => navigation.goBack()}
    >

      {carregando ? (
        <ActivityIndicator
          color={cores.primaria}
          style={estilos.estado}
        />
      ) : erro || !frase ? (
        <View style={estilos.estado}>
          <Text style={[
            estilos.erro,
            { color: cores.perigo },
          ]}>
            {erro || 'Frase não encontrada.'}
          </Text>

          <Button
            titulo="Tentar novamente"
            variante="secundario"
            aoPressionar={carregar}
          />
        </View>
      ) : (
        <DetalheFrase
          frase={frase}
          favorita={favorita}
          ocupado={ocupado}
          falando={falando}
          aoAlternarFavorita={alternarFavorita}
          aoPronunciar={pronunciar}
        />
      )}

    </ScreenTemplate>
  );
}

const estilos = StyleSheet.create({
  estado: {
    marginTop: espacamentos.xl,
    gap: espacamentos.md,
  },

  erro: {
    fontSize: tipografia.corpo,
    textAlign: 'center',
  },
});
