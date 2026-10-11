// ORGANISM — RegisterForm
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Button } from '../atoms/Button';
import { FormField } from '../molecules/FormField';
import {
  campoObrigatorio,
  emailValido,
  senhaValida,
} from '../../utils/validacao';
import { cores, espacamentos, tipografia } from '../../theme';

export function RegisterForm({
  aoEnviar,
  aoVoltarParaLogin,
  carregando = false,
  erroGeral = '',
}) {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [erros, setErros] = useState({});

  function validar() {
    const novosErros = {};
    if (!campoObrigatorio(nome)) novosErros.nome = 'Informe seu nome.';
    if (!emailValido(email)) novosErros.email = 'Informe um e-mail válido.';
    if (!senhaValida(senha))
      novosErros.senha = 'A senha deve ter pelo menos 6 caracteres.';
    if (confirmarSenha !== senha)
      novosErros.confirmarSenha = 'As senhas não conferem.';
    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  }

  function enviar() {
    if (validar()) {
      aoEnviar({ nome: nome.trim(), email: email.trim(), senha });
    }
  }

  return (
    <View>
      <FormField
        rotulo="Nome"
        placeholder="Seu nome completo"
        value={nome}
        onChangeText={setNome}
        erro={erros.nome}
      />
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
        placeholder="Mínimo de 6 caracteres"
        value={senha}
        onChangeText={setSenha}
        secureTextEntry
        autoCapitalize="none"
        erro={erros.senha}
      />
      <FormField
        rotulo="Confirmar senha"
        placeholder="Repita a senha"
        value={confirmarSenha}
        onChangeText={setConfirmarSenha}
        secureTextEntry
        autoCapitalize="none"
        erro={erros.confirmarSenha}
      />

      {!!erroGeral && <Text style={estilos.erroGeral}>{erroGeral}</Text>}

      <Button titulo="Cadastrar" aoPressionar={enviar} carregando={carregando} />
      <View style={estilos.espaco} />
      <Button
        titulo="Já tenho uma conta"
        variante="link"
        aoPressionar={aoVoltarParaLogin}
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