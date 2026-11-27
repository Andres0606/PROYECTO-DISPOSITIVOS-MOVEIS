// SERVICE — Geolocalização para os locais

import * as Location from 'expo-location';
import { Platform } from 'react-native';

import { obterConfiguracoes } from './auth';
import { obterPosicao } from './nativos';

import {
  coordenadasValidas,
} from '../utils/geolocalizacao';

export async function obterPosicaoExplorar() {
  try {
    if (Platform.OS === 'web') {
      return null;
    }

    const configuracoes =
      await obterConfiguracoes();

    if (!configuracoes?.localizacaoPermitida) {
      return null;
    }

    const permissao =
      await Location.getForegroundPermissionsAsync();

    if (permissao.status !== 'granted') {
      return null;
    }

    const servicosAtivos =
      await Location.hasServicesEnabledAsync();

    if (!servicosAtivos) {
      return null;
    }

    const posicao = await obterPosicao();

    return coordenadasValidas(posicao)
      ? posicao
      : null;

  } catch {
    return null;
  }
}