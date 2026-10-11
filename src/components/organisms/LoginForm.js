// ORGANISM — LoginForm
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '../atoms/Button';
import { FormField } from '../molecules/FormField';
import { Divider } from '../molecules/Divider';
import { campoObrigatorio, emailValido } from '../../utils/validacao';
import { cores, espacamentos, tipografia } from '../../theme';

export function LoginForm({
  aoEnviar,
  aoIrParaCadastro,
  aoEsquecerSenha = () => {},
  aoEntrarComRedeSocial = () => {},
  carregando = false,
  erroGeral = '',
}) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erros, setErros] = useState({});

  function validar() {
    const novosErros = {};
    if (!emailValido(email)) novosErros.email = 'Informe um e-mail válido.';
    if (!campoObrigatorio(senha)) novosErros.senha = 'Informe sua senha.';
    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  }

  function enviar() {
    if (validar()) aoEnviar(email.trim(), senha);
  }

  return (
    <View>
      <FormField
        rotulo="E-mail"
        placeholder="email@dominio.com"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        erro={erros.email}
      />
      <FormField
        rotulo="Senha"
        placeholder="•••••••"
        value={senha}
        onChangeText={setSenha}
        secureTextEntry
        autoCapitalize="none"
        erro={erros.senha}
      />

      {!!erroGeral && <Text style={estilos.erroGeral}>{erroGeral}</Text>}

      <View style={estilos.espaco} />
      <Button titulo="Continuar" aoPressionar={enviar} carregando={carregando} />

      <View style={estilos.espacoPequeno} />
      <Button
        titulo="Esqueceu sua senha? Recuperar senha."
        variante="link"
        aoPressionar={aoEsquecerSenha}
        desabilitado={carregando}
      />

      <View style={estilos.espacoPequeno} />
      <Button
        titulo="Continuar com Google"
        variante="secundario"
        icone={<Ionicons name="logo-google" size={20} color={cores.texto} />}
        aoPressionar={() => aoEntrarComRedeSocial('Google')}
        desabilitado={carregando}
      />
      <View style={estilos.espaco} />
      <Button
        titulo="Continuar com Apple"
        variante="secundario"
        icone={<Ionicons name="logo-apple" size={20} color={cores.texto} />}
        aoPressionar={() => aoEntrarComRedeSocial('Apple')}
        desabilitado={carregando}
      />

      <View style={estilos.divisor}>
        <Divider texto="ou" />
      </View>

      <Button
        titulo="Não tem uma conta? Cadastre-se."
        variante="link"
        aoPressionar={aoIrParaCadastro}
        desabilitado={carregando}
      />
    </View>
  );
}

const estilos = StyleSheet.create({
  erroGeral: {
    marginBottom: espacamentos.sm,
    fontSize: tipografia.legenda,
    color: cores.perigo,
    textAlign: 'center',
  },
  espaco: { height: espacamentos.sm },
  espacoPequeno: { height: espacamentos.xs },
  divisor: { marginVertical: espacamentos.sm },
});