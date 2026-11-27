import { rotuloAdmin, rotuloCategoriaAdmin } from '../i18n/catalogosGrupo4';
import { usePreferencias } from '../contexts/PreferenciasContext';

// SCREEN — Painel administrativo

import { StyleSheet, Text, View, Pressable, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { ScreenTemplate } from '../components/templates/ScreenTemplate';
import { Card } from '../components/atoms/Card';
import { Button } from '../components/atoms/Button';
import { useTema } from '../theme/useTema';
import { espacamentos, tipografia } from '../theme';
import { useCallback, useRef, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { obterResumoAdmin } from '../services/admin';

const ATALHOS = [
  { titulo: 'Usuários', chave: 'usuarios', icone: 'people-outline', rota: 'Usuarios' },
  { titulo: 'Lugares', chave: 'lugares', icone: 'location-outline', rota: 'Conteudos' },
  { titulo: 'Frases', chave: 'frases', icone: 'chatbubbles-outline', rota: 'Conteudos' },
  { titulo: 'Conselhos', chave: 'conselhos', icone: 'chatbox-outline', rota: 'Moderacao' },
  { titulo: 'Atividades', chave: 'atividades', icone: 'calendar-outline', rota: 'Moderacao' },
  { titulo: 'Categorias', chave: 'categorias', icone: 'layers-outline', rota: 'Conteudos' },
];

export function AdminHomeScreen({ navigation, route }) {
  const { t } = usePreferencias();
  const { cores } = useTema();

  const [resumo, setResumo] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');
  const consultaAtual = useRef(0);

  const carregar = useCallback(async () => {
    const consulta = ++consultaAtual.current;

    setCarregando(true);
    setErro('');

    try {
      const resultado = await obterResumoAdmin();

      if (consulta === consultaAtual.current) {
        setResumo(resultado);
      }
    } catch (erro) {
      if (consulta === consultaAtual.current) {
        setResumo(null);
        setErro(t('mensagens.servidor', { mensagem: erro.message, opcional: true }) || t('grupo4.g024'));
      }
    } finally {
      if (consulta === consultaAtual.current) {
        setCarregando(false);
      }
    }
  }, [t]);

  useFocusEffect(useCallback(() => {
    carregar();

    return () => {
      consultaAtual.current += 1;
    };
  }, [carregar]));

  const nome = route.params?.usuario?.nome
    ?.trim().split(/\s+/)[0] || t('grupo4.g012');

  return (
    <ScreenTemplate titulo={t('grupo4.g016')}>
      <Text style={[estilos.saudacao, { color: cores.texto }]}>
        {t('grupo4.g107', { nome })}
      </Text>

      <Text style={[estilos.descricao, { color: cores.textoSecundario }]}>
        {t('grupo4.g017')}
      </Text>

      {carregando && <ActivityIndicator color={cores.primaria} />}

      {!!erro && (
        <View style={estilos.aviso}>
          <Text style={{ color: cores.perigo }}>{erro}</Text>
          <Button titulo={t('grupo4.g023')} variante="contorno"
            aoPressionar={carregar} />
        </View>
      )}

      <View style={estilos.grade}>
        {ATALHOS.map(item => (
          <Pressable key={item.chave} style={estilos.item}
            accessibilityRole="button"
            onPress={() => navigation.navigate(item.rota, {
              tipo: item.chave,
              atalho: Date.now(),
            })}>

            <Card style={estilos.cartao}>
              <Ionicons name={item.icone} size={28} color={cores.texto} />

              <Text style={[estilos.numero, { color: cores.texto }]}>
                {resumo?.[item.chave]?.total ?? '—'}
              </Text>

              <Text style={[estilos.rotulo, { color: cores.texto }]}>
                {rotuloAdmin(item.titulo, t)}
              </Text>
            </Card>

          </Pressable>
        ))}
      </View>

      <Card style={estilos.resumo}>
        <Text style={[estilos.saudacao, { color: cores.texto }]}>
          {t('grupo4.g018')}
        </Text>

        {[
          [t('grupo4.g019'), resumo?.usuarios?.estudantes],
          [t('grupo4.g020'), resumo?.usuarios?.estudantesAtivos],
          [t('grupo4.g021'), resumo?.usuarios?.estudantesInativos],
          [t('grupo4.g022'), resumo?.comentarios],
        ].map(([rotulo, valor]) => (
          <View key={rotulo} style={estilos.linha}>
            <Text style={{ color: cores.textoSecundario }}>{rotulo}</Text>
            <Text style={[estilos.rotulo, { color: cores.texto }]}>
              {valor ?? '—'}
            </Text>
          </View>
        ))}
      </Card>
    </ScreenTemplate>
  );
}

const estilos = StyleSheet.create({
  saudacao: {
    fontSize: tipografia.tituloCartao,
    fontWeight: '700', marginBottom: espacamentos.sm,
  },
  descricao: {
    fontSize: tipografia.corpo, marginBottom: espacamentos.lg,
  },
  grade: {
    flexDirection: 'row', flexWrap: 'wrap',
    justifyContent: 'space-between', rowGap: espacamentos.md,
  },
  item: { width: '48%' },
  cartao: {
    minHeight: 120, alignItems: 'center',
    justifyContent: 'center', gap: espacamentos.xs,
  },
  numero: { fontSize: 28, fontWeight: '700' },
  rotulo: { fontSize: tipografia.corpo, fontWeight: '600' },
  resumo: { marginTop: espacamentos.lg, gap: espacamentos.sm },
  linha: {
    flexDirection: 'row', justifyContent: 'space-between', gap: 8,
  },
  aviso: { gap: espacamentos.sm, marginBottom: espacamentos.md },
});
