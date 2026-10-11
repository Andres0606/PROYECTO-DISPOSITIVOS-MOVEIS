// MOLECULE — FormField (rótulo + Input + mensagem de erro)
import { StyleSheet, Text, View } from 'react-native';
import { Input } from '../atoms/Input';
import { cores, espacamentos, tipografia } from '../../theme';

export function FormField({ rotulo, erro = '', ...resto }) {
  return (
    <View style={estilos.container}>
      <Text style={estilos.rotulo}>{rotulo}</Text>
      <Input erro={!!erro} {...resto} />
      {!!erro && <Text style={estilos.mensagemErro}>{erro}</Text>}
    </View>
  );
}

const estilos = StyleSheet.create({
  container: { marginBottom: espacamentos.md },
  rotulo: {
    marginBottom: espacamentos.xs,
    fontSize: tipografia.legenda,
    fontWeight: '600',
    color: cores.texto,
  },
  mensagemErro: {
    marginTop: espacamentos.xs,
    fontSize: tipografia.legenda,
    color: cores.perigo,
  },
});