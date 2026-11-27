
// ORGANISM — ResumoInicio

import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { CardInfo } from '../molecules/CardInfo';

import { espacamentos, raios, tipografia } from '../../theme';
import { useTema } from '../../theme/useTema';
import { formatarReais } from '../../utils/formatacao';

const ATALHOS = [
  {
    chave: 'portugues',
    titulo: 'Português útil',
    icone: 'language-outline',
  },
  {
    chave: 'conselhos',
    titulo: 'Conselhos úteis',
    icone: 'chatbubbles-outline',
  },
  {
    chave: 'atividades',
    titulo: 'Atividades e planos',
    icone: 'calendar-outline',
  },
];

function calcularProporcao(parte, total) {
  return total > 0 ? parte / total : 0;
}

export function ResumoInicio({ resumo, aoAbrirAtalho }) {
  const { cores } = useTema();

  const {
    tarefas,
    gastos,
    conselhoDestaque,
    proximaAtividade,
  } = resumo;

  const temOrcamento = gastos.orcamento !== null;
  const excedido = temOrcamento && gastos.disponivel < 0;

  return (
    <View style={estilos.lista}>

      {/* RESUMO DO INTERCÂMBIO */}

      <Pressable
        onPress={() => aoAbrirAtalho('tarefas')}
        accessibilityRole="button"
      >
        <CardInfo
          titulo="Seu intercâmbio em Chapecó"
          progresso={calcularProporcao(
            tarefas.concluidas,
            tarefas.total
          )}
          legenda={tarefas.total
            ? `${tarefas.concluidas} de ${tarefas.total} tarefas concluídas`
            : 'Nenhuma tarefa cadastrada.'}
        />
      </Pressable>

      {/* RESUMO DOS GASTOS */}

      <Pressable
        onPress={() => aoAbrirAtalho('gastos')}
        accessibilityRole="button"
      >
        <CardInfo
          titulo={`Gastos — ${gastos.periodo}`}
          detalhe={formatarReais(gastos.gasto)}
          progresso={temOrcamento
            ? calcularProporcao(gastos.gasto, gastos.orcamento)
            : undefined}
          alerta={excedido}
          legenda={!temOrcamento
            ? 'Orçamento ainda não definido.'
            : `Orçamento: ${formatarReais(gastos.orcamento)}`}
          texto={temOrcamento
            ? excedido
              ? `Orçamento excedido em ${formatarReais(-gastos.disponivel)}.`
              : `Disponível: ${formatarReais(gastos.disponivel)}`
            : 'Toque para definir seu orçamento.'}
        />
      </Pressable>

      {/* ACESSO RÁPIDO */}

      <View style={estilos.secaoAtalhos}>

        <Text style={[
          estilos.tituloAtalhos,
          { color: cores.texto },
        ]}>
          Acesso rápido
        </Text>

        <View style={estilos.atalhos}>

          {ATALHOS.map(atalho => (
            <Pressable
              key={atalho.chave}
              accessibilityRole="button"
              accessibilityLabel={atalho.titulo}
              onPress={() => aoAbrirAtalho(atalho.chave)}
              style={({ pressed }) => [
                estilos.cartaoAtalho,
                {
                  backgroundColor: cores.superficie,
                  borderColor: cores.borda,
                },
                pressed && estilos.pressionado,
              ]}
            >

              <View style={[
                estilos.iconeAtalho,
                { backgroundColor: cores.decoracao },
              ]}>
                <Ionicons
                  name={atalho.icone}
                  size={23}
                  color={cores.texto}
                />
              </View>

              <Text style={[
                estilos.textoAtalho,
                { color: cores.texto },
              ]}>
                {atalho.titulo}
              </Text>

            </Pressable>
          ))}

        </View>

      </View>

      {/* CONSELHO EM DESTAQUE */}

      <Pressable
        accessibilityRole="button"
        onPress={() => aoAbrirAtalho(
          'conselhoDetalhe',
          conselhoDestaque?.id
        )}
      >
        <CardInfo
          titulo="Conselho em destaque"
          texto={conselhoDestaque
            ? `“${conselhoDestaque.texto}” — ${[
              conselhoDestaque.autor,
              conselhoDestaque.pais,
            ].filter(Boolean).join(', ')}.`
            : 'Nenhum conselho publicado.'}
        />
      </Pressable>

      {/* PRÓXIMA ATIVIDADE */}

      <Pressable
        accessibilityRole="button"
        onPress={() => aoAbrirAtalho(
          'atividadeDetalhe',
          proximaAtividade?.id
        )}
      >
        <CardInfo
          titulo="Próxima atividade"
          detalhe={proximaAtividade?.data}
          texto={proximaAtividade?.titulo
            ?? 'Nenhuma atividade próxima disponível.'}
        />
      </Pressable>

    </View>
  );
}

// ESTILOS

const estilos = StyleSheet.create({
  lista: {
    gap: espacamentos.md,
  },

  secaoAtalhos: {
    gap: espacamentos.sm,
  },

  tituloAtalhos: {
    fontSize: tipografia.corpo,
    fontWeight: '600',
  },

  atalhos: {
    flexDirection: 'row',
    alignItems: 'stretch',
    gap: espacamentos.sm,
  },

  cartaoAtalho: {
    flex: 1,
    minWidth: 0,
    minHeight: 112,
    borderWidth: 1,
    borderRadius: raios.md,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
    paddingVertical: espacamentos.md,
    gap: 10,
  },

  iconeAtalho: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },

  textoAtalho: {
    fontSize: tipografia.legenda,
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 18,
  },

  pressionado: {
    opacity: 0.65,
  },
});
