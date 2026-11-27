import { usePreferencias } from '../../contexts/PreferenciasContext';
// ORGANISM — LoginForm
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '../atoms/Button';
import { FormField } from '../molecules/FormField';
import { Divider } from '../molecules/Divider';
import { campoObrigatorio, emailValido } from '../../utils/validacao';
import { espacamentos, tipografia } from '../../theme';
import { useTema } from '../../theme/useTema';

export function LoginForm({ aoEnviar, aoIrParaCadastro, aoEsquecerSenha = () => {}, aoEntrarComRedeSocial = () => {}, carregando = false, erroGeral = '' }) {
  const { t: grupo1Traducao } = usePreferencias();
  const { cores } = useTema();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erros, setErros] = useState({});

  function validar() {
    const novosErros = {};
    if (!emailValido(email)) novosErros.email = grupo1Traducao('grupo1.informe_um_e_mail_valido');
    if (!campoObrigatorio(senha)) novosErros.senha = grupo1Traducao('grupo1.informe_sua_senha');
    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  }

  function enviar() {
    if (validar()) aoEnviar(email.trim(), senha);
  }

  return (
    <View>
      <FormField rotulo={grupo1Traducao('grupo1.e_mail')} placeholder="email@dominio.com" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" autoCorrect={false} erro={erros.email} />
      <FormField rotulo={grupo1Traducao('grupo1.senha')} placeholder="•••••••" value={senha} onChangeText={setSenha} secureTextEntry autoCapitalize="none" erro={erros.senha} />
      {!!erroGeral && <Text style={[estilos.erroGeral, { color: cores.perigo }]}>{erroGeral}</Text>}
      <View style={estilos.espaco} />
      <Button titulo={grupo1Traducao('grupo1.continuar')} aoPressionar={enviar} carregando={carregando} />
      <View style={estilos.espacoPequeno} />
      <Button titulo={grupo1Traducao('grupo1.esqueceu_sua_senha_recuperar_senha')} variante="link" aoPressionar={aoEsquecerSenha} desabilitado={carregando} />
      <View style={estilos.espacoPequeno} />
      <Button titulo={grupo1Traducao('grupo1.continuar_com_google')} variante="secundario" icone={<Ionicons name="logo-google" size={20} color={cores.texto} />} aoPressionar={() => aoEntrarComRedeSocial('Google')} desabilitado={carregando} />
      <View style={estilos.espaco} />
      <Button titulo={grupo1Traducao('grupo1.continuar_com_apple')} variante="secundario" icone={<Ionicons name="logo-apple" size={20} color={cores.texto} />} aoPressionar={() => aoEntrarComRedeSocial('Apple')} desabilitado={carregando} />
      <View style={estilos.divisor}><Divider texto={grupo1Traducao('grupo1.ou')} /></View>
      <Button titulo={grupo1Traducao('grupo1.nao_tem_uma_conta_cadastre_se')} variante="link" aoPressionar={aoIrParaCadastro} desabilitado={carregando} />
    </View>
  );
}

const estilos = StyleSheet.create({
  erroGeral: { marginBottom: espacamentos.sm, fontSize: tipografia.legenda, textAlign: 'center' },
  espaco: { height: espacamentos.sm },
  espacoPequeno: { height: espacamentos.xs },
  divisor: { marginVertical: espacamentos.sm },
});
