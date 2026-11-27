import { usePreferencias } from '../contexts/PreferenciasContext';

// SCREEN — Detalhes do conselho

import { useCallback, useRef, useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { ScreenTemplate } from '../components/templates/ScreenTemplate';
import { DetalheConselho } from '../components/organisms/DetalheConselho';
import { ComentariosConselho } from '../components/organisms/ComentariosConselho';
import { Button } from '../components/atoms/Button';
import {
  obterConselhoPorId, adicionarCurtidaConselho, removerCurtidaConselho,
  obterComentariosConselho, criarComentarioConselho,
  atualizarComentarioConselho, excluirComentarioConselho,
} from '../services/conselhos';
import { espacamentos, tipografia } from '../theme';
import { useTema } from '../theme/useTema';

export function ConselhoDetalheScreen({ navigation, route }) {
  const { t } = usePreferencias();
  const { cores } = useTema();
  const id = route.params?.conselhoId ?? route.params?.conselho?.id;

  const [conselho, setConselho] = useState(null);
  const [comentarios, setComentarios] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [carregandoComentarios, setCarregandoComentarios] = useState(true);
  const [erro, setErro] = useState('');
  const [erroComentarios, setErroComentarios] = useState('');
  const [erroAcao, setErroAcao] = useState('');
  const [ocupado, setOcupado] = useState(false);

  const consultaAtual = useRef(0);
  const bloqueio = useRef(false);

  const carregarComentarios = useCallback(async () => {
    const consulta = consultaAtual.current;

    setCarregandoComentarios(true);
    setErroComentarios('');

    try {
      const resultado = await obterComentariosConselho(id);

      if (consulta !== consultaAtual.current) return;

      setComentarios(resultado);
      setConselho(atual => atual
        ? { ...atual, comentarios: resultado.length }
        : atual
      );
    } catch (erro) {
      if (consulta === consultaAtual.current) {
        setErroComentarios(t('grupo3.g033'));
      }
    } finally {
      if (consulta === consultaAtual.current) {
        setCarregandoComentarios(false);
      }
    }
  }, [t, id]);

  const carregar = useCallback(async () => {
    const consulta = ++consultaAtual.current;

    setCarregando(true);
    setCarregandoComentarios(true);
    setErro('');
    setErroAcao('');
    setConselho(null);
    setComentarios([]);

    try {
      if (!id) throw new Error(t('grupo3.g034'));

      const resultado = await obterConselhoPorId(id);

      if (consulta !== consultaAtual.current) return;

      setConselho(resultado);
      setCarregando(false);
      await carregarComentarios();
    } catch (erro) {
      if (consulta === consultaAtual.current) {
        setErro(t('mensagens.servidor', { mensagem: erro.message, opcional: true }) || t('grupo3.g035'));
      }
    } finally {
      if (consulta === consultaAtual.current) {
        setCarregando(false);
      }
    }
  }, [t, id, carregarComentarios]);

  useFocusEffect(
    useCallback(() => {
      carregar();

      return () => { consultaAtual.current += 1; };
    }, [carregar])
  );

  async function executarAcao(acao, mensagemErro) {
    if (bloqueio.current || carregando || !conselho) return false;

    bloqueio.current = true;
    setOcupado(true);
    setErroAcao('');
    const consulta = consultaAtual.current;

    try {
      await acao(consulta);
      return true;
    } catch (erro) {
      if (consulta === consultaAtual.current) {
        setErroAcao(t('mensagens.servidor', { mensagem: erro.message, opcional: true }) || mensagemErro);
      }
      return false;
    } finally {
      bloqueio.current = false;
      setOcupado(false);
    }
  }

  async function alternarCurtida() {
    await executarAcao(async consulta => {
      const resultado = conselho.curtido
        ? await removerCurtidaConselho(id)
        : await adicionarCurtidaConselho(id);

      if (consulta !== consultaAtual.current) return;

      setConselho(atual => ({
        ...atual,
        curtido: resultado.curtido,
        curtidas: resultado.curtidas,
      }));
    }, t('grupo3.g026'));
  }

  async function publicarComentario(conteudo) {
    return executarAcao(async consulta => {
      await criarComentarioConselho(id, conteudo);

      if (consulta === consultaAtual.current) {
        await carregarComentarios();
      }
    }, t('grupo3.g036'));
  }

  async function editarComentario(comentarioId, conteudo) {
    return executarAcao(async consulta => {
      await atualizarComentarioConselho(id, comentarioId, conteudo);

      if (consulta === consultaAtual.current) {
        await carregarComentarios();
      }
    }, t('grupo3.g037'));
  }

  function confirmarExclusao(comentario) {
    if (bloqueio.current || !comentario.meuComentario) return;

    Alert.alert(
      t('grupo3.g038'),
      t('grupo3.g039'),
      [
        { text: t('grupo3.g040'), style: 'cancel' },
        {
          text: t('grupo3.g041'),
          style: 'destructive',
          onPress: () => excluirComentario(comentario.id),
        },
      ]
    );
  }

  async function excluirComentario(comentarioId) {
    await executarAcao(async consulta => {
      await excluirComentarioConselho(id, comentarioId);

      if (consulta === consultaAtual.current) {
        await carregarComentarios();
      }
    }, t('grupo3.g042'));
  }

  return (
    <ScreenTemplate titulo={t('grupo3.g043')}
      aoVoltar={() => { if (!bloqueio.current) navigation.goBack(); }}>

      {carregando ? (
        <ActivityIndicator color={cores.primaria} style={estilos.carregando} />
      ) : erro || !conselho ? (
        <View style={estilos.estado}>
          <Text style={[estilos.erro, { color: cores.perigo }]}>
            {erro || t('grupo3.g034')}
          </Text>

          <Button titulo={t('grupo3.g002')} variante="contorno"
            aoPressionar={carregar} />
        </View>
      ) : (
        <>
          <DetalheConselho
            conselho={conselho}
            aoCurtir={alternarCurtida}
            ocupado={ocupado || carregandoComentarios}
            aoEditar={() => {
              if (conselho.meuConselho && !bloqueio.current) {
                navigation.navigate('EditarConselho', { conselho });
              }
            }}
          />

          <View style={[
            estilos.separador,
            { backgroundColor: cores.divisor },
          ]} />

          <ComentariosConselho
            key={id}
            comentarios={comentarios}
            carregando={carregandoComentarios}
            erro={erroComentarios}
            erroAcao={erroAcao}
            ocupado={ocupado}
            aoRecarregar={carregarComentarios}
            aoPublicar={publicarComentario}
            aoAtualizar={editarComentario}
            aoExcluir={confirmarExclusao}
          />
        </>
      )}
    </ScreenTemplate>
  );
}

const estilos = StyleSheet.create({
  carregando: { marginTop: espacamentos.xl },
  estado: { gap: espacamentos.md, marginTop: espacamentos.lg },
  erro: { fontSize: tipografia.corpo, textAlign: 'center' },
  separador: { height: 1, marginVertical: espacamentos.md },
});
