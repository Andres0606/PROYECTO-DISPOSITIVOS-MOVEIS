// MOLECULE — SeletorMes

import { StyleSheet, Text, View } from 'react-native';
import { BotaoIcone } from '../atoms/BotaoIcone';
import { deslocarMes } from '../../utils/datas';
import { formatarPeriodo } from '../../utils/formatacao';
import { espacamentos, tipografia } from '../../theme';
import { useTema } from '../../theme/useTema';

export function SeletorMes({
  periodo, aoMudar, desabilitado = false,
}) {
  const { cores } = useTema();

  function alterar(deslocamento) {
    if (!desabilitado) {
      aoMudar(deslocarMes(periodo, deslocamento));
    }
  }

  return (
    <View style={estilos.linha}>
      <BotaoIcone nome="chevron-back" tamanho={22}
        rotulo="Mês anterior" aoPressionar={() => alterar(-1)} />

      <Text style={[estilos.periodo, { color: cores.texto }]}>
        {formatarPeriodo(periodo.ano, periodo.mes)}
      </Text>

      <BotaoIcone nome="chevron-forward" tamanho={22}
        rotulo="Próximo mês" aoPressionar={() => alterar(1)} />
    </View>
  );
}

const estilos = StyleSheet.create({
  linha: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: espacamentos.md,
  },
  periodo: {
    fontSize: tipografia.subtitulo,
    fontWeight: '600',
  },
});