
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
  const { idioma } = usePreferencias();
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
      setFormulario(null);
    }
  }, [route.params?.tipo, route.params?.atalho]);

  const grupoCategoria = CATEGORIAS[grupo];

  const itens = tipo === 'categorias'
    ? categorias[grupoCategoria] ?? []
    : tipo === 'lugares' ? lugares : frases;

  const indisponivel = ocupado || carregando || !!erro;

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
            Alert.alert('Erro', erro.message);
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
      ativo ? 'Ativar conteúdo' : 'Desativar conteúdo',
      'Deseja alterar a disponibilidade deste conteúdo?',
      async () => {
        await alterarEstadoConteudoAdmin(tipoAtual, item.id, ativo);

        Alert.alert(
          'Sucesso',
          ativo
            ? 'Conteúdo ativado com sucesso.'
            : 'Conteúdo desativado com sucesso.'
        );
      }
    );
  }

  // Excluir categoria

  function excluirCategoria(item) {
    const grupoAtual = grupoCategoria;

    confirmar(
      'Excluir categoria',
      `Deseja excluir a categoria "${item.nome}"?`,
      async () => {
        await excluirCategoriaAdmin(grupoAtual, item.id);
        Alert.alert('Sucesso', 'Categoria excluída com sucesso.');
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
        Alert.alert('Atenção', resultado.aviso);
      } else {
        Alert.alert('Sucesso', 'Conteúdo salvo com sucesso.');
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
        titulo={formulario.registro ? 'Editar conteúdo' : 'Novo conteúdo'}
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
    <ScreenTemplate titulo="Conteúdos">
      <View style={estilos.container}>

        <BotaoSegmentado
          opcoes={TIPOS}
          valor={tipo}
          aoMudar={valor => {
            if (!ocupado) setTipo(valor);
          }}
        />

        {tipo === 'categorias' && (
          <CampoSelecao
            rotulo="Tipo de categoria"
            valor={grupo}
            opcoes={Object.keys(CATEGORIAS)}
            aoMudar={setGrupo}
            desabilitado={ocupado}
          />
        )}

        <Button
          titulo={tipo === 'lugares'
            ? 'Adicionar lugar'
            : tipo === 'frases'
              ? 'Adicionar frase'
              : 'Adicionar categoria'}
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
            item.endereco,
          ]}
          renderItem={item => (
            <CardAdmin
              titulo={item.nome || item.frasePortugues}
              subtitulo={item.categoria?.nome}
              descricao={tipo === 'frases'
                ? obterTraducaoFrase(item, idioma)
                : item.descricao}
              imagemUrl={item.imagemUrl}
              ativo={item.ativo}
              acoes={[
                {
                  titulo: 'Editar',
                  aoPressionar: () => setFormulario({
                    tipo,
                    grupo: grupoCategoria,
                    registro: item,
                  }),
                  desabilitado: indisponivel,
                },
                tipo === 'categorias' ? {
                  titulo: 'Excluir',
                  aoPressionar: () => excluirCategoria(item),
                  desabilitado: indisponivel,
                } : {
                  titulo: item.ativo ? 'Desativar' : 'Ativar',
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
