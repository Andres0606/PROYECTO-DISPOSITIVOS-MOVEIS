// SCREEN — Configurações

import {
  useCallback,
  useEffect,
  useState,
} from 'react';

import {
  ActivityIndicator,
  Alert,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import { ScreenTemplate } from '../components/templates/ScreenTemplate';

import {
  configurarNotificacoes,
  enviarAvisoLocal,
  obterPosicao,
  statusPermissoes,
} from '../services/nativos';

import {
  obterLocalizacaoSalva,
  removerLocalizacao,
  salvarLocalizacao,
} from '../services/storage';

import {
  cores,
  espacamentos,
  tipografia,
} from '../theme';

function rotuloPermissao(status) {
  if (status === 'granted') {
    return 'Permitida';
  }

  if (status === 'denied') {
    return 'Negada';
  }

  if (status === 'undetermined') {
    return 'Não solicitada';
  }

  if (status === 'indisponivel') {
    return 'Indisponível';
  }

  return '—';
}

function formatarGps(coords) {
  if (!coords) {
    return 'Nenhuma localização salva';
  }

  return `${coords.latitude.toFixed(
    5
  )}, ${coords.longitude.toFixed(5)}`;
}

export function ConfiguracoesScreen({
  navigation,
}) {
  const [permissoes, setPermissoes] =
    useState(null);

  const [localizacao, setLocalizacao] =
    useState(null);

  const [ocupado, setOcupado] =
    useState('');

  const [erro, setErro] =
    useState('');

  const carregarDados =
    useCallback(async () => {
      setErro('');

      try {
        const [
          permissoesAtuais,
          localizacaoSalva,
        ] = await Promise.all([
          statusPermissoes(),
          obterLocalizacaoSalva(),
        ]);

        setPermissoes(
          permissoesAtuais
        );

        setLocalizacao(
          localizacaoSalva
        );
      } catch (e) {
        setErro(
          'Não foi possível carregar as configurações.'
        );
      }
    }, []);

  useEffect(() => {
    configurarNotificacoes();
    carregarDados();
  }, [carregarDados]);

  async function atualizarLocalizacao() {
    setOcupado('gps');
    setErro('');

    try {
      const posicao =
        await obterPosicao();

      setLocalizacao(posicao);

      await salvarLocalizacao(
        posicao
      );

      await carregarDados();
    } catch (e) {
      Alert.alert(
        'Localização',
        e?.message ??
          'Não foi possível obter sua localização.'
      );
    } finally {
      setOcupado('');
    }
  }

  function confirmarRemocaoLocalizacao() {
    Alert.alert(
      'Remover localização',
      'Deseja apagar a localização salva?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },

        {
          text: 'Remover',
          style: 'destructive',
          onPress:
            removerLocalizacaoSalva,
        },
      ]
    );
  }

  async function removerLocalizacaoSalva() {
    try {
      await removerLocalizacao();

      setLocalizacao(null);
    } catch (e) {
      Alert.alert(
        'Erro',
        'Não foi possível remover a localização salva.'
      );
    }
  }

  async function testarNotificacao() {
    setOcupado('notificacao');

    try {
      await enviarAvisoLocal({
        titulo: 'InterChapecó',
        corpo:
          'As notificações estão funcionando corretamente.',
      });

      Alert.alert(
        'Notificação enviada',
        'A notificação deverá aparecer em alguns segundos.'
      );

      await carregarDados();
    } catch (e) {
      Alert.alert(
        'Notificações',
        e?.message ??
          'Não foi possível enviar a notificação.'
      );
    } finally {
      setOcupado('');
    }
  }

  function abrirIdioma() {
    Alert.alert(
      'Idioma',
      'A seleção de idioma será implementada posteriormente.'
    );
  }

  function abrirPrivacidade() {
    Alert.alert(
      'Privacidade',
      'As opções de privacidade serão implementadas posteriormente.'
    );
  }

  function abrirTema() {
    Alert.alert(
      'Tema',
      'A seleção de tema será implementada posteriormente.'
    );
  }

  function abrirSobre() {
    Alert.alert(
      'InterChapecó',
      'Versão 1.0'
    );
  }

  return (
    <ScreenTemplate
      titulo="Configurações"
      aoVoltar={() =>
        navigation.goBack()
      }
    >
      {!!erro && (
        <Text style={estilos.erro}>
          {erro}
        </Text>
      )}

      {!permissoes ? (
        <ActivityIndicator
          color={cores.primaria}
          style={
            estilos.carregando
          }
        />
      ) : (
        <View style={estilos.menu}>
          <OpcaoConfiguracao
            titulo="Idioma"
            valor="Português"
            aoPressionar={
              abrirIdioma
            }
          />

          <OpcaoConfiguracao
            titulo="Notificações"
            valor={rotuloPermissao(
              permissoes.notificacoes
            )}
            aoPressionar={
              testarNotificacao
            }
          />

          <OpcaoConfiguracao
            titulo="Localização"
            valor={rotuloPermissao(
              permissoes.localizacao
            )}
            aoPressionar={
              atualizarLocalizacao
            }
            carregando={
              ocupado === 'gps'
            }
          />

          <OpcaoConfiguracao
            titulo="Privacidade"
            aoPressionar={
              abrirPrivacidade
            }
          />

          <OpcaoConfiguracao
            titulo="Tema"
            valor="Claro"
            aoPressionar={
              abrirTema
            }
          />

          <OpcaoConfiguracao
            titulo="Sobre o app"
            valor="v1.0"
            aoPressionar={
              abrirSobre
            }
          />
        </View>
      )}

      <View
        style={
          estilos.secaoLocalizacao
        }
      >
        <Text
          style={
            estilos.tituloSecao
          }
        >
          Localização salva
        </Text>

        <Text
          style={
            estilos.localizacaoTexto
          }
        >
          {formatarGps(
            localizacao
          )}
        </Text>

        {!!localizacao?.precisao && (
          <Text
            style={
              estilos.textoSecundario
            }
          >
            Precisão aproximada:{' '}
            {Math.round(
              localizacao.precisao
            )}{' '}
            metros
          </Text>
        )}

        <View
          style={
            estilos.acoesLocalizacao
          }
        >
          <Pressable
            onPress={
              atualizarLocalizacao
            }
            disabled={
              !!ocupado
            }
            style={({
              pressed,
            }) => [
              estilos.botaoPrincipal,

              pressed &&
                estilos.pressionado,

              !!ocupado &&
                estilos.desabilitado,
            ]}
          >
            <Ionicons
              name="location-outline"
              size={18}
              color="#FFFFFF"
            />

            <Text
              style={
                estilos.botaoPrincipalTexto
              }
            >
              {ocupado === 'gps'
                ? 'Obtendo...'
                : 'Atualizar localização'}
            </Text>
          </Pressable>

          {!!localizacao && (
            <Pressable
              onPress={
                confirmarRemocaoLocalizacao
              }
              disabled={
                !!ocupado
              }
              style={({
                pressed,
              }) => [
                estilos.botaoSecundario,

                pressed &&
                  estilos.pressionado,
              ]}
            >
              <Text
                style={
                  estilos.botaoSecundarioTexto
                }
              >
                Remover
              </Text>
            </Pressable>
          )}
        </View>
      </View>
    </ScreenTemplate>
  );
}

