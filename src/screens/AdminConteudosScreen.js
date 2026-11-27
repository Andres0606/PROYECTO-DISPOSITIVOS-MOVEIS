
// SCREEN — Gestão de conteúdos

import { useEffect, useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';

import { ScreenTemplate } from '../components/templates/ScreenTemplate';
import { ListaAdmin } from '../components/organisms/ListaAdmin';
import { FormularioAdmin } from '../components/organisms/FormularioAdmin';
import { CardAdmin } from '../components/molecules/CardAdmin';
import { BotaoSegmentado } from '../components/molecules/BotaoSegmentado';
import { CampoSelecao } from '../components/molecules/CampoSelecao';
import { Button } from '../components/atoms/Button';
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

export function AdminConteudosScreen({
  route, lugares = [], frases = [], categorias = {},
  carregando, erro, aoRecarregar,
  aoSalvar, aoAlterarEstado, aoExcluirCategoria,
}) {
  const [tipo, setTipo] = useState('lugares');
  const [grupo, setGrupo] = useState('Lugares');
  const [formulario, setFormulario] = useState(null);
  const [ocupado, setOcupado] = useState(false);

  // Atalhos do painel

  useEffect(() => {
    const destino = route.params?.tipo;

    if (TIPOS.some(item => item.valor === destino)) {
      setTipo(destino);
      setFormulario(null);
    }
  }, [route.params?.tipo, route.params?.atalho]);

  const grupoCategoria = CATEGORIAS[grupo];

  const itens = tipo === 'categorias'
    ? categorias[grupoCategoria] ?? []
    : tipo === 'lugares' ? lugares : frases;

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
      item.ativo ? 'Desativar conteúdo' : 'Ativar conteúdo',
      'Deseja alterar a disponibilidade deste conteúdo?',
      () => aoAlterarEstado(tipo, item.id, !item.ativo)
    );
  }

  function excluirCategoria(item) {
    if (!aoExcluirCategoria) return;

    confirmar(
      'Excluir categoria',
      `Deseja excluir a categoria "${item.nome}"?`,
      () => aoExcluirCategoria(grupoCategoria, item.id)
    );
  }

  // Formulário de criação e edição

  if (formulario) {
    return (
      <ScreenTemplate
        titulo={formulario.registro ? 'Editar conteúdo' : 'Novo conteúdo'}
        aoVoltar={() => setFormulario(null)}>

        <FormularioAdmin
          tipo={formulario.tipo}
          registro={formulario.registro}
          categorias={categorias[formulario.tipo] ?? []}
          aoCancelar={() => setFormulario(null)}
          aoSalvar={aoSalvar ? async (dados, foto) => {
            await aoSalvar({
              tipo: formulario.tipo,
              grupo: formulario.grupo,
              id: formulario.registro?.id,
              dados,
              foto,
            });

            setFormulario(null);
          } : undefined}
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
          aoMudar={setTipo}
        />

        {tipo === 'categorias' && (
          <CampoSelecao
            rotulo="Tipo de categoria"
            valor={grupo}
            opcoes={Object.keys(CATEGORIAS)}
            aoMudar={setGrupo}
          />
        )}

        <Button
          titulo={tipo === 'lugares'
            ? 'Adicionar lugar'
            : tipo === 'frases'
              ? 'Adicionar frase'
              : 'Adicionar categoria'}
          variante="escuro"
          desabilitado={ocupado}
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
          aoRecarregar={aoRecarregar}
          filtrarEstado={tipo !== 'categorias'}
          camposBusca={item => [
            item.nome,
            item.frasePortugues,
            item.traducaoEspanhol,
            item.descricao,
            item.categoria?.nome,
            item.endereco,
          ]}
          renderItem={item => (
            <CardAdmin
              titulo={item.nome || item.frasePortugues}
              subtitulo={item.categoria?.nome}
              descricao={tipo === 'frases'
                ? item.traducaoEspanhol
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
                  desabilitado: ocupado,
                },
                tipo === 'categorias' ? {
                  titulo: 'Excluir',
                  aoPressionar: aoExcluirCategoria
                    ? () => excluirCategoria(item) : undefined,
                  desabilitado: ocupado,
                } : {
                  titulo: item.ativo ? 'Desativar' : 'Ativar',
                  aoPressionar: aoAlterarEstado
                    ? () => alterarEstado(item) : undefined,
                  desabilitado: ocupado,
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
