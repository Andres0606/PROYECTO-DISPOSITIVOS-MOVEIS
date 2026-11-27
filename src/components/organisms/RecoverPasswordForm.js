import { usePreferencias } from '../../contexts/PreferenciasContext';
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
  const { t: grupo1Traducao } = usePreferencias();
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
      setErros({ email: grupo1Traducao('grupo1.informe_um_e_mail_valido') });
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
      novosErros.codigo = grupo1Traducao('grupo1.informe_o_codigo_de_64_caracteres_recebido_por_e_mail');
    }
    if (senha.length < 6) {
      novosErros.senha = grupo1Traducao('grupo1.a_senha_deve_ter_pelo_menos_6_caracteres');
    }
    if (!confirmacao || confirmacao !== senha) {
      novosErros.confirmacao = grupo1Traducao('grupo1.as_senhas_devem_ser_iguais');
    }
    setErros(novosErros);
    if (Object.keys(novosErros).length) return;
    aoRedefinir(token, senha);
  }

  const titulo = etapa === 'sucesso'
    ? grupo1Traducao('grupo1.senha_redefinida')
    : etapa === 'codigo' ? grupo1Traducao('grupo1.redefinir_senha') : grupo1Traducao('grupo1.recuperar_senha');

  return (
    <View style={estilos.cartao}>
      <View style={estilos.titulo}>
        <Text style={estilos.tituloTexto}>{titulo}</Text>
      </View>
      <View style={estilos.divisor} />

      {etapa === 'email' && (
        <>
          <Text style={estilos.descricao}>{grupo1Traducao('grupo1.informe_seu_e_mail_cadastrado_para_receber_um_codigo_de_recu')}{' '}</Text>
          <FormField
            rotulo={grupo1Traducao('grupo1.e_mail')}
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
          <Button titulo={grupo1Traducao('grupo1.enviar_codigo')} aoPressionar={enviar} carregando={carregando} desabilitado={carregando} grande />
        </>
      )}

      {etapa === 'codigo' && (
        <>
          <Text style={estilos.descricao}>{grupo1Traducao('grupo1.se_o_e_mail_estiver_cadastrado_voce_recebera_um_codigo_valid')}{' '}</Text>
          <Text style={estilos.email}>{emailInicial}</Text>
          <FormField
            rotulo={grupo1Traducao('grupo1.codigo_de_recuperacao')}
            variante="cartao"
            placeholder={grupo1Traducao('grupo1.cole_seu_codigo')}
            value={codigo}
            onChangeText={setCodigo}
            autoCapitalize="none"
            autoCorrect={false}
            editable={!carregando}
            erro={erros.codigo}
            margemInferior={espacamentos.md}
          />
          <FormField
            rotulo={grupo1Traducao('grupo1.nova_senha')}
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
            rotulo={grupo1Traducao('grupo1.confirmar_senha')}
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
          <Button titulo={grupo1Traducao('grupo1.redefinir_senha')} aoPressionar={redefinir} carregando={carregando} desabilitado={carregando} grande />
          <View style={estilos.espaco}>
            <Button titulo={grupo1Traducao('grupo1.solicitar_novo_codigo')} variante="link" aoPressionar={() => { setCodigo(''); setErros({}); aoReenviar(); }} desabilitado={carregando} />
            <Button titulo={grupo1Traducao('grupo1.alterar_e_mail')} variante="link" aoPressionar={aoAlterarEmail} desabilitado={carregando} />
          </View>
        </>
      )}

      {etapa === 'sucesso' && (
        <>
          <View style={estilos.iconeSucesso}>
            <Ionicons name="checkmark-circle-outline" size={64} color={cores.sucesso} />
          </View>
          <Text style={[estilos.descricao, estilos.centralizado]}>{grupo1Traducao('grupo1.sua_senha_foi_alterada_com_sucesso_entre_novamente_na_sua_co')}{' '}</Text>
          <Button titulo={grupo1Traducao('grupo1.voltar_ao_login')} aoPressionar={aoVoltarLogin} grande />
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
