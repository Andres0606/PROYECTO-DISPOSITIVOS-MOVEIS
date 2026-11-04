// SCREEN — Criar atividade

import {
  useState,
} from 'react';

import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { ScreenTemplate } from '../components/templates/ScreenTemplate';

import {
  criarAtividade,
} from '../services/atividades';

import {
  cores,
  espacamentos,
  raios,
  tipografia,
} from '../theme';

export function CriarAtividadeScreen({
  navigation,
}) {
  const [nome, setNome] =
    useState('');

  const [descricao, setDescricao] =
    useState('');

  const [categoria, setCategoria] =
    useState('Social');

  const [data, setData] =
    useState('');

  const [hora, setHora] =
    useState('');

  const [local, setLocal] =
    useState('');

  const [criando, setCriando] =
    useState(false);

  function formatarData(valor) {
    const apenasNumeros =
      valor.replace(/\D/g, '');

    if (
      apenasNumeros.length <= 2
    ) {
      return apenasNumeros;
    }

    if (
      apenasNumeros.length <= 4
    ) {
      return `${apenasNumeros.slice(
        0,
        2
      )}/${apenasNumeros.slice(
        2
      )}`;
    }

    return `${apenasNumeros.slice(
      0,
      2
    )}/${apenasNumeros.slice(
      2,
      4
    )}/${apenasNumeros.slice(
      4,
      8
    )}`;
  }

  function formatarHora(valor) {
    const apenasNumeros =
      valor.replace(/\D/g, '');

    if (
      apenasNumeros.length <= 2
    ) {
      return apenasNumeros;
    }

    return `${apenasNumeros.slice(
      0,
      2
    )}:${apenasNumeros.slice(
      2,
      4
    )}`;
  }

  function contemLetras(valor) {
    return /[A-Za-zÀ-ÿ]/.test(
      valor
    );
  }

  function dataValida(valor) {
    const regex =
      /^(\d{2})\/(\d{2})\/(\d{4})$/;

    const resultado =
      valor.match(regex);

    if (!resultado) {
      return false;
    }

    const dia =
      Number(resultado[1]);

    const mes =
      Number(resultado[2]);

    const ano =
      Number(resultado[3]);

    const dataCriada =
      new Date(
        ano,
        mes - 1,
        dia
      );

    // Verifica se a data realmente existe.
    if (
      dataCriada.getFullYear() !==
        ano ||
      dataCriada.getMonth() !==
        mes - 1 ||
      dataCriada.getDate() !==
        dia
    ) {
      return false;
    }

    // Data de hoje sem considerar hora.
    const hoje =
      new Date();

    hoje.setHours(
      0,
      0,
      0,
      0
    );

    dataCriada.setHours(
      0,
      0,
      0,
      0
    );

    // Limite máximo:
    // 5 anos a partir de hoje.
    const dataMaxima =
      new Date(hoje);

    dataMaxima.setFullYear(
      hoje.getFullYear() + 5
    );

    return (
      dataCriada >= hoje &&
      dataCriada <= dataMaxima
    );
  }

  function horaValida(valor) {
    return /^([01]\d|2[0-3]):[0-5]\d$/.test(
      valor
    );
  }

  async function salvarAtividade() {
    const nomeLimpo =
      nome.trim();

    const descricaoLimpa =
      descricao.trim();

    const categoriaLimpa =
      categoria.trim();

    const dataLimpa =
      data.trim();

    const horaLimpa =
      hora.trim();

    const localLimpo =
      local.trim();

    // NOME
    if (
      nomeLimpo.length < 3 ||
      !contemLetras(nomeLimpo)
    ) {
      Alert.alert(
        'Nome inválido',
        'Informe um nome válido com pelo menos 3 caracteres e letras.'
      );

      return;
    }

    // DESCRIÇÃO
    if (
      descricaoLimpa.length < 10 ||
      !contemLetras(
        descricaoLimpa
      )
    ) {
      Alert.alert(
        'Descrição inválida',
        'A descrição deve ter pelo menos 10 caracteres e conter texto válido.'
      );

      return;
    }

    // CATEGORIA
    if (
      categoriaLimpa.length < 3 ||
      !contemLetras(
        categoriaLimpa
      )
    ) {
      Alert.alert(
        'Categoria inválida',
        'Informe uma categoria válida.'
      );

      return;
    }

    // DATA
    if (
      !dataValida(dataLimpa)
    ) {
      Alert.alert(
        'Data inválida',
        'Informe uma data válida a partir de hoje e com no máximo 5 anos no futuro.'
      );

      return;
    }

    // HORA
    if (
      !horaValida(horaLimpa)
    ) {
      Alert.alert(
        'Hora inválida',
        'Informe uma hora válida entre 00:00 e 23:59.'
      );

      return;
    }

    // LOCAL
    if (
      localLimpo.length < 3 ||
      !contemLetras(localLimpo)
    ) {
      Alert.alert(
        'Local inválido',
        'Informe um local válido com pelo menos 3 caracteres e letras.'
      );

      return;
    }

    try {
      setCriando(true);

      await criarAtividade({
        nome: nomeLimpo,

        descricao:
          descricaoLimpa,

        categoria:
          categoriaLimpa,

        data:
          dataLimpa,

        hora:
          horaLimpa,

        local:
          localLimpo,
      });

      navigation.goBack();
    } catch (erro) {
      Alert.alert(
        'Erro',
        'Não foi possível criar a atividade.'
      );
    } finally {
      setCriando(false);
    }
  }

  return (
    <ScreenTemplate
      titulo="Nova atividade"
      aoVoltar={() =>
        navigation.goBack()
      }
    >
      <View
        style={
          estilos.formulario
        }
      >
        {/* NOME */}
        <View
          style={estilos.campo}
        >
          <Text
            style={
              estilos.rotulo
            }
          >
            Nome
          </Text>

          <TextInput
            value={nome}
            onChangeText={
              setNome
            }
            placeholder="Ex: Piquenique no Ecoparque"
            placeholderTextColor={
              cores.textoSecundario
            }
            style={
              estilos.input
            }
            maxLength={60}
          />
        </View>

        {/* DESCRIÇÃO */}
        <View
          style={estilos.campo}
        >
          <Text
            style={
              estilos.rotulo
            }
          >
            Descrição
          </Text>

          <TextInput
            value={descricao}
            onChangeText={
              setDescricao
            }
            placeholder="Descreva a atividade"
            placeholderTextColor={
              cores.textoSecundario
            }
            style={[
              estilos.input,
              estilos.inputDescricao,
            ]}
            multiline
            textAlignVertical="top"
            maxLength={300}
          />
        </View>

        {/* CATEGORIA */}
        <View
          style={estilos.campo}
        >
          <Text
            style={
              estilos.rotulo
            }
          >
            Categoria
          </Text>

          <TextInput
            value={categoria}
            onChangeText={
              setCategoria
            }
            placeholder="Social"
            placeholderTextColor={
              cores.textoSecundario
            }
            style={
              estilos.input
            }
            maxLength={30}
          />
        </View>

        {/* DATA */}
        <View
          style={estilos.campo}
        >
          <Text
            style={
              estilos.rotulo
            }
          >
            Data
          </Text>

          <TextInput
            value={data}
            onChangeText={(
              valor
            ) =>
              setData(
                formatarData(
                  valor
                )
              )
            }
            placeholder="20/09/2026"
            placeholderTextColor={
              cores.textoSecundario
            }
            style={
              estilos.input
            }
            keyboardType="number-pad"
            maxLength={10}
          />
        </View>

        {/* HORA */}
        <View
          style={estilos.campo}
        >
          <Text
            style={
              estilos.rotulo
            }
          >
            Hora
          </Text>

          <TextInput
            value={hora}
            onChangeText={(
              valor
            ) =>
              setHora(
                formatarHora(
                  valor
                )
              )
            }
            placeholder="13:00"
            placeholderTextColor={
              cores.textoSecundario
            }
            style={
              estilos.input
            }
            keyboardType="number-pad"
            maxLength={5}
          />
        </View>

        {/* LOCAL */}
        <View
          style={estilos.campo}
        >
          <Text
            style={
              estilos.rotulo
            }
          >
            Local
          </Text>

          <TextInput
            value={local}
            onChangeText={
              setLocal
            }
            placeholder="Ecoparque Chapecó"
            placeholderTextColor={
              cores.textoSecundario
            }
            style={
              estilos.input
            }
            maxLength={80}
          />
        </View>
      </View>

      {/* BOTÃO */}
      <View
        style={
          estilos.areaBotao
        }
      >
        <Pressable
          onPress={
            salvarAtividade
          }
          disabled={
            criando
          }
          style={({
            pressed,
          }) => [
            estilos.botaoCriar,

            pressed &&
              estilos.pressionado,

            criando &&
              estilos.desabilitado,
          ]}
        >
          <Text
            style={
              estilos.botaoCriarTexto
            }
          >
            {criando
              ? 'Criando...'
              : 'Criar atividade'}
          </Text>
        </Pressable>
      </View>
    </ScreenTemplate>
  );
}

const estilos =
  StyleSheet.create({
    formulario: {
      marginTop:
        espacamentos.lg,

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
      minHeight: 44,

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

    inputDescricao: {
      minHeight: 65,
    },

    areaBotao: {
      marginTop:
        espacamentos.xl,

      marginBottom:
        espacamentos.md,
    },

    botaoCriar: {
      minHeight: 48,

      borderRadius:
        raios.sm,

      backgroundColor:
        '#000000',

      alignItems:
        'center',

      justifyContent:
        'center',
    },

    botaoCriarTexto: {
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