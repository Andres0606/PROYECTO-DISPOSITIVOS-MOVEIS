// MOLECULE — SeletorImagem

import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import { Button } from '../atoms/Button';
import { FotoLocal } from '../atoms/FotoLocal';

import {
  espacamentos,
  raios,
  tipografia,
} from '../../theme';

import { useTema } from '../../theme/useTema';
import { usePreferencias } from '../../contexts/PreferenciasContext';

export function SeletorImagem({
  uri,
  aoCapturar,
  aoEscolher,
  aoRemover,
  desabilitado = false,
  rotulo,
}) {
  const { cores } = useTema();
  const { t } = usePreferencias();

  return (
    <View style={estilos.container}>

      <Text
        style={[
          estilos.rotulo,
          { color: cores.texto },
        ]}
      >
        {rotulo ?? t('componentes.fotoAtividade')}
      </Text>

      <FotoLocal
        imagem={uri ? { uri } : undefined}
        style={estilos.imagem}
      />

      <View style={estilos.linha}>

        <View style={estilos.botao}>

          <Button
            titulo={t('componentes.tirarFoto')}
            variante="escuro"
            aoPressionar={aoCapturar}
            desabilitado={desabilitado}
            icone={
              <Ionicons
                name="camera-outline"
                size={18}
                color={cores.textoBotaoPrincipal}
              />
            }
          />

        </View>

        <View style={estilos.botao}>

          <Button
            titulo={t('componentes.galeria')}
            variante="contorno"
            aoPressionar={aoEscolher}
            desabilitado={desabilitado}
            icone={
              <Ionicons
                name="images-outline"
                size={18}
                color={cores.texto}
              />
            }
          />

        </View>

      </View>

      {!!uri && (
        <Button
          titulo={t('componentes.removerFoto')}
          variante="link"
          aoPressionar={aoRemover}
          desabilitado={desabilitado}
        />
      )}

      <Text
        style={[
          estilos.ajuda,
          { color: cores.textoSecundario },
        ]}
      >
        {t('componentes.formatosImagem')}
      </Text>

    </View>
  );
}

const estilos = StyleSheet.create({
  container: {
    gap: espacamentos.sm,
    marginBottom: espacamentos.lg,
  },

  rotulo: {
    fontSize: tipografia.legenda,
    fontWeight: '700',
  },

  imagem: {
    width: '100%',
    height: 150,
    borderRadius: raios.sm,
  },

  linha: {
    flexDirection: 'row',
    gap: espacamentos.sm,
  },

  botao: {
    flex: 1,
  },

  ajuda: {
    fontSize: tipografia.legenda,
    textAlign: 'center',
  },
});