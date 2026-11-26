
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
import {
  obterConselhos, adicionarCurtidaConselho, removerCurtidaConselho,
} from '../services/conselhos';
import { espacamentos, tipografia } from '../theme';
import { useTema } from '../theme/useTema';

const OPCOES_ORDENACAO = [
  { titulo: 'Recentes', valor: 'recentes' },
  { titulo: 'Populares', valor: 'populares' },
];

export function ConselhosScreen({ navigation }) {
  const { cores } = useTema();
  const [ordenacao, setOrdenacao] = useState('recentes');
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

      if (consulta === consultaAtual.current) {
        setConselhos(resultado);
      }
    } catch (erro) {
      if (consulta === consultaAtual.current) {
        setConselhos([]);
        setErro('Não foi possível carregar os conselhos.');
      }
    } finally {
      if (consulta === consultaAtual.current) {
        setCarregando(false);
      }
    }
  }, [ordenacao]);

  useFocusEffect(
    useCallback(() => {
      carregar();
      return () => { consultaAtual.current += 1; };
    }, [carregar, revisao])
  );

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
          const lista = atuais.map(item =>
            item.id === conselho.id
              ? { ...item, curtido: resultado.curtido, curtidas: resultado.curtidas }
              : item
          );

          if (ordenacao === 'populares') {
            lista.sort((a, b) =>
              b.curtidas - a.curtidas || new Date(b.data) - new Date(a.data)
            );
          }

          return lista;
        });
      } else {
        setRevisao(atual => atual + 1);
      }
    } catch (erro) {
      if (navigation.isFocused()) {
        Alert.alert('Erro', 'Não foi possível atualizar a curtida.');
      }
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
    <ScreenTemplate
      titulo="Conselhos de estudantes de intercâmbio"
      aoVoltar={() => navigation.goBack()}
      flutuante={
        <BotaoFlutuante aoPressionar={criarConselho}
          rotulo="Adicionar conselho" />
      }>

      <View style={estilos.ordenacao}>
        <BotaoSegmentado opcoes={OPCOES_ORDENACAO}
          valor={ordenacao} aoMudar={setOrdenacao} />
      </View>

      {carregando ? (
        <ActivityIndicator color={cores.primaria} style={estilos.carregando} />
      ) : erro ? (
        <View style={estilos.estado}>
          <Ionicons name="alert-circle-outline" size={40} color={cores.perigo} />
          <Text style={[estilos.mensagem, { color: cores.perigo }]}>{erro}</Text>
          <Button titulo="Tentar novamente" variante="secundario"
            aoPressionar={carregar} />
        </View>
      ) : conselhos.length === 0 ? (
        <View style={estilos.estado}>
          <Ionicons name="chatbubbles-outline" size={48}
            color={cores.textoSecundario} />

          <Text style={[estilos.mensagem, { color: cores.texto }]}>
            Nenhum conselho disponível.
          </Text>

          <Text style={[estilos.mensagem, { color: cores.textoSecundario }]}>
            Compartilhe suas experiências com outros estudantes.
          </Text>

          <Button titulo="Publicar conselho" variante="escuro"
            aoPressionar={criarConselho} />
        </View>
      ) : (
        <View style={estilos.lista}>
          {conselhos.map(conselho => (
            <CardConselho
              key={conselho.id}
              conselho={conselho}
              desabilitado={curtindo}
              aoCurtir={() => alternarCurtida(conselho)}
              aoAbrir={() => navigation.navigate('ConselhoDetalhe', { conselho })}
            />
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
  estado: {
    marginTop: espacamentos.xl,
    alignItems: 'center',
    gap: espacamentos.md,
    paddingHorizontal: espacamentos.md,
  },
  mensagem: {
    fontSize: tipografia.corpo,
    textAlign: 'center',
  },
});
