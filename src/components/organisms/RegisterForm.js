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
  carregando = false,
  erroGeral = '',
}) {
  const [nome, setNome] = useState('');
  const [pais, setPais] = useState('');
  const [email, setEmail] = useState('');
  const [universidade, setUniversidade] = useState('');
  const [senha, setSenha] = useState('');
  const [erros, setErros] = useState({});

  function validar() {
    const novosErros = {};
    if (!campoObrigatorio(nome)) novosErros.nome = 'Informe seu nome.';
    if (!campoObrigatorio(pais)) novosErros.pais = 'Informe seu país de origem.';
    if (!emailValido(email)) novosErros.email = 'Informe um e-mail válido.';
    if (!campoObrigatorio(universidade))
      novosErros.universidade = 'Informe sua universidade.';
    if (!senhaValida(senha))
      novosErros.senha = 'A senha deve ter pelo menos 6 caracteres.';
    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  }

  function enviar() {
    if (validar()) {
      aoEnviar({
        nome: nome.trim(),
        pais: pais.trim(),
        email: email.trim(),
        universidade: universidade.trim(),
        senha,
      });
    }
  }

  return (
    <View>
      <FormField
        rotulo="Nome completo"
        placeholder="Laura Gomez"
        value={nome}
        onChangeText={setNome}
        autoCapitalize="words"
        erro={erros.nome}
        margemInferior={espacamentos.md}
      />
      <FormField
        rotulo="País de origem"
        placeholder="Colômbia"
        value={pais}
        onChangeText={setPais}
        autoCapitalize="words"
        erro={erros.pais}
        margemInferior={espacamentos.md}
      />
      <FormField
        rotulo="E-mail"
        placeholder="laura@email.com"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        erro={erros.email}
        margemInferior={espacamentos.md}
      />
      <FormField
        rotulo="Universidade em Chapecó"
        placeholder="Unochapecó"
        value={universidade}
        onChangeText={setUniversidade}
        autoCapitalize="words"
        erro={erros.universidade}
        margemInferior={espacamentos.md}
      />
      <FormField
        rotulo="Senha"
        placeholder="•••••••"
        value={senha}
        onChangeText={setSenha}
        secureTextEntry
        autoCapitalize="none"
        erro={erros.senha}
        margemInferior={espacamentos.md}
      />

      {!!erroGeral && <Text style={estilos.erroGeral}>{erroGeral}</Text>}

      <View style={estilos.espaco} />
      <Button
        titulo="Criar conta"
        aoPressionar={enviar}
        carregando={carregando}
        grande
      />

      <Text style={estilos.termos}>
        Ao clicar em Criar conta, você aceita nossos Termos de Serviço e nossa
        Política de Privacidade.
      </Text>
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
  termos: {
    marginTop: espacamentos.sm,
    marginHorizontal: -espacamentos.sm,
    fontSize: tipografia.legenda,
    lineHeight: 18,
    color: cores.textoSecundario,
    textAlign: 'center',
  },
});