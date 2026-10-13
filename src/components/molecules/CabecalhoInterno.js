// MOLECULE — CabecalhoInterno (chevron de voltar + título centralizado + divisor)
import { StyleSheet, Text, View } from 'react-native';
import { BotaoVoltar } from '../atoms/BotaoVoltar';
import { Divider } from './Divider';
import { cores, espacamentos, tipografia } from '../../theme';

export function CabecalhoInterno({ titulo, aoVoltar }) {
  return (
    <View>
      <View style={estilos.linha}>
        <View style={estilos.voltar}>
          {/* Se o BotaoVoltar usar outro nome de prop, ajuste aqui. */}
          <BotaoVoltar aoPressionar={aoVoltar} />
        </View>
        <Text style={estilos.titulo} numberOfLines={1}>
          {titulo}
        </Text>
      </View>
      <Divider />
    </View>
  );
}

const estilos = StyleSheet.create({
  linha: {
    height: 40,
    justifyContent: 'center',
    marginBottom: espacamentos.md,
  },
  voltar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    zIndex: 1,
  },
  titulo: {
    paddingHorizontal: 44,
    textAlign: 'center',
    fontSize: tipografia.tituloCartao,
    fontWeight: '600',
    color: cores.texto,
  },
});