// SCREEN — Detalhes da atividade

import { useCallback, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { ScreenTemplate } from '../components/templates/ScreenTemplate';
import { DetalheAtividade } from '../components/organisms/DetalheAtividade';
import { Button } from '../components/atoms/Button';
import {
  obterAtividadePorId, adicionarInteresseAtividade, removerInteresseAtividade,
  adicionarFavoritoAtividade, removerFavoritoAtividade,
} from '../services/atividades';
import { espacamentos, tipografia } from '../theme';
import { useTema } from '../theme/useTema';

export function AtividadeDetalheScreen({ navigation, route }) {
  const { cores } = useTema();
  const estilos = useMemo(() => criarEstilos(cores), [cores]);
  const atividadeId = route.params?.atividadeId ?? route.params?.atividade?.id;
  const ordenacao = route.params?.ordenacao ?? 'recentes';
  const [atividade, setAtividade] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');
  const [salvandoInteresse, setSalvandoInteresse] = useState(false);
  const [salvandoFavorito, setSalvandoFavorito] = useState(false);
  const bloqueio = useRef(false);
  const consultaAtual = useRef(0);

  const carregar = useCallback(async () => {
    const consulta = ++consultaAtual.current;
    setCarregando(true);
    setErro('');
    try {
      if (!atividadeId) throw new Error('Atividade não encontrada.');
      const resultado = await obterAtividadePorId(atividadeId);
      if (consulta === consultaAtual.current) setAtividade(resultado);
    } catch (erro) {
      if (consulta !== consultaAtual.current) return;
      setAtividade(null);
      setErro('Não foi possível carregar a atividade.');
    } finally {
      if (consulta === consultaAtual.current) setCarregando(false);
    }
  }, [atividadeId]);

  useFocusEffect(useCallback(() => {
    carregar();
    return () => { consultaAtual.current += 1; };
  }, [carregar]));

  async function alternarInteresse() {
    if (bloqueio.current || carregando || !atividade ||
        (atividade.vencida && !atividade.interessado)) return;
    bloqueio.current = true;
    setSalvandoInteresse(true);
    const consulta = consultaAtual.current;
    try {
      const resultado = atividade.interessado
        ? await removerInteresseAtividade(atividadeId)
        : await adicionarInteresseAtividade(atividadeId);
      if (consulta !== consultaAtual.current) return;
      setAtividade(atual => atual?.id === atividadeId ? {
        ...atual, interessado: resultado.interessado, interessados: resultado.interessados,
      } : atual);
    } catch (erro) {
      if (consulta === consultaAtual.current) {
        Alert.alert('Interesse', erro.message || 'Não foi possível atualizar o interesse. Tente novamente.');
        await carregar();
      }
    } finally {
      bloqueio.current = false;
      setSalvandoInteresse(false);
    }
  }

  async function alternarGuardado() {
    if (bloqueio.current || carregando || !atividade) return;
    bloqueio.current = true;
    setSalvandoFavorito(true);
    const consulta = consultaAtual.current;
    try {
      const guardado = atividade.guardado
        ? await removerFavoritoAtividade(atividadeId)
        : await adicionarFavoritoAtividade(atividadeId);
      if (consulta !== consultaAtual.current) return;
      setAtividade(atual => atual?.id === atividadeId ? { ...atual, guardado } : atual);
    } catch (erro) {
      if (consulta === consultaAtual.current) {
        Alert.alert('Favoritos', 'Não foi possível atualizar o favorito. Tente novamente.');
      }
    } finally {
      bloqueio.current = false;
      setSalvandoFavorito(false);
    }
  }

  function editarAtividade() {
    if (!atividade?.minhaAtividade || bloqueio.current) return;
    navigation.navigate('EditarAtividade', { atividade });
  }

  return (
    <ScreenTemplate titulo="Detalhes" aoVoltar={() => navigation.goBack()}>
      {carregando ? (
        <ActivityIndicator color={cores.primaria} style={estilos.centro} />
      ) : erro ? (
        <View style={estilos.centro}>
          <Text style={estilos.erro}>{erro}</Text>
          <Button titulo="Tentar novamente" variante="secundario" aoPressionar={carregar} />
        </View>
      ) : atividade ? (
        <DetalheAtividade atividade={atividade} ordenacao={ordenacao}
          salvandoInteresse={salvandoInteresse} salvandoFavorito={salvandoFavorito}
          aoAlternarInteresse={alternarInteresse} aoAlternarGuardado={alternarGuardado}
          aoEditar={editarAtividade} />
      ) : null}
    </ScreenTemplate>
  );
}

function criarEstilos(cores) {
  return StyleSheet.create({
    centro: { marginTop: espacamentos.xl, gap: espacamentos.md },
    erro: { fontSize: tipografia.corpo, textAlign: 'center', color: cores.perigo },
  });
}
