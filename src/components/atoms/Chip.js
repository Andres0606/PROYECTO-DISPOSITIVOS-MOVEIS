// ATOM — Chip (atalho de 32 px de altura)
// variante: 'contorno' (padrão) | 'suave' (fundo cinza) | 'selecionado' (escuro)
import { Pressable, StyleSheet, Text } from 'react-native';
import { cores, espacamentos, raios, tipografia } from '../../theme';

export function Chip({ titulo, aoPressionar, variante = 'contorno' }) {
  return (
    <Pressable
      onPress={aoPressionar}
      accessibilityRole="button"
      style={({ pressed }) => [
        estilos.chip,
        estilos[variante],
        pressed && estilos.pressionado,
      ]}
    >
      <Text
        style={[
          estilos.titulo,
          variante === 'suave' && estilos.tituloSuave,
          variante === 'selecionado' && estilos.tituloSelecionado,
        ]}
      >
        {titulo}
      </Text>
    </Pressable>
  );
}

const estilos = StyleSheet.create({
  chip: {
    height: 32,
    justifyContent: 'center',
    paddingHorizontal: espacamentos.md - 2,
    borderRadius: raios.sm,
    borderWidth: 1,
  },
  contorno: {
    borderColor: cores.chipBorda,
    backgroundColor: 'transparent',
  },
  suave: {
    borderColor: cores.decoracaoClara,
    backgroundColor: cores.decoracaoClara,
  },
  selecionado: {
    borderColor: cores.pillSelecionado,
    backgroundColor: cores.pillSelecionado,
  },
  pressionado: { opacity: 0.6 },
  titulo: {
    fontSize: tipografia.corpo,
    fontWeight: '500',
    color: cores.chipTexto,
  },
  tituloSuave: { color: cores.textoSecundario },
  tituloSelecionado: { color: cores.superficie },
});