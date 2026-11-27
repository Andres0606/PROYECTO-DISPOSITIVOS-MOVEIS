
// SCREEN — Detalhe de uma frase

import { useCallback, useRef, useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, View } from 'react-native';
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
  const fraseId = route.params?.fraseId ?? route.params?.frase?.id;

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

  const carregar = useCallback(async () => {
    const consulta = ++consultaAtual.current;

    setCarregando(true);
    setErro('');

    try {
      if (!fraseId) throw new Error('Frase não encontrada.');

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

  useFocusEffect(
    useCallback(() => {
      audioAtivo.current = false;
      setFalando(false);
      carregar();

      return () => {
        consultaAtual.current += 1;
        audioAtual.current += 1;
        audioAtivo.current = false;
        Speech.stop().catch(() => {});
      };
    }, [carregar, revisao])
  );

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
        Alert.alert('Favoritos', 'Não foi possível atualizar o favorito.');
      }

      setRevisao(atual => atual + 1);
    } finally {
      bloqueio.current = false;
      setOcupado(false);
    }
  }

  async function pronunciar() {
    if (!frase?.portugues) return;

    const audio = ++audioAtual.current;
    const estavaFalando = audioAtivo.current;

    audioAtivo.current = !estavaFalando;
    setFalando(!estavaFalando);

    function finalizar() {
      if (audio === audioAtual.current) {
        audioAtivo.current = false;
        setFalando(false);
      }
    }

    function falhar() {
      if (audio !== audioAtual.current) return;

      finalizar();

      if (navigation.isFocused()) {
        Alert.alert('Pronúncia', 'Não foi possível reproduzir a frase.');
      }
    }

    try {
      await Speech.stop();

      if (audio !== audioAtual.current || estavaFalando) return;

      Speech.speak(frase.portugues, {
        language: 'pt-BR',
        rate: 0.85,
        pitch: 1,
        onDone: finalizar,
        onStopped: finalizar,
        onError: falhar,
      });
    } catch {
      falhar();
    }
  }

  return (
    <ScreenTemplate titulo="Frase"
      aoVoltar={() => navigation.goBack()}>

      {carregando ? (
        <ActivityIndicator color={cores.primaria} style={estilos.estado} />
      ) : erro || !frase ? (
        <View style={estilos.estado}>
          <Text style={[estilos.erro, { color: cores.perigo }]}>
            {erro || 'Frase não encontrada.'}
          </Text>

          <Button titulo="Tentar novamente" variante="secundario"
            aoPressionar={carregar} />
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
  estado: { marginTop: espacamentos.xl, gap: espacamentos.md },
  erro: { fontSize: tipografia.corpo, textAlign: 'center' },
});
