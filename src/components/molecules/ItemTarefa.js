import { usePreferencias } from '../../contexts/PreferenciasContext';

// MOLECULE — ItemTarefa

import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Checkbox } from '../atoms/Checkbox';
import { BotaoIcone } from '../atoms/BotaoIcone';
import { espacamentos, tipografia } from '../../theme';
import { useTema } from '../../theme/useTema';

export function ItemTarefa({
  titulo, concluida, estado, ocupado = false,
  aoAlternar, aoAbrir, aoEditar,
}) {
  const { t } = usePreferencias();
  const { cores } = useTema();

  return (
    <View style={[
      estilos.linha,
      { borderBottomColor: cores.bordaForte },
    ]}>
      <Checkbox marcado={concluida}
        aoAlternar={aoAlternar} desabilitado={ocupado} />

      <Pressable onPress={aoAbrir} disabled={ocupado}
        accessibilityRole="button" style={estilos.texto}>

        <Text numberOfLines={2} style={[
          estilos.titulo,
          { color: concluida ? cores.textoSecundario : cores.texto },
        ]}>
          {titulo}
        </Text>

        {estado === 'Em Andamento' && (
          <Text style={[
            estilos.estado,
            { color: cores.textoSecundario },
          ]}>
            {t('grupo2.g130')}
          </Text>
        )}
      </Pressable>

      <BotaoIcone nome="pencil-outline" rotulo={t('grupo2.g025')}
        aoPressionar={() => { if (!ocupado) aoEditar?.(); }} />
    </View>
  );
}

const estilos = StyleSheet.create({
  linha: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: espacamentos.md - 4,
    paddingVertical: espacamentos.sm - 2,
    borderBottomWidth: 1,
  },
  texto: { flex: 1 },
  titulo: { fontSize: tipografia.subtitulo, lineHeight: 24 },
  estado: { fontSize: tipografia.legenda },
});
