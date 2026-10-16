// SCREEN — Início (resumo do intercâmbio)
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { ScreenTemplate } from '../components/templates/ScreenTemplate';
import { ResumoInicio } from '../components/organisms/ResumoInicio';
import { Button } from '../components/atoms/Button';
import { obterResumoInicio } from '../services/inicio';
import { cores, espacamentos, tipografia } from '../theme';

export function HomeScreen({ navigation, route }) {
  const usuario = route.params?.usuario;
  const primeiroNome = usuario?.nome?.split(' ')[0] ?? 'estudante';

  const [resumo, setResumo] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  const carregar = useCallback(async () => {
    setCarregando(true);
    setErro('');
    try {
      setResumo(await obterResumoInicio());
    } catch (e) {
      setErro('Não foi possível carregar seu resumo. Tente novamente.');
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    carregar();
  }, [carregar]);

  function abrirAtalho(chave) {
    if (chave === 'portugues') {
      navigation.navigate('Sobrevive');
    }
    // TODO: 'conselhos' e 'atividades' quando essas telas existirem.
  }

  return (
    <ScreenTemplate titulo={`Olá, ${primeiroNome}`}>
      {carregando && (
        <ActivityIndicator color={cores.primaria} style={estilos.centro} />
      )}

      {!carregando && !!erro && (
        <View style={estilos.centro}>
          <Text style={estilos.erro}>{erro}</Text>
          <Button
            titulo="Tentar novamente"
            variante="secundario"
            aoPressionar={carregar}
          />
        </View>
      )}

      {!carregando && !erro && resumo && (
        <ResumoInicio resumo={resumo} aoAbrirAtalho={abrirAtalho} />
      )}
    </ScreenTemplate>
  );
}

const estilos = StyleSheet.create({
  centro: { marginTop: espacamentos.xl, gap: espacamentos.md },
  erro: {
    fontSize: tipografia.corpo,
    textAlign: 'center',
    color: cores.perigo,
  },
});