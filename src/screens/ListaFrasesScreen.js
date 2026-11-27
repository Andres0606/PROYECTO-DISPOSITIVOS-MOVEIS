import { rotuloCatalogo3 } from '../i18n/catalogosGrupo3';
import { usePreferencias } from '../contexts/PreferenciasContext';

// SCREEN — Lista de frases por categoria

import { useCallback, useRef, useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { ScreenTemplate } from '../components/templates/ScreenTemplate';
import { ItemFrase } from '../components/molecules/ItemFrase';
import { BarraBusca } from '../components/molecules/BarraBusca';
import { Button } from '../components/atoms/Button';
import {
  obterFrasesPorCategoria,
  obterFrasesFavoritas,
  adicionarFavoritoFrase,
  removerFavoritoFrase,
} from '../services/frases';
import { filtrarFrases } from '../utils/frases';
import { espacamentos, tipografia } from '../theme';
import { useTema } from '../theme/useTema';

export function ListaFrasesScreen({ navigation, route }) {
  const { t } = usePreferencias();
  const { cores } = useTema();
  const categoria = route.params?.categoria;

  const [frases, setFrases] = useState([]);
  const [favoritas, setFavoritas] = useState([]);
  const [busca, setBusca] = useState('');
  const [carregando, setCarregando] = useState(true);
  const [ocupado, setOcupado] = useState(false);
  const [erro, setErro] = useState('');
  const [revisao, setRevisao] = useState(0);

  const consultaAtual = useRef(0);
  const bloqueio = useRef(false);

  const carregar = useCallback(async () => {
    const consulta = ++consultaAtual.current;
    setCarregando(true);
    setErro('');

    try {
      if (!categoria?.id) throw new Error(t('grupo3.g004'));

      const [lista, guardadas] = await Promise.all([
        obterFrasesPorCategoria(categoria.id),
        obterFrasesFavoritas(),
      ]);

      if (consulta !== consultaAtual.current) return;

      setFrases(lista);
      setFavoritas(guardadas.map(item => item.id));
    } catch {
      if (consulta === consultaAtual.current) {
        setErro(t('grupo3.g005'));
      }
    } finally {
      if (consulta === consultaAtual.current) {
        setCarregando(false);
      }
    }
  }, [t, categoria?.id]);

  useFocusEffect(
    useCallback(() => {
      carregar();
      return () => { consultaAtual.current += 1; };
    }, [carregar, revisao])
  );

  async function alternarFavorita(id) {
    if (bloqueio.current || carregando) return;

    bloqueio.current = true;
    setOcupado(true);

    const consulta = consultaAtual.current;

    try {
      const resultado = favoritas.includes(id)
        ? await removerFavoritoFrase(id)
        : await adicionarFavoritoFrase(id);

      if (consulta === consultaAtual.current) {
        setFavoritas(atuais => resultado.guardado
          ? [...new Set([...atuais, id])]
          : atuais.filter(item => item !== id)
        );
      } else {
        setRevisao(atual => atual + 1);
      }
    } catch {
      if (navigation.isFocused()) {
        Alert.alert(t('grupo3.g006'), t('grupo3.g007'));
      }

      setRevisao(atual => atual + 1);
    } finally {
      bloqueio.current = false;
      setOcupado(false);
    }
  }

  const filtradas = filtrarFrases(frases, busca);

  return (
    <ScreenTemplate titulo={rotuloCatalogo3(categoria?.nome, t) ?? t('grupo3.g008')}
      aoVoltar={() => navigation.goBack()}>

      {carregando ? (
        <ActivityIndicator color={cores.primaria} style={estilos.estado} />
      ) : erro ? (
        <View style={estilos.estado}>
          <Text style={[estilos.texto, { color: cores.perigo }]}>
            {erro}
          </Text>

          <Button titulo={t('grupo3.g002')} variante="secundario"
            aoPressionar={carregar} />
        </View>
      ) : (
        <View style={estilos.lista}>
          <BarraBusca valor={busca} aoMudar={setBusca}
            placeholder={t('grupo3.g009')} />

          {filtradas.length === 0 ? (
            <Text style={[estilos.texto, { color: cores.textoSecundario }]}>
              {busca.trim()
                ? t('grupo3.g010')
                : t('grupo3.g011')}
            </Text>
          ) : (
            filtradas.map(frase => (
              <ItemFrase key={frase.id}
                frase={frase}
                favorita={favoritas.includes(frase.id)}
                ocupado={ocupado}
                aoAbrir={() => {
                  if (!bloqueio.current) {
                    navigation.navigate('FraseDetalhe', {
                      fraseId: frase.id,
                    });
                  }
                }}
                aoAlternarFavorita={() => alternarFavorita(frase.id)}
              />
            ))
          )}
        </View>
      )}
    </ScreenTemplate>
  );
}

const estilos = StyleSheet.create({
  lista: { gap: espacamentos.xs },
  estado: { marginTop: espacamentos.xl, gap: espacamentos.md },
  texto: { fontSize: tipografia.corpo, textAlign: 'center' },
});
