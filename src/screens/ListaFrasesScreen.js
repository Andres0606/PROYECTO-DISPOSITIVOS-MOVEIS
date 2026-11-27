
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
      if (!categoria?.id) throw new Error('Categoria não encontrada.');

      const [lista, guardadas] = await Promise.all([
        obterFrasesPorCategoria(categoria.id),
        obterFrasesFavoritas(),
      ]);

      if (consulta !== consultaAtual.current) return;

      setFrases(lista);
      setFavoritas(guardadas.map(item => item.id));
    } catch {
      if (consulta === consultaAtual.current) {
        setErro('Não foi possível carregar as frases.');
      }
    } finally {
      if (consulta === consultaAtual.current) {
        setCarregando(false);
      }
    }
  }, [categoria?.id]);

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
        Alert.alert('Favoritos', 'Não foi possível atualizar o favorito.');
      }

      setRevisao(atual => atual + 1);
    } finally {
      bloqueio.current = false;
      setOcupado(false);
    }
  }

  const filtradas = filtrarFrases(frases, busca);

  return (
    <ScreenTemplate titulo={categoria?.nome ?? 'Frases'}
      aoVoltar={() => navigation.goBack()}>

      {carregando ? (
        <ActivityIndicator color={cores.primaria} style={estilos.estado} />
      ) : erro ? (
        <View style={estilos.estado}>
          <Text style={[estilos.texto, { color: cores.perigo }]}>
            {erro}
          </Text>

          <Button titulo="Tentar novamente" variante="secundario"
            aoPressionar={carregar} />
        </View>
      ) : (
        <View style={estilos.lista}>
          <BarraBusca valor={busca} aoMudar={setBusca}
            placeholder="Buscar frase..." />

          {filtradas.length === 0 ? (
            <Text style={[estilos.texto, { color: cores.textoSecundario }]}>
              {busca.trim()
                ? 'Nenhuma frase encontrada.'
                : 'Nenhuma frase disponível nesta categoria.'}
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
