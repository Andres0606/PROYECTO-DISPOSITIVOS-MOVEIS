import { usePreferencias } from '../contexts/PreferenciasContext';

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



export function FavoritosScreen({ navigation }) {
  const { t: grupo1Traducao } = usePreferencias();
  const OPCOES = [
  { titulo: grupo1Traducao('grupo1.lugares'), valor: 'lugares' },
  { titulo: grupo1Traducao('grupo1.frases'), valor: 'frases' },
  { titulo: grupo1Traducao('grupo1.atividades'), valor: 'atividades' },
];
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
        setErro(grupo1Traducao('grupo1.nao_foi_possivel_carregar_os_favoritos_tente_novamente'));
      }
    } finally {
      if (consulta === consultaAtual.current) {
        setCarregando(false);
      }
    }
  }, [tipo, grupo1Traducao]);

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
        grupo1Traducao('grupo1.favoritos'),
        grupo1Traducao('grupo1.nao_foi_possivel_remover_o_favorito_tente_novamente')
      );
    } finally {
      bloqueio.current = false;
      setRemovendo(false);
    }
  }

function abrirFavorito(item) {
  if (bloqueio.current) return;

  if (tipo === 'atividades') {
    navigation.navigate('AtividadeDetalhe', {
      atividadeId: item.id,
    });
  }

  if (tipo === 'frases') {
    navigation.navigate('FraseDetalhe', {
      fraseId: item.id,
      frase: item,
      categoria: item.categoria,
    });
  }
}

  return (
    <ScreenTemplate
      titulo={grupo1Traducao('grupo1.favoritos')}
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
            titulo={grupo1Traducao('grupo1.tentar_novamente')}
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

          <Text style={estilos.vazioTexto}>{grupo1Traducao('grupo1.nenhum_favorito_nesta_categoria')}{' '}</Text>
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
                tipo === 'atividades' || tipo === 'frases'
                  ? () => abrirFavorito(item)
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
