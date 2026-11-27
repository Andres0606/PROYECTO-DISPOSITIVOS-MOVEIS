import { rotuloAdmin, rotuloCategoriaAdmin } from '../i18n/catalogosGrupo4';
import { usePreferencias } from '../contexts/PreferenciasContext';

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
  const { t } = usePreferencias();
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
        setErro(erro.message || t('grupo4.g042'));
      }
    } finally {
      if (consulta === consultaAtual.current) {
        setCarregando(false);
      }
    }
  }, [t]);

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
              erro.message || t('grupo4.g062')
            );
          }
        })
        .finally(() => {
          if (ativo) setCarregandoComentarios(false);
        });
    }

    return () => { ativo = false; };
  }, [tipo, selecionado, revisaoComentarios, t]));

  // Confirmar operações

  function confirmar(titulo, mensagem, acao) {
    if (indisponivel || bloqueio.current) return;

    Alert.alert(titulo, mensagem, [
      { text: t('grupo4.g033'), style: 'cancel' },
      {
        text: t('grupo4.g043'),
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
              Alert.alert(t('grupo4.g027'), erro.message || t('grupo4.g063'));
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
      ativo ? t('grupo4.g064') : t('grupo4.g045'),
      t('grupo4.g065'),
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
            t('grupo4.g026'),
            ativo
              ? t('grupo4.g066')
              : t('grupo4.g048')
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
      t('grupo4.g067'),
      t('grupo4.g068'),
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
          Alert.alert(t('grupo4.g026'), t('grupo4.g069'));
        }
      }
    );
  }

  // Ações dos conteúdos

  function acoes(item, mostrarDetalhes = true) {
    return [
      ...(mostrarDetalhes ? [{
        titulo: t('grupo4.g034'),
        aoPressionar: () => setSelecionado(item.id),
        desabilitado: indisponivel,
      }] : []),
      {
        titulo: item.ativo ? t('grupo4.g032') : t('grupo4.g070'),
        aoPressionar: () => alterarEstado(item),
        desabilitado: indisponivel,
      },
    ];
  }

  function subtitulo(item) {
    return [
      item.autor?.nomeCompleto || item.criador?.nomeCompleto,
      rotuloCategoriaAdmin(item.categoria?.nome, t),
    ].filter(Boolean).join(' · ');
  }

  // Detalhes do conteúdo

  if (detalhes) {
    return (
      <ScreenTemplate
        titulo={tipo === 'conselhos'
          ? t('grupo4.g071')
          : t('grupo4.g072')}
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

              <Button titulo={t('grupo4.g023')}
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
                ? t('grupo4.g116', { total: detalhes.curtidas ?? 0 })
                : t('grupo4.g117', { total: detalhes.interessados ?? 0 })}
            </Text>

            {tipo === 'conselhos' && (
              <Text style={{ color: cores.textoSecundario }}>
                {t('grupo4.g118', { total: detalhes.comentarios ?? 0 })}
              </Text>
            )}

            {tipo === 'atividades' && (
              <>
                <Text style={{ color: cores.texto }}>
                  {t('grupo4.g119', { local: detalhes.local ?? "" })}
                </Text>

                <Text style={{ color: cores.texto }}>
                  {t('grupo4.g120', { data: detalhes.dataAtividade?.split('-').reverse().join('/') ?? '', hora: detalhes.horaInicio?.slice(0, 5) ?? '' })}
                </Text>

                <Text style={{ color: cores.textoSecundario }}>
                  {detalhes.vencida
                    ? t('grupo4.g073')
                    : t('grupo4.g074')}
                </Text>
              </>
            )}

          </CardAdmin>

          {tipo === 'conselhos' && (
            <>
              <Text style={[estilos.titulo, { color: cores.texto }]}>
                {t('grupo4.g075')}
              </Text>

              {carregandoComentarios ? (
                <ActivityIndicator color={cores.primaria} />

              ) : erroComentarios ? (
                <>
                  <Text style={{ color: cores.perigo }}>
                    {erroComentarios}
                  </Text>

                  <Button
                    titulo={t('grupo4.g023')}
                    variante="contorno"
                    desabilitado={ocupado}
                    aoPressionar={() =>
                      setRevisaoComentarios(atual => atual + 1)
                    }
                  />
                </>

              ) : comentarios.length === 0 ? (
                <Text style={{ color: cores.textoSecundario }}>
                  {t('grupo4.g076')}
                </Text>

              ) : (
                comentarios.map(comentario => (
                  <CardAdmin
                    key={comentario.id}
                    titulo={comentario.autor?.nomeCompleto || t('grupo4.g013')}
                    descricao={comentario.conteudo}
                    acoes={[{
                      titulo: t('grupo4.g067'),
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
    <ScreenTemplate titulo={t('grupo4.g077')}>
      <View style={estilos.container}>

        <BotaoSegmentado
          opcoes={TIPOS.map(item => ({ ...item, titulo: rotuloAdmin(item.titulo, t) }))}
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
