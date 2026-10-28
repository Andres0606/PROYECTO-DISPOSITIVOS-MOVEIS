// SCREEN — Recursos nativos
import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { Button } from '../components/atoms/Button';
import { ScreenTemplate } from '../components/templates/ScreenTemplate';

import {
  capturarFoto,
  configurarNotificacoes,
  escolherImagem,
  enviarAvisoLocal,
  obterPosicao,
  statusPermissoes,
} from '../services/nativos';

import {
  obterFotoLocal,
  obterLocalizacaoSalva,
  salvarFotoLocal,
  salvarLocalizacao,
} from '../services/storage';

import { cores, espacamentos, tipografia } from '../theme';

function rotuloPermissao(status) {
  if (status === 'granted') return 'Concedida';
  if (status === 'denied') return 'Negada';
  if (status === 'undetermined') return 'Ainda não solicitada';
  if (status === 'indisponivel') return 'Indisponível';

  return status || '—';
}

function formatarGps(coords) {
  if (!coords) {
    return 'Localização ainda não obtida.';
  }

  return `${coords.latitude.toFixed(5)}, ${coords.longitude.toFixed(5)}`;
}

export function RecursosScreen({ navigation }) {
  const [fotoUri, setFotoUri] = useState(null);
  const [coords, setCoords] = useState(null);
  const [permissoes, setPermissoes] = useState(null);
  const [ocupado, setOcupado] = useState('');
  const [erro, setErro] = useState('');

  const atualizarPermissoes = useCallback(async () => {
    try {
      const resultado = await statusPermissoes();
      setPermissoes(resultado);
    } catch (e) {
      setErro('Não foi possível consultar as permissões.');
    }
  }, []);

  const carregarDadosSalvos = useCallback(async () => {
    try {
      const [fotoSalva, localizacaoSalva] = await Promise.all([
        obterFotoLocal(),
        obterLocalizacaoSalva(),
      ]);

      if (fotoSalva) {
        setFotoUri(fotoSalva);
      }

      if (localizacaoSalva) {
        setCoords(localizacaoSalva);
      }
    } catch (e) {
      setErro('Não foi possível carregar os dados salvos.');
    }
  }, []);

  useEffect(() => {
    configurarNotificacoes();
    atualizarPermissoes();
    carregarDadosSalvos();
  }, [atualizarPermissoes, carregarDadosSalvos]);

  async function executar(chave, acao) {
    setErro('');
    setOcupado(chave);

    try {
      await acao();
      await atualizarPermissoes();
    } catch (e) {
      setErro(e.message);
    } finally {
      setOcupado('');
    }
  }

  function tirarFoto() {
    executar('foto', async () => {
      const resultado = await capturarFoto();

      if (resultado) {
        setFotoUri(resultado.uri);

        await salvarFotoLocal(resultado.uri);
      }
    });
  }

  function abrirGaleria() {
    executar('galeria', async () => {
      const resultado = await escolherImagem();

      if (resultado) {
        setFotoUri(resultado.uri);

        await salvarFotoLocal(resultado.uri);
      }
    });
  }

  function obterLocalizacao() {
    executar('gps', async () => {
      const posicao = await obterPosicao();

      setCoords(posicao);

      await salvarLocalizacao(posicao);
    });
  }

  function enviarNotificacao() {
    executar('notificacao', async () => {
      await enviarAvisoLocal({
        titulo: 'InterChapecó',
        corpo: 'Notificação local de teste.',
      });

      Alert.alert(
        'Notificação agendada',
        'A notificação deverá aparecer em alguns segundos.'
      );
    });
  }

  return (
    <ScreenTemplate
      titulo="Recursos nativos"
      aoVoltar={() => navigation.goBack()}
    >
      {!!erro && (
        <Text style={estilos.erro}>
          {erro}
        </Text>
      )}

      <View style={estilos.cartao}>
        <Text style={estilos.subtitulo}>
          Permissões
        </Text>

        {!permissoes ? (
          <ActivityIndicator />
        ) : (
          <>
            <Text style={estilos.texto}>
              Câmera: {rotuloPermissao(permissoes.camera)}
            </Text>

            <Text style={estilos.texto}>
              Galeria: {rotuloPermissao(permissoes.galeria)}
            </Text>

            <Text style={estilos.texto}>
              Localização: {rotuloPermissao(permissoes.localizacao)}
            </Text>

            <Text style={estilos.texto}>
              Notificações: {rotuloPermissao(permissoes.notificacoes)}
            </Text>
          </>
        )}

        <View style={estilos.espaco}>
          <Button
            titulo="Atualizar permissões"
            variante="secundario"
            aoPressionar={atualizarPermissoes}
          />
        </View>
      </View>

      <View style={estilos.cartao}>
        <Text style={estilos.subtitulo}>
          Câmera e galeria
        </Text>

        {fotoUri ? (
          <Image
            source={{ uri: fotoUri }}
            style={estilos.foto}
          />
        ) : (
          <View style={estilos.fotoVazia}>
            <Text style={estilos.textoSecundario}>
              Nenhuma imagem
            </Text>
          </View>
        )}

        <View style={estilos.acoes}>
          <Button
            titulo="Tirar foto"
            aoPressionar={tirarFoto}
            carregando={ocupado === 'foto'}
            desabilitado={!!ocupado}
          />

          <Button
            titulo="Escolher da galeria"
            variante="secundario"
            aoPressionar={abrirGaleria}
            carregando={ocupado === 'galeria'}
            desabilitado={!!ocupado}
          />
        </View>
      </View>

      <View style={estilos.cartao}>
        <Text style={estilos.subtitulo}>
          Geolocalização
        </Text>

        <Text style={estilos.texto}>
          {formatarGps(coords)}
        </Text>

        {!!coords?.precisao && (
          <Text style={estilos.textoSecundario}>
            Precisão aproximada: {Math.round(coords.precisao)} metros
          </Text>
        )}

        <View style={estilos.espaco}>
          <Button
            titulo="Obter localização atual"
            aoPressionar={obterLocalizacao}
            carregando={ocupado === 'gps'}
            desabilitado={!!ocupado}
          />
        </View>
      </View>

      <View style={estilos.cartao}>
        <Text style={estilos.subtitulo}>
          Notificação local
        </Text>

        <Text style={estilos.textoSecundario}>
          Teste de notificação local do aplicativo.
        </Text>

        <View style={estilos.espaco}>
          <Button
            titulo="Enviar notificação de teste"
            aoPressionar={enviarNotificacao}
            carregando={ocupado === 'notificacao'}
            desabilitado={!!ocupado}
          />
        </View>
      </View>
    </ScreenTemplate>
  );
}

const estilos = StyleSheet.create({
  cartao: {
    backgroundColor: cores.superficie,
    borderWidth: 1,
    borderColor: cores.borda,
    padding: espacamentos.md,
    marginBottom: espacamentos.md,
  },

  subtitulo: {
    fontSize: tipografia.subtitulo,
    fontWeight: '700',
    color: cores.texto,
    marginBottom: espacamentos.sm,
  },

  texto: {
    fontSize: tipografia.corpo,
    color: cores.texto,
    marginBottom: espacamentos.xs,
  },

  textoSecundario: {
    fontSize: tipografia.legenda,
    color: cores.textoSecundario,
  },

  erro: {
    color: cores.perigo,
    marginBottom: espacamentos.md,
  },

  espaco: {
    marginTop: espacamentos.sm,
  },

  acoes: {
    gap: espacamentos.sm,
  },

  foto: {
    width: 140,
    height: 140,
    borderRadius: 70,
    alignSelf: 'center',
    marginVertical: espacamentos.md,
  },

  fotoVazia: {
    width: 140,
    height: 140,
    borderRadius: 70,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: cores.fundo,
    marginVertical: espacamentos.md,
  },
});