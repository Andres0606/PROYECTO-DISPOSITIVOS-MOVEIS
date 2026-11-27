/* grupo5.1 */
import { formatarDataNumerica } from '../../utils/formatacao';
import { rotuloCatalogo3 } from '../../i18n/catalogosGrupo3';
import { usePreferencias } from '../../contexts/PreferenciasContext';

// MOLECULE — CardAtividade

import { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { FotoLocal } from '../atoms/FotoLocal';
import { Etiqueta } from '../atoms/Etiqueta';
import { espacamentos, raios, tipografia } from '../../theme';
import { useTema } from '../../theme/useTema';

export function CardAtividade({ atividade, aoAbrir, mostrarEstado = false }) {
  const { t, idioma } = usePreferencias();
  const { cores } = useTema();
  const estilos = useMemo(() => criarEstilos(cores), [cores]);

  return (
    <Pressable
      onPress={aoAbrir}
      accessibilityRole="button"
      style={({ pressed }) => [
        estilos.cartao,
        pressed && estilos.pressionado,
      ]}
    >
      <FotoLocal
        imagem={atividade.imagem ? { uri: atividade.imagem } : undefined}
        style={estilos.imagem}
      />

      <View style={estilos.linhaPrincipal}>
        <View style={estilos.informacoes}>
          <Text style={estilos.titulo} numberOfLines={1}>
            {atividade.titulo}
          </Text>

          <Text style={estilos.detalhes}>
            {formatarDataNumerica(atividade.dataAtividade, idioma)}{' · '}{atividade.horario}
            {' · '}{atividade.interessados}{' '}{t('grupo3.g140')}
          </Text>

          {mostrarEstado && (
            <View style={estilos.estado}>
              <Etiqueta titulo={atividade.vencida ? t('grupo3.g115') : t('grupo3.g141')} />
            </View>
          )}
        </View>

        <Etiqueta titulo={rotuloCatalogo3(atividade.categoria, t)} />
      </View>
    </Pressable>
  );
}

function criarEstilos(cores) {
  return StyleSheet.create({
    cartao: {
      backgroundColor: cores.superficie,
      borderWidth: 1,
      borderColor: cores.borda,
      borderRadius: raios.sm,
      padding: espacamentos.sm,
      gap: espacamentos.sm,
    },
    imagem: {
      width: '100%',
      height: 125,
      borderRadius: raios.sm,
    },
    linhaPrincipal: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: espacamentos.sm,
    },
    informacoes: { flex: 1 },
    titulo: {
      fontSize: tipografia.legenda,
      fontWeight: '700',
      color: cores.texto,
      marginBottom: 3,
    },
    detalhes: {
      fontSize: 11,
      color: cores.textoSecundario,
    },
    estado: {
      alignSelf: 'flex-start',
      marginTop: espacamentos.xs,
    },
    pressionado: { opacity: 0.65 },
  });
}
