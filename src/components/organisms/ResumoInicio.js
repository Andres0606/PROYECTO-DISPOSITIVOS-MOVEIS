import { usePreferencias } from '../../contexts/PreferenciasContext';

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
  const { t } = usePreferencias();
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
          titulo={t('grupo2.g051')}
          progresso={calcularProporcao(
            tarefas.concluidas,
            tarefas.total
          )}
          legenda={tarefas.total
            ? t('grupo2.g152', { v0: tarefas.concluidas, v1: tarefas.total })
            : t('grupo2.g052')}
        />
      </Pressable>

      {/* RESUMO DOS GASTOS */}

      <Pressable
        onPress={() => aoAbrirAtalho('gastos')}
        accessibilityRole="button"
      >
        <CardInfo
          titulo={t('grupo2.g153', { v0: gastos.periodo })}
          detalhe={formatarReais(gastos.gasto)}
          progresso={temOrcamento
            ? calcularProporcao(gastos.gasto, gastos.orcamento)
            : undefined}
          alerta={excedido}
          legenda={!temOrcamento
            ? t('grupo2.g053')
            : t('grupo2.g154', { v0: formatarReais(gastos.orcamento) })}
          texto={temOrcamento
            ? excedido
              ? t('grupo2.g155', { v0: formatarReais(-gastos.disponivel) })
              : t('grupo2.g156', { v0: formatarReais(gastos.disponivel) })
            : t('grupo2.g054')}
        />
      </Pressable>

      {/* ACESSO RÁPIDO */}

      <View style={estilos.secaoAtalhos}>

        <Text style={[
          estilos.tituloAtalhos,
          { color: cores.texto },
        ]}>
          {t('grupo2.g055')}
        </Text>

        <View style={estilos.atalhos}>

          {ATALHOS.map(atalho => (
            <Pressable
              key={atalho.chave}
              accessibilityRole="button"
              accessibilityLabel={({ portugues: t('grupo2.g048'), conselhos: t('grupo2.g049'), atividades: t('grupo2.g050') }[atalho.chave] ?? atalho.titulo)}
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
                {({ portugues: t('grupo2.g048'), conselhos: t('grupo2.g049'), atividades: t('grupo2.g050') }[atalho.chave] ?? atalho.titulo)}
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
          titulo={t('grupo2.g056')}
          texto={conselhoDestaque
            ? `“${conselhoDestaque.texto}” — ${[
              conselhoDestaque.autor,
              conselhoDestaque.pais,
            ].filter(Boolean).join(', ')}.`
            : t('grupo2.g057')}
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
          titulo={t('grupo2.g058')}
          detalhe={proximaAtividade?.data}
          texto={proximaAtividade?.titulo
            ?? t('grupo2.g059')}
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
