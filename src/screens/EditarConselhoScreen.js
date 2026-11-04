// SCREEN — Editar conselho

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
  atualizarConselho,
} from '../services/conselhos';

import {
  cores,
  espacamentos,
  raios,
  tipografia,
} from '../theme';

export function EditarConselhoScreen({
  navigation,
  route,
}) {
  const conselho =
    route.params?.conselho;

  const [titulo, setTitulo] =
    useState(conselho?.texto ?? '');

  const [categoria, setCategoria] =
    useState(conselho?.categoria ?? '');

  const [conteudo, setConteudo] =
    useState(conselho?.descricao ?? '');

  const [salvando, setSalvando] =
    useState(false);

  if (!conselho) {
    return (
      <ScreenTemplate
        titulo="Editar conselho"
        aoVoltar={() =>
          navigation.goBack()
        }
      >
        <Text style={estilos.erro}>
          Conselho não encontrado.
        </Text>
      </ScreenTemplate>
    );
  }

  async function salvarAlteracoes() {
    const tituloLimpo =
      titulo.trim();

    const categoriaLimpa =
      categoria.trim();

    const conteudoLimpo =
      conteudo.trim();

    if (!tituloLimpo) {
      Alert.alert(
        'Título obrigatório',
        'Informe um título para o conselho.'
      );

      return;
    }

    if (!categoriaLimpa) {
      Alert.alert(
        'Categoria obrigatória',
        'Informe uma categoria.'
      );

      return;
    }

    if (!conteudoLimpo) {
      Alert.alert(
        'Conteúdo obrigatório',
        'Informe o conteúdo do conselho.'
      );

      return;
    }

    try {
      setSalvando(true);

      await atualizarConselho(
        conselho.id,
        {
          titulo: tituloLimpo,
          categoria: categoriaLimpa,
          conteudo: conteudoLimpo,
        }
      );

      navigation.goBack();
    } catch (erro) {
      Alert.alert(
        'Erro',
        'Não foi possível editar o conselho.'
      );
    } finally {
      setSalvando(false);
    }
  }

  return (
    <ScreenTemplate
      titulo="Editar conselho"
      aoVoltar={() =>
        navigation.goBack()
      }
    >
      <View style={estilos.formulario}>
        {/* TÍTULO */}
        <View style={estilos.campo}>
          <Text style={estilos.rotulo}>
            Título
          </Text>

          <TextInput
            value={titulo}
            onChangeText={setTitulo}
            placeholder="Ex: Leve roupa de frio."
            placeholderTextColor={
              cores.textoSecundario
            }
            style={estilos.input}
            maxLength={80}
          />
        </View>

        {/* CATEGORIA */}
        <View style={estilos.campo}>
          <Text style={estilos.rotulo}>
            Categoria
          </Text>

          <TextInput
            value={categoria}
            onChangeText={setCategoria}
            placeholder="Adaptação"
            placeholderTextColor={
              cores.textoSecundario
            }
            style={estilos.input}
            maxLength={40}
          />
        </View>

        {/* CONTEÚDO */}
        <View style={estilos.campo}>
          <Text style={estilos.rotulo}>
            Conteúdo
          </Text>

          <TextInput
            value={conteudo}
            onChangeText={setConteudo}
            placeholder="Escreva o conteúdo..."
            placeholderTextColor={
              cores.textoSecundario
            }
            style={[
              estilos.input,
              estilos.inputConteudo,
            ]}
            multiline
            textAlignVertical="top"
            maxLength={500}
          />
        </View>
      </View>

      <View style={estilos.areaBotao}>
        <Pressable
          onPress={salvarAlteracoes}
          disabled={salvando}
          style={({ pressed }) => [
            estilos.botaoSalvar,

            pressed &&
              estilos.pressionado,

            salvando &&
              estilos.desabilitado,
          ]}
        >
          <Text style={estilos.botaoSalvarTexto}>
            {salvando
              ? 'Salvando...'
              : 'Editar conselho'}
          </Text>
        </Pressable>
      </View>
    </ScreenTemplate>
  );
}

const estilos = StyleSheet.create({
  formulario: {
    marginTop: espacamentos.lg,
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
    minHeight: 44,

    backgroundColor:
      cores.superficie,

    borderWidth: 1,
    borderColor: cores.borda,

    borderRadius: raios.sm,

    paddingHorizontal:
      espacamentos.md,

    paddingVertical:
      espacamentos.sm,

    fontSize:
      tipografia.legenda,

    color: cores.texto,
  },

  inputConteudo: {
    minHeight: 65,
  },

  areaBotao: {
    marginTop: 170,
    marginBottom:
      espacamentos.md,
  },

  botaoSalvar: {
    minHeight: 48,

    backgroundColor:
      '#000000',

    borderRadius: raios.sm,

    alignItems: 'center',
    justifyContent: 'center',
  },

  botaoSalvarTexto: {
    fontSize:
      tipografia.legenda,

    fontWeight: '700',

    color: '#FFFFFF',
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

    color: cores.perigo,
  },
});