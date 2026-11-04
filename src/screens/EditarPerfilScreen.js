// SCREEN — Editar perfil

import {
  useCallback,
  useState,
} from 'react';

import {
  Alert,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import {
  useFocusEffect,
} from '@react-navigation/native';

import { Ionicons } from '@expo/vector-icons';

import { ScreenTemplate } from '../components/templates/ScreenTemplate';

import {
  capturarFoto,
  escolherImagem,
} from '../services/nativos';

import {
  obterFotoLocal,
  removerFotoLocal,
  salvarFotoLocal,
  salvarUsuario,
} from '../services/storage';

import {
  cores,
  espacamentos,
  raios,
  tipografia,
} from '../theme';

export function EditarPerfilScreen({
  navigation,
  route,
}) {
  const usuario =
    route.params?.usuario ?? {};

  const [nome, setNome] =
    useState(usuario?.nome ?? '');

  const [pais, setPais] =
    useState(usuario?.pais ?? '');

  const [
    universidade,
    setUniversidade,
  ] = useState(
    usuario?.universidade ?? ''
  );

  const [email, setEmail] =
    useState(usuario?.email ?? '');

  const [fotoUri, setFotoUri] =
    useState(null);

  const [ocupado, setOcupado] =
    useState('');

  const [salvando, setSalvando] =
    useState(false);

  useFocusEffect(
    useCallback(() => {
      async function carregarFoto() {
        try {
          const fotoSalva =
            await obterFotoLocal();

          if (fotoSalva) {
            setFotoUri(fotoSalva);
          }
        } catch (erro) {
          console.log(
            'Erro ao carregar foto:',
            erro
          );
        }
      }

      carregarFoto();
    }, [])
  );

  function contemLetras(valor) {
    return /[A-Za-zÀ-ÿ]/.test(
      valor
    );
  }

  function emailValido(valor) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
      valor
    );
  }

  async function tirarFoto() {
    setOcupado('camera');

    try {
      const resultado =
        await capturarFoto();

      if (resultado?.uri) {
        setFotoUri(
          resultado.uri
        );

        await salvarFotoLocal(
          resultado.uri
        );
      }
    } catch (erro) {
      Alert.alert(
        'Erro',
        erro?.message ??
          'Não foi possível tirar a foto.'
      );
    } finally {
      setOcupado('');
    }
  }

  async function abrirGaleria() {
    setOcupado('galeria');

    try {
      const resultado =
        await escolherImagem();

      if (resultado?.uri) {
        setFotoUri(
          resultado.uri
        );

        await salvarFotoLocal(
          resultado.uri
        );
      }
    } catch (erro) {
      Alert.alert(
        'Erro',
        erro?.message ??
          'Não foi possível escolher a imagem.'
      );
    } finally {
      setOcupado('');
    }
  }

  function confirmarRemocaoFoto() {
    Alert.alert(
      'Remover foto',
      'Deseja remover a foto do perfil?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },

        {
          text: 'Remover',
          style: 'destructive',
          onPress: removerFoto,
        },
      ]
    );
  }

  async function removerFoto() {
    try {
      await removerFotoLocal();

      setFotoUri(null);
    } catch (erro) {
      Alert.alert(
        'Erro',
        'Não foi possível remover a foto.'
      );
    }
  }

  async function salvarAlteracoes() {
    const nomeLimpo =
      nome.trim();

    const paisLimpo =
      pais.trim();

    const universidadeLimpa =
      universidade.trim();

    const emailLimpo =
      email
        .trim()
        .toLowerCase();

    if (
      nomeLimpo.length < 3 ||
      !contemLetras(nomeLimpo)
    ) {
      Alert.alert(
        'Nome inválido',
        'Informe um nome válido.'
      );

      return;
    }

    if (
      paisLimpo.length < 3 ||
      !contemLetras(paisLimpo)
    ) {
      Alert.alert(
        'País inválido',
        'Informe um país válido.'
      );

      return;
    }

    if (
      universidadeLimpa.length <
        3 ||
      !contemLetras(
        universidadeLimpa
      )
    ) {
      Alert.alert(
        'Universidade inválida',
        'Informe uma universidade válida.'
      );

      return;
    }

    if (
      !emailValido(emailLimpo)
    ) {
      Alert.alert(
        'E-mail inválido',
        'Informe um endereço de e-mail válido.'
      );

      return;
    }

    const usuarioAtualizado = {
      ...usuario,

      nome:
        nomeLimpo,

      pais:
        paisLimpo,

      universidade:
        universidadeLimpa,

      email:
        emailLimpo,
    };

    try {
      setSalvando(true);

      await salvarUsuario(
        usuarioAtualizado
      );

      navigation.goBack();
    } catch (erro) {
      Alert.alert(
        'Erro',
        'Não foi possível atualizar o perfil.'
      );
    } finally {
      setSalvando(false);
    }
  }

  const trabalhando =
    !!ocupado || salvando;

  return (
    <ScreenTemplate
      titulo="Editar Perfil"
      aoVoltar={() =>
        navigation.goBack()
      }
    >
      {/* FOTO */}
      <View
        style={
          estilos.areaFoto
        }
      >
        {fotoUri ? (
          <Image
            source={{
              uri: fotoUri,
            }}
            style={
              estilos.fotoPerfil
            }
          />
        ) : (
          <View
            style={
              estilos.fotoVazia
            }
          >
            <Ionicons
              name="person-outline"
              size={48}
              color={
                cores.textoSecundario
              }
            />
          </View>
        )}

        <Text
          style={
            estilos.tituloFoto
          }
        >
          Foto de perfil
        </Text>

        <View
          style={
            estilos.botoesFoto
          }
        >
          <Pressable
            onPress={
              tirarFoto
            }
            disabled={
              trabalhando
            }
            style={({
              pressed,
            }) => [
              estilos.botaoFoto,

              pressed &&
                estilos.pressionado,

              trabalhando &&
                estilos.desabilitado,
            ]}
          >
            <Ionicons
              name="camera-outline"
              size={18}
              color="#FFFFFF"
            />

            <Text
              style={
                estilos.botaoFotoTexto
              }
            >
              {ocupado ===
              'camera'
                ? 'Abrindo...'
                : 'Tirar foto'}
            </Text>
          </Pressable>

          <Pressable
            onPress={
              abrirGaleria
            }
            disabled={
              trabalhando
            }
            style={({
              pressed,
            }) => [
              estilos.botaoGaleria,

              pressed &&
                estilos.pressionado,

              trabalhando &&
                estilos.desabilitado,
            ]}
          >
            <Ionicons
              name="images-outline"
              size={18}
              color={
                cores.texto
              }
            />

            <Text
              style={
                estilos.botaoGaleriaTexto
              }
            >
              {ocupado ===
              'galeria'
                ? 'Abrindo...'
                : 'Galeria'}
            </Text>
          </Pressable>
        </View>

        {!!fotoUri && (
          <Pressable
            onPress={
              confirmarRemocaoFoto
            }
            disabled={
              trabalhando
            }
            style={({
              pressed,
            }) => [
              estilos.botaoRemoverFoto,

              pressed &&
                estilos.pressionado,
            ]}
          >
            <Text
              style={
                estilos.botaoRemoverFotoTexto
              }
            >
              Remover foto
            </Text>
          </Pressable>
        )}
      </View>

      {/* FORMULÁRIO */}
      <View
        style={
          estilos.formulario
        }
      >
        <View
          style={estilos.campo}
        >
          <Text
            style={
              estilos.rotulo
            }
          >
            Nome completo
          </Text>

          <TextInput
            value={nome}
            onChangeText={
              setNome
            }
            placeholder="Laura Gómez"
            placeholderTextColor={
              cores.textoSecundario
            }
            style={
              estilos.input
            }
            maxLength={80}
            autoCapitalize="words"
          />
        </View>

        <View
          style={estilos.campo}
        >
          <Text
            style={
              estilos.rotulo
            }
          >
            País de origem
          </Text>

          <TextInput
            value={pais}
            onChangeText={
              setPais
            }
            placeholder="Colômbia"
            placeholderTextColor={
              cores.textoSecundario
            }
            style={
              estilos.input
            }
            maxLength={60}
            autoCapitalize="words"
          />
        </View>

        <View
          style={estilos.campo}
        >
          <Text
            style={
              estilos.rotulo
            }
          >
            Universidade
          </Text>

          <TextInput
            value={
              universidade
            }
            onChangeText={
              setUniversidade
            }
            placeholder="Unochapecó"
            placeholderTextColor={
              cores.textoSecundario
            }
            style={
              estilos.input
            }
            maxLength={100}
          />
        </View>

        <View
          style={estilos.campo}
        >
          <Text
            style={
              estilos.rotulo
            }
          >
            E-mail
          </Text>

          <TextInput
            value={email}
            onChangeText={
              setEmail
            }
            placeholder="laura@gmail.com"
            placeholderTextColor={
              cores.textoSecundario
            }
            style={
              estilos.input
            }
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            maxLength={120}
          />
        </View>
      </View>

      {/* GUARDAR */}
      <View
        style={
          estilos.areaBotao
        }
      >
        <Pressable
          onPress={
            salvarAlteracoes
          }
          disabled={
            trabalhando
          }
          style={({
            pressed,
          }) => [
            estilos.botaoSalvar,

            pressed &&
              estilos.pressionado,

            trabalhando &&
              estilos.desabilitado,
          ]}
        >
          <Text
            style={
              estilos.botaoSalvarTexto
            }
          >
            {salvando
              ? 'Salvando...'
              : 'Guardar alterações'}
          </Text>
        </Pressable>
      </View>
    </ScreenTemplate>
  );
}

