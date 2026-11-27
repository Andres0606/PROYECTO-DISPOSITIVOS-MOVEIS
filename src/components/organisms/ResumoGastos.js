/* grupo5.1 */
import { rotuloCatalogo } from '../../i18n/catalogosGrupo2';
import { usePreferencias } from '../../contexts/PreferenciasContext';

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
  const { t, idioma } = usePreferencias();
  const { cores } = useTema();
  const { orcamento, gasto, disponivel, distribuicao } = resumo;

  const definido = orcamento !== null;
  const ultrapassado = definido && disponivel < 0;
  const progresso = definido && orcamento > 0 ? gasto / orcamento : 0;
  const dadosGrafico = distribuicao.map(item => ({
    rotulo: rotuloCatalogo(item.categoria, t),
    valor: item.valor,
  }));

  return (
    <View style={estilos.tela}>
      <View style={estilos.cartoes}>
        <Card>
          <View style={estilos.cabecalho}>
            <View style={estilos.valor}>
              <LinhaValor rotulo={t('grupo2.g096')}
                valor={definido ? formatarReais(orcamento, idioma) : t('grupo2.g097')} />
            </View>

            <BotaoIcone nome="pencil-outline" tamanho={18}
              rotulo={t('grupo2.g098')}
              aoPressionar={() => {
                if (!salvando) aoEditarOrcamento();
              }} />
          </View>

          <LinhaValor rotulo={t('grupo2.g099')} valor={formatarReais(gasto, idioma)} />
          <LinhaValor rotulo={t('grupo2.g100')}
            valor={definido ? formatarReais(disponivel, idioma) : '—'} />

          {definido && (
            <View style={estilos.barra}>
              <ProgressBar valor={progresso} altura={8}
                alerta={ultrapassado} />

              <Text style={[
                estilos.aviso,
                { color: ultrapassado ? cores.perigo : cores.textoSecundario },
              ]}>
                {(progresso * 100).toFixed(1).replace('.', ',')}%
                {t('grupo2.g101')}
              </Text>
            </View>
          )}

          {!definido && !editando && (
            <Text style={[estilos.aviso, { color: cores.textoSecundario }]}>
              {t('grupo2.g102')}
            </Text>
          )}

          {ultrapassado && (
            <Text style={[estilos.aviso, { color: cores.perigo }]}>
              {t('grupo2.g103')} {formatarReais(Math.abs(disponivel), idioma)}.
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
            {t('grupo2.g104')}
          </Text>

          {distribuicao.length > 0 ? (
            <GraficoBarras dados={dadosGrafico} />
          ) : (
            <Text style={[estilos.aviso, { color: cores.textoSecundario }]}>
              {t('grupo2.g105')}
            </Text>
          )}

          <View style={estilos.barra}>
            <Button titulo={t('grupo2.g106')} variante="secundario"
              aoPressionar={aoAbrirEstatisticas} desabilitado={salvando} />
          </View>
        </Card>
      </View>

      <View style={estilos.acoes}>
        <Button titulo={t('grupo2.g107')} variante="contorno"
          aoPressionar={aoAbrirHistorico} desabilitado={salvando} />

        <Button titulo={t('grupo2.g108')} variante="escuro"
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
