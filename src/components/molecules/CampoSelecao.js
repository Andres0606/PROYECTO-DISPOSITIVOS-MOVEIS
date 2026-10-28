// MOLECULE — CampoSelecao (rótulo + campo que abre uma lista de opções)
// opcoes: lista de textos. aoMudar(opcao) é chamado ao escolher.
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FormField } from './FormField';
import { cores, espacamentos, raios, tipografia } from '../../theme';

export function CampoSelecao({
  rotulo,
  opcoes,
  valor,
  aoMudar,
  margemInferior,
}) {
  const [aberto, setAberto] = useState(false);

  function escolher(opcao) {
    aoMudar(opcao);
    setAberto(false);
  }

  return (
    <FormField rotulo={rotulo} margemInferior={margemInferior}>
      <Pressable
        onPress={() => setAberto((atual) => !atual)}
        accessibilityRole="button"
        accessibilityState={{ expanded: aberto }}
        style={[estilos.campo, aberto && estilos.campoAberto]}
      >
        <Text style={estilos.valor}>{valor}</Text>
        <Ionicons
          name={aberto ? 'chevron-up' : 'chevron-down'}
          size={18}
          color={cores.textoSecundario}
        />
      </Pressable>

      {aberto && (
        <View style={estilos.lista}>
          {opcoes.map((opcao, indice) => {
            const selecionada = opcao === valor;

            return (
              <Pressable
                key={opcao}
                onPress={() => escolher(opcao)}
                accessibilityRole="button"
                accessibilityState={{ selected: selecionada }}
                style={[estilos.opcao, indice > 0 && estilos.separador]}
              >
                <Text
                  style={[
                    estilos.textoOpcao,
                    selecionada && estilos.textoSelecionado,
                  ]}
                >
                  {opcao}
                </Text>
                {selecionada && (
                  <Ionicons name="checkmark" size={16} color={cores.texto} />
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
    borderColor: cores.borda,
    borderRadius: raios.sm,
    backgroundColor: cores.superficie,
  },
  campoAberto: { borderColor: cores.bordaFoco },
  valor: {
    fontSize: tipografia.corpo,
    color: cores.texto,
  },
  lista: {
    marginTop: espacamentos.xs,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: cores.borda,
    borderRadius: raios.sm,
    backgroundColor: cores.superficie,
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
    borderTopColor: cores.divisor,
  },
  textoOpcao: {
    fontSize: tipografia.corpo,
    color: cores.texto,
  },
  textoSelecionado: { fontWeight: '600' },
});