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



function rotuloPermissao(status, grupo1Traducao) {
  if (status === 'granted') {
    return grupo1Traducao('grupo1.permitida');
  }

  if (status === 'denied') {
    return grupo1Traducao('grupo1.negada');
  }

  if (status === 'undetermined') {
    return grupo1Traducao('grupo1.nao_solicitada');
  }

  if (status === 'indisponivel') {
    return grupo1Traducao('grupo1.indisponivel');
  }

  return '—';
}

function formatarGps(coords, grupo1Traducao) {
  if (!coords) {
    return grupo1Traducao('grupo1.nenhuma_localizacao_salva');
  }

  return `${coords.latitude.toFixed(5)}, ${coords.longitude.toFixed(5)}`;
}

// ============================================================
// SCREEN — CONFIGURAÇÕES
// ============================================================

export function ConfiguracoesScreen({ navigation }) {
  const { t: grupo1Traducao } = usePreferencias();

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
        grupo1Traducao('mensagens.servidor', { mensagem: erro?.message, opcional: true }) ??
          grupo1Traducao('grupo1.nao_foi_possivel_carregar_as_configuracoes')
      );
    }
  }, [carregarPreferencias, grupo1Traducao]);

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
        grupo1Traducao('grupo1.erro'),
        grupo1Traducao('mensagens.servidor', { mensagem: erro?.message, opcional: true }) ??
          grupo1Traducao('grupo1.nao_foi_possivel_atualizar_as_configuracoes')
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
      grupo1Traducao('grupo1.idioma'),
      grupo1Traducao('grupo1.selecione_seu_idioma_de_preferencia'),
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
      grupo1Traducao('grupo1.tema'),
      grupo1Traducao('grupo1.selecione_o_tema_de_sua_preferencia'),
      [
        {
          text: grupo1Traducao('grupo1.claro'),
          onPress: () =>
            salvarConfiguracao({
              tema: 'claro',
            }),
        },
        {
          text: grupo1Traducao('grupo1.escuro'),
          onPress: () =>
            salvarConfiguracao({
              tema: 'escuro',
            }),
        },
        {
          text: grupo1Traducao('grupo1.cancelar'),
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
        grupo1Traducao('grupo1.notificacoes'),
        grupo1Traducao('grupo1.ative_as_notificacoes_antes_de_realizar_o_teste')
      );

      return;
    }

    setOcupado('notificacao');

    try {
      await enviarAvisoLocal({
        titulo: 'InterChapecó',
        corpo:
          grupo1Traducao('grupo1.as_notificacoes_estao_funcionando_corretamente'),
      });

      Alert.alert(
        grupo1Traducao('grupo1.notificacao_enviada'),
        grupo1Traducao('grupo1.a_notificacao_devera_aparecer_em_alguns_segundos')
      );

      setPermissoes(
        await statusPermissoes()
      );
    } catch (erro) {
      Alert.alert(
        grupo1Traducao('grupo1.notificacoes'),
        grupo1Traducao('mensagens.servidor', { mensagem: erro?.message, opcional: true }) ??
          grupo1Traducao('grupo1.nao_foi_possivel_enviar_a_notificacao')
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
        grupo1Traducao('grupo1.erro'),
        grupo1Traducao('mensagens.servidor', { mensagem: erro?.message, opcional: true }) ??
          grupo1Traducao('grupo1.nao_foi_possivel_atualizar_a_localizacao')
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
        grupo1Traducao('grupo1.localizacao'),
        grupo1Traducao('grupo1.ative_a_localizacao_nas_configuracoes')
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
        grupo1Traducao('grupo1.localizacao'),
        grupo1Traducao('mensagens.servidor', { mensagem: erro?.message, opcional: true }) ??
          grupo1Traducao('grupo1.nao_foi_possivel_obter_sua_localizacao')
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
      grupo1Traducao('grupo1.remover_localizacao'),
      grupo1Traducao('grupo1.deseja_apagar_a_localizacao_salva'),
      [
        {
          text: grupo1Traducao('grupo1.cancelar'),
          style: 'cancel',
        },
        {
          text: grupo1Traducao('grupo1.remover'),
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
        grupo1Traducao('grupo1.erro'),
        grupo1Traducao('grupo1.nao_foi_possivel_remover_a_localizacao_salva')
      );
    }
  }

  // ==========================================================
  // PRIVACIDADE
  // ==========================================================

  function abrirPrivacidade() {
    Alert.alert(
      grupo1Traducao('grupo1.privacidade'),
      grupo1Traducao('grupo1.suas_preferencias_sao_vinculadas_a_sua_conta') +
        grupo1Traducao('grupo1.a_localizacao_gps_e_armazenada_apenas_neste_dispositivo') +
        grupo1Traducao('grupo1.voce_pode_remove_la_a_qualquer_momento') +
        grupo1Traducao('grupo1.as_fotos_de_perfil_sao_armazenadas_no_servidor_e_podem') +
        grupo1Traducao('grupo1.ser_acessadas_por_quem_possuir_o_endereco_da_imagem'),
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
      grupo1Traducao('grupo1.versao_1_0')
    );
  }

  const trabalhando = !!ocupado;

  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <ScreenTemplate
      titulo={grupo1Traducao('grupo1.configuracoes')}
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
            <Text style={estilos.botaoSecundarioTexto}>{grupo1Traducao('grupo1.tentar_novamente')}{' '}</Text>
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
              titulo={grupo1Traducao('grupo1.idioma')}
              valor={
                idiomas[configuracoes.idioma] ??
                'Português'
              }
              aoPressionar={abrirIdioma}
              desabilitado={trabalhando}
            />

            <OpcaoInterruptor
              titulo={grupo1Traducao('grupo1.notificacoes')}
              valor={configuracoes.notificacoesAtivas}
              aoMudar={alterarNotificacoes}
              desabilitado={trabalhando}
            />

            <OpcaoInterruptor
              titulo={grupo1Traducao('grupo1.localizacao')}
              valor={configuracoes.localizacaoPermitida}
              aoMudar={alterarPermissaoLocalizacao}
              desabilitado={trabalhando}
            />

            <OpcaoConfiguracao
              titulo={grupo1Traducao('grupo1.privacidade')}
              aoPressionar={abrirPrivacidade}
              desabilitado={trabalhando}
            />

            <OpcaoConfiguracao
              titulo={grupo1Traducao('grupo1.tema')}
              valor={
                configuracoes.tema === 'escuro' ? grupo1Traducao('grupo1.escuro') : grupo1Traducao('grupo1.claro')
              }
              aoPressionar={abrirTema}
              desabilitado={trabalhando}
            />

            <OpcaoConfiguracao
              titulo={grupo1Traducao('grupo1.sobre_o_app')}
              valor="v1.0"
              aoPressionar={abrirSobre}
              desabilitado={trabalhando}
            />

          </View>

          {/* NOTIFICAÇÕES */}

          <View style={estilos.secaoLocalizacao}>

            <Text style={estilos.tituloSecao}>{grupo1Traducao('grupo1.notificacoes')}{' '}</Text>

            <Text style={estilos.textoSecundario}>{grupo1Traducao('grupo1.permissao_do_dispositivo')}{' '}
              {rotuloPermissao(
                permissoes.notificacoes, grupo1Traducao
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
                    ? grupo1Traducao('grupo1.enviando')
                    : grupo1Traducao('grupo1.testar_notificacao')}
                </Text>

              </Pressable>

            </View>

          </View>

          {/* LOCALIZAÇÃO */}

          <View style={estilos.secaoLocalizacao}>

            <Text style={estilos.tituloSecao}>{grupo1Traducao('grupo1.localizacao_salva')}{' '}</Text>

            <Text style={estilos.textoSecundario}>{grupo1Traducao('grupo1.permissao_do_dispositivo')}{' '}
              {rotuloPermissao(
                permissoes.localizacao, grupo1Traducao
              )}
            </Text>

            <Text style={estilos.localizacaoTexto}>
              {formatarGps(localizacao, grupo1Traducao)}
            </Text>

            {localizacao?.precisao != null && (
              <Text style={estilos.textoSecundario}>{grupo1Traducao('grupo1.precisao_aproximada')}{' '}
                {Math.round(localizacao.precisao)}{' '}{grupo1Traducao('grupo1.metros')}{' '}</Text>
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
                    ? grupo1Traducao('grupo1.obtendo')
                    : grupo1Traducao('grupo1.atualizar_localizacao')}
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
                  <Text style={estilos.botaoSecundarioTexto}>{grupo1Traducao('grupo1.remover')}{' '}</Text>
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