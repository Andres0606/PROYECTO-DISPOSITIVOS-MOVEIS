// MOLECULE — CampoSelecao
// Campo com lista de opções.

import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FormField } from './FormField';
import { espacamentos, raios, tipografia } from '../../theme';
import { useTema } from '../../theme/useTema';

export function CampoSelecao({
  rotulo,
  opcoes,
  valor,
  aoMudar,
  margemInferior,
  desabilitado = false,
}) {
  const { cores } = useTema();
  const [aberto, setAberto] = useState(false);

  function escolher(opcao) {
    if (desabilitado) return;

    aoMudar(opcao);
    setAberto(false);
  }

  return (
    <FormField rotulo={rotulo} margemInferior={margemInferior}>
      <Pressable
        onPress={() => setAberto(atual => !atual)}
        disabled={desabilitado}
        accessibilityRole="button"
        accessibilityState={{
          expanded: aberto && !desabilitado,
          disabled: desabilitado,
        }}
        style={[
          estilos.campo,
          {
            borderColor: cores.borda,
            backgroundColor: cores.superficie,
          },
          aberto && !desabilitado && {
            borderColor: cores.bordaFoco,
          },
        ]}
      >
        <Text style={[estilos.valor, { color: cores.texto }]}>
          {valor}
        </Text>

        <Ionicons
          name={aberto && !desabilitado ? 'chevron-up' : 'chevron-down'}
          size={18}
          color={cores.textoSecundario}
        />
      </Pressable>

      {aberto && !desabilitado && (
        <View style={[
          estilos.lista,
          {
            borderColor: cores.borda,
            backgroundColor: cores.superficie,
          },
        ]}>
          {opcoes.map((opcao, indice) => {
            const selecionada = opcao === valor;

            return (
              <Pressable
                key={opcao}
                onPress={() => escolher(opcao)}
                disabled={desabilitado}
                accessibilityRole="button"
                accessibilityState={{
                  selected: selecionada,
                  disabled: desabilitado,
                }}
                style={[
                  estilos.opcao,
                  indice > 0 && [
                    estilos.separador,
                    { borderTopColor: cores.divisor },
                  ],
                ]}
              >
                <Text style={[
                  estilos.textoOpcao,
                  { color: cores.texto },
                  selecionada && estilos.textoSelecionado,
                ]}>
                  {opcao}
                </Text>

                {selecionada && (
                  <Ionicons
                    name="checkmark"
                    size={16}
                    color={cores.texto}
                  />
                )}
              </Pressable>
            );
          })}
        </View>
      )}
    </FormField>
  );
}

const estilos = StyleSheet.create({
  campo: {
    minHeight: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: espacamentos.md,
    borderWidth: 1,
    borderRadius: raios.sm,
  },
  valor: {
    fontSize: tipografia.corpo,
  },
  lista: {
    marginTop: espacamentos.xs,
    overflow: 'hidden',
    borderWidth: 1,
    borderRadius: raios.sm,
  },
  opcao: {
    minHeight: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: espacamentos.md,
  },
  separador: {
    borderTopWidth: 1,
  },
  textoOpcao: {
    fontSize: tipografia.corpo,
  },
  textoSelecionado: {
    fontWeight: '600',
  },
});