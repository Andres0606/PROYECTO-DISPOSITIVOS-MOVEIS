// ORGANISM — RecoverPasswordForm (cartão de vidro com e-mail + botão)
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Button } from '../atoms/Button';
import { FormField } from '../molecules/FormField';
import { emailValido } from '../../utils/validacao';
import { cores, espacamentos, raios, tipografia } from '../../theme';

export function RecoverPasswordForm({
  aoEnviar,
  carregando = false,
  erroGeral = '',
  mensagemSucesso = '',
}) {
  const [email, setEmail] = useState('');
  const [erro, setErro] = useState('');

  function enviar() {
    if (!emailValido(email)) {
      setErro('Informe um e-mail válido.');
      return;
    }
    setErro('');
    aoEnviar(email.trim());
  }

  return (
    <View style={estilos.cartao}>
      <View style={estilos.titulo}>
        <Text style={estilos.tituloTexto}>Recuperar senha</Text>
      </View>
      <View style={estilos.divisor} />

      <Text style={estilos.descricao}>
        Informe seu e-mail cadastrado e enviaremos um link para redefinir sua
        senha.
      </Text>

      <FormField
        rotulo="E-mail"
        variante="cartao"
        placeholder="laura@email.com"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        erro={erro}
        margemInferior={espacamentos.lg}
      />

      <Button
        titulo="Enviar link"
        aoPressionar={enviar}
        carregando={carregando}
        grande
      />

      {!!erroGeral && <Text style={estilos.erroGeral}>{erroGeral}</Text>}
      {!!mensagemSucesso && (
        <Text style={estilos.sucesso}>{mensagemSucesso}</Text>
      )}
    </View>
  );
}

const estilos = StyleSheet.create({
  // Largura 343 (anula 8 px do padding do template); Figma: 347.
  cartao: {
    marginHorizontal: -espacamentos.sm,
    minHeight: 401,
    paddingHorizontal: espacamentos.lg,
    paddingVertical: espacamentos.xl,
    borderWidth: 1,
    borderColor: cores.vidroBorda,
    borderRadius: raios.xl,
    backgroundColor: cores.vidro,
  },
  titulo: {
    alignItems: 'center',
    paddingBottom: espacamentos.lg,
  },
  tituloTexto: {
    fontSize: tipografia.tituloCartao,
    lineHeight: 24,
    fontWeight: '700',
    color: cores.texto,
  },
  divisor: { height: 1, backgroundColor: cores.divisorCartao },
  descricao: {
    paddingVertical: espacamentos.md + espacamentos.xs,
    fontSize: tipografia.corpo,
    lineHeight: 22,
    color: cores.texto,
  },
  erroGeral: {
    marginTop: espacamentos.md,
    fontSize: tipografia.legenda,
    color: cores.perigo,
    textAlign: 'center',
  },
  sucesso: {
    marginTop: espacamentos.md,
    fontSize: tipografia.legenda,
    lineHeight: 18,
    color: cores.sucesso,
    textAlign: 'center',
  },
});