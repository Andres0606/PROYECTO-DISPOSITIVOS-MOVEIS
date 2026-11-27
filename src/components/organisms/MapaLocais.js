import {
  coordenadasValidas,
} from '../../utils/geolocalizacao';

import {
  textosGeolocalizacao,
} from '../../i18n/catalogosGeolocalizacao';
import { usePreferencias } from '../../contexts/PreferenciasContext';

// ORGANISM — MapaLocais

import { useEffect, useMemo, useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import MapView, { Marker } from 'react-native-maps';

import { espacamentos, raios, tipografia } from '../../theme';
import { useTema } from '../../theme/useTema';

export function MapaLocais({
  locais = [],
  posicaoUsuario = null,
  aoAbrirLocal,
  altura = 350,
}) {
  const { t, idioma } = usePreferencias();
  const textos = textosGeolocalizacao(idioma);
  const { cores } = useTema();
  const mapa = useRef(null);
  const [pronto, setPronto] = useState(false);

  const pontos = useMemo(() => locais.filter(local =>
    Number.isFinite(local.latitude) &&
    Number.isFinite(local.longitude) &&
    Math.abs(local.latitude) <= 90 &&
    Math.abs(local.longitude) <= 180
  ), [locais]);

  const regiao = {
    latitude: pontos[0]?.latitude ?? -27.1004,
    longitude: pontos[0]?.longitude ?? -52.6152,
    latitudeDelta: 0.025,
    longitudeDelta: 0.025,
  };

  useEffect(() => {
    if (!pronto || !mapa.current || !pontos.length) return;

    if (pontos.length === 1) {
      mapa.current.animateToRegion({
        latitude: pontos[0].latitude,
        longitude: pontos[0].longitude,
        latitudeDelta: 0.015,
        longitudeDelta: 0.015,
      });
    } else {
      mapa.current.fitToCoordinates(
        pontos.map(local => ({
          latitude: local.latitude,
          longitude: local.longitude,
        })),
        {
          edgePadding: {
            top: 45,
            right: 45,
            bottom: 45,
            left: 45,
          },
          animated: true,
        }
      );
    }
  }, [pronto, pontos]);

  return (
    <View>
      <View style={[
        estilos.container,
        {
          height: altura,
          borderColor: cores.borda,
        },
      ]}>
        <MapView
          ref={mapa}
          style={estilos.mapa}
          initialRegion={regiao}
          onMapReady={() => setPronto(true)}
          showsCompass
          showsScale
          toolbarEnabled={false}
        >
          {coordenadasValidas(posicaoUsuario) && (
            <Marker
              coordinate={{
                latitude: posicaoUsuario.latitude,
                longitude: posicaoUsuario.longitude,
              }}
              title={textos.suaLocalizacao}
              pinColor="#2563EB"
            />
          )}
          {pontos.map(local => (
            <Marker
              key={local.id}
              coordinate={{
                latitude: local.latitude,
                longitude: local.longitude,
              }}
              title={local.nome}
              description={
                aoAbrirLocal
                  ? t('grupo2.g061')
                  : local.categoria
              }
              onCalloutPress={() => aoAbrirLocal?.(local)}
            />
          ))}
        </MapView>
      </View>

      {pontos.length === 0 && (
        <Text style={[
          estilos.aviso,
          { color: cores.textoSecundario },
        ]}>
          {t('grupo2.g062')}
        </Text>
      )}

      {pontos.length > 0 && pontos.length < locais.length && (
        <Text style={[
          estilos.aviso,
          { color: cores.textoSecundario },
        ]}>
          {t('grupo2.g063')}
        </Text>
      )}
    </View>
  );
}

const estilos = StyleSheet.create({
  container: {
    width: '100%',
    borderWidth: 1,
    borderRadius: raios.sm,
    overflow: 'hidden',
  },

  mapa: {
    flex: 1,
  },

  aviso: {
    marginTop: espacamentos.sm,
    fontSize: tipografia.legenda,
    textAlign: 'center',
  },
});
