// SCREEN — Editar atividade

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
  atualizarAtividade,
  excluirAtividade,
} from '../services/atividades';

import {
  cores,
  espacamentos,
  raios,
  tipografia,
} from '../theme';

export function EditarAtividadeScreen({
  navigation,
  route,
}) {
  const atividade =
    route.params?.atividade;

  const [nome, setNome] =
    useState(
      atividade?.titulo ?? ''
    );

  const [data, setData] =
    useState(
      atividade?.dataOriginal ??
        atividade?.data ??
        ''
    );

  const [hora, setHora] =
    useState(
      atividade?.horario ?? ''
    );

  const [local, setLocal] =
    useState(
      atividade?.local ?? ''
    );

  const [salvando, setSalvando] =
    useState(false);

  const [excluindo, setExcluindo] =
    useState(false);

  if (!atividade) {
    return (
      <ScreenTemplate
        titulo="Editar atividade"
        aoVoltar={() =>
          navigation.goBack()
        }
      >
        <Text style={estilos.erro}>
          Atividade não encontrada.
        </Text>
      </ScreenTemplate>
    );
  }

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
      )}/${apenasNumeros.slice(2)}`;
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

  async function salvarAlteracoes() {
    const nomeLimpo =
      nome.trim();

    const dataLimpa =
      data.trim();

    const horaLimpa =
      hora.trim();

    const localLimpo =
      local.trim();

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

    if (
      !dataValida(dataLimpa)
    ) {
      Alert.alert(
        'Data inválida',
        'Informe uma data válida a partir de hoje e com no máximo 5 anos no futuro.'
      );

      return;
    }

    if (
      !horaValida(horaLimpa)
    ) {
      Alert.alert(
        'Hora inválida',
        'Informe uma hora válida entre 00:00 e 23:59.'
      );

      return;
    }

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
      setSalvando(true);

      await atualizarAtividade(
        atividade.id,
        {
          nome: nomeLimpo,
          data: dataLimpa,
          hora: horaLimpa,
          local: localLimpo,
        }
      );

      navigation.goBack();
    } catch (erro) {
      Alert.alert(
        'Erro',
        'Não foi possível atualizar a atividade.'
      );
    } finally {
      setSalvando(false);
    }
  }

  function confirmarExclusao() {
    Alert.alert(
      'Excluir atividade',
      'Tem certeza que deseja excluir esta atividade?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },

        {
          text: 'Excluir',
          style: 'destructive',

          onPress:
            excluirAtividadeAtual,
        },
      ]
    );
  }

  async function excluirAtividadeAtual() {
    try {
      setExcluindo(true);

      await excluirAtividade(
        atividade.id
      );

      navigation.pop(2);
    } catch (erro) {
      Alert.alert(
        'Erro',
        'Não foi possível excluir a atividade.'
      );
    } finally {
      setExcluindo(false);
    }
  }

  return (
    <ScreenTemplate
      titulo="Editar atividade"
      aoVoltar={() =>
        navigation.goBack()
      }
    >
      <View style={estilos.formulario}>
        {/* NOME */}
        <View style={estilos.campo}>
          <Text style={estilos.rotulo}>
            Nome
          </Text>

          <TextInput
            value={nome}
            onChangeText={setNome}
            placeholder="Ex: Piquenique no Ecoparque"
            placeholderTextColor={
              cores.textoSecundario
            }
            style={estilos.input}
            maxLength={60}
          />
        </View>

        {/* DATA */}
        <View style={estilos.campo}>
          <Text style={estilos.rotulo}>
            Data
          </Text>

          <TextInput
            value={data}
            onChangeText={(valor) =>
              setData(
                formatarData(valor)
              )
            }
            placeholder="20/09/2026"
            placeholderTextColor={
              cores.textoSecundario
            }
            style={estilos.input}
            keyboardType="number-pad"
            maxLength={10}
          />
        </View>

        {/* HORA */}
        <View style={estilos.campo}>
          <Text style={estilos.rotulo}>
            Hora
          </Text>

          <TextInput
            value={hora}
            onChangeText={(valor) =>
              setHora(
                formatarHora(valor)
              )
            }
            placeholder="13:00"
            placeholderTextColor={
              cores.textoSecundario
            }
            style={estilos.input}
            keyboardType="number-pad"
            maxLength={5}
          />
        </View>

        {/* LOCAL */}
        <View style={estilos.campo}>
          <Text style={estilos.rotulo}>
            Local
          </Text>

          <TextInput
            value={local}
            onChangeText={setLocal}
            placeholder="Ecoparque Chapecó"
            placeholderTextColor={
              cores.textoSecundario
            }
            style={estilos.input}
            maxLength={80}
          />
        </View>
      </View>

      <View style={estilos.areaBotoes}>
        <Pressable
          onPress={salvarAlteracoes}
          disabled={
            salvando ||
            excluindo
          }
          style={({ pressed }) => [
            estilos.botaoSalvar,

            pressed &&
              estilos.pressionado,

            salvando &&
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

        <Pressable
          onPress={confirmarExclusao}
          disabled={
            salvando ||
            excluindo
          }
          style={({ pressed }) => [
            estilos.botaoExcluir,

            pressed &&
              estilos.pressionado,

            excluindo &&
              estilos.desabilitado,
          ]}
        >
          <Text
            style={
              estilos.botaoExcluirTexto
            }
          >
            {excluindo
              ? 'Excluindo...'
              : 'Excluir'}
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

      fontWeight: '700',

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

    areaBotoes: {
      flexDirection: 'row',

      gap:
        espacamentos.md,

      marginTop: 170,

      marginBottom:
        espacamentos.md,

      paddingHorizontal:
        espacamentos.md,
    },

    botaoSalvar: {
      flex: 1,

      minHeight: 48,

      backgroundColor:
        '#000000',

      borderRadius:
        raios.sm,

      alignItems: 'center',

      justifyContent:
        'center',

      paddingHorizontal: 6,
    },

    botaoSalvarTexto: {
      fontSize:
        tipografia.legenda,

      fontWeight: '700',

      textAlign: 'center',

      color:
        '#FFFFFF',
    },

    botaoExcluir: {
      flex: 1,

      minHeight: 48,

      backgroundColor:
        '#D3D3D3',

      borderRadius:
        raios.sm,

      alignItems: 'center',

      justifyContent:
        'center',
    },

    botaoExcluirTexto: {
      fontSize:
        tipografia.legenda,

      fontWeight: '700',

      color:
        '#000000',
    },

    pressionado: {
      opacity: 0.6,
    },

    desabilitado: {
      opacity: 0.5,
    },

    erro: {
      marginTop:
        espacamentos.xl,

      textAlign: 'center',

      fontSize:
        tipografia.corpo,

      color:
        cores.perigo,
    },
  });