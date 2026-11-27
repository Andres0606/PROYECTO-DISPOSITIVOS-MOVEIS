import { usePreferencias } from '../../contexts/PreferenciasContext';
// ORGANISM — FormularioOrcamento

import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { FormField } from '../molecules/FormField';
import { Button } from '../atoms/Button';
import {
  limparValor, numeroParaValor, valorParaNumero, valorMonetarioValido,
} from '../../utils/moeda';
import { espacamentos, tipografia } from '../../theme';
import { useTema } from '../../theme/useTema';

export function FormularioOrcamento({
  valorInicial, aoSalvar, aoCancelar,
  salvando = false, erroGeral = '',
}) {
  const { t } = usePreferencias();
  const { cores } = useTema();
  const [valor, setValor] = useState(
    valorInicial === null ? '' : numeroParaValor(valorInicial)
  );
  const [erro, setErro] = useState('');

  function salvar() {
    if (salvando) return;

    if (!valorMonetarioValido(valor)) {
      setErro(t('grupo2.g127'));
      return;
    }

    setErro('');
    aoSalvar(valorParaNumero(valor));
  }

  return (
    <View style={estilos.formulario}>
      <FormField rotulo={t('grupo2.g128')}
        placeholder="R$ 2.000,00"
        value={valor}
        onChangeText={texto => {
          setValor(limparValor(texto));
          setErro('');
        }}
        keyboardType="decimal-pad"
        editable={!salvando}
        erro={erro} />

      {!!erroGeral && (
        <Text style={[estilos.erro, { color: cores.perigo }]}>
          {erroGeral}
        </Text>
      )}

      <Button titulo={t('grupo2.g129')} variante="escuro"
        aoPressionar={salvar} carregando={salvando} />

      <Button titulo={t('grupo2.g023')} variante="contorno"
        aoPressionar={aoCancelar} desabilitado={salvando} />
    </View>
  );
}

const estilos = StyleSheet.create({
  formulario: { marginTop: espacamentos.md, gap: espacamentos.sm },
  erro: { fontSize: tipografia.legenda, textAlign: 'center' },
});