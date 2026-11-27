
// SCREEN — Gerenciamento de usuários

import { useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';

import { ScreenTemplate } from '../components/templates/ScreenTemplate';
import { CardAdmin } from '../components/molecules/CardAdmin';
import { ListaAdmin } from '../components/organisms/ListaAdmin';
import { BotaoSegmentado } from '../components/molecules/BotaoSegmentado';
import { useTema } from '../theme/useTema';
import { espacamentos } from '../theme';

const PERFIS = [
  { titulo: 'Todos', valor: 'todos' },
  { titulo: 'Estudantes', valor: 'Estudante' },
  { titulo: 'Admins', valor: 'Administrador' },
];

export function AdminUsuariosScreen({
  usuarios = [], carregando, erro,
  aoRecarregar, aoAlterarEstado,
}) {
  const { cores } = useTema();

  const [perfil, setPerfil] = useState('todos');
  const [selecionado, setSelecionado] = useState(null);
  const [ocupado, setOcupado] = useState(false);

  const detalhes = usuarios.find(item => item.id === selecionado);

  const filtrados = usuarios.filter(item =>
    perfil === 'todos' || item.rol?.nome === perfil
  );

  // Alterar estado da conta

  function confirmarEstado(usuario) {
    if (!aoAlterarEstado || ocupado) return;

    const ativo = !usuario.ativo;
    const acao = ativo ? 'Ativar' : 'Desativar';

    Alert.alert(
      `${acao} conta`,
      `Deseja ${acao.toLowerCase()} a conta de ${usuario.nomeCompleto}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: acao,
          style: ativo ? 'default' : 'destructive',
          onPress: async () => {
            setOcupado(true);

            try {
              await aoAlterarEstado(usuario.id, ativo);
            } catch (erro) {
              Alert.alert('Erro', erro.message);
            } finally {
              setOcupado(false);
            }
          },
        },
      ]
    );
  }

  function acoes(usuario, mostrarDetalhes = true) {
    return [
      ...(mostrarDetalhes ? [{
        titulo: 'Detalhes',
        aoPressionar: () => setSelecionado(usuario.id),
        desabilitado: ocupado,
      }] : []),

      ...(usuario.rol?.nome === 'Estudante' ? [{
        titulo: usuario.ativo ? 'Desativar' : 'Ativar',
        aoPressionar: aoAlterarEstado
          ? () => confirmarEstado(usuario) : undefined,
        desabilitado: ocupado,
      }] : []),
    ];
  }

  // Detalhes do usuário

  if (detalhes) {
    return (
      <ScreenTemplate titulo="Detalhes do usuário"
        aoVoltar={() => {
          if (!ocupado) setSelecionado(null);
        }}>

        <CardAdmin
          titulo={detalhes.nomeCompleto}
          subtitulo={detalhes.email}
          ativo={detalhes.ativo}
          acoes={acoes(detalhes, false)}>

          {[
            ['Perfil', detalhes.rol?.nome],
            ['País de origem', detalhes.paisOrigem?.nome],
            ['Universidade de origem', detalhes.universidadeOrigem?.nome],
            ['Universidade de destino', detalhes.universidadeDestino?.nome],
          ].map(([rotulo, valor]) => (
            <View key={rotulo} style={estilos.campo}>

              <Text style={{ color: cores.textoSecundario }}>
                {rotulo}
              </Text>

              <Text style={{ color: cores.texto, fontWeight: '600' }}>
                {valor || 'Não informado'}
              </Text>

            </View>
          ))}

        </CardAdmin>
      </ScreenTemplate>
    );
  }

  // Lista de usuários

  return (
    <ScreenTemplate titulo="Usuários">
      <View style={estilos.container}>

        <BotaoSegmentado
          opcoes={PERFIS}
          valor={perfil}
          aoMudar={setPerfil}
        />

        <ListaAdmin
          itens={filtrados}
          carregando={carregando}
          erro={erro}
          aoRecarregar={aoRecarregar}
          placeholder="Buscar nome ou e-mail"
          camposBusca={item => [
            item.nomeCompleto,
            item.email,
            item.paisOrigem?.nome,
            item.universidadeDestino?.nome,
          ]}
          renderItem={item => (
            <CardAdmin
              titulo={item.nomeCompleto}
              subtitulo={`${item.email}\n${item.rol?.nome ?? ''}`}
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
  campo: {
    gap: espacamentos.xs,
    marginVertical: espacamentos.xs,
  },
});
