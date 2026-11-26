
// SCREEN — Favoritos

import { useCallback, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

import { ScreenTemplate } from '../components/templates/ScreenTemplate';
import { BotaoSegmentado } from '../components/molecules/BotaoSegmentado';
import { ItemFavorito } from '../components/molecules/ItemFavorito';
import { Button } from '../components/atoms/Button';

import { obterFavoritos, removerFavorito } from '../services/favoritos';
import { espacamentos, tipografia } from '../theme';
import { useTema } from '../theme/useTema';

const OPCOES = [
  { titulo: 'Lugares', valor: 'lugares' },
  { titulo: 'Frases', valor: 'frases' },
  { titulo: 'Atividades', valor: 'atividades' },
];

export function FavoritosScreen({ navigation }) {
  const { cores } = useTema();
  const estilos = useMemo(() => criarEstilos(cores), [cores]);

  const [tipo, setTipo] = useState('lugares');
  const [favoritos, setFavoritos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');
  const [removendo, setRemovendo] = useState(false);

  const consultaAtual = useRef(0);
  const bloqueio = useRef(false);

  // Carregar favoritos
  const carregar = useCallback(async () => {
    const consulta = ++consultaAtual.current;

    setCarregando(true);
    setErro('');

    try {
      const resultado = await obterFavoritos(tipo);

      if (consulta === consultaAtual.current) {
        setFavoritos(resultado);
      }
    } catch (erro) {
      if (consulta === consultaAtual.current) {
        setFavoritos([]);
        setErro('Não foi possível carregar os favoritos. Tente novamente.');
      }
    } finally {
      if (consulta === consultaAtual.current) {
        setCarregando(false);
      }
    }
  }, [tipo]);

  useFocusEffect(
    useCallback(() => {
      carregar();

      return () => {
        consultaAtual.current += 1;
      };
    }, [carregar])
  );

  // Alterar categoria
  function mudarTipo(novoTipo) {
    if (bloqueio.current || novoTipo === tipo) return;

    consultaAtual.current += 1;
    setCarregando(true);
    setTipo(novoTipo);
  }

  // Remover favorito
  async function remover(item) {
    if (bloqueio.current || carregando) return;

    bloqueio.current = true;
    setRemovendo(true);

    const consulta = consultaAtual.current;

    try {
      await removerFavorito(tipo, item.id);

      if (consulta === consultaAtual.current) {
        setFavoritos((atuais) =>
          atuais.filter((favorito) => favorito.id !== item.id)
        );
      }
    } catch (erro) {
      Alert.alert(
        'Favoritos',
        'Não foi possível remover o favorito. Tente novamente.'
      );
    } finally {
      bloqueio.current = false;
      setRemovendo(false);
    }
  }

  // Abrir detalhes da atividade
  function abrirAtividade(item) {
    if (bloqueio.current) return;

    navigation.navigate('AtividadeDetalhe', {
      atividadeId: item.id,
    });
  }

  return (
    <ScreenTemplate
      titulo="Favoritos"
      aoVoltar={() => navigation.goBack()}
    >
      <View style={estilos.abas}>
        <BotaoSegmentado
          opcoes={OPCOES}
          valor={tipo}
          aoMudar={mudarTipo}
        />
      </View>

      {carregando ? (
        <ActivityIndicator
          color={cores.primaria}
          style={estilos.carregando}
        />
      ) : erro ? (
        <View style={estilos.vazio}>
          <Ionicons
            name="alert-circle-outline"
            size={34}
            color={cores.perigo}
          />

          <Text style={estilos.erro}>{erro}</Text>

          <Button
            titulo="Tentar novamente"
            variante="secundario"
            aoPressionar={carregar}
          />
        </View>
      ) : favoritos.length === 0 ? (
        <View style={estilos.vazio}>
          <Ionicons
            name="heart-outline"
            size={34}
            color={cores.textoSecundario}
          />

          <Text style={estilos.vazioTexto}>
            Nenhum favorito nesta categoria.
          </Text>
        </View>
      ) : (
        <View>
          {favoritos.map((item) => (
            <ItemFavorito
              key={item.id}
              item={item}
              tipo={tipo}
              removendo={removendo}
              aoRemover={() => remover(item)}
              aoAbrir={
                tipo === 'atividades'
                  ? () => abrirAtividade(item)
                  : undefined
              }
            />
          ))}
        </View>
      )}
    </ScreenTemplate>
  );
}

function criarEstilos(cores) {
  return StyleSheet.create({
    abas: {
      marginTop: espacamentos.lg,
      marginBottom: espacamentos.md,
    },

    carregando: { marginTop: espacamentos.xl },

    vazio: {
      marginTop: 80,
      alignItems: 'center',
      gap: espacamentos.sm,
    },

    vazioTexto: {
      fontSize: tipografia.legenda,
      color: cores.textoSecundario,
      textAlign: 'center',
    },

    erro: {
      fontSize: tipografia.legenda,
      color: cores.perigo,
      textAlign: 'center',
    },
  });
}
