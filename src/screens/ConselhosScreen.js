// SCREEN — Conselhos de estudantes de intercâmbio
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
import { CardConselho } from '../components/molecules/CardConselho';

import { obterConselhos } from '../services/conselhos';

import {
  cores,
  espacamentos,
  raios,
  tipografia,
} from '../theme';

export function ConselhosScreen({ navigation }) {
  const [ordenacao, setOrdenacao] =
    useState('recentes');

  const [conselhos, setConselhos] =
    useState([]);

  const [curtidos, setCurtidos] =
    useState([]);

  const [carregando, setCarregando] =
    useState(true);

  const [erro, setErro] =
    useState('');

  const carregar = useCallback(async () => {
    setCarregando(true);
    setErro('');

    try {
      const resultado =
        await obterConselhos(ordenacao);

      setConselhos(resultado);
    } catch (e) {
      setErro(
        'Não foi possível carregar os conselhos.'
      );
    } finally {
      setCarregando(false);
    }
  }, [ordenacao]);

  useEffect(() => {
    carregar();
  }, [carregar]);

  function alternarCurtida(id) {
    setCurtidos((atuais) => {
      if (atuais.includes(id)) {
        return atuais.filter(
          (item) => item !== id
        );
      }

      return [...atuais, id];
    });
  }

  function criarConselho() {
    Alert.alert(
      'Novo conselho',
      'O cadastro de conselhos será implementado na próxima etapa.'
    );
  }

  const botaoFlutuante = (
    <Pressable
      onPress={criarConselho}
      style={({ pressed }) => [
        estilos.botaoAdicionar,
        pressed && estilos.pressionado,
      ]}
      accessibilityRole="button"
      accessibilityLabel="Adicionar conselho"
    >
      <Ionicons
        name="add"
        size={30}
        color={cores.texto}
      />
    </Pressable>
  );

  return (
    <ScreenTemplate
      titulo="Conselhos de estudantes de intercâmbio"
      aoVoltar={() => navigation.goBack()}
      flutuante={botaoFlutuante}
    >
      <View style={estilos.segmentado}>
        <Pressable
          onPress={() =>
            setOrdenacao('recentes')
          }
          style={[
            estilos.segmento,
            ordenacao === 'recentes' &&
              estilos.segmentoAtivo,
          ]}
        >
          <Text style={estilos.segmentoTexto}>
            Recentes
          </Text>
        </Pressable>

        <Pressable
          onPress={() =>
            setOrdenacao('populares')
          }
          style={[
            estilos.segmento,
            ordenacao === 'populares' &&
              estilos.segmentoAtivo,
          ]}
        >
          <Text style={estilos.segmentoTexto}>
            Populares
          </Text>
        </Pressable>
      </View>

      {carregando && (
        <ActivityIndicator
          color={cores.primaria}
          style={estilos.carregando}
        />
      )}

      {!carregando && !!erro && (
        <Text style={estilos.erro}>
          {erro}
        </Text>
      )}

      {!carregando && !erro && (
        <View style={estilos.lista}>
          {conselhos.map((conselho) => (
            <CardConselho
              key={conselho.id}
              conselho={conselho}
              curtido={curtidos.includes(
                conselho.id
              )}
              aoCurtir={() =>
                alternarCurtida(
                  conselho.id
                )
              }
            />
          ))}
        </View>
      )}
    </ScreenTemplate>
  );
}

const estilos = StyleSheet.create({
  segmentado: {
    height: 38,
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: cores.segmentoBorda,
    borderRadius: raios.pill,
    overflow: 'hidden',
    marginBottom: espacamentos.md,
  },

  segmento: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  segmentoAtivo: {
    backgroundColor:
      cores.segmentoSelecionado,
  },

  segmentoTexto: {
    fontSize: tipografia.legenda,
    color: cores.texto,
  },

  lista: {
    gap: espacamentos.md,
  },

  carregando: {
    marginTop: espacamentos.xl,
  },

  erro: {
    marginTop: espacamentos.xl,
    textAlign: 'center',
    fontSize: tipografia.corpo,
    color: cores.perigo,
  },

  botaoAdicionar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: cores.superficie,
    borderWidth: 3,
    borderColor: cores.texto,
    alignItems: 'center',
    justifyContent: 'center',
  },

  pressionado: {
    opacity: 0.55,
  },
});