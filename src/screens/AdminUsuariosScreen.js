import { traduzirPais } from '../i18n/catalogosPaises';
import { rotuloAdmin, rotuloCategoriaAdmin } from '../i18n/catalogosGrupo4';
import { usePreferencias } from '../contexts/PreferenciasContext';

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
  const { t, idioma } = usePreferencias();
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
        setErro(erro.message || t('grupo4.g025'));
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
        t('grupo4.g026'),
        ativo
          ? t('grupo4.g028')
          : t('grupo4.g029')
      );
    } catch (erro) {
      Alert.alert(
        t('grupo4.g027'),
        erro.message || t('grupo4.g030')
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
    const acao = ativo ? t('grupo4.g031') : t('grupo4.g032');

    Alert.alert(
      ativo ? t('grupo4.g108') : t('grupo4.g109'),
      ativo ? t('grupo4.g110', { nome: usuario.nomeCompleto }) : t('grupo4.g111', { nome: usuario.nomeCompleto }),
      [
        { text: t('grupo4.g033'), style: 'cancel' },
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
        titulo: t('grupo4.g034'),
        aoPressionar: () => setSelecionado(usuario.id),
        desabilitado: ocupado || carregando,
      }] : []),

      ...(usuario.rol?.nome === 'Estudante' ? [{
        titulo: usuario.ativo ? t('grupo4.g032') : t('grupo4.g031'),
        aoPressionar: () => confirmarEstado(usuario),
        desabilitado: ocupado || carregando,
      }] : []),
    ];
  }

  // Detalhes do usuário

  if (detalhes) {
    return (
      <ScreenTemplate titulo={t('grupo4.g035')}
        aoVoltar={() => {
          if (!ocupado) setSelecionado(null);
        }}>

        <CardAdmin
          titulo={detalhes.nomeCompleto}
          subtitulo={detalhes.email}
          ativo={detalhes.ativo}
          acoes={acoes(detalhes, false)}>

          {[
            [t('grupo4.g036'), rotuloAdmin(detalhes.rol?.nome, t)],
            [t('grupo4.g037'), traduzirPais(detalhes.paisOrigem?.nome, idioma)],
            [t('grupo4.g038'), detalhes.universidadeOrigem?.nome],
            [t('grupo4.g039'), detalhes.universidadeDestino?.nome],
          ].map(([rotulo, valor]) => (
            <View key={rotulo} style={estilos.campo}>
              <Text style={{ color: cores.textoSecundario }}>
                {rotulo}
              </Text>

              <Text style={{ color: cores.texto, fontWeight: '600' }}>
                {valor || t('grupo4.g040')}
              </Text>
            </View>
          ))}

        </CardAdmin>
      </ScreenTemplate>
    );
  }

  // Lista de usuários

  return (
    <ScreenTemplate titulo={t('grupo4.g006')}>
      <View style={estilos.container}>

        <BotaoSegmentado
          opcoes={PERFIS.map(item => ({ ...item, titulo: rotuloAdmin(item.titulo, t) }))}
          valor={perfil}
          aoMudar={setPerfil}
        />

        <ListaAdmin
          itens={filtrados}
          carregando={carregando}
          erro={erro}
          aoRecarregar={carregar}
          placeholder={t('grupo4.g041')}
          camposBusca={item => [
            item.nomeCompleto,
            item.email,
            item.paisOrigem?.nome,
            traduzirPais(item.paisOrigem?.nome, idioma),
            item.universidadeDestino?.nome,
          ]}
          renderItem={item => (
            <CardAdmin
              titulo={item.nomeCompleto}
              subtitulo={`${item.email}\n${rotuloAdmin(item.rol?.nome, t) ?? ''}`}
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
