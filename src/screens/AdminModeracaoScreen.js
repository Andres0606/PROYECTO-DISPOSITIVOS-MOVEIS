
// SCREEN — Moderação administrativa

import { useCallback, useEffect, useRef, useState } from 'react';
import { Alert, StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

import { ScreenTemplate } from '../components/templates/ScreenTemplate';
import { CardAdmin } from '../components/molecules/CardAdmin';
import { ListaAdmin } from '../components/organisms/ListaAdmin';
import { BotaoSegmentado } from '../components/molecules/BotaoSegmentado';
import { Button } from '../components/atoms/Button';

import {
  obterGestaoModeracaoAdmin,
  alterarEstadoModeracaoAdmin,
  obterComentariosAdmin,
  excluirComentarioAdmin,
} from '../services/admin';

import { useTema } from '../theme/useTema';
import { espacamentos, tipografia } from '../theme';

const TIPOS = [
  { titulo: 'Conselhos', valor: 'conselhos' },
  { titulo: 'Atividades', valor: 'atividades' },
];

export function AdminModeracaoScreen({ route, navigation }) {
  const { cores } = useTema();

  const [conselhos, setConselhos] = useState([]);
  const [atividades, setAtividades] = useState([]);
  const [tipo, setTipo] = useState('conselhos');
  const [selecionado, setSelecionado] = useState(null);

  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');
  const [ocupado, setOcupado] = useState(false);

  const [comentarios, setComentarios] = useState([]);
  const [carregandoComentarios, setCarregandoComentarios] = useState(false);
  const [erroComentarios, setErroComentarios] = useState('');
  const [revisaoComentarios, setRevisaoComentarios] = useState(0);

  const consultaAtual = useRef(0);
  const bloqueio = useRef(false);

  // Carregar conteúdos

  const carregar = useCallback(async () => {
    const consulta = ++consultaAtual.current;

    setCarregando(true);
    setErro('');

    try {
      const resultado = await obterGestaoModeracaoAdmin();

      if (consulta === consultaAtual.current) {
        setConselhos(resultado.conselhos);
        setAtividades(resultado.atividades);
      }
    } catch (erro) {
      if (consulta === consultaAtual.current) {
        setErro(erro.message || 'Não foi possível carregar os conteúdos.');
      }
    } finally {
      if (consulta === consultaAtual.current) {
        setCarregando(false);
      }
    }
  }, []);

  useFocusEffect(useCallback(() => {
    carregar();

    return () => {
      consultaAtual.current += 1;
    };
  }, [carregar]));

  // Atalhos do painel

  useEffect(() => {
    const destino = route.params?.tipo;

    if (!bloqueio.current &&
        TIPOS.some(item => item.valor === destino)) {
      setTipo(destino);
      setSelecionado(null);
    }
  }, [route.params?.tipo, route.params?.atalho]);

  const itens = tipo === 'conselhos' ? conselhos : atividades;
  const detalhes = itens.find(item => item.id === selecionado);
  const indisponivel = ocupado || carregando || !!erro;

  // Carregar comentários

  useFocusEffect(useCallback(() => {
    let ativo = true;

    setComentarios([]);
    setErroComentarios('');
    setCarregandoComentarios(false);

    if (tipo === 'conselhos' && selecionado) {
      setCarregandoComentarios(true);

      obterComentariosAdmin(selecionado)
        .then(resultado => {
          if (ativo) setComentarios(resultado);
        })
        .catch(erro => {
          if (ativo) {
            setErroComentarios(
              erro.message || 'Não foi possível carregar os comentários.'
            );
          }
        })
        .finally(() => {
          if (ativo) setCarregandoComentarios(false);
        });
    }

    return () => { ativo = false; };
  }, [tipo, selecionado, revisaoComentarios]));

  // Confirmar operações

  function confirmar(titulo, mensagem, acao) {
    if (indisponivel || bloqueio.current) return;

    Alert.alert(titulo, mensagem, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Confirmar',
        style: 'destructive',
        onPress: async () => {
          if (bloqueio.current) return;

          bloqueio.current = true;
          setOcupado(true);
          consultaAtual.current += 1;

          try {
            await acao();
            await carregar();
          } catch (erro) {
            if (navigation.isFocused()) {
              Alert.alert('Erro', erro.message || 'Não foi possível concluir a operação.');
            }

            await carregar();
          } finally {
            bloqueio.current = false;
            setOcupado(false);
          }
        },
      },
    ]);
  }

  // Ativar ou desativar conteúdos

  function alterarEstado(item) {
    const tipoAtual = tipo;
    const ativo = !item.ativo;

    confirmar(
      ativo ? 'Reativar conteúdo' : 'Desativar conteúdo',
      'Deseja alterar a visibilidade deste conteúdo para os estudantes?',
      async () => {
        const atualizado = await alterarEstadoModeracaoAdmin(
          tipoAtual, item.id, ativo
        );

        const atualizarLista = tipoAtual === 'conselhos'
          ? setConselhos : setAtividades;

        atualizarLista(atuais => atuais.map(registro =>
          registro.id === item.id ? atualizado : registro
        ));

        if (navigation.isFocused()) {
          Alert.alert(
            'Sucesso',
            ativo
              ? 'Conteúdo reativado com sucesso.'
              : 'Conteúdo desativado com sucesso.'
          );
        }
      }
    );
  }

  // Excluir comentário

  function excluirComentario(comentario) {
    if (carregandoComentarios || !selecionado) return;

    const conselhoId = selecionado;

    confirmar(
      'Excluir comentário',
      'Esta ação é permanente. Deseja continuar?',
      async () => {
        const resultado = await excluirComentarioAdmin(
          conselhoId, comentario.id
        );

        setComentarios(atuais =>
          atuais.filter(item => item.id !== comentario.id)
        );

        setConselhos(atuais => atuais.map(item =>
          item.id === conselhoId
            ? { ...item, comentarios: resultado.comentarios }
            : item
        ));

        setRevisaoComentarios(atual => atual + 1);

        if (navigation.isFocused()) {
          Alert.alert('Sucesso', 'Comentário excluído com sucesso.');
        }
      }
    );
  }

  // Ações dos conteúdos

  function acoes(item, mostrarDetalhes = true) {
    return [
      ...(mostrarDetalhes ? [{
        titulo: 'Detalhes',
        aoPressionar: () => setSelecionado(item.id),
        desabilitado: indisponivel,
      }] : []),
      {
        titulo: item.ativo ? 'Desativar' : 'Reativar',
        aoPressionar: () => alterarEstado(item),
        desabilitado: indisponivel,
      },
    ];
  }

  function subtitulo(item) {
    return [
      item.autor?.nomeCompleto || item.criador?.nomeCompleto,
      item.categoria?.nome,
    ].filter(Boolean).join(' · ');
  }

  // Detalhes do conteúdo

  if (detalhes) {
    return (
      <ScreenTemplate
        titulo={tipo === 'conselhos'
          ? 'Detalhes do conselho'
          : 'Detalhes da atividade'}
        aoVoltar={() => {
          if (!bloqueio.current) setSelecionado(null);
        }}>

        <View style={estilos.container}>

          {carregando && (
            <ActivityIndicator color={cores.primaria} />
          )}

          {!!erro && (
            <>
              <Text style={{ color: cores.perigo }}>{erro}</Text>

              <Button titulo="Tentar novamente"
                variante="contorno"
                aoPressionar={carregar}
                desabilitado={ocupado} />
            </>
          )}

          <CardAdmin
            titulo={detalhes.titulo || detalhes.nome}
            subtitulo={subtitulo(detalhes)}
            descricao={detalhes.conteudo || detalhes.descricao}
            imagemUrl={detalhes.imagemUrl}
            ativo={detalhes.ativo}
            acoes={acoes(detalhes, false)}>

            <Text style={{ color: cores.textoSecundario }}>
              {tipo === 'conselhos'
                ? `${detalhes.curtidas ?? 0} curtidas`
                : `${detalhes.interessados ?? 0} interessados`}
            </Text>

            {tipo === 'conselhos' && (
              <Text style={{ color: cores.textoSecundario }}>
                {detalhes.comentarios ?? 0} comentários
              </Text>
            )}

            {tipo === 'atividades' && (
              <>
                <Text style={{ color: cores.texto }}>
                  Local: {detalhes.local}
                </Text>

                <Text style={{ color: cores.texto }}>
                  Data: {detalhes.dataAtividade?.split('-').reverse().join('/')}
                  {' às '}{detalhes.horaInicio?.slice(0, 5)}
                </Text>

                <Text style={{ color: cores.textoSecundario }}>
                  {detalhes.vencida
                    ? 'Horário de início ultrapassado'
                    : 'Atividade futura'}
                </Text>
              </>
            )}

          </CardAdmin>

          {tipo === 'conselhos' && (
            <>
              <Text style={[estilos.titulo, { color: cores.texto }]}>
                Comentários
              </Text>

              {carregandoComentarios ? (
                <ActivityIndicator color={cores.primaria} />

              ) : erroComentarios ? (
                <>
                  <Text style={{ color: cores.perigo }}>
                    {erroComentarios}
                  </Text>

                  <Button
                    titulo="Tentar novamente"
                    variante="contorno"
                    desabilitado={ocupado}
                    aoPressionar={() =>
                      setRevisaoComentarios(atual => atual + 1)
                    }
                  />
                </>

              ) : comentarios.length === 0 ? (
                <Text style={{ color: cores.textoSecundario }}>
                  Nenhum comentário disponível.
                </Text>

              ) : (
                comentarios.map(comentario => (
                  <CardAdmin
                    key={comentario.id}
                    titulo={comentario.autor?.nomeCompleto || 'Estudante'}
                    descricao={comentario.conteudo}
                    acoes={[{
                      titulo: 'Excluir comentário',
                      aoPressionar: () => excluirComentario(comentario),
                      desabilitado: indisponivel,
                    }]}
                  />
                ))
              )}
            </>
          )}

        </View>
      </ScreenTemplate>
    );
  }

  // Lista de conteúdos

  return (
    <ScreenTemplate titulo="Moderação">
      <View style={estilos.container}>

        <BotaoSegmentado
          opcoes={TIPOS}
          valor={tipo}
          aoMudar={valor => {
            if (!bloqueio.current) {
              setTipo(valor);
              setSelecionado(null);
            }
          }}
        />

        <ListaAdmin
          key={tipo}
          itens={itens}
          carregando={carregando}
          erro={erro}
          aoRecarregar={carregar}
          camposBusca={item => [
            item.titulo,
            item.nome,
            item.conteudo,
            item.descricao,
            item.autor?.nomeCompleto,
            item.criador?.nomeCompleto,
            item.categoria?.nome,
            item.local,
          ]}
          renderItem={item => (
            <CardAdmin
              titulo={item.titulo || item.nome}
              subtitulo={subtitulo(item)}
              descricao={item.conteudo || item.descricao}
              imagemUrl={item.imagemUrl}
              ativo={item.ativo}
              acoes={acoes(item)}
            />
          )}
        />

      </View>
    </ScreenTemplate>
  );
}

const estilos = StyleSheet.create({
  container: {
    gap: espacamentos.md,
  },
  titulo: {
    fontSize: tipografia.tituloCartao,
    fontWeight: '700',
  },
});
