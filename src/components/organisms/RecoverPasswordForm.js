// ORGANISM — RecoverPasswordForm
import { useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '../atoms/Button';
import { FormField } from '../molecules/FormField';
import { emailValido } from '../../utils/validacao';
import { espacamentos, raios, tipografia } from '../../theme';
import { useTema } from '../../theme/useTema';

export function RecoverPasswordForm({
  etapa = 'email',
  emailInicial = '',
  aoEnviar,
  aoRedefinir,
  aoReenviar,
  aoAlterarEmail,
  aoVoltarLogin,
  carregando = false,
  erroGeral = '',
  mensagemSucesso = '',
}) {
  const { cores } = useTema();
  const estilos = useMemo(() => criarEstilos(cores), [cores]);
  const [email, setEmail] = useState(emailInicial);
  const [codigo, setCodigo] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmacao, setConfirmacao] = useState('');
  const [erros, setErros] = useState({});

  function enviar() {
    if (carregando) return;
    const endereco = email.trim();
    if (!emailValido(endereco) || endereco.length > 150) {
      setErros({ email: 'Informe um e-mail válido.' });
      return;
    }
    setErros({});
    aoEnviar(endereco);
  }

  function redefinir() {
    if (carregando) return;
    const novosErros = {};
    const token = codigo.trim();
    if (!/^[a-f0-9]{64}$/i.test(token)) {
      novosErros.codigo = 'Informe o código de 64 caracteres recebido por e-mail.';
    }
    if (senha.length < 6) {
      novosErros.senha = 'A senha deve ter pelo menos 6 caracteres.';
    }
    if (!confirmacao || confirmacao !== senha) {
      novosErros.confirmacao = 'As senhas devem ser iguais.';
    }
    setErros(novosErros);
    if (Object.keys(novosErros).length) return;
    aoRedefinir(token, senha);
  }

  const titulo = etapa === 'sucesso'
    ? 'Senha redefinida!'
    : etapa === 'codigo' ? 'Redefinir senha' : 'Recuperar senha';

  return (
    <View style={estilos.cartao}>
      <View style={estilos.titulo}>
        <Text style={estilos.tituloTexto}>{titulo}</Text>
      </View>
      <View style={estilos.divisor} />

      {etapa === 'email' && (
        <>
          <Text style={estilos.descricao}>
            Informe seu e-mail cadastrado para receber um código de recuperação.
          </Text>
          <FormField
            rotulo="E-mail"
            variante="cartao"
            placeholder="email@dominio.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            editable={!carregando}
            erro={erros.email}
            margemInferior={espacamentos.lg}
          />
          <Button titulo="Enviar código" aoPressionar={enviar} carregando={carregando} desabilitado={carregando} grande />
        </>
      )}

      {etapa === 'codigo' && (
        <>
          <Text style={estilos.descricao}>
            Se o e-mail estiver cadastrado, você receberá um código válido por 15 minutos. Cole o código e informe sua nova senha.
          </Text>
          <Text style={estilos.email}>{emailInicial}</Text>
          <FormField
            rotulo="Código de recuperação"
            variante="cartao"
            placeholder="Cole seu código"
            value={codigo}
            onChangeText={setCodigo}
            autoCapitalize="none"
            autoCorrect={false}
            editable={!carregando}
            erro={erros.codigo}
            margemInferior={espacamentos.md}
          />
          <FormField
            rotulo="Nova senha"
            variante="cartao"
            placeholder="••••••••"
            value={senha}
            onChangeText={setSenha}
            secureTextEntry
            autoCapitalize="none"
            autoCorrect={false}
            editable={!carregando}
            erro={erros.senha}
            margemInferior={espacamentos.md}
          />
          <FormField
            rotulo="Confirmar senha"
            variante="cartao"
            placeholder="••••••••"
            value={confirmacao}
            onChangeText={setConfirmacao}
            secureTextEntry
            autoCapitalize="none"
            autoCorrect={false}
            editable={!carregando}
            erro={erros.confirmacao}
            margemInferior={espacamentos.lg}
          />
          <Button titulo="Redefinir senha" aoPressionar={redefinir} carregando={carregando} desabilitado={carregando} grande />
          <View style={estilos.espaco}>
            <Button titulo="Solicitar novo código" variante="link" aoPressionar={() => { setCodigo(''); setErros({}); aoReenviar(); }} desabilitado={carregando} />
            <Button titulo="Alterar e-mail" variante="link" aoPressionar={aoAlterarEmail} desabilitado={carregando} />
          </View>
        </>
      )}

      {etapa === 'sucesso' && (
        <>
          <View style={estilos.iconeSucesso}>
            <Ionicons name="checkmark-circle-outline" size={64} color={cores.sucesso} />
          </View>
          <Text style={[estilos.descricao, estilos.centralizado]}>
            Sua senha foi alterada com sucesso. Entre novamente na sua conta.
          </Text>
          <Button titulo="Voltar ao login" aoPressionar={aoVoltarLogin} grande />
        </>
      )}

      {!!erroGeral && <Text style={estilos.erroGeral}>{erroGeral}</Text>}
      {!!mensagemSucesso && etapa === 'codigo' && (
        <Text style={estilos.sucesso}>{mensagemSucesso}</Text>
      )}
    </View>
  );
}

function criarEstilos(cores) {
  return StyleSheet.create({
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
    titulo: { alignItems: 'center', paddingBottom: espacamentos.lg },
    tituloTexto: { fontSize: tipografia.tituloCartao, lineHeight: 24, fontWeight: '700', color: cores.texto },
    divisor: { height: 1, backgroundColor: cores.divisorCartao },
    descricao: { paddingVertical: espacamentos.md + espacamentos.xs, fontSize: tipografia.corpo, lineHeight: 22, color: cores.texto },
    email: { color: cores.textoSecundario, fontSize: tipografia.legenda, marginBottom: espacamentos.md },
    erroGeral: { marginTop: espacamentos.md, fontSize: tipografia.legenda, color: cores.perigo, textAlign: 'center' },
    sucesso: { marginTop: espacamentos.md, fontSize: tipografia.legenda, lineHeight: 18, color: cores.sucesso, textAlign: 'center' },
    espaco: { marginTop: espacamentos.sm, gap: espacamentos.xs },
    iconeSucesso: { alignItems: 'center', marginTop: espacamentos.lg },
    centralizado: { textAlign: 'center' },
  });
}
