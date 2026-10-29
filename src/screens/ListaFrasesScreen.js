// SCREEN — Lista de frases por categoria
import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { ScreenTemplate } from '../components/templates/ScreenTemplate';
import { ItemFrase } from '../components/molecules/ItemFrase';
import { Button } from '../components/atoms/Button';

import { obterFrasesPorCategoria } from '../services/frases';

import {
  cores,
  espacamentos,
  tipografia,
} from '../theme';

export function ListaFrasesScreen({ navigation, route }) {
  const categoria = route.params?.categoria;

  const [frases, setFrases] = useState([]);
  const [favoritas, setFavoritas] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  const carregar = useCallback(async () => {
    if (!categoria?.id) {
      setErro('Categoria não encontrada.');
      setCarregando(false);
      return;
    }

    setCarregando(true);
    setErro('');

    try {
      const resultado = await obterFrasesPorCategoria(
        categoria.id
      );

      setFrases(resultado);
    } catch (e) {
      setErro(
        'Não foi possível carregar as frases. Tente novamente.'
      );
    } finally {
      setCarregando(false);
    }
  }, [categoria?.id]);

  useEffect(() => {
    carregar();
  }, [carregar]);

  function alternarFavorita(fraseId) {
    setFavoritas((atuais) => {
      const jaFavorita = atuais.includes(fraseId);

      if (jaFavorita) {
        return atuais.filter((id) => id !== fraseId);
      }

      return [...atuais, fraseId];
    });
  }

  return (
    <ScreenTemplate
      titulo={categoria?.nome ?? 'Frases'}
      aoVoltar={() => navigation.goBack()}
    >
      {carregando && (
        <ActivityIndicator
          color={cores.primaria}
          style={estilos.carregando}
        />
      )}

      {!carregando && !!erro && (
        <View style={estilos.estado}>
          <Text style={estilos.erro}>
            {erro}
          </Text>

          <Button
            titulo="Tentar novamente"
            variante="secundario"
            aoPressionar={carregar}
          />
        </View>
      )}

      {!carregando && !erro && frases.length === 0 && (
        <View style={estilos.estado}>
          <Text style={estilos.vazio}>
            Nenhuma frase disponível nesta categoria.
          </Text>
        </View>
      )}

      {!carregando && !erro && frases.length > 0 && (
        <View style={estilos.lista}>
          {frases.map((frase) => (
            <ItemFrase
                key={frase.id}
                frase={frase}
                favorita={favoritas.includes(frase.id)}
                aoAbrir={() =>
                    navigation.navigate('FraseDetalhe', {
                    frase,
                    categoria,
                    })
                }
                aoAlternarFavorita={() =>
                    alternarFavorita(frase.id)
                }
                />
          ))}
        </View>
      )}
    </ScreenTemplate>
  );
}

const estilos = StyleSheet.create({
  lista: {
    marginTop: espacamentos.xs,
  },

  carregando: {
    marginTop: espacamentos.xl,
  },

  estado: {
    marginTop: espacamentos.xl,
    gap: espacamentos.md,
  },

  erro: {
    fontSize: tipografia.corpo,
    textAlign: 'center',
    color: cores.perigo,
  },

  vazio: {
    fontSize: tipografia.corpo,
    textAlign: 'center',
    color: cores.textoSecundario,
  },
});