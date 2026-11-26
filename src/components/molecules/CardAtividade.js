
// MOLECULE — CardAtividade

import { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { FotoLocal } from '../atoms/FotoLocal';
import { Etiqueta } from '../atoms/Etiqueta';
import { espacamentos, raios, tipografia } from '../../theme';
import { useTema } from '../../theme/useTema';

export function CardAtividade({ atividade, aoAbrir, mostrarEstado = false }) {
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
            {atividade.data}{' · '}{atividade.horario}
            {' · '}{atividade.interessados}{' '}interessados
          </Text>

          {mostrarEstado && (
            <View style={estilos.estado}>
              <Etiqueta titulo={atividade.vencida ? 'Encerrada' : 'Próxima'} />
            </View>
          )}
        </View>

        <Etiqueta titulo={atividade.categoria} />
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
