// SCREEN — Criar novo conselho

import {
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

import { Ionicons } from '@expo/vector-icons';

import * as ImagePicker from 'expo-image-picker';

import { ScreenTemplate } from '../components/templates/ScreenTemplate';

import {
  criarConselho,
} from '../services/conselhos';

import {
  cores,
  espacamentos,
  raios,
  tipografia,
} from '../theme';

export function CriarConselhoScreen({
  navigation,
}) {
  const [titulo, setTitulo] =
    useState('');

  const [categoria, setCategoria] =
    useState('Adaptação');

  const [conteudo, setConteudo] =
    useState('');

  const [imagem, setImagem] =
    useState(null);

  const [publicando, setPublicando] =
    useState(false);

  async function selecionarImagem() {
    try {
      const resultado =
        await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ['images'],
          allowsEditing: true,
          aspect: [4, 3],
          quality: 0.8,
        });

      if (!resultado.canceled) {
        const imagemSelecionada =
          resultado.assets?.[0]?.uri;

        if (imagemSelecionada) {
          setImagem(imagemSelecionada);
        }
      }
    } catch (erro) {
      Alert.alert(
        'Erro',
        'Não foi possível selecionar a imagem.'
      );
    }
  }

  function removerImagem() {
    setImagem(null);
  }

  async function publicarConselho() {
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
        'Escreva o conteúdo do conselho.'
      );

      return;
    }

    try {
      setPublicando(true);

      await criarConselho({
        titulo: tituloLimpo,
        categoria: categoriaLimpa,
        conteudo: conteudoLimpo,
        imagem,
      });

      navigation.goBack();
    } catch (erro) {
      Alert.alert(
        'Erro',
        'Não foi possível publicar o conselho.'
      );
    } finally {
      setPublicando(false);
    }
  }

  return (
    <ScreenTemplate
      titulo="Novo conselho"
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
            placeholder="Ex: Adaptação"
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
            placeholder="Escreva seu conselho..."
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

        {/* IMAGEM */}
        <View style={estilos.campo}>
          <Text style={estilos.rotulo}>
            Imagem (opcional)
          </Text>

          {!imagem && (
            <Pressable
              onPress={selecionarImagem}
              style={({ pressed }) => [
                estilos.botaoFoto,
                pressed &&
                  estilos.pressionado,
              ]}
              accessibilityRole="button"
              accessibilityLabel="Adicionar foto"
            >
              <Ionicons
                name="add"
                size={18}
                color={
                  cores.textoSecundario
                }
              />

              <Text style={estilos.fotoTexto}>
                Adicionar foto
              </Text>
            </Pressable>
          )}

          {imagem && (
            <View
              style={
                estilos.areaImagem
              }
            >
              <Image
                source={{
                  uri: imagem,
                }}
                style={
                  estilos.imagemPreview
                }
                resizeMode="cover"
              />

              <View
                style={
                  estilos.acoesImagem
                }
              >
                <Pressable
                  onPress={
                    selecionarImagem
                  }
                  style={({ pressed }) => [
                    estilos.botaoImagem,
                    pressed &&
                      estilos.pressionado,
                  ]}
                >
                  <Ionicons
                    name="image-outline"
                    size={17}
                    color={cores.texto}
                  />

                  <Text
                    style={
                      estilos.botaoImagemTexto
                    }
                  >
                    Trocar
                  </Text>
                </Pressable>

                <Pressable
                  onPress={removerImagem}
                  style={({ pressed }) => [
                    estilos.botaoImagem,
                    pressed &&
                      estilos.pressionado,
                  ]}
                >
                  <Ionicons
                    name="trash-outline"
                    size={17}
                    color={cores.perigo}
                  />

                  <Text
                    style={[
                      estilos.botaoImagemTexto,
                      estilos.textoRemover,
                    ]}
                  >
                    Remover
                  </Text>
                </Pressable>
              </View>
            </View>
          )}
        </View>
      </View>

      {/* PUBLICAR */}
      <View style={estilos.areaBotao}>
        <Pressable
          onPress={publicarConselho}
          disabled={publicando}
          style={({ pressed }) => [
            estilos.botaoPublicar,

            pressed &&
              estilos.pressionado,

            publicando &&
              estilos.desabilitado,
          ]}
        >
          <Text
            style={
              estilos.publicarTexto
            }
          >
            {publicando
              ? 'Publicando...'
              : 'Publicar conselho'}
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
    minHeight: 80,
  },

  botaoFoto: {
    minHeight: 44,

    flexDirection: 'row',
    alignItems: 'center',

    gap: espacamentos.xs,

    backgroundColor:
      cores.superficie,

    borderWidth: 1,
    borderColor: cores.borda,

    borderRadius: raios.sm,

    paddingHorizontal:
      espacamentos.md,
  },

  fotoTexto: {
    fontSize:
      tipografia.legenda,

    color:
      cores.textoSecundario,
  },

  areaImagem: {
    gap: espacamentos.sm,
  },

  imagemPreview: {
    width: '100%',
    height: 160,

    borderRadius: raios.sm,

    backgroundColor:
      cores.superficie,

    borderWidth: 1,
    borderColor: cores.borda,
  },

  acoesImagem: {
    flexDirection: 'row',

    gap: espacamentos.sm,
  },

  botaoImagem: {
    flexDirection: 'row',
    alignItems: 'center',

    gap: espacamentos.xs,

    paddingHorizontal:
      espacamentos.md,

    paddingVertical:
      espacamentos.sm,

    borderWidth: 1,
    borderColor: cores.borda,

    borderRadius: raios.sm,

    backgroundColor:
      cores.superficie,
  },

  botaoImagemTexto: {
    fontSize:
      tipografia.legenda,

    color: cores.texto,
  },

  textoRemover: {
    color: cores.perigo,
  },

  areaBotao: {
    marginTop: 70,
    marginBottom: espacamentos.md,
  },

  botaoPublicar: {
    minHeight: 48,

    backgroundColor: '#000000',

    borderRadius: raios.sm,

    alignItems: 'center',
    justifyContent: 'center',
  },

  publicarTexto: {
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
});