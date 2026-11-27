import { usePreferencias } from '../contexts/PreferenciasContext';
// SCREEN — Editar perfil

import { useEffect, useMemo, useState } from 'react';

import {
  Alert,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import { ScreenTemplate } from '../components/templates/ScreenTemplate';
import { CampoSelecao } from '../components/molecules/CampoSelecao';

import {
  capturarFoto,
  escolherImagem,
} from '../services/nativos';

import {
  atualizarPerfil,
  atualizarFotoPerfil,
  removerFotoPerfil,
} from '../services/auth';

import {
  obterPaises,
  obterUniversidadesPorPais,
  obterUniversidadesChapeco,
} from '../services/api';

import {
  espacamentos,
  raios,
  tipografia,
} from '../theme';

import { useTema } from '../theme/useTema';

export function EditarPerfilScreen({ navigation, route }) {
  const { t: grupo1Traducao } = usePreferencias();
  const { cores } = useTema();

  const estilos = useMemo(
    () => criarEstilos(cores),
    [cores]
  );
  
  const usuario = route.params?.usuario;

  // ==========================================================
  // DADOS DO USUÁRIO
  // ==========================================================

  const [nome, setNome] =
    useState(usuario?.nome ?? '');

  const [email, setEmail] =
    useState(usuario?.email ?? '');

  const [paises, setPaises] =
    useState([]);

  const [universidadesOrigem, setUniversidadesOrigem] =
    useState([]);

  const [universidadesDestino, setUniversidadesDestino] =
    useState([]);

  const [paisSelecionado, setPaisSelecionado] =
    useState(usuario?.paisOrigem ?? null);

  const [
    universidadeOrigemSelecionada,
    setUniversidadeOrigemSelecionada,
  ] = useState(usuario?.universidadeOrigem ?? null);

  const [
    universidadeDestinoSelecionada,
    setUniversidadeDestinoSelecionada,
  ] = useState(usuario?.universidadeDestino ?? null);

  // ==========================================================
  // FOTO E ESTADOS
  // ==========================================================

  const [fotoUri, setFotoUri] =
    useState(usuario?.fotoUrl ?? null);

  const [ocupado, setOcupado] =
    useState('');

  const [salvando, setSalvando] =
    useState(false);

  const [carregandoDados, setCarregandoDados] =
    useState(true);

  // ==========================================================
  // CARREGAR CATÁLOGOS
  // ==========================================================

  useEffect(() => {
    async function carregarDados() {
      try {
        const [listaPaises, listaDestino] =
          await Promise.all([
            obterPaises(),
            obterUniversidadesChapeco(),
          ]);

        setPaises(listaPaises);
        setUniversidadesDestino(listaDestino);

        if (usuario?.paisOrigem?.id) {
          const listaOrigem =
            await obterUniversidadesPorPais(
              usuario.paisOrigem.id
            );

          setUniversidadesOrigem(listaOrigem);
        }
      } catch (erro) {
        Alert.alert(
          grupo1Traducao('grupo1.erro'),
          erro?.message ??
            grupo1Traducao('grupo1.nao_foi_possivel_carregar_os_dados')
        );
      } finally {
        setCarregandoDados(false);
      }
    }

    carregarDados();
  }, [usuario?.paisOrigem?.id]);

  // ==========================================================
  // VALIDAÇÕES
  // ==========================================================

  function contemLetras(valor) {
    return /[A-Za-zÀ-ÿ]/.test(valor);
  }

  function emailValido(valor) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor);
  }

  // ==========================================================
  // PAÍS
  // ==========================================================

  async function selecionarPais(nomePais) {
    const pais = paises.find(
      (item) => item.nome === nomePais
    );

    if (!pais) {
      return;
    }

    setPaisSelecionado(pais);
    setUniversidadeOrigemSelecionada(null);
    setUniversidadesOrigem([]);

    try {
      const universidades =
        await obterUniversidadesPorPais(pais.id);

      setUniversidadesOrigem(universidades);
    } catch (erro) {
      Alert.alert(
        grupo1Traducao('grupo1.erro'),
        erro?.message ??
          grupo1Traducao('grupo1.nao_foi_possivel_carregar_as_universidades')
      );
    }
  }

  // ==========================================================
  // UNIVERSIDADE DE ORIGEM
  // ==========================================================

  function selecionarUniversidadeOrigem(nomeUniversidade) {
    const universidade = universidadesOrigem.find(
      (item) => item.nome === nomeUniversidade
    );

    if (!universidade) {
      return;
    }

    setUniversidadeOrigemSelecionada(universidade);
  }

  // ==========================================================
  // UNIVERSIDADE DE DESTINO
  // ==========================================================

  function selecionarUniversidadeDestino(nomeUniversidade) {
    const universidade = universidadesDestino.find(
      (item) => item.nome === nomeUniversidade
    );

    if (!universidade) {
      return;
    }

    setUniversidadeDestinoSelecionada(universidade);
  }

  // ==========================================================
  // FOTO — ENVIAR PARA O BACKEND
  // ==========================================================

  async function enviarImagem(imagem) {
    if (!imagem?.uri) {
      return;
    }

    const novaFotoUrl =
      await atualizarFotoPerfil(imagem);

    setFotoUri(novaFotoUrl);
  }

  // ==========================================================
  // FOTO — CÂMERA
  // ==========================================================

  async function tirarFoto() {
    setOcupado('camera');

    try {
      const resultado = await capturarFoto();

      if (resultado?.uri) {
        setOcupado('enviando');

        await enviarImagem(resultado);
      }
    } catch (erro) {
      Alert.alert(
        grupo1Traducao('grupo1.erro'),
        erro?.message ??
          grupo1Traducao('grupo1.nao_foi_possivel_atualizar_a_foto')
      );
    } finally {
      setOcupado('');
    }
  }

  // ==========================================================
  // FOTO — GALERIA
  // ==========================================================

  async function abrirGaleria() {
    setOcupado('galeria');

    try {
      const resultado = await escolherImagem();

      if (resultado?.uri) {
        setOcupado('enviando');

        await enviarImagem(resultado);
      }
    } catch (erro) {
      Alert.alert(
        grupo1Traducao('grupo1.erro'),
        erro?.message ??
          grupo1Traducao('grupo1.nao_foi_possivel_atualizar_a_foto')
      );
    } finally {
      setOcupado('');
    }
  }

  // ==========================================================
  // REMOVER FOTO
  // ==========================================================

  function confirmarRemocaoFoto() {
    Alert.alert(
      grupo1Traducao('grupo1.remover_foto'),
      grupo1Traducao('grupo1.deseja_remover_a_foto_do_perfil'),
      [
        {
          text: grupo1Traducao('grupo1.cancelar'),
          style: 'cancel',
        },
        {
          text: grupo1Traducao('grupo1.remover'),
          style: 'destructive',
          onPress: removerFoto,
        },
      ]
    );
  }

  async function removerFoto() {
    setOcupado('removendo');

    try {
      await removerFotoPerfil();

      setFotoUri(null);
    } catch (erro) {
      Alert.alert(
        grupo1Traducao('grupo1.erro'),
        erro?.message ??
          grupo1Traducao('grupo1.nao_foi_possivel_remover_a_foto')
      );
    } finally {
      setOcupado('');
    }
  }

  // ==========================================================
  // SALVAR PERFIL
  // ==========================================================

  async function salvarAlteracoes() {
    const nomeLimpo = nome.trim();

    const emailLimpo =
      email.trim().toLowerCase();

    if (
      nomeLimpo.length < 3 ||
      !contemLetras(nomeLimpo)
    ) {
      Alert.alert(
        grupo1Traducao('grupo1.nome_invalido'),
        grupo1Traducao('grupo1.informe_um_nome_valido')
      );

      return;
    }

    if (!paisSelecionado) {
      Alert.alert(
        grupo1Traducao('grupo1.pais_invalido'),
        grupo1Traducao('grupo1.selecione_seu_pais_de_origem')
      );

      return;
    }

    if (!universidadeOrigemSelecionada) {
      Alert.alert(
        grupo1Traducao('grupo1.universidade_invalida'),
        grupo1Traducao('grupo1.selecione_sua_universidade_de_origem')
      );

      return;
    }

    if (!universidadeDestinoSelecionada) {
      Alert.alert(
        grupo1Traducao('grupo1.universidade_invalida'),
        grupo1Traducao('grupo1.selecione_sua_universidade_em_chapeco')
      );

      return;
    }

    if (!emailValido(emailLimpo)) {
      Alert.alert(
        grupo1Traducao('grupo1.e_mail_invalido'),
        grupo1Traducao('grupo1.informe_um_endereco_de_e_mail_valido')
      );

      return;
    }

    try {
      setSalvando(true);

      await atualizarPerfil({
        nome: nomeLimpo,

        paisOrigemId:
          paisSelecionado.id,

        universidadeOrigemId:
          universidadeOrigemSelecionada.id,

        universidadeDestinoId:
          universidadeDestinoSelecionada.id,

        email: emailLimpo,
      });

      Alert.alert(
        grupo1Traducao('grupo1.perfil_atualizado'),
        grupo1Traducao('grupo1.suas_alteracoes_foram_salvas_com_sucesso'),
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } catch (erro) {
      Alert.alert(
        grupo1Traducao('grupo1.erro'),
        erro?.message ??
          grupo1Traducao('grupo1.nao_foi_possivel_atualizar_o_perfil')
      );
    } finally {
      setSalvando(false);
    }
  }

  const trabalhando =
    !!ocupado || salvando || carregandoDados;

  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <ScreenTemplate
      titulo={grupo1Traducao('grupo1.editar_perfil_55')}
      aoVoltar={() => {
        if (!ocupado && !salvando) {
          navigation.goBack();
        }
      }}
    >
      {/* FOTO */}

      <View style={estilos.areaFoto}>

        {fotoUri ? (
          <Image
            source={{ uri: fotoUri }}
            style={estilos.fotoPerfil}
          />
        ) : (
          <View style={estilos.fotoVazia}>
            <Ionicons
              name="person-outline"
              size={48}
              color={cores.textoSecundario}
            />
          </View>
        )}

        <Text style={estilos.tituloFoto}>{grupo1Traducao('grupo1.foto_de_perfil')}{' '}</Text>

        {ocupado === 'enviando' && (
          <Text style={estilos.statusFoto}>{grupo1Traducao('grupo1.enviando_foto')}{' '}</Text>
        )}

        {ocupado === 'removendo' && (
          <Text style={estilos.statusFoto}>{grupo1Traducao('grupo1.removendo_foto')}{' '}</Text>
        )}

        <View style={estilos.botoesFoto}>

          <Pressable
            onPress={tirarFoto}
            disabled={trabalhando}
            style={({ pressed }) => [
              estilos.botaoFoto,
              pressed && estilos.pressionado,
              trabalhando && estilos.desabilitado,
            ]}
          >
          <Ionicons
            name="camera-outline"
            size={18}
            color={cores.textoBotaoPrincipal}
          />

            <Text style={estilos.botaoFotoTexto}>
              {ocupado === 'camera'
                ? grupo1Traducao('grupo1.abrindo')
                : grupo1Traducao('grupo1.tirar_foto')}
            </Text>
          </Pressable>

          <Pressable
            onPress={abrirGaleria}
            disabled={trabalhando}
            style={({ pressed }) => [
              estilos.botaoGaleria,
              pressed && estilos.pressionado,
              trabalhando && estilos.desabilitado,
            ]}
          >
            <Ionicons
              name="images-outline"
              size={18}
              color={cores.texto}
            />

            <Text style={estilos.botaoGaleriaTexto}>
              {ocupado === 'galeria'
                ? grupo1Traducao('grupo1.abrindo')
                : grupo1Traducao('grupo1.galeria')}
            </Text>
          </Pressable>

        </View>

        {!!fotoUri && (
          <Pressable
            onPress={confirmarRemocaoFoto}
            disabled={trabalhando}
            style={({ pressed }) => [
              estilos.botaoRemoverFoto,
              pressed && estilos.pressionado,
              trabalhando && estilos.desabilitado,
            ]}
          >
            <Text style={estilos.botaoRemoverFotoTexto}>{grupo1Traducao('grupo1.remover_foto')}{' '}</Text>
          </Pressable>
        )}

      </View>

      {/* FORMULÁRIO */}

      <View style={estilos.formulario}>

        <View style={estilos.campo}>

          <Text style={estilos.rotulo}>{grupo1Traducao('grupo1.nome_completo')}{' '}</Text>

          <TextInput
            value={nome}
            onChangeText={setNome}
            placeholder="Laura Gómez"
            placeholderTextColor={cores.textoSecundario}
            style={estilos.input}
            maxLength={80}
            autoCapitalize="words"
          />

        </View>

        <CampoSelecao
          rotulo={grupo1Traducao('grupo1.pais_de_origem_89')}
          opcoes={paises.map((pais) => pais.nome)}
          valor={
            paisSelecionado?.nome ||
            grupo1Traducao('grupo1.selecione_seu_pais')
          }
          aoMudar={selecionarPais}
          margemInferior={espacamentos.sm}
        />

        <CampoSelecao
          rotulo={grupo1Traducao('grupo1.universidade_de_origem_90')}
          opcoes={
            universidadesOrigem.map(
              (universidade) => universidade.nome
            )
          }
          valor={
            universidadeOrigemSelecionada?.nome ||
            grupo1Traducao('grupo1.selecione_sua_universidade')
          }
          aoMudar={selecionarUniversidadeOrigem}
          margemInferior={espacamentos.sm}
        />

        <CampoSelecao
          rotulo={grupo1Traducao('grupo1.universidade_em_chapeco_91')}
          opcoes={
            universidadesDestino.map(
              (universidade) => universidade.nome
            )
          }
          valor={
            universidadeDestinoSelecionada?.nome ||
            grupo1Traducao('grupo1.selecione_a_universidade')
          }
          aoMudar={selecionarUniversidadeDestino}
          margemInferior={espacamentos.sm}
        />

        <View style={estilos.campo}>

          <Text style={estilos.rotulo}>{grupo1Traducao('grupo1.e_mail')}{' '}</Text>

          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="laura@gmail.com"
            placeholderTextColor={cores.textoSecundario}
            style={estilos.input}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            maxLength={120}
          />

        </View>

      </View>

      {/* GUARDAR ALTERAÇÕES */}

      <View style={estilos.areaBotao}>

        <Pressable
          onPress={salvarAlteracoes}
          disabled={trabalhando}
          style={({ pressed }) => [
            estilos.botaoSalvar,
            pressed && estilos.pressionado,
            trabalhando && estilos.desabilitado,
          ]}
        >
          <Text style={estilos.botaoSalvarTexto}>
            {salvando
              ? grupo1Traducao('grupo1.salvando')
              : grupo1Traducao('grupo1.guardar_alteracoes')}
          </Text>
        </Pressable>

      </View>
    </ScreenTemplate>
  );
}

