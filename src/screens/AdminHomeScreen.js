
// SCREEN — Painel administrativo

import { StyleSheet, Text, View, Pressable, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { ScreenTemplate } from '../components/templates/ScreenTemplate';
import { Card } from '../components/atoms/Card';
import { Button } from '../components/atoms/Button';
import { useTema } from '../theme/useTema';
import { espacamentos, tipografia } from '../theme';

const ATALHOS = [
  { titulo: 'Usuários', chave: 'usuarios', icone: 'people-outline', rota: 'Usuarios' },
  { titulo: 'Lugares', chave: 'lugares', icone: 'location-outline', rota: 'Conteudos' },
  { titulo: 'Frases', chave: 'frases', icone: 'chatbubbles-outline', rota: 'Conteudos' },
  { titulo: 'Conselhos', chave: 'conselhos', icone: 'chatbox-outline', rota: 'Moderacao' },
  { titulo: 'Atividades', chave: 'atividades', icone: 'calendar-outline', rota: 'Moderacao' },
  { titulo: 'Categorias', chave: 'categorias', icone: 'layers-outline', rota: 'Conteudos' },
];

export function AdminHomeScreen({
  navigation, route, resumo,
  carregando = false, erro = '', aoRecarregar,
}) {
  const { cores } = useTema();

  const nome = route.params?.usuario?.nome
    ?.trim().split(/\s+/)[0] || 'Administrador';

  return (
    <ScreenTemplate titulo="Painel administrativo">
      <Text style={[estilos.saudacao, { color: cores.texto }]}>
        Olá, {nome}!
      </Text>

      <Text style={[estilos.descricao, { color: cores.textoSecundario }]}>
        Gerencie os recursos do InterChapecó.
      </Text>

      {carregando && <ActivityIndicator color={cores.primaria} />}

      {!!erro && (
        <View style={estilos.aviso}>
          <Text style={{ color: cores.perigo }}>{erro}</Text>
          <Button titulo="Tentar novamente" variante="contorno"
            aoPressionar={aoRecarregar} />
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
                {item.titulo}
              </Text>
            </Card>

          </Pressable>
        ))}
      </View>

      <Card style={estilos.resumo}>
        <Text style={[estilos.saudacao, { color: cores.texto }]}>
          Resumo dos estudantes
        </Text>

        {[
          ['Estudantes cadastrados', resumo?.usuarios?.estudantes],
          ['Contas ativas', resumo?.usuarios?.estudantesAtivos],
          ['Contas inativas', resumo?.usuarios?.estudantesInativos],
          ['Comentários publicados', resumo?.comentarios],
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
