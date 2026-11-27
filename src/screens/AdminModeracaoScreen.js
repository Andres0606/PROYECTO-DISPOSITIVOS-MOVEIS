
// SCREEN — Moderação administrativa

import { useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, View, ActivityIndicator } from 'react-native';

import { ScreenTemplate } from '../components/templates/ScreenTemplate';
import { CardAdmin } from '../components/molecules/CardAdmin';
import { ListaAdmin } from '../components/organisms/ListaAdmin';
import { BotaoSegmentado } from '../components/molecules/BotaoSegmentado';
import { Button } from '../components/atoms/Button';

import { useTema } from '../theme/useTema';
import { espacamentos, tipografia } from '../theme';

const TIPOS = [
  { titulo: 'Conselhos', valor: 'conselhos' },
  { titulo: 'Atividades', valor: 'atividades' },
];

export function AdminModeracaoScreen({
  route, conselhos = [], atividades = [],
  carregando, erro, aoRecarregar,
  aoAlterarEstado, aoObterComentarios, aoExcluirComentario,
}) {
  const { cores } = useTema();

  const [tipo, setTipo] = useState('conselhos');
  const [selecionado, setSelecionado] = useState(null);
  const [comentarios, setComentarios] = useState([]);
  const [carregandoComentarios, setCarregandoComentarios] = useState(false);
  const [erroComentarios, setErroComentarios] = useState('');
  const [ocupado, setOcupado] = useState(false);
  const [revisaoComentarios, setRevisaoComentarios] = useState(0);

  // Atalhos do painel

  useEffect(() => {
    const destino = route.params?.tipo;

    if (TIPOS.some(item => item.valor === destino)) {
      setTipo(destino);
      setSelecionado(null);
    }
  }, [route.params?.tipo, route.params?.atalho]);

  const itens = tipo === 'conselhos' ? conselhos : atividades;
  const detalhes = itens.find(item => item.id === selecionado);

  // Carregar comentários

  useEffect(() => {
    let ativo = true;

    setComentarios([]);
    setErroComentarios('');
    setCarregandoComentarios(false);

    if (tipo === 'conselhos' && selecionado && aoObterComentarios) {
      setCarregandoComentarios(true);

      aoObterComentarios(selecionado)
        .then(resultado => {
          if (ativo) setComentarios(resultado);
        })
        .catch(erro => {
          if (ativo) setErroComentarios(erro.message);
        })
        .finally(() => {
          if (ativo) setCarregandoComentarios(false);
        });
    }

    return () => { ativo = false; };
  }, [tipo, selecionado, aoObterComentarios, revisaoComentarios]);

  // Confirmar operações

  function confirmar(titulo, mensagem, acao) {
    if (ocupado) return;

    Alert.alert(titulo, mensagem, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Confirmar',
        style: 'destructive',
        onPress: async () => {
          setOcupado(true);

          try {
            await acao();
          } catch (erro) {
            Alert.alert('Erro', erro.message);
          } finally {
            setOcupado(false);
          }
        },
      },
    ]);
  }

  function alterarEstado(item) {
    if (!aoAlterarEstado) return;

    confirmar(
      item.ativo ? 'Desativar conteúdo' : 'Reativar conteúdo',
      'Deseja alterar a visibilidade deste conteúdo para os estudantes?',
      () => aoAlterarEstado(tipo, item.id, !item.ativo)
    );
  }

  function excluirComentario(comentario) {
    if (!aoExcluirComentario) return;

    const conselhoId = selecionado;

    confirmar(
      'Excluir comentário',
      'Esta ação é permanente. Deseja continuar?',
      async () => {
        await aoExcluirComentario(conselhoId, comentario.id);

        setComentarios(atuais =>
          atuais.filter(item => item.id !== comentario.id)
        );
      }
    );
  }

  // Ações dos conteúdos

  function acoes(item, mostrarDetalhes = true) {
    return [
      ...(mostrarDetalhes ? [{
        titulo: 'Detalhes',
        aoPressionar: () => setSelecionado(item.id),
        desabilitado: ocupado,
      }] : []),
      {
        titulo: item.ativo ? 'Desativar' : 'Reativar',
        aoPressionar: aoAlterarEstado
          ? () => alterarEstado(item) : undefined,
        desabilitado: ocupado,
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
          if (!ocupado) setSelecionado(null);
        }}>

        <View style={estilos.container}>

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
                      aoPressionar: aoExcluirComentario
                        ? () => excluirComentario(comentario) : undefined,
                      desabilitado: ocupado,
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
            if (!ocupado) {
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
          aoRecarregar={aoRecarregar}
          camposBusca={item => [
            item.titulo,
            item.nome,
            item.conteudo,
            item.descricao,
            item.autor?.nomeCompleto,
            item.criador?.nomeCompleto,
            item.categoria?.nome,
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
