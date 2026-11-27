import { usePreferencias } from '../contexts/PreferenciasContext';
// SCREEN — Atividades e planos
import { useCallback, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { ScreenTemplate } from '../components/templates/ScreenTemplate';
import { CardAtividade } from '../components/molecules/CardAtividade';
import { BotaoSegmentado } from '../components/molecules/BotaoSegmentado';
import { BotaoFlutuante } from '../components/atoms/BotaoFlutuante';
import { Button } from '../components/atoms/Button';
import { obterAtividades } from '../services/atividades';
import { espacamentos, tipografia } from '../theme';
import { useTema } from '../theme/useTema';

const OPCOES_ORDENACAO = [
  { titulo: 'Próximas', valor: 'recentes' },
  { titulo: 'Populares', valor: 'populares' },
  { titulo: 'Minhas atividades', valor: 'minhas' },
];

export function AtividadesScreen({ navigation, route }) {
  const { t } = usePreferencias();
  const apenasMinhas = route.params?.apenasMinhas === true;
  const { cores } = useTema();
  const estilos = useMemo(() => criarEstilos(cores), [cores]);
  const [ordenacao, setOrdenacao] = useState(apenasMinhas ? 'minhas' : 'recentes');
  const [atividades, setAtividades] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');
  const consultaAtual = useRef(0);

  const carregar = useCallback(async () => {
    const consulta = ++consultaAtual.current;
    setCarregando(true);
    setErro('');
    try {
      const resultado = await obterAtividades(ordenacao);
      if (consulta === consultaAtual.current) setAtividades(resultado);
    } catch (erro) {
      if (consulta === consultaAtual.current) {
        setAtividades([]);
        setErro(t('grupo3.g054'));
      }
    } finally {
      if (consulta === consultaAtual.current) setCarregando(false);
    }
  }, [t, ordenacao]);

  useFocusEffect(useCallback(() => {
    carregar();
    return () => { consultaAtual.current += 1; };
  }, [carregar]));

  function abrirAtividade(atividade) {
    navigation.navigate('AtividadeDetalhe', { atividadeId: atividade.id, ordenacao });
  }

  function criarAtividade() {
    navigation.navigate('CriarAtividade');
  }

  return (
    <ScreenTemplate titulo={apenasMinhas ? t('grupo3.g053') : t('grupo3.g055')}
      aoVoltar={() => navigation.goBack()}
      flutuante={<BotaoFlutuante aoPressionar={criarAtividade} rotulo={t('grupo3.g056')} />}>
      {!apenasMinhas && (
        <View style={estilos.ordenacao}>
          <BotaoSegmentado opcoes={OPCOES_ORDENACAO.map(item => ({ ...item, titulo: item.valor === 'populares' ? t('grupo3.g023') : item.valor === 'minhas' ? t('grupo3.g053') : t('grupo3.g052') }))} valor={ordenacao} aoMudar={setOrdenacao} />
        </View>
      )}
      {carregando ? (
        <ActivityIndicator color={cores.primaria} style={estilos.carregando} />
      ) : erro ? (
        <View style={estilos.estadoVazio}>
          <Ionicons name="alert-circle-outline" size={40} color={cores.perigo} />
          <Text style={estilos.erro}>{erro}</Text>
          <Button titulo={t('grupo3.g002')} variante="secundario" aoPressionar={carregar} />
        </View>
      ) : atividades.length === 0 ? (
        <View style={estilos.estadoVazio}>
          <Ionicons name="calendar-outline" size={48} color={cores.textoSecundario} />
          <Text style={estilos.tituloVazio}>
            {ordenacao === 'minhas' ? t('grupo3.g057') : t('grupo3.g058')}
          </Text>
          <Text style={estilos.textoVazio}>
            {t('grupo3.g059')}
          </Text>
          <Button titulo={t('grupo3.g060')} variante="escuro" aoPressionar={criarAtividade} />
        </View>
      ) : (
        <View style={estilos.lista}>
          {atividades.map(atividade => (
            <CardAtividade key={atividade.id} atividade={atividade}
              mostrarEstado={ordenacao === 'minhas'} aoAbrir={() => abrirAtividade(atividade)} />
          ))}
        </View>
      )}
    </ScreenTemplate>
  );
}

function criarEstilos(cores) {
  return StyleSheet.create({
    ordenacao: { marginBottom: espacamentos.lg },
    lista: { gap: espacamentos.md },
    carregando: { marginTop: espacamentos.xl },
    estadoVazio: { marginTop: espacamentos.xl, paddingHorizontal: espacamentos.md, alignItems: 'center', gap: espacamentos.md },
    tituloVazio: { fontSize: tipografia.corpo, fontWeight: '700', color: cores.texto, textAlign: 'center' },
    textoVazio: { fontSize: tipografia.legenda, color: cores.textoSecundario, textAlign: 'center', lineHeight: 20 },
    erro: { fontSize: tipografia.corpo, color: cores.perigo, textAlign: 'center' },
  });
}
