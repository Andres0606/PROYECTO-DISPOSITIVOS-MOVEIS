
// SCREEN — Gerenciamento de usuários

import { useCallback, useRef, useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

import { ScreenTemplate } from '../components/templates/ScreenTemplate';
import { CardAdmin } from '../components/molecules/CardAdmin';
import { ListaAdmin } from '../components/organisms/ListaAdmin';
import { BotaoSegmentado } from '../components/molecules/BotaoSegmentado';

import {
  obterUsuariosAdmin,
  alterarEstadoUsuarioAdmin,
} from '../services/admin';

import { useTema } from '../theme/useTema';
import { espacamentos } from '../theme';

const PERFIS = [
  { titulo: 'Todos', valor: 'todos' },
  { titulo: 'Estudantes', valor: 'Estudante' },
  { titulo: 'Admins', valor: 'Administrador' },
];

export function AdminUsuariosScreen() {
  const { cores } = useTema();

  const [usuarios, setUsuarios] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');
  const [perfil, setPerfil] = useState('todos');
  const [selecionado, setSelecionado] = useState(null);
  const [ocupado, setOcupado] = useState(false);

  const consultaAtual = useRef(0);
  const bloqueio = useRef(false);

  // Carregar usuários

  const carregar = useCallback(async () => {
    const consulta = ++consultaAtual.current;

    setCarregando(true);
    setErro('');

    try {
      const resultado = await obterUsuariosAdmin();

      if (consulta === consultaAtual.current) {
        setUsuarios(resultado);
      }
    } catch (erro) {
      if (consulta === consultaAtual.current) {
        setUsuarios([]);
        setErro(erro.message || 'Não foi possível carregar os usuários.');
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

  const detalhes = usuarios.find(item => item.id === selecionado);

  const filtrados = usuarios.filter(item =>
    perfil === 'todos' || item.rol?.nome === perfil
  );

  // Alterar estado da conta

  async function alterarEstado(id, ativo) {
    if (bloqueio.current) return;

    bloqueio.current = true;
    setOcupado(true);

    // Invalidar consultas anteriores
    consultaAtual.current += 1;

    try {
      const atualizado = await alterarEstadoUsuarioAdmin(id, ativo);

      setUsuarios(atuais => atuais.map(item =>
        item.id === id ? atualizado : item
      ));

      await carregar();

      Alert.alert(
        'Sucesso',
        ativo
          ? 'Conta ativada com sucesso.'
          : 'Conta desativada com sucesso.'
      );
    } catch (erro) {
      Alert.alert(
        'Erro',
        erro.message || 'Não foi possível alterar o estado da conta.'
      );

      await carregar();
    } finally {
      bloqueio.current = false;
      setOcupado(false);
    }
  }

  function confirmarEstado(usuario) {
    if (ocupado || carregando || bloqueio.current) return;
    if (usuario.rol?.nome !== 'Estudante') return;

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
          onPress: () => alterarEstado(usuario.id, ativo),
        },
      ]
    );
  }

  function acoes(usuario, mostrarDetalhes = true) {
    return [
      ...(mostrarDetalhes ? [{
        titulo: 'Detalhes',
        aoPressionar: () => setSelecionado(usuario.id),
        desabilitado: ocupado || carregando,
      }] : []),

      ...(usuario.rol?.nome === 'Estudante' ? [{
        titulo: usuario.ativo ? 'Desativar' : 'Ativar',
        aoPressionar: () => confirmarEstado(usuario),
        desabilitado: ocupado || carregando,
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
          aoRecarregar={carregar}
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
