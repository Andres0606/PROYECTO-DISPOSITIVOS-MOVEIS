// MOLECULE — CabecalhoAcesso (chevron "voltar" + logo; telas de acesso internas)
import { StyleSheet, View } from 'react-native';
import { BotaoVoltar } from '../atoms/BotaoVoltar';
import { Logo } from '../atoms/Logo';
import { espacamentos } from '../../theme';

export function CabecalhoAcesso({ aoVoltar, style }) {
  return (
    <View style={[estilos.cabecalho, style]}>
      <BotaoVoltar aoPressionar={aoVoltar} style={estilos.voltar} />
      <Logo />
    </View>
  );
}

const estilos = StyleSheet.create({
  // Ocupa a largura toda da tela (anula o padding do template) para que o
  // chevron, posicionado em x=13 como no Figma, fique dentro da área tocável.
  cabecalho: {
    marginHorizontal: -espacamentos.lg,
    alignItems: 'center',
  },
  voltar: {
    position: 'absolute',
    left: 13,
    top: 20,
  },
});