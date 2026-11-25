// SCREEN — Configurações

import {
  useCallback,
  useMemo,
  useState,
} from 'react';

import {
  ActivityIndicator,
  Alert,
  Pressable,
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native';

import { usePreferencias } from '../contexts/PreferenciasContext';
import { useFocusEffect } from '@react-navigation/native';
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
  obterConfiguracoes,
  atualizarConfiguracoes,
} from '../services/auth';

import {
  espacamentos,
  tipografia,
} from '../theme';

import { useTema } from '../theme/useTema';

// ============================================================
// RÓTULOS
// ============================================================

const idiomas = {
  'pt-BR': 'Português',
  es: 'Español',
  en: 'English',
};

const temas = {
  claro: 'Claro',
  escuro: 'Escuro',
};

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

  return `${coords.latitude.toFixed(5)}, ${coords.longitude.toFixed(5)}`;
}

// ============================================================
// SCREEN — CONFIGURAÇÕES
// ============================================================

export function ConfiguracoesScreen({ navigation }) {

  const { cores } = useTema();

const estilos = useMemo(
  () => criarEstilos(cores),
  [cores]
);

  const {
    alterarIdioma,
    alterarTema,
    carregarPreferencias,
  } = usePreferencias();

  const [configuracoes, setConfiguracoes] =
    useState(null);

  const [permissoes, setPermissoes] =
    useState(null);

  const [localizacao, setLocalizacao] =
    useState(null);

  const [ocupado, setOcupado] =
    useState('');

  const [erro, setErro] =
    useState('');

  // ==========================================================
  // CARREGAR CONFIGURAÇÕES
  // ==========================================================

  const carregarDados = useCallback(async () => {
    setErro('');

    try {
      const [
        dadosConfiguracoes,
        permissoesAtuais,
        localizacaoSalva,
      ] = await Promise.all([
        obterConfiguracoes(),
        statusPermissoes(),
        obterLocalizacaoSalva(),
      ]);

      setConfiguracoes(dadosConfiguracoes);
      setPermissoes(permissoesAtuais);

      carregarPreferencias(dadosConfiguracoes);

      if (!dadosConfiguracoes.localizacaoPermitida) {
        await removerLocalizacao();
        setLocalizacao(null);
      } else {
        setLocalizacao(localizacaoSalva);
      }
    } catch (erro) {
      setErro(
        erro?.message ??
          'Não foi possível carregar as configurações.'
      );
    }
  }, [carregarPreferencias]);

  useFocusEffect(
    useCallback(() => {
      configurarNotificacoes();
      carregarDados();
    }, [carregarDados])
  );

  // ==========================================================
  // SALVAR CONFIGURAÇÕES
  // ==========================================================

  async function salvarConfiguracao(dados) {
    setOcupado('configuracoes');

    try {
      let resultado;

      if (dados.idioma !== undefined) {
        resultado = await alterarIdioma(dados.idioma);
      } else if (dados.tema !== undefined) {
        resultado = await alterarTema(dados.tema);
      } else {
        resultado = await atualizarConfiguracoes(dados);
      }

      setConfiguracoes(resultado);

      return resultado;
    } catch (erro) {
      Alert.alert(
        'Erro',
        erro?.message ??
          'Não foi possível atualizar as configurações.'
      );

      return null;
    } finally {
      setOcupado('');
    }
  }

  // ==========================================================
  // IDIOMA
  // ==========================================================

  function abrirIdioma() {
    Alert.alert(
      'Idioma',
      'Selecione seu idioma de preferência.',
      [
        {
          text: 'Português',
          onPress: () =>
            salvarConfiguracao({
              idioma: 'pt-BR',
            }),
        },
        {
          text: 'Español',
          onPress: () =>
            salvarConfiguracao({
              idioma: 'es',
            }),
        },
        {
          text: 'English',
          onPress: () =>
            salvarConfiguracao({
              idioma: 'en',
            }),
        },
      ],
      { cancelable: true }
    );
  }

  // ==========================================================
  // TEMA
  // ==========================================================

  function abrirTema() {
    Alert.alert(
      'Tema',
      'Selecione o tema de sua preferência.',
      [
        {
          text: 'Claro',
          onPress: () =>
            salvarConfiguracao({
              tema: 'claro',
            }),
        },
        {
          text: 'Escuro',
          onPress: () =>
            salvarConfiguracao({
              tema: 'escuro',
            }),
        },
        {
          text: 'Cancelar',
          style: 'cancel',
        },
      ]
    );
  }

  // ==========================================================
  // NOTIFICAÇÕES
  // ==========================================================

  async function alterarNotificacoes(valor) {
    await salvarConfiguracao({
      notificacoesAtivas: valor,
    });
  }

  async function testarNotificacao() {
    if (!configuracoes?.notificacoesAtivas) {
      Alert.alert(
        'Notificações',
        'Ative as notificações antes de realizar o teste.'
      );

      return;
    }

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

      setPermissoes(
        await statusPermissoes()
      );
    } catch (erro) {
      Alert.alert(
        'Notificações',
        erro?.message ??
          'Não foi possível enviar a notificação.'
      );
    } finally {
      setOcupado('');
    }
  }

  // ==========================================================
  // PREFERÊNCIA DE LOCALIZAÇÃO
  // ==========================================================

  async function alterarPermissaoLocalizacao(valor) {
    setOcupado('configuracoes');

    try {
      const resultado =
        await atualizarConfiguracoes({
          localizacaoPermitida: valor,
        });

      setConfiguracoes(resultado);

      if (!valor) {
        await removerLocalizacao();
        setLocalizacao(null);
      }
    } catch (erro) {
      Alert.alert(
        'Erro',
        erro?.message ??
          'Não foi possível atualizar a localização.'
      );
    } finally {
      setOcupado('');
    }
  }

  // ==========================================================
  // LOCALIZAÇÃO GPS
  // ==========================================================

  async function atualizarLocalizacao() {
    if (!configuracoes?.localizacaoPermitida) {
      Alert.alert(
        'Localização',
        'Ative a localização nas configurações.'
      );

      return;
    }

    setOcupado('gps');
    setErro('');

    try {
      const posicao =
        await obterPosicao();

      await salvarLocalizacao(posicao);

      setLocalizacao(posicao);

      setPermissoes(
        await statusPermissoes()
      );
    } catch (erro) {
      Alert.alert(
        'Localização',
        erro?.message ??
          'Não foi possível obter sua localização.'
      );
    } finally {
      setOcupado('');
    }
  }

  // ==========================================================
  // REMOVER LOCALIZAÇÃO
  // ==========================================================

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
          onPress: removerLocalizacaoSalva,
        },
      ]
    );
  }

  async function removerLocalizacaoSalva() {
    try {
      await removerLocalizacao();

      setLocalizacao(null);
    } catch (erro) {
      Alert.alert(
        'Erro',
        'Não foi possível remover a localização salva.'
      );
    }
  }

  // ==========================================================
  // PRIVACIDADE
  // ==========================================================

  function abrirPrivacidade() {
    Alert.alert(
      'Privacidade',
      'Suas preferências são vinculadas à sua conta. ' +
        'A localização GPS é armazenada apenas neste dispositivo. ' +
        'Você pode removê-la a qualquer momento. ' +
        'As fotos de perfil são armazenadas no servidor e podem ' +
        'ser acessadas por quem possuir o endereço da imagem.',
      [
        {
          text: 'OK',
        },
      ]
    );
  }

  // ==========================================================
  // SOBRE O APP
  // ==========================================================

  function abrirSobre() {
    Alert.alert(
      'InterChapecó',
      'Versão 1.0'
    );
  }

  const trabalhando = !!ocupado;

  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <ScreenTemplate
      titulo="Configurações"
      aoVoltar={() => navigation.goBack()}
    >

      {!!erro && (
        <View>
          <Text style={estilos.erro}>
            {erro}
          </Text>

          <Pressable
            onPress={carregarDados}
            style={estilos.botaoSecundario}
          >
            <Text style={estilos.botaoSecundarioTexto}>
              Tentar novamente
            </Text>
          </Pressable>
        </View>
      )}

      {!configuracoes || !permissoes ? (
        !erro && (
          <ActivityIndicator
            color={cores.primaria}
            style={estilos.carregando}
          />
        )
      ) : (
        <>
          <View style={estilos.menu}>

            <OpcaoConfiguracao
              titulo="Idioma"
              valor={
                idiomas[configuracoes.idioma] ??
                'Português'
              }
              aoPressionar={abrirIdioma}
              desabilitado={trabalhando}
            />

            <OpcaoInterruptor
              titulo="Notificações"
              valor={configuracoes.notificacoesAtivas}
              aoMudar={alterarNotificacoes}
              desabilitado={trabalhando}
            />

            <OpcaoInterruptor
              titulo="Localização"
              valor={configuracoes.localizacaoPermitida}
              aoMudar={alterarPermissaoLocalizacao}
              desabilitado={trabalhando}
            />

            <OpcaoConfiguracao
              titulo="Privacidade"
              aoPressionar={abrirPrivacidade}
              desabilitado={trabalhando}
            />

            <OpcaoConfiguracao
              titulo="Tema"
              valor={
                temas[configuracoes.tema] ??
                'Claro'
              }
              aoPressionar={abrirTema}
              desabilitado={trabalhando}
            />

            <OpcaoConfiguracao
              titulo="Sobre o app"
              valor="v1.0"
              aoPressionar={abrirSobre}
              desabilitado={trabalhando}
            />

          </View>

          {/* NOTIFICAÇÕES */}

          <View style={estilos.secaoLocalizacao}>

            <Text style={estilos.tituloSecao}>
              Notificações
            </Text>

            <Text style={estilos.textoSecundario}>
              Permissão do dispositivo:{' '}
              {rotuloPermissao(
                permissoes.notificacoes
              )}
            </Text>

            <View style={estilos.acoesLocalizacao}>

              <Pressable
                onPress={testarNotificacao}
                disabled={
                  trabalhando ||
                  !configuracoes.notificacoesAtivas
                }
                style={({ pressed }) => [
                  estilos.botaoPrincipal,

                  pressed &&
                    estilos.pressionado,

                  (
                    trabalhando ||
                    !configuracoes.notificacoesAtivas
                  ) && estilos.desabilitado,
                ]}
              >
                <Ionicons
                  name="notifications-outline"
                  size={18}
                  color={cores.textoBotaoPrincipal}
                />

                <Text style={estilos.botaoPrincipalTexto}>
                  {ocupado === 'notificacao'
                    ? 'Enviando...'
                    : 'Testar notificação'}
                </Text>

              </Pressable>

            </View>

          </View>

          {/* LOCALIZAÇÃO */}

          <View style={estilos.secaoLocalizacao}>

            <Text style={estilos.tituloSecao}>
              Localização salva
            </Text>

            <Text style={estilos.textoSecundario}>
              Permissão do dispositivo:{' '}
              {rotuloPermissao(
                permissoes.localizacao
              )}
            </Text>

            <Text style={estilos.localizacaoTexto}>
              {formatarGps(localizacao)}
            </Text>

            {localizacao?.precisao != null && (
              <Text style={estilos.textoSecundario}>
                Precisão aproximada:{' '}
                {Math.round(localizacao.precisao)}{' '}
                metros
              </Text>
            )}

            <View style={estilos.acoesLocalizacao}>

              <Pressable
                onPress={atualizarLocalizacao}
                disabled={
                  trabalhando ||
                  !configuracoes.localizacaoPermitida
                }
                style={({ pressed }) => [
                  estilos.botaoPrincipal,

                  pressed &&
                    estilos.pressionado,

                  (
                    trabalhando ||
                    !configuracoes.localizacaoPermitida
                  ) && estilos.desabilitado,
                ]}
              >
                <Ionicons
                  name="location-outline"
                  size={18}
                  color={cores.textoBotaoPrincipal}
                />

                <Text style={estilos.botaoPrincipalTexto}>
                  {ocupado === 'gps'
                    ? 'Obtendo...'
                    : 'Atualizar localização'}
                </Text>

              </Pressable>

              {!!localizacao && (
                <Pressable
                  onPress={confirmarRemocaoLocalizacao}
                  disabled={trabalhando}
                  style={({ pressed }) => [
                    estilos.botaoSecundario,

                    pressed &&
                      estilos.pressionado,
                  ]}
                >
                  <Text style={estilos.botaoSecundarioTexto}>
                    Remover
                  </Text>
                </Pressable>
              )}

            </View>

          </View>
        </>
      )}

    </ScreenTemplate>
  );

}

