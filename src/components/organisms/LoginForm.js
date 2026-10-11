// ORGANISM — LoginForm
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Button } from '../atoms/Button';
import { FormField } from '../molecules/FormField';
import { campoObrigatorio, emailValido } from '../../utils/validacao';
import { cores, espacamentos, tipografia } from '../../theme';

export function LoginForm({
  aoEnviar,
  aoIrParaCadastro,
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
        placeholder="seu@email.com"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        erro={erros.email}
      />
      <FormField
        rotulo="Senha"
        placeholder="Sua senha"
        value={senha}
        onChangeText={setSenha}
        secureTextEntry
        autoCapitalize="none"
        erro={erros.senha}
      />

      {!!erroGeral && <Text style={estilos.erroGeral}>{erroGeral}</Text>}

      <Button titulo="Entrar" aoPressionar={enviar} carregando={carregando} />
      <View style={estilos.espaco} />
      <Button
        titulo="Criar uma conta"
        variante="link"
        aoPressionar={aoIrParaCadastro}
        desabilitado={carregando}
      />
    </View>
  );
}

const estilos = StyleSheet.create({
  erroGeral: {
    marginBottom: espacamentos.md,
    fontSize: tipografia.legenda,
    color: cores.perigo,
    textAlign: 'center',
  },
  espaco: { height: espacamentos.sm },
});