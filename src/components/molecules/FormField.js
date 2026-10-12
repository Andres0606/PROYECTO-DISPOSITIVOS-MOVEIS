// MOLECULE — FormField (rótulo + Input + mensagem de erro)
import { StyleSheet, Text, View } from 'react-native';
import { Input } from '../atoms/Input';
import { cores, espacamentos, tipografia } from '../../theme';

export function FormField({
  rotulo,
  erro = '',
  margemInferior = espacamentos.sm,
  ...resto
}) {
  return (
    <View style={{ marginBottom: margemInferior }}>
      <Text style={estilos.rotulo}>{rotulo}</Text>
      <Input erro={!!erro} {...resto} />
      {!!erro && <Text style={estilos.mensagemErro}>{erro}</Text>}
    </View>
  );
}

const estilos = StyleSheet.create({
  rotulo: {
    marginBottom: espacamentos.xs,
    fontSize: tipografia.corpo,
    lineHeight: 21,
    fontWeight: '600',
    color: cores.texto,
  },
  mensagemErro: {
    marginTop: espacamentos.xs,
    fontSize: tipografia.legenda,
    color: cores.perigo,
  },
});