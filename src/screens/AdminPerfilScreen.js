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
  const { t: grupo1Traducao } = usePreferencias();
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
        if (ativo) Alert.alert(grupo1Traducao('grupo1.erro'), grupo1Traducao('grupo1.nao_foi_possivel_carregar_o_perfil'));
      }
    }
    carregar();
    return () => { ativo = false; };
  }, [grupo1Traducao]));

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
      Alert.alert(grupo1Traducao('grupo1.erro'), grupo1Traducao('grupo1.nao_foi_possivel_encerrar_a_sessao'));
      setSaindo(false);
    }
  }

  function confirmarLogout() {
    Alert.alert(grupo1Traducao('grupo1.encerrar_sessao'), grupo1Traducao('grupo1.tem_certeza_que_deseja_sair_da_sua_conta'), [
      { text: grupo1Traducao('grupo1.cancelar'), style: 'cancel' },
      { text: grupo1Traducao('grupo1.sair'), style: 'destructive', onPress: sair },
    ]);
  }

  return (
    <ScreenTemplate titulo={grupo1Traducao('grupo1.perfil')}>
      <View style={[estilos.cartao, { backgroundColor: cores.superficie, borderColor: cores.borda }]}>
        {usuario?.fotoUrl ? (
          <Image source={{ uri: usuario.fotoUrl }} style={estilos.avatar} />
        ) : (
          <View style={[estilos.avatar, { backgroundColor: cores.decoracaoClara }]}>
            <Ionicons name="person-outline" size={28} color={cores.texto} />
          </View>
        )}
        <View style={estilos.dados}>
          <Text style={[estilos.nome, { color: cores.texto }]}>{usuario?.nome ?? grupo1Traducao('grupo1.administrador')}</Text>
          <Text style={[estilos.info, { color: cores.textoSecundario }]}>{usuario?.email ?? grupo1Traducao('grupo1.nao_informado')}</Text>
          <Text style={[estilos.info, { color: cores.textoSecundario }]}>{grupo1Traducao('grupo1.administrador')}</Text>
        </View>
      </View>
      <View style={estilos.acoes}>
        <Button titulo={grupo1Traducao('grupo1.configuracoes')} variante="secundario"
          aoPressionar={() => navigation.navigate('Configuracoes')} desabilitado={saindo} />
        <Button titulo={grupo1Traducao('grupo1.encerrar_sessao')} variante="contorno"
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
