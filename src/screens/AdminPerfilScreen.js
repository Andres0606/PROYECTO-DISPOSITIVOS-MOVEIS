// SCREEN — Perfil administrativo
import { useCallback, useState } from 'react';
import { Alert, Image, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { ScreenTemplate } from '../components/templates/ScreenTemplate';
import { Button } from '../components/atoms/Button';
import { usePreferencias } from '../contexts/PreferenciasContext';
import { useTema } from '../theme/useTema';
import { logout } from '../services/auth';
import { obterUsuario } from '../services/storage';
import { espacamentos, raios, tipografia } from '../theme';

export function AdminPerfilScreen({ navigation, route }) {
  const { cores } = useTema();
  const { restaurarPreferencias } = usePreferencias();
  const [usuario, setUsuario] = useState(route.params?.usuario);
  const [saindo, setSaindo] = useState(false);

  useFocusEffect(useCallback(() => {
    let ativo = true;
    async function carregar() {
      try {
        const salvo = await obterUsuario();
        if (ativo && salvo) setUsuario(salvo);
      } catch (erro) {
        if (ativo) Alert.alert('Erro', 'Não foi possível carregar o perfil.');
      }
    }
    carregar();
    return () => { ativo = false; };
  }, []));

  async function sair() {
    setSaindo(true);
    try {
      await logout();
      restaurarPreferencias();
      navigation.getParent()?.getParent()?.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    } catch (erro) {
      Alert.alert('Erro', 'Não foi possível encerrar a sessão.');
      setSaindo(false);
    }
  }

  function confirmarLogout() {
    Alert.alert('Encerrar sessão', 'Tem certeza que deseja sair da sua conta?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Sair', style: 'destructive', onPress: sair },
    ]);
  }

  return (
    <ScreenTemplate titulo="Perfil">
      <View style={[estilos.cartao, { backgroundColor: cores.superficie, borderColor: cores.borda }]}>
        {usuario?.fotoUrl ? (
          <Image source={{ uri: usuario.fotoUrl }} style={estilos.avatar} />
        ) : (
          <View style={[estilos.avatar, { backgroundColor: cores.decoracaoClara }]}>
            <Ionicons name="person-outline" size={28} color={cores.texto} />
          </View>
        )}
        <View style={estilos.dados}>
          <Text style={[estilos.nome, { color: cores.texto }]}>{usuario?.nome ?? 'Administrador'}</Text>
          <Text style={[estilos.info, { color: cores.textoSecundario }]}>{usuario?.email ?? 'Não informado'}</Text>
          <Text style={[estilos.info, { color: cores.textoSecundario }]}>{usuario?.rol?.nome ?? 'Administrador'}</Text>
        </View>
      </View>
      <View style={estilos.acoes}>
        <Button titulo="Configurações" variante="secundario"
          aoPressionar={() => navigation.navigate('Configuracoes')} desabilitado={saindo} />
        <Button titulo="Encerrar sessão" variante="contorno"
          aoPressionar={confirmarLogout} carregando={saindo} desabilitado={saindo} />
      </View>
    </ScreenTemplate>
  );
}

const estilos = StyleSheet.create({
  cartao: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderRadius: raios.sm, padding: espacamentos.md, gap: espacamentos.md },
  avatar: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center' },
  dados: { flex: 1, gap: espacamentos.xs },
  nome: { fontSize: 18, fontWeight: '700' },
  info: { fontSize: tipografia.legenda },
  acoes: { marginTop: espacamentos.lg, gap: espacamentos.md },
});
