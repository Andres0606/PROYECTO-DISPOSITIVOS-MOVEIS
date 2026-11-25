// SCREEN — Painel administrativo
import { StyleSheet, Text, View, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ScreenTemplate } from '../components/templates/ScreenTemplate';
import { useTema } from '../theme/useTema';
import { espacamentos, raios, tipografia } from '../theme';

const ATALHOS = [
  { titulo: 'Usuários', icone: 'people-outline', rota: 'Usuarios' },
  { titulo: 'Lugares', icone: 'location-outline', rota: 'Conteudos' },
  { titulo: 'Frases', icone: 'chatbubbles-outline', rota: 'Conteudos' },
  { titulo: 'Conselhos', icone: 'chatbox-outline', rota: 'Moderacao' },
  { titulo: 'Atividades', icone: 'calendar-outline', rota: 'Moderacao' },
  { titulo: 'Categorias', icone: 'layers-outline', rota: 'Conteudos' },
];

export function AdminHomeScreen({ navigation, route }) {
  const { cores } = useTema();
  const nome = route.params?.usuario?.nome?.trim().split(/\s+/)[0] || 'Administrador';

  return (
    <ScreenTemplate titulo="Painel administrativo">
      <Text style={[estilos.saudacao, { color: cores.texto }]}>
        Olá, {nome}!
      </Text>
      <Text style={[estilos.descricao, { color: cores.textoSecundario }]}>
        Gerencie os recursos do InterChapecó.
      </Text>
      <View style={estilos.grade}>
        {ATALHOS.map((item) => (
          <Pressable key={item.titulo}
            accessibilityRole="button"
            onPress={() => navigation.navigate(item.rota)}
            style={({ pressed }) => [estilos.cartao, {
              backgroundColor: cores.superficie,
              borderColor: cores.borda,
              opacity: pressed ? 0.65 : 1,
            }]}
          >
            <Ionicons name={item.icone} size={30} color={cores.texto} />
            <Text style={[estilos.rotulo, { color: cores.texto }]}>{item.titulo}</Text>
          </Pressable>
        ))}
      </View>
      <Text style={[estilos.aviso, { color: cores.textoSecundario }]}>
        Os módulos de gestão serão disponibilizados nas próximas etapas.
      </Text>
    </ScreenTemplate>
  );
}

const estilos = StyleSheet.create({
  saudacao: { fontSize: tipografia.tituloCartao, fontWeight: '700', marginBottom: espacamentos.sm },
  descricao: { fontSize: tipografia.corpo, marginBottom: espacamentos.lg },
  grade: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', rowGap: espacamentos.md },
  cartao: { width: '48%', minHeight: 108, borderWidth: 1, borderRadius: raios.md, padding: espacamentos.md, alignItems: 'center', justifyContent: 'center', gap: espacamentos.sm },
  rotulo: { fontSize: tipografia.corpo, fontWeight: '600', textAlign: 'center' },
  aviso: { marginTop: espacamentos.lg, fontSize: tipografia.legenda, textAlign: 'center' },
});
