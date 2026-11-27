import { usePreferencias } from '../contexts/PreferenciasContext';
// SCREEN — Início

import { useCallback, useRef, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { ScreenTemplate } from '../components/templates/ScreenTemplate';
import { ResumoInicio } from '../components/organisms/ResumoInicio';
import { Button } from '../components/atoms/Button';
import { obterResumoInicio } from '../services/inicio';
import { obterUsuario } from '../services/storage';
import { useTema } from '../theme/useTema';
import { espacamentos, tipografia } from '../theme';

export function HomeScreen({ navigation, route }) {
  const { t } = usePreferencias();
  const { cores } = useTema();

  const [usuario, setUsuario] = useState(route.params?.usuario);
  const [resumo, setResumo] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  const consultaAtual = useRef(0);

  const primeiroNome = usuario?.nome?.trim().split(/\s+/)[0]
    || t('grupo2.g017');

  const carregar = useCallback(async () => {
    const consulta = ++consultaAtual.current;

    setCarregando(true);
    setErro('');

    try {
      const [resultado, usuarioSalvo] = await Promise.all([
        obterResumoInicio(),
        obterUsuario(),
      ]);

      if (consulta !== consultaAtual.current) return;

      setResumo(resultado);

      if (usuarioSalvo) setUsuario(usuarioSalvo);
    } catch {
      if (consulta === consultaAtual.current) {
        setErro(t('grupo2.g018'));
      }
    } finally {
      if (consulta === consultaAtual.current) {
        setCarregando(false);
      }
    }
  }, [t]);

  useFocusEffect(
    useCallback(() => {
      carregar();

      return () => {
        consultaAtual.current += 1;
      };
    }, [carregar])
  );

  function abrirAtalho(chave, id) {
    switch (chave) {
      case 'tarefas':
        navigation.navigate('Intercambio', {
          screen: 'TarefasLista',
        });
        break;

      case 'gastos':
        navigation.navigate('Gastos', {
          screen: 'GastosResumo',
        });
        break;

      case 'portugues':
        navigation.navigate('Sobrevive');
        break;

      case 'conselhos':
        navigation.navigate('Conselhos');
        break;

      case 'atividades':
        navigation.navigate('Atividades');
        break;

      case 'conselhoDetalhe':
        if (id) {
          navigation.navigate('ConselhoDetalhe', {
            conselhoId: id,
          });
        } else {
          navigation.navigate('Conselhos');
        }
        break;

      case 'atividadeDetalhe':
        if (id) {
          navigation.navigate('AtividadeDetalhe', {
            atividadeId: id,
          });
        } else {
          navigation.navigate('Atividades');
        }
        break;
    }
  }

  return (
    <ScreenTemplate titulo={t('grupo2.g151', { v0: primeiroNome })}>

      {carregando ? (
        <ActivityIndicator
          color={cores.primaria}
          style={estilos.centro} />
      ) : erro ? (
        <View style={estilos.centro}>
          <Text style={[estilos.erro, { color: cores.perigo }]}>
            {erro}
          </Text>

          <Button
            titulo={t('grupo2.g006')}
            variante="secundario"
            aoPressionar={carregar} />
        </View>
      ) : resumo ? (
        <ResumoInicio
          resumo={resumo}
          aoAbrirAtalho={abrirAtalho} />
      ) : null}

    </ScreenTemplate>
  );
}

const estilos = StyleSheet.create({
  centro: {
    marginTop: espacamentos.xl,
    gap: espacamentos.md,
  },
  erro: {
    fontSize: tipografia.corpo,
    textAlign: 'center',
  },
});