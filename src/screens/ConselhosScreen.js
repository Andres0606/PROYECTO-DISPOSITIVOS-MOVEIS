import { usePreferencias } from '../contexts/PreferenciasContext';
// SCREEN — Conselhos de estudantes de intercâmbio
import { useCallback, useRef, useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { ScreenTemplate } from '../components/templates/ScreenTemplate';
import { CardConselho } from '../components/molecules/CardConselho';
import { BotaoSegmentado } from '../components/molecules/BotaoSegmentado';
import { BotaoFlutuante } from '../components/atoms/BotaoFlutuante';
import { Button } from '../components/atoms/Button';
import { obterConselhos, adicionarCurtidaConselho, removerCurtidaConselho } from '../services/conselhos';
import { espacamentos, tipografia } from '../theme';
import { useTema } from '../theme/useTema';

const OPCOES_ORDENACAO = [
  { titulo: 'Recentes', valor: 'recentes' },
  { titulo: 'Populares', valor: 'populares' },
];

export function ConselhosScreen({ navigation, route }) {
  const { t } = usePreferencias();
  const apenasMeus = route.params?.apenasMeus === true;
  const { cores } = useTema();
  const [ordenacao, setOrdenacao] = useState(apenasMeus ? 'meus' : 'recentes');
  const [conselhos, setConselhos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');
  const [curtindo, setCurtindo] = useState(false);
  const [revisao, setRevisao] = useState(0);
  const consultaAtual = useRef(0);
  const bloqueio = useRef(false);

  const carregar = useCallback(async () => {
    const consulta = ++consultaAtual.current;
    setCarregando(true);
    setErro('');
    try {
      const resultado = await obterConselhos(ordenacao);
      if (consulta === consultaAtual.current) setConselhos(resultado);
    } catch (erro) {
      if (consulta === consultaAtual.current) {
        setConselhos([]);
        setErro(t('grupo3.g024'));
      }
    } finally {
      if (consulta === consultaAtual.current) setCarregando(false);
    }
  }, [t, ordenacao]);

  useFocusEffect(useCallback(() => {
    carregar();
    return () => { consultaAtual.current += 1; };
  }, [carregar, revisao]));

  async function alternarCurtida(conselho) {
    if (bloqueio.current || carregando) return;
    bloqueio.current = true;
    setCurtindo(true);
    const consulta = consultaAtual.current;
    try {
      const resultado = conselho.curtido
        ? await removerCurtidaConselho(conselho.id)
        : await adicionarCurtidaConselho(conselho.id);
      if (consulta === consultaAtual.current) {
        setConselhos(atuais => {
          const lista = atuais.map(item => item.id === conselho.id
            ? { ...item, curtido: resultado.curtido, curtidas: resultado.curtidas }
            : item);
          if (ordenacao === 'populares') {
            lista.sort((a, b) => b.curtidas - a.curtidas || new Date(b.data) - new Date(a.data));
          }
          return lista;
        });
      } else {
        setRevisao(atual => atual + 1);
      }
    } catch (erro) {
      if (navigation.isFocused()) Alert.alert(t('grupo3.g025'), t('grupo3.g026'));
      setRevisao(atual => atual + 1);
    } finally {
      bloqueio.current = false;
      setCurtindo(false);
    }
  }

  function criarConselho() {
    navigation.navigate('CriarConselho');
  }

  return (
    <ScreenTemplate titulo={apenasMeus ? t('grupo3.g027') : t('grupo3.g028')}
      aoVoltar={() => navigation.goBack()}
      flutuante={<BotaoFlutuante aoPressionar={criarConselho} rotulo={t('grupo3.g029')} />}>
      {!apenasMeus && (
        <View style={estilos.ordenacao}>
          <BotaoSegmentado opcoes={OPCOES_ORDENACAO.map(item => ({ ...item, titulo: item.valor === 'populares' ? t('grupo3.g023') : item.valor === 'minhas' ? t('grupo3.g053') : t('grupo3.g022') }))} valor={ordenacao} aoMudar={setOrdenacao} />
        </View>
      )}
      {carregando ? (
        <ActivityIndicator color={cores.primaria} style={estilos.carregando} />
      ) : erro ? (
        <View style={estilos.estado}>
          <Ionicons name="alert-circle-outline" size={40} color={cores.perigo} />
          <Text style={[estilos.mensagem, { color: cores.perigo }]}>{erro}</Text>
          <Button titulo={t('grupo3.g002')} variante="secundario" aoPressionar={carregar} />
        </View>
      ) : conselhos.length === 0 ? (
        <View style={estilos.estado}>
          <Ionicons name="chatbubbles-outline" size={48} color={cores.textoSecundario} />
          <Text style={[estilos.mensagem, { color: cores.texto }]}>
            {apenasMeus ? t('grupo3.g030') : t('grupo3.g031')}
          </Text>
          <Text style={[estilos.mensagem, { color: cores.textoSecundario }]}>
            {t('grupo3.g032')}
          </Text>
          <Button titulo={t('grupo3.g021')} variante="escuro" aoPressionar={criarConselho} />
        </View>
      ) : (
        <View style={estilos.lista}>
          {conselhos.map(conselho => (
            <CardConselho key={conselho.id} conselho={conselho} desabilitado={curtindo}
              aoCurtir={() => alternarCurtida(conselho)}
              aoAbrir={() => navigation.navigate('ConselhoDetalhe', { conselho })} />
          ))}
        </View>
      )}
    </ScreenTemplate>
  );
}

const estilos = StyleSheet.create({
  ordenacao: { marginBottom: espacamentos.lg },
  lista: { gap: espacamentos.md },
  carregando: { marginTop: espacamentos.xl },
  estado: { marginTop: espacamentos.xl, alignItems: 'center', gap: espacamentos.md, paddingHorizontal: espacamentos.md },
  mensagem: { fontSize: tipografia.corpo, textAlign: 'center' },
});
