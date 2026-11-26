
// MOLECULE — SeletorImagem

import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { Button } from '../atoms/Button';
import { FotoLocal } from '../atoms/FotoLocal';
import { espacamentos, raios, tipografia } from '../../theme';
import { useTema } from '../../theme/useTema';

export function SeletorImagem({
  uri,
  aoCapturar,
  aoEscolher,
  aoRemover,
  desabilitado = false,
}) {
  const { cores } = useTema();

  return (
    <View style={estilos.container}>
      <Text style={[estilos.rotulo, { color: cores.texto }]}>
        Foto da atividade (opcional)
      </Text>

      <FotoLocal
        imagem={uri ? { uri } : undefined}
        style={estilos.imagem}
      />

      <View style={estilos.linha}>
        <View style={estilos.botao}>
          <Button
            titulo="Tirar foto"
            variante="escuro"
            aoPressionar={aoCapturar}
            desabilitado={desabilitado}
            icone={
              <Ionicons name="camera-outline" size={18}
                color={cores.textoBotaoPrincipal} />
            }
          />
        </View>

        <View style={estilos.botao}>
          <Button
            titulo="Galeria"
            variante="contorno"
            aoPressionar={aoEscolher}
            desabilitado={desabilitado}
            icone={
              <Ionicons name="images-outline" size={18}
                color={cores.texto} />
            }
          />
        </View>
      </View>

      {!!uri && (
        <Button
          titulo="Remover foto"
          variante="link"
          aoPressionar={aoRemover}
          desabilitado={desabilitado}
        />
      )}

      <Text style={[estilos.ajuda, { color: cores.textoSecundario }]}>
        JPG, PNG ou WEBP · Até 5 MB
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
  botao: { flex: 1 },
  ajuda: {
    fontSize: tipografia.legenda,
    textAlign: 'center',
  },
});