// ============================================================
// ESTILOS
// ============================================================

// ============================================================
// ESTILOS DINÂMICOS
// ============================================================

function criarEstilos(cores) {
  return StyleSheet.create({
    areaFoto: {
      alignItems: 'center',
      marginTop: espacamentos.lg,
      marginBottom: espacamentos.lg,
    },

    fotoPerfil: {
      width: 105,
      height: 105,
      borderRadius: 53,
      backgroundColor: cores.superficie,
      marginBottom: espacamentos.sm,
    },

    fotoVazia: {
      width: 105,
      height: 105,
      borderRadius: 53,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: cores.superficieSecundaria,
      marginBottom: espacamentos.sm,
    },

    tituloFoto: {
      fontSize: tipografia.legenda,
      fontWeight: '700',
      color: cores.texto,
      marginBottom: espacamentos.sm,
    },

    statusFoto: {
      fontSize: tipografia.legenda,
      color: cores.textoSecundario,
      marginBottom: espacamentos.sm,
    },

    botoesFoto: {
      flexDirection: 'row',
      gap: espacamentos.sm,
      width: '100%',
    },

    botaoFoto: {
      flex: 1,
      minHeight: 42,
      flexDirection: 'row',
      gap: 6,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: raios.sm,
      backgroundColor: cores.botaoPrincipal,
    },

    botaoFotoTexto: {
      fontSize: tipografia.legenda,
      fontWeight: '700',
      color: cores.textoBotaoPrincipal,
    },

    botaoGaleria: {
      flex: 1,
      minHeight: 42,
      flexDirection: 'row',
      gap: 6,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: raios.sm,
      borderWidth: 1,
      borderColor: cores.borda,
      backgroundColor: cores.superficie,
    },

    botaoGaleriaTexto: {
      fontSize: tipografia.legenda,
      fontWeight: '700',
      color: cores.texto,
    },

    botaoRemoverFoto: {
      marginTop: espacamentos.sm,
      paddingVertical: 6,
      paddingHorizontal: espacamentos.md,
    },

    botaoRemoverFotoTexto: {
      fontSize: tipografia.legenda,
      color: cores.perigo,
      fontWeight: '600',
    },

    formulario: {
      gap: espacamentos.md,
    },

    campo: {
      gap: 6,
    },

    rotulo: {
      fontSize: tipografia.legenda,
      fontWeight: '700',
      color: cores.texto,
    },

    input: {
      minHeight: 46,
      backgroundColor: cores.superficie,
      borderWidth: 1,
      borderColor: cores.borda,
      borderRadius: raios.sm,
      paddingHorizontal: espacamentos.md,
      paddingVertical: espacamentos.sm,
      fontSize: tipografia.legenda,
      color: cores.texto,
    },

    areaBotao: {
      marginTop: espacamentos.xl,
      marginBottom: espacamentos.md,
    },

    botaoSalvar: {
      minHeight: 48,
      backgroundColor: cores.botaoPrincipal,
      borderRadius: raios.sm,
      alignItems: 'center',
      justifyContent: 'center',
    },

    botaoSalvarTexto: {
      fontSize: tipografia.legenda,
      fontWeight: '700',
      color: cores.textoBotaoPrincipal,
    },

    pressionado: {
      opacity: 0.6,
    },

    desabilitado: {
      opacity: 0.5,
    },
  });
}