const estilos =
  StyleSheet.create({
    areaFoto: {
      alignItems:
        'center',

      marginTop:
        espacamentos.lg,

      marginBottom:
        espacamentos.lg,
    },

    fotoPerfil: {
      width: 105,
      height: 105,

      borderRadius: 53,

      backgroundColor:
        cores.superficie,

      marginBottom:
        espacamentos.sm,
    },

    fotoVazia: {
      width: 105,
      height: 105,

      borderRadius: 53,

      alignItems:
        'center',

      justifyContent:
        'center',

      backgroundColor:
        '#D6D4D8',

      marginBottom:
        espacamentos.sm,
    },

    tituloFoto: {
      fontSize:
        tipografia.legenda,

      fontWeight:
        '700',

      color:
        cores.texto,

      marginBottom:
        espacamentos.sm,
    },

    botoesFoto: {
      flexDirection:
        'row',

      gap:
        espacamentos.sm,

      width:
        '100%',
    },

    botaoFoto: {
      flex: 1,

      minHeight: 42,

      flexDirection:
        'row',

      gap: 6,

      alignItems:
        'center',

      justifyContent:
        'center',

      borderRadius:
        raios.sm,

      backgroundColor:
        '#000000',
    },

    botaoFotoTexto: {
      fontSize:
        tipografia.legenda,

      fontWeight:
        '700',

      color:
        '#FFFFFF',
    },

    botaoGaleria: {
      flex: 1,

      minHeight: 42,

      flexDirection:
        'row',

      gap: 6,

      alignItems:
        'center',

      justifyContent:
        'center',

      borderRadius:
        raios.sm,

      borderWidth: 1,

      borderColor:
        cores.borda,

      backgroundColor:
        cores.superficie,
    },

    botaoGaleriaTexto: {
      fontSize:
        tipografia.legenda,

      fontWeight:
        '700',

      color:
        cores.texto,
    },

    botaoRemoverFoto: {
      marginTop:
        espacamentos.sm,

      paddingVertical: 6,

      paddingHorizontal:
        espacamentos.md,
    },

    botaoRemoverFotoTexto: {
      fontSize:
        tipografia.legenda,

      color:
        cores.perigo,

      fontWeight:
        '600',
    },

    formulario: {
      gap:
        espacamentos.md,
    },

    campo: {
      gap: 6,
    },

    rotulo: {
      fontSize:
        tipografia.legenda,

      fontWeight:
        '700',

      color:
        cores.texto,
    },

    input: {
      minHeight: 46,

      backgroundColor:
        cores.superficie,

      borderWidth: 1,

      borderColor:
        cores.borda,

      borderRadius:
        raios.sm,

      paddingHorizontal:
        espacamentos.md,

      paddingVertical:
        espacamentos.sm,

      fontSize:
        tipografia.legenda,

      color:
        cores.texto,
    },

    areaBotao: {
      marginTop:
        espacamentos.xl,

      marginBottom:
        espacamentos.md,
    },

    botaoSalvar: {
      minHeight: 48,

      backgroundColor:
        '#000000',

      borderRadius:
        raios.sm,

      alignItems:
        'center',

      justifyContent:
        'center',
    },

    botaoSalvarTexto: {
      fontSize:
        tipografia.legenda,

      fontWeight:
        '700',

      color:
        '#FFFFFF',
    },

    pressionado: {
      opacity: 0.6,
    },

    desabilitado: {
      opacity: 0.5,
    },
  });