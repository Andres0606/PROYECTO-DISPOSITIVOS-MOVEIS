/**
 * SERVICE — nativos
 * Câmera, galeria, geolocalização, permissões e notificações locais.
 * As telas não importam expo-* diretamente.
 */

import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

let handlerPronto = false;

function recusarSeWeb() {
  if (Platform.OS === 'web') {
    throw new Error('Recurso nativo indisponível no navegador.');
  }
}

// NOTIFICAÇÕES

export function configurarNotificacoes() {
  if (handlerPronto) {
    return;
  }

  handlerPronto = true;

  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
    }),
  });
}

export async function pedirPermissaoNotificacao() {
  recusarSeWeb();

  configurarNotificacoes();

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync(
      'interchapeco',
      {
        name: 'InterChapecó',
        importance: Notifications.AndroidImportance.DEFAULT,
      }
    );
  }

  const permissaoAtual =
    await Notifications.getPermissionsAsync();

  let status = permissaoAtual.status;

  if (status !== 'granted') {
    const solicitacao =
      await Notifications.requestPermissionsAsync();

    status = solicitacao.status;
  }

  return status === 'granted';
}

export async function enviarAvisoLocal({
  titulo,
  corpo,
}) {
  const permitido =
    await pedirPermissaoNotificacao();

  if (!permitido) {
    throw new Error(
      'Permissão de notificação negada.'
    );
  }

  await Notifications.scheduleNotificationAsync({
    content: {
      title: titulo,
      body: corpo,
    },

    trigger: {
      type:
        Notifications.SchedulableTriggerInputTypes
          .TIME_INTERVAL,

      seconds: 2,

      channelId: 'interchapeco',
    },
  });
}

// CÂMERA

export async function capturarFoto() {
  recusarSeWeb();

  const { status } =
    await ImagePicker.requestCameraPermissionsAsync();

  if (status !== 'granted') {
    throw new Error(
      'Permissão da câmera negada.'
    );
  }

  const result =
    await ImagePicker.launchCameraAsync({
      mediaTypes: ['images'],
      quality: 0.6,
      allowsEditing: true,
      aspect: [1, 1],
    });

  if (result.canceled) {
    return null;
  }

  return {
    uri: result.assets[0].uri,
  };
}

// GALERIA

export async function escolherImagem() {
  recusarSeWeb();

  const { status } =
    await ImagePicker
      .requestMediaLibraryPermissionsAsync();

  if (status !== 'granted') {
    throw new Error(
      'Permissão da galeria negada.'
    );
  }

  const result =
    await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.6,
      allowsEditing: true,
      aspect: [1, 1],
    });

  if (result.canceled) {
    return null;
  }

  return {
    uri: result.assets[0].uri,
  };
}

// GEOLOCALIZAÇÃO

export async function obterPosicao() {
  recusarSeWeb();

  const { status } =
    await Location.requestForegroundPermissionsAsync();

  if (status !== 'granted') {
    throw new Error(
      'Permissão de localização negada.'
    );
  }

  const posicao =
    await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });

  return {
    latitude: posicao.coords.latitude,
    longitude: posicao.coords.longitude,
    precisao: posicao.coords.accuracy,
  };
}

// PERMISSÕES

export async function statusPermissoes() {
  if (Platform.OS === 'web') {
    return {
      camera: 'indisponivel',
      galeria: 'indisponivel',
      localizacao: 'indisponivel',
      notificacoes: 'indisponivel',
    };
  }

  const [
    camera,
    galeria,
    localizacao,
    notificacoes,
  ] = await Promise.all([
    ImagePicker.getCameraPermissionsAsync(),
    ImagePicker.getMediaLibraryPermissionsAsync(),
    Location.getForegroundPermissionsAsync(),
    Notifications.getPermissionsAsync(),
  ]);

  return {
    camera: camera.status,
    galeria: galeria.status,
    localizacao: localizacao.status,
    notificacoes: notificacoes.status,
  };
}