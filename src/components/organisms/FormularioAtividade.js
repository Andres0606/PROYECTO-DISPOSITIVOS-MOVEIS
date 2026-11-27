import { rotuloCatalogo3 } from '../../i18n/catalogosGrupo3';
import { usePreferencias } from '../../contexts/PreferenciasContext';
// ORGANISM — FormularioAtividade

import { useEffect, useMemo, useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { Button } from '../atoms/Button';
import { FormField } from '../molecules/FormField';
import { CampoSelecao } from '../molecules/CampoSelecao';
import { SeletorImagem } from '../molecules/SeletorImagem';
import { obterCategoriasAtividade } from '../../services/atividades';
import { capturarFoto, escolherImagem } from '../../services/nativos';
import {
  mascaraData, mascaraHora, dataValida, dataFuturaValida, dataHoraFuturaValida, horaValida,
} from '../../utils/datas';
import { contemLetras } from '../../utils/validacao';
import { espacamentos, tipografia } from '../../theme';
import { useTema } from '../../theme/useTema';

export function FormularioAtividade({
  valoresIniciais, rotuloEnviar, aoEnviar, aoExcluir,
  carregando = false, excluindo = false, erroGeral = '',
}) {
  const { t } = usePreferencias();
  const { cores } = useTema();
  const estilos = useMemo(() => criarEstilos(cores), [cores]);
  const [nome, setNome] = useState(valoresIniciais?.titulo ?? '');
  const [descricao, setDescricao] = useState(valoresIniciais?.descricao ?? '');
  const [categoriaId, setCategoriaId] = useState(valoresIniciais?.categoriaId ?? '');
  const [data, setData] = useState(valoresIniciais?.dataOriginal ?? '');
  const [hora, setHora] = useState(valoresIniciais?.horario ?? '');
  const [local, setLocal] = useState(valoresIniciais?.local ?? '');
  const [erros, setErros] = useState({});
  const [imagem, setImagem] = useState(undefined);
  const [selecionandoImagem, setSelecionandoImagem] = useState(false);
  const [categorias, setCategorias] = useState([]);
  const [carregandoCategorias, setCarregandoCategorias] = useState(true);
  const [erroCategorias, setErroCategorias] = useState('');
  const [tentativa, setTentativa] = useState(0);
  const imagemUri = imagem === undefined ? valoresIniciais?.imagem : imagem?.uri;
  const ocupado = carregando || excluindo || selecionandoImagem;
  const categoriaSelecionada = categorias.find(item => item.id === categoriaId);

  useEffect(() => {
    let ativo = true;
    async function carregarCategorias() {
      setCarregandoCategorias(true);
      setErroCategorias('');
      try {
        const resultado = await obterCategoriasAtividade();
        if (!ativo) return;
        setCategorias(resultado);
        setCategoriaId(atual => resultado.some(item => item.id === atual) ? atual : '');
        if (!resultado.length) setErroCategorias(t('grupo3.g077'));
      } catch (erro) {
        if (!ativo) return;
        setCategorias([]);
        setErroCategorias(t('grupo3.g098'));
      } finally {
        if (ativo) setCarregandoCategorias(false);
      }
    }
    carregarCategorias();
    return () => { ativo = false; };
  }, [t, tentativa]);

  function selecionarCategoria(nomeCategoria) {
    if (ocupado || carregandoCategorias) return;
    const categoria = categorias.find(item => item.nome === nomeCategoria);
    if (categoria) setCategoriaId(categoria.id);
  }

  async function selecionarImagem(origem) {
    if (ocupado) return;
    setSelecionandoImagem(true);
    try {
      const resultado = origem === 'camera' ? await capturarFoto() : await escolherImagem();
      if (resultado?.uri) setImagem(resultado);
    } catch (erro) {
      Alert.alert(t('grupo3.g025'), erro.message || t('grupo3.g099'));
    } finally {
      setSelecionandoImagem(false);
    }
  }

  function validar() {
    const novosErros = {};
    if (nome.trim().length < 3 || !contemLetras(nome.trim())) {
      novosErros.nome = t('grupo3.g122');
    }
    if (descricao.trim().length < 10 || !contemLetras(descricao.trim())) {
      novosErros.descricao = t('grupo3.g123');
    }
    if (!categoriaSelecionada) novosErros.categoria = t('grupo3.g102');

    const alterouHorario = !valoresIniciais || data !== valoresIniciais.dataOriginal || hora !== valoresIniciais.horario;
    if (!dataValida(data)) novosErros.data = t('grupo3.g124');
    if (!horaValida(hora)) novosErros.hora = t('grupo3.g125');
    if (alterouHorario && !novosErros.data && !novosErros.hora) {
      if (!dataFuturaValida(data)) {
        novosErros.data = t('grupo3.g126');
      } else if (!dataHoraFuturaValida(data, hora)) {
        novosErros.hora = t('grupo3.g127');
      }
    }
    if (local.trim().length < 3 || !contemLetras(local.trim())) {
      novosErros.local = t('grupo3.g128');
    }
    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  }

  function enviar() {
    if (ocupado || carregandoCategorias || erroCategorias || !validar()) return;
    const alterouHorario = !valoresIniciais || data !== valoresIniciais.dataOriginal || hora !== valoresIniciais.horario;
    aoEnviar({
      nome: nome.trim(), descricao: descricao.trim(), categoriaId,
      ...(alterouHorario ? { data: data.trim(), hora: hora.trim() } : {}),
      local: local.trim(), imagem,
    });
  }

  return (
    <View style={estilos.formulario}>
      {valoresIniciais?.vencida && (
        <Text style={estilos.aviso}>{t('grupo3.g129')}</Text>
      )}
      <SeletorImagem uri={imagemUri} aoCapturar={() => selecionarImagem('camera')}
        aoEscolher={() => selecionarImagem('galeria')} aoRemover={() => setImagem(null)} desabilitado={ocupado} />
      <FormField rotulo={t('grupo3.g130')} placeholder={t('grupo3.g131')} value={nome}
        onChangeText={setNome} maxLength={60} editable={!ocupado} erro={erros.nome} margemInferior={espacamentos.md} />
      <FormField rotulo={t('grupo3.g132')} placeholder={t('grupo3.g133')} value={descricao}
        onChangeText={setDescricao} multiline numberOfLines={3} textAlignVertical="top" maxLength={300}
        editable={!ocupado} erro={erros.descricao} margemInferior={espacamentos.md} />
      {erroCategorias ? (
        <FormField rotulo={t('grupo3.g107')} erro={erroCategorias} margemInferior={espacamentos.md}>
          <Button titulo={t('grupo3.g002')} variante="contorno" aoPressionar={() => setTentativa(atual => atual + 1)} desabilitado={ocupado} />
        </FormField>
      ) : (
        <>
          <CampoSelecao formatarOpcao={valor => rotuloCatalogo3(valor, t)} rotulo={t('grupo3.g107')} opcoes={carregandoCategorias || ocupado ? [] : categorias.map(item => item.nome)}
            valor={carregandoCategorias ? t('grupo3.g108') : categoriaSelecionada?.nome ?? t('grupo3.g109')}
            aoMudar={selecionarCategoria} margemInferior={espacamentos.md} />
          {!!erros.categoria && <Text style={estilos.erroCategoria}>{erros.categoria}</Text>}
        </>
      )}
      <FormField rotulo={t('grupo3.g134')} placeholder={t('grupo3.g137')} value={data}
        onChangeText={texto => setData(mascaraData(texto))} keyboardType="number-pad" maxLength={10}
        editable={!ocupado} erro={erros.data} margemInferior={espacamentos.md} />
      <FormField rotulo={t('grupo3.g135')} placeholder="13:00" value={hora}
        onChangeText={texto => setHora(mascaraHora(texto))} keyboardType="number-pad" maxLength={5}
        editable={!ocupado} erro={erros.hora} margemInferior={espacamentos.md} />
      <FormField rotulo={t('grupo3.g136')} placeholder="Ecoparque Chapecó" value={local} onChangeText={setLocal}
        maxLength={80} editable={!ocupado} erro={erros.local} margemInferior={espacamentos.md} />
      {!!erroGeral && <Text style={estilos.erroGeral}>{erroGeral}</Text>}
      <View style={aoExcluir ? estilos.linhaBotoes : estilos.areaBotao}>
        <View style={aoExcluir ? estilos.botao : undefined}>
          <Button titulo={rotuloEnviar ?? t('grupo3.g060')} variante="escuro" aoPressionar={enviar} carregando={carregando}
            desabilitado={ocupado || carregandoCategorias || !!erroCategorias} />
        </View>
        {aoExcluir && (
          <View style={estilos.botao}>
            <Button titulo={t('grupo3.g041')} variante="secundario" aoPressionar={aoExcluir}
              carregando={excluindo} desabilitado={ocupado} />
          </View>
        )}
      </View>
    </View>
  );
}

function criarEstilos(cores) {
  return StyleSheet.create({
    formulario: { marginTop: espacamentos.lg },
    aviso: { color: cores.textoSecundario, fontSize: tipografia.legenda, marginBottom: espacamentos.md },
    erroCategoria: { marginTop: -espacamentos.sm, marginBottom: espacamentos.sm, fontSize: tipografia.legenda, color: cores.perigo },
    erroGeral: { marginBottom: espacamentos.md, fontSize: tipografia.legenda, textAlign: 'center', color: cores.perigo },
    areaBotao: { marginTop: espacamentos.md, marginBottom: espacamentos.md },
    linhaBotoes: { flexDirection: 'row', gap: espacamentos.md, marginTop: espacamentos.md, marginBottom: espacamentos.md },
    botao: { flex: 1 },
  });
}
