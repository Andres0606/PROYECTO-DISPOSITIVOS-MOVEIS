import { traduzirCategoriaLocal } from '../i18n/catalogosLocais';
import { rotuloAdmin, rotuloCategoriaAdmin } from '../i18n/catalogosGrupo4';

// SCREEN — Gestão de conteúdos

import { useCallback, useEffect, useRef, useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

import { ScreenTemplate } from '../components/templates/ScreenTemplate';
import { ListaAdmin } from '../components/organisms/ListaAdmin';
import { FormularioAdmin } from '../components/organisms/FormularioAdmin';
import { CardAdmin } from '../components/molecules/CardAdmin';
import { BotaoSegmentado } from '../components/molecules/BotaoSegmentado';
import { CampoSelecao } from '../components/molecules/CampoSelecao';
import { Button } from '../components/atoms/Button';
import { usePreferencias } from '../contexts/PreferenciasContext';
import { obterTraducaoFrase } from '../utils/frases';
import {
  obterGestaoConteudosAdmin,
  salvarConteudoAdmin,
  alterarEstadoConteudoAdmin,
  excluirCategoriaAdmin,
} from '../services/admin';

import { espacamentos } from '../theme';

const TIPOS = [
  { titulo: 'Lugares', valor: 'lugares' },
  { titulo: 'Frases', valor: 'frases' },
  { titulo: 'Categorias', valor: 'categorias' },
];

const CATEGORIAS = {
  Lugares: 'lugares',
  Frases: 'frases',
  Conselhos: 'conselhos',
  Atividades: 'atividades',
};

export function AdminConteudosScreen({ route }) {
  const { idioma, t } = usePreferencias();
  const [lugares, setLugares] = useState([]);
  const [frases, setFrases] = useState([]);
  const [categorias, setCategorias] = useState({});

  const [tipo, setTipo] = useState('lugares');
  const [grupo, setGrupo] = useState('Lugares');
  const [formulario, setFormulario] = useState(null);

  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');
  const [ocupado, setOcupado] = useState(false);

  const consultaAtual = useRef(0);
  const bloqueio = useRef(false);

  // Carregar conteúdos

  const carregar = useCallback(async () => {
    const consulta = ++consultaAtual.current;

    setCarregando(true);
    setErro('');

    try {
      const resultado = await obterGestaoConteudosAdmin();

      if (consulta === consultaAtual.current) {
        setLugares(resultado.lugares);
        setFrases(resultado.frases);
        setCategorias(resultado.categorias);
      }
    } catch (erro) {
      if (consulta === consultaAtual.current) {
        setErro(t('mensagens.servidor', { mensagem: erro.message, opcional: true }) || t('grupo4.g042'));
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
      setFormulario(null);
    }
  }, [route.params?.tipo, route.params?.atalho]);

  const grupoCategoria = CATEGORIAS[grupo];
  function traduzirCategoria(nome) {
    if (tipo === 'lugares' ||
      (tipo === 'categorias' && grupoCategoria === 'lugares')) {
      return traduzirCategoriaLocal(nome, idioma);
    }

    return rotuloCategoriaAdmin(nome, t);
  }

  const itens = tipo === 'categorias'
    ? categorias[grupoCategoria] ?? []
    : tipo === 'lugares' ? lugares : frases;

  const indisponivel = ocupado || carregando || !!erro;

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
            Alert.alert(t('grupo4.g027'), t('mensagens.servidor', { mensagem: erro.message }));
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
      ativo ? t('grupo4.g044') : t('grupo4.g045'),
      t('grupo4.g046'),
      async () => {
        await alterarEstadoConteudoAdmin(tipoAtual, item.id, ativo);

        Alert.alert(
          t('grupo4.g026'),
          ativo
            ? t('grupo4.g047')
            : t('grupo4.g048')
        );
      }
    );
  }

  // Excluir categoria

  function excluirCategoria(item) {
    const grupoAtual = grupoCategoria;

    confirmar(
      t('grupo4.g049'),
      t('grupo4.g112', { nome: traduzirCategoria(item.nome) }),
      async () => {
        await excluirCategoriaAdmin(grupoAtual, item.id);
        Alert.alert(t('grupo4.g026'), t('grupo4.g050'));
      }
    );
  }

  // Criar ou editar conteúdos

  async function salvar(dados, foto) {
    if (bloqueio.current || !formulario) return;

    bloqueio.current = true;
    setOcupado(true);
    consultaAtual.current += 1;

    try {
      const resultado = await salvarConteudoAdmin({
        tipo: formulario.tipo,
        grupo: formulario.grupo,
        id: formulario.registro?.id,
        dados,
        foto,
      });

      setFormulario(null);

      await carregar();

      if (resultado.aviso) {
        Alert.alert(t('grupo4.g051'), t('mensagens.servidor', { mensagem: resultado.aviso }));
      } else {
        Alert.alert(t('grupo4.g026'), t('grupo4.g052'));
      }
    } finally {
      bloqueio.current = false;
      setOcupado(false);
    }
  }

  function fecharFormulario() {
    if (!bloqueio.current) setFormulario(null);
  }

  // Formulário

  if (formulario) {
    return (
      <ScreenTemplate
        titulo={formulario.registro ? t('grupo4.g053') : t('grupo4.g054')}
        aoVoltar={fecharFormulario}>

        <FormularioAdmin
          tipo={formulario.tipo}
          registro={formulario.registro}
          categorias={categorias[formulario.tipo] ?? []}
          aoCancelar={fecharFormulario}
          aoSalvar={salvar}
        />

      </ScreenTemplate>
    );
  }

  // Lista de conteúdos

  return (
    <ScreenTemplate titulo={t('grupo4.g055')}>
      <View style={estilos.container}>

        <BotaoSegmentado
          opcoes={TIPOS.map(item => ({ ...item, titulo: rotuloAdmin(item.titulo, t) }))}
          valor={tipo}
          aoMudar={valor => {
            if (!ocupado) setTipo(valor);
          }}
        />

        {tipo === 'categorias' && (
          <CampoSelecao
            rotulo={t('grupo4.g056')}
            valor={grupo}
            opcoes={Object.keys(CATEGORIAS)}
            formatarOpcao={valor => rotuloAdmin(valor, t)}
            aoMudar={setGrupo}
            desabilitado={ocupado}
          />
        )}

        <Button
          titulo={tipo === 'lugares'
            ? t('grupo4.g057')
            : tipo === 'frases'
              ? t('grupo4.g058')
              : t('grupo4.g059')}
          variante="escuro"
          desabilitado={indisponivel}
          aoPressionar={() => setFormulario({
            tipo,
            grupo: grupoCategoria,
            registro: null,
          })}
        />

        <ListaAdmin
          key={`${tipo}-${grupoCategoria}`}
          itens={itens}
          carregando={carregando}
          erro={erro}
          aoRecarregar={carregar}
          filtrarEstado={tipo !== 'categorias'}
          camposBusca={item => [
            item.nome,
            item.frasePortugues,
            item.traducaoEspanhol,
            item.traducaoIngles,
            item.descricao,
            item.explicacao,
            item.explicacaoIngles,
            item.explicacaoPortugues,
            item.categoria?.nome,
            traduzirCategoria(item.categoria?.nome),
            tipo === 'categorias' ? traduzirCategoria(item.nome) : '',
            item.endereco,
          ]}
          renderItem={item => (
            <CardAdmin
              titulo={
                tipo === 'categorias'
                  ? traduzirCategoria(item.nome)
                  : item.nome || item.frasePortugues
              }
              subtitulo={traduzirCategoria(item.categoria?.nome)}
              descricao={tipo === 'frases'
                ? obterTraducaoFrase(item, idioma)
                : item.descricao}
              imagemUrl={item.imagemUrl}
              ativo={item.ativo}
              acoes={[
                {
                  titulo: t('grupo4.g060'),
                  aoPressionar: () => setFormulario({
                    tipo,
                    grupo: grupoCategoria,
                    registro: item,
                  }),
                  desabilitado: indisponivel,
                },
                tipo === 'categorias' ? {
                  titulo: t('grupo4.g061'),
                  aoPressionar: () => excluirCategoria(item),
                  desabilitado: indisponivel,
                } : {
                  titulo: item.ativo ? t('grupo4.g032') : t('grupo4.g031'),
                  aoPressionar: () => alterarEstado(item),
                  desabilitado: indisponivel,
                },
              ]}
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
});