function OpcaoConfiguracao({
  titulo,
  valor,
  aoPressionar,
  carregando = false,
}) {
  return (
    <Pressable
      onPress={aoPressionar}
      disabled={carregando}
      style={({ pressed }) => [
        estilos.opcao,

        pressed &&
          estilos.pressionado,
      ]}
    >
      <Text
        style={
          estilos.opcaoTitulo
        }
      >
        {titulo}
      </Text>

      <View
        style={
          estilos.opcaoDireita
        }
      >
        {!!valor && (
          <Text
            style={
              estilos.opcaoValor
            }
          >
            {carregando
              ? 'Carregando...'
              : valor}
          </Text>
        )}

        <Ionicons
          name="chevron-forward"
          size={19}
          color={cores.texto}
        />
      </View>
    </Pressable>
  );
}

const estilos =
  StyleSheet.create({
    carregando: {
      marginTop:
        espacamentos.xl,
    },

    erro: {
      color:
        cores.perigo,

      marginBottom:
        espacamentos.md,

      fontSize:
        tipografia.legenda,
    },

    menu: {
      marginTop:
        espacamentos.lg,
    },

    opcao: {
      minHeight: 52,

      flexDirection:
        'row',

      alignItems:
        'center',

      justifyContent:
        'space-between',

      borderBottomWidth: 1,

      borderBottomColor:
        cores.borda,

      paddingHorizontal: 2,
    },

    opcaoTitulo: {
      fontSize:
        tipografia.corpo,

      fontWeight:
        '600',

      color:
        cores.texto,
    },

    opcaoDireita: {
      flexDirection:
        'row',

      alignItems:
        'center',

      gap:
        espacamentos.sm,
    },

    opcaoValor: {
      fontSize:
        tipografia.legenda,

      color:
        cores.textoSecundario,
    },

    secaoLocalizacao: {
      marginTop:
        espacamentos.xl,

      borderWidth: 1,

      borderColor:
        cores.borda,

      backgroundColor:
        cores.superficie,

      padding:
        espacamentos.md,
    },

    tituloSecao: {
      fontSize:
        tipografia.subtitulo,

      fontWeight:
        '700',

      color:
        cores.texto,

      marginBottom:
        espacamentos.sm,
    },

    localizacaoTexto: {
      fontSize:
        tipografia.corpo,

      color:
        cores.texto,

      marginBottom:
        espacamentos.xs,
    },

    textoSecundario: {
      fontSize:
        tipografia.legenda,

      color:
        cores.textoSecundario,
    },

    acoesLocalizacao: {
      marginTop:
        espacamentos.md,

      gap:
        espacamentos.sm,
    },

    botaoPrincipal: {
      minHeight: 44,

      flexDirection:
        'row',

      gap: 7,

      alignItems:
        'center',

      justifyContent:
        'center',

      backgroundColor:
        '#000000',
    },

    botaoPrincipalTexto: {
      fontSize:
        tipografia.legenda,

      fontWeight:
        '700',

      color:
        '#FFFFFF',
    },

    botaoSecundario: {
      minHeight: 44,

      alignItems:
        'center',

      justifyContent:
        'center',

      borderWidth: 1,

      borderColor:
        cores.borda,

      backgroundColor:
        cores.superficie,
    },

    botaoSecundarioTexto: {
      fontSize:
        tipografia.legenda,

      fontWeight:
        '600',

      color:
        cores.perigo,
    },

    pressionado: {
      opacity: 0.6,
    },

    desabilitado: {
      opacity: 0.5,
    },
  });