// ORGANISM — ResumoGastos (orçamento, distribuição por categoria e botão)
// aoAbrirHistorico, aoAbrirEstatisticas: opcionais. Quando existem, o card
// correspondente passa a reagir ao toque.
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Button } from '../atoms/Button';
import { Card } from '../atoms/Card';
import { ProgressBar } from '../atoms/ProgressBar';
import { GraficoBarras } from '../molecules/GraficoBarras';
import { LinhaValor } from '../molecules/LinhaValor';
import { formatarReais } from '../../utils/formatacao';
import { cores, espacamentos, tipografia } from '../../theme';

// Torna o conteúdo tocável só se houver uma ação.
function Toque({ aoPressionar, children }) {
  if (!aoPressionar) {
    return children;
  }

  return (
    <Pressable
      onPress={aoPressionar}
      accessibilityRole="button"
      style={({ pressed }) => pressed && estilos.pressionado}
    >
      {children}
    </Pressable>
  );
}

export function ResumoGastos({
  resumo,
  aoAbrirHistorico,
  aoAbrirEstatisticas,
  aoRegistrar,
}) {
  const { orcamento, gasto, distribuicao } = resumo;
  const disponivel = orcamento - gasto;
  const progresso = orcamento > 0 ? gasto / orcamento : 0;

  const dadosGrafico = distribuicao.map((item) => ({
    rotulo: item.categoria,
    valor: item.valor,
  }));

  return (
    <View style={estilos.tela}>
      <View style={estilos.cartoes}>
        <Toque aoPressionar={aoAbrirHistorico}>
          <Card>
            <LinhaValor rotulo="Orçamento" valor={formatarReais(orcamento)} />
            <LinhaValor rotulo="Gasto" valor={formatarReais(gasto)} />
            <LinhaValor rotulo="Disponível" valor={formatarReais(disponivel)} />

            <View style={estilos.barra}>
              <ProgressBar valor={progresso} altura={8} />
            </View>
          </Card>
        </Toque>

        <Toque aoPressionar={aoAbrirEstatisticas}>
          <Card>
            <Text style={estilos.titulo}>Distribuição</Text>
            <GraficoBarras dados={dadosGrafico} />
          </Card>
        </Toque>
      </View>

      <Button
        titulo="+ Registrar gasto"
        variante="escuro"
        aoPressionar={aoRegistrar}
      />
    </View>
  );
}

const estilos = StyleSheet.create({
  // Ocupa o resto da tela: cards em cima, botão embaixo.
  tela: {
    flexGrow: 1,
    justifyContent: 'space-between',
    gap: espacamentos.lg,
  },
  cartoes: { gap: espacamentos.lg },
  barra: { marginTop: espacamentos.sm },
  titulo: {
    marginBottom: espacamentos.md,
    fontSize: tipografia.corpo,
    fontWeight: '600',
    color: cores.texto,
  },
  pressionado: { opacity: 0.7 },
});