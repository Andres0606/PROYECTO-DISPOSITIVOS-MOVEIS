
// ORGANISM — ResumoGastos

import { StyleSheet, Text, View } from 'react-native';
import { Button } from '../atoms/Button';
import { Card } from '../atoms/Card';
import { ProgressBar } from '../atoms/ProgressBar';
import { BotaoIcone } from '../atoms/BotaoIcone';
import { GraficoBarras } from '../molecules/GraficoBarras';
import { LinhaValor } from '../molecules/LinhaValor';
import { FormularioOrcamento } from './FormularioOrcamento';
import { formatarReais } from '../../utils/formatacao';
import { espacamentos, tipografia } from '../../theme';
import { useTema } from '../../theme/useTema';

export function ResumoGastos({
  resumo, aoAbrirHistorico, aoAbrirEstatisticas, aoRegistrar,
  editando, aoEditarOrcamento, aoSalvarOrcamento, aoCancelarOrcamento,
  salvando, erroOrcamento,
}) {
  const { cores } = useTema();
  const { orcamento, gasto, disponivel, distribuicao } = resumo;

  const definido = orcamento !== null;
  const ultrapassado = definido && disponivel < 0;
  const progresso = definido && orcamento > 0 ? gasto / orcamento : 0;
  const dadosGrafico = distribuicao.map(item => ({
    rotulo: item.categoria,
    valor: item.valor,
  }));

  return (
    <View style={estilos.tela}>
      <View style={estilos.cartoes}>
        <Card>
          <View style={estilos.cabecalho}>
            <View style={estilos.valor}>
              <LinhaValor rotulo="Orçamento"
                valor={definido ? formatarReais(orcamento) : 'Não definido'} />
            </View>

            <BotaoIcone nome="pencil-outline" tamanho={18}
              rotulo="Editar orçamento"
              aoPressionar={() => {
                if (!salvando) aoEditarOrcamento();
              }} />
          </View>

          <LinhaValor rotulo="Gasto" valor={formatarReais(gasto)} />
          <LinhaValor rotulo="Disponível"
            valor={definido ? formatarReais(disponivel) : '—'} />

          {definido && (
            <View style={estilos.barra}>
              <ProgressBar valor={progresso} altura={8}
                alerta={ultrapassado} />

              <Text style={[
                estilos.aviso,
                { color: ultrapassado ? cores.perigo : cores.textoSecundario },
              ]}>
                {(progresso * 100).toFixed(1).replace('.', ',')}%
                {' do orçamento utilizado'}
              </Text>
            </View>
          )}

          {!definido && !editando && (
            <Text style={[estilos.aviso, { color: cores.textoSecundario }]}>
              Defina um orçamento para acompanhar seus gastos.
            </Text>
          )}

          {ultrapassado && (
            <Text style={[estilos.aviso, { color: cores.perigo }]}>
              Orçamento ultrapassado em {formatarReais(Math.abs(disponivel))}.
            </Text>
          )}

          {editando && (
            <FormularioOrcamento
              valorInicial={orcamento}
              aoSalvar={aoSalvarOrcamento}
              aoCancelar={aoCancelarOrcamento}
              salvando={salvando}
              erroGeral={erroOrcamento}
            />
          )}
        </Card>

        <Card>
          <Text style={[estilos.titulo, { color: cores.texto }]}>
            Distribuição
          </Text>

          {distribuicao.length > 0 ? (
            <GraficoBarras dados={dadosGrafico} />
          ) : (
            <Text style={[estilos.aviso, { color: cores.textoSecundario }]}>
              Nenhum gasto neste mês.
            </Text>
          )}

          <View style={estilos.barra}>
            <Button titulo="Ver estatísticas" variante="secundario"
              aoPressionar={aoAbrirEstatisticas} desabilitado={salvando} />
          </View>
        </Card>
      </View>

      <View style={estilos.acoes}>
        <Button titulo="Ver histórico" variante="contorno"
          aoPressionar={aoAbrirHistorico} desabilitado={salvando} />

        <Button titulo="+ Registrar gasto" variante="escuro"
          aoPressionar={aoRegistrar} desabilitado={salvando} />
      </View>
    </View>
  );
}

const estilos = StyleSheet.create({
  tela: {
    flexGrow: 1,
    justifyContent: 'space-between',
    gap: espacamentos.lg,
  },
  cartoes: { gap: espacamentos.lg },
  cabecalho: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: espacamentos.sm,
  },
  valor: { flex: 1 },
  barra: { marginTop: espacamentos.md },
  titulo: {
    marginBottom: espacamentos.md,
    fontSize: tipografia.corpo,
    fontWeight: '600',
  },
  aviso: {
    marginTop: espacamentos.sm,
    fontSize: tipografia.legenda,
    textAlign: 'center',
  },
  acoes: { gap: espacamentos.sm },
});
