// ORGANISM — MapaLocais

import { useEffect, useMemo, useRef, useState } from 'react';

import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import MapView, { Marker } from 'react-native-maps';

import {
  coordenadasValidas,
} from '../../utils/geolocalizacao';

import {
  textosGeolocalizacao,
} from '../../i18n/catalogosGeolocalizacao';

import {
  usePreferencias,
} from '../../contexts/PreferenciasContext';

import {
  espacamentos,
  raios,
  tipografia,
} from '../../theme';

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

  const temPosicaoUsuario =
    coordenadasValidas(posicaoUsuario);

  // VALIDAR COORDENADAS DOS LOCAIS

  const pontos = useMemo(
    () => locais.filter(coordenadasValidas),
    [locais]
  );

  const regiao = {
    latitude: pontos[0]?.latitude ?? -27.1004,
    longitude: pontos[0]?.longitude ?? -52.6152,
    latitudeDelta: 0.025,
    longitudeDelta: 0.025,
  };

  // AJUSTAR MAPA AOS LOCAIS

  useEffect(() => {
    if (!pronto || !mapa.current || !pontos.length) {
      return;
    }

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

  // CENTRALIZAR NA LOCALIZAÇÃO DO USUÁRIO

  function centralizarUsuario() {
    if (
      !pronto ||
      !mapa.current ||
      !temPosicaoUsuario
    ) {
      return;
    }

    mapa.current.animateToRegion(
      {
        latitude: posicaoUsuario.latitude,
        longitude: posicaoUsuario.longitude,
        latitudeDelta: 0.012,
        longitudeDelta: 0.012,
      },
      600
    );
  }

  // RENDER

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

          {/* LOCALIZAÇÃO DO USUÁRIO */}

          {temPosicaoUsuario && (
            <Marker
              coordinate={{
                latitude: posicaoUsuario.latitude,
                longitude: posicaoUsuario.longitude,
              }}
              title={textos.suaLocalizacao}
              pinColor="#2563EB"
            />
          )}

          {/* LOCAIS CADASTRADOS */}

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
              onCalloutPress={() =>
                aoAbrirLocal?.(local)
              }
            />
          ))}

        </MapView>

        {/* BOTÃO MINHA LOCALIZAÇÃO */}

        {pronto && temPosicaoUsuario && (
          <Pressable
            onPress={centralizarUsuario}
            accessibilityRole="button"
            accessibilityLabel={textos.suaLocalizacao}
            style={({ pressed }) => [
              estilos.botaoLocalizacao,
              {
                backgroundColor: cores.superficie,
                borderColor: cores.borda,
              },
              pressed && estilos.pressionado,
            ]}
          >
            <Ionicons
              name="locate-outline"
              size={25}
              color={cores.texto}
            />
          </Pressable>
        )}

      </View>

      {pontos.length === 0 && (
        <Text style={[
          estilos.aviso,
          { color: cores.textoSecundario },
        ]}>
          {t('grupo2.g062')}
        </Text>
      )}

      {pontos.length > 0 &&
        pontos.length < locais.length && (
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

// ESTILOS

const estilos = StyleSheet.create({
  container: {
    width: '100%',
    borderWidth: 1,
    borderRadius: raios.sm,
    overflow: 'hidden',
    position: 'relative',
  },

  mapa: {
    flex: 1,
  },

  botaoLocalizacao: {
    position: 'absolute',
    bottom: 16,
    right: 12,
    width: 44,
    height: 44,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.18,
    shadowRadius: 3,
    zIndex: 10,
  },

  pressionado: {
    opacity: 0.7,
  },

  aviso: {
    marginTop: espacamentos.sm,
    fontSize: tipografia.legenda,
    textAlign: 'center',
  },
});