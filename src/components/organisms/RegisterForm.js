import { usePreferencias } from '../../contexts/PreferenciasContext';
// ORGANISM — RegisterForm
import { useEffect, useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Button } from '../atoms/Button';
import { FormField } from '../molecules/FormField';
import { CampoSelecao } from '../molecules/CampoSelecao';
import { campoObrigatorio, emailValido, senhaValida } from '../../utils/validacao';
import { obterPaises, obterUniversidadesPorPais, obterUniversidadesChapeco } from '../../services/api';
import { espacamentos, tipografia } from '../../theme';
import { useTema } from '../../theme/useTema';
import { traduzirPais } from '../../i18n/catalogosPaises';

export function RegisterForm({ aoEnviar, carregando = false, erroGeral = '' }) {
  const { t: grupo1Traducao, idioma } = usePreferencias();
  const { cores } = useTema();
  const estilos = useMemo(() => criarEstilos(cores), [cores]);
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [paises, setPaises] = useState([]);
  const [universidadesOrigem, setUniversidadesOrigem] = useState([]);
  const [universidadesDestino, setUniversidadesDestino] = useState([]);
  const [paisSelecionado, setPaisSelecionado] = useState(null);
  const [universidadeOrigemSelecionada, setUniversidadeOrigemSelecionada] = useState(null);
  const [universidadeDestinoSelecionada, setUniversidadeDestinoSelecionada] = useState(null);
  const [erros, setErros] = useState({});
  const [erroDados, setErroDados] = useState('');
  const [carregandoDados, setCarregandoDados] = useState(true);

  useEffect(() => {
    async function carregarDados() {
      try {
        setErroDados('');
        const [listaPaises, listaUniversidadesDestino] = await Promise.all([obterPaises(), obterUniversidadesChapeco()]);
        setPaises(listaPaises);
        setUniversidadesDestino(listaUniversidadesDestino);
      } catch (erro) {
        setErroDados(grupo1Traducao('mensagens.servidor', { mensagem: erro.message }));
      } finally {
        setCarregandoDados(false);
      }
    }
    carregarDados();
  }, []);

  async function selecionarPais(nomePais) {
    const pais = paises.find((item) => item.nome === nomePais);
    if (!pais) return;
    setPaisSelecionado(pais);
    setUniversidadeOrigemSelecionada(null);
    setUniversidadesOrigem([]);
    try {
      const universidades = await obterUniversidadesPorPais(pais.id);
      setUniversidadesOrigem(universidades);
    } catch (erro) {
      setErroDados(grupo1Traducao('mensagens.servidor', { mensagem: erro.message }));
    }
  }
  function selecionarUniversidadeOrigem(nomeUniversidade) {
    const universidade = universidadesOrigem.find((item) => item.nome === nomeUniversidade);
    if (!universidade) return;
    setUniversidadeOrigemSelecionada(universidade);
  }
  function selecionarUniversidadeDestino(nomeUniversidade) {
    const universidade = universidadesDestino.find((item) => item.nome === nomeUniversidade);
    if (!universidade) return;
    setUniversidadeDestinoSelecionada(universidade);
  }
  function validar() {
    const novosErros = {};
    if (!campoObrigatorio(nome)) novosErros.nome = grupo1Traducao('grupo1.informe_seu_nome');
    if (!paisSelecionado) novosErros.pais = grupo1Traducao('grupo1.selecione_seu_pais_de_origem');
    if (!universidadeOrigemSelecionada) novosErros.universidadeOrigem = grupo1Traducao('grupo1.selecione_sua_universidade_de_origem');
    if (!universidadeDestinoSelecionada) novosErros.universidadeDestino = grupo1Traducao('grupo1.selecione_sua_universidade_em_chapeco');
    if (!emailValido(email)) novosErros.email = grupo1Traducao('grupo1.informe_um_e_mail_valido');
    if (!senhaValida(senha)) novosErros.senha = grupo1Traducao('grupo1.a_senha_deve_ter_pelo_menos_6_caracteres');
    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  }
  function enviar() {
    if (!validar()) return;
    aoEnviar({ nome: nome.trim(), paisOrigemId: paisSelecionado.id, universidadeOrigemId: universidadeOrigemSelecionada.id, universidadeDestinoId: universidadeDestinoSelecionada.id, email: email.trim(), senha });
  }
  return (
    <View>
      <FormField rotulo={grupo1Traducao('grupo1.nome_completo')} placeholder="Laura Gomez" value={nome} onChangeText={setNome} autoCapitalize="words" erro={erros.nome} margemInferior={espacamentos.md} />
      <CampoSelecao rotulo={grupo1Traducao('grupo1.pais_de_origem_89')} opcoes={paises.map((pais) => pais.nome)} formatarOpcao={nome => traduzirPais(nome, idioma)} valor={paisSelecionado?.nome || (carregandoDados ? grupo1Traducao('grupo1.carregando') : grupo1Traducao('grupo1.selecione_seu_pais'))} aoMudar={selecionarPais} margemInferior={espacamentos.md} />
      {!!erros.pais && <Text style={estilos.erroCampo}>{erros.pais}</Text>}
      <CampoSelecao rotulo={grupo1Traducao('grupo1.universidade_de_origem_90')} opcoes={universidadesOrigem.map((universidade) => universidade.nome)} valor={universidadeOrigemSelecionada?.nome || (paisSelecionado ? grupo1Traducao('grupo1.selecione_sua_universidade') : grupo1Traducao('grupo1.selecione_primeiro_o_pais'))} aoMudar={selecionarUniversidadeOrigem} margemInferior={espacamentos.md} />
      {!!erros.universidadeOrigem && <Text style={estilos.erroCampo}>{erros.universidadeOrigem}</Text>}
      <CampoSelecao rotulo={grupo1Traducao('grupo1.universidade_em_chapeco_91')} opcoes={universidadesDestino.map((universidade) => universidade.nome)} valor={universidadeDestinoSelecionada?.nome || (carregandoDados ? grupo1Traducao('grupo1.carregando') : grupo1Traducao('grupo1.selecione_a_universidade'))} aoMudar={selecionarUniversidadeDestino} margemInferior={espacamentos.md} />
      {!!erros.universidadeDestino && <Text style={estilos.erroCampo}>{erros.universidadeDestino}</Text>}
      <FormField rotulo={grupo1Traducao('grupo1.e_mail')} placeholder="laura@email.com" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" autoCorrect={false} erro={erros.email} margemInferior={espacamentos.md} />
      <FormField rotulo={grupo1Traducao('grupo1.senha')} placeholder="•••••••" value={senha} onChangeText={setSenha} secureTextEntry autoCapitalize="none" erro={erros.senha} margemInferior={espacamentos.md} />
      {!!erroDados && <Text style={estilos.erroGeral}>{erroDados}</Text>}
      {!!erroGeral && <Text style={estilos.erroGeral}>{erroGeral}</Text>}
      <View style={estilos.espaco} />
      <Button titulo={grupo1Traducao('grupo1.criar_conta')} aoPressionar={enviar} carregando={carregando} grande />
      <Text style={estilos.termos}>{grupo1Traducao('grupo1.ao_clicar_em_criar_conta_voce_aceita_nossos_termos_de_servic')}</Text>
    </View>
  );
}
function criarEstilos(cores) {
  return StyleSheet.create({
    erroCampo: { marginTop: -espacamentos.sm, marginBottom: espacamentos.sm, fontSize: tipografia.legenda, color: cores.perigo },
    erroGeral: { marginBottom: espacamentos.sm, fontSize: tipografia.legenda, color: cores.perigo, textAlign: 'center' },
    espaco: { height: espacamentos.sm },
    termos: { marginTop: espacamentos.sm, marginHorizontal: -espacamentos.sm, fontSize: tipografia.legenda, lineHeight: 18, color: cores.textoSecundario, textAlign: 'center' },
  });
}