// ============================================================
// OPÇÃO DE CONFIGURAÇÃO
// ============================================================

function OpcaoConfiguracao({
  titulo,
  valor,
  aoPressionar,
  desabilitado = false,
}) {

  const { cores } = useTema();

const estilos = useMemo(
  () => criarEstilos(cores),
  [cores]
);


  return (
    <Pressable
      onPress={aoPressionar}
      disabled={desabilitado}
      style={({ pressed }) => [
        estilos.opcao,
        pressed && estilos.pressionado,
        desabilitado && estilos.desabilitado,
      ]}
    >
      <Text style={estilos.opcaoTitulo}>
        {titulo}
      </Text>

      <View style={estilos.opcaoDireita}>

        {!!valor && (
          <Text style={estilos.opcaoValor}>
            {valor}
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

// ============================================================
// INTERRUPTOR
// ============================================================

function OpcaoInterruptor({
  titulo,
  valor,
  aoMudar,
  desabilitado = false,
}) {

  const { cores } = useTema();

const estilos = useMemo(
  () => criarEstilos(cores),
  [cores]
);

  return (
    <View style={estilos.opcao}>

      <Text style={estilos.opcaoTitulo}>
        {titulo}
      </Text>

      <Switch
        value={valor}
        onValueChange={aoMudar}
        disabled={desabilitado}
        trackColor={{
        false: cores.interruptorInativo,
        true: cores.interruptorAtivo,
        }}
        thumbColor={cores.interruptorControle}
      />

    </View>
  );
}

// ============================================================
// ESTILOS
// ============================================================

function criarEstilos(cores) {
  return StyleSheet.create({  carregando: {
    marginTop: espacamentos.xl,
  },

  erro: {
    color: cores.perigo,
    marginBottom: espacamentos.md,
    fontSize: tipografia.legenda,
  },

  menu: {
    marginTop: espacamentos.lg,
  },

  opcao: {
    minHeight: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: cores.borda,
    paddingHorizontal: 2,
  },

  opcaoTitulo: {
    fontSize: tipografia.corpo,
    fontWeight: '600',
    color: cores.texto,
  },

  opcaoDireita: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: espacamentos.sm,
  },

  opcaoValor: {
    fontSize: tipografia.legenda,
    color: cores.textoSecundario,
  },

  secaoLocalizacao: {
    marginTop: espacamentos.xl,
    borderWidth: 1,
    borderColor: cores.borda,
    backgroundColor: cores.superficie,
    padding: espacamentos.md,
  },

  tituloSecao: {
    fontSize: tipografia.subtitulo,
    fontWeight: '700',
    color: cores.texto,
    marginBottom: espacamentos.sm,
  },

  localizacaoTexto: {
    fontSize: tipografia.corpo,
    color: cores.texto,
    marginTop: espacamentos.sm,
    marginBottom: espacamentos.xs,
  },

  textoSecundario: {
    fontSize: tipografia.legenda,
    color: cores.textoSecundario,
  },

  acoesLocalizacao: {
    marginTop: espacamentos.md,
    gap: espacamentos.sm,
  },

  botaoPrincipal: {
    minHeight: 44,
    flexDirection: 'row',
    gap: 7,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: cores.botaoPrincipal,
  },

  botaoPrincipalTexto: {
    fontSize: tipografia.legenda,
    fontWeight: '700',
    color: cores.textoBotaoPrincipal,
  },

  botaoSecundario: {
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: cores.borda,
    backgroundColor: cores.superficie,
  },

  botaoSecundarioTexto: {
    fontSize: tipografia.legenda,
    fontWeight: '600',
    color: cores.perigo,
  },

  pressionado: {
    opacity: 0.6,
  },

  desabilitado: {
    opacity: 0.5,
  },
  });
}