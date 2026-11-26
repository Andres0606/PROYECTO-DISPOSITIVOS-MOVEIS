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
  valoresIniciais, rotuloEnviar = 'Criar atividade', aoEnviar, aoExcluir,
  carregando = false, excluindo = false, erroGeral = '',
}) {
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
        if (!resultado.length) setErroCategorias('Nenhuma categoria disponível.');
      } catch (erro) {
        if (!ativo) return;
        setCategorias([]);
        setErroCategorias('Não foi possível carregar as categorias.');
      } finally {
        if (ativo) setCarregandoCategorias(false);
      }
    }
    carregarCategorias();
    return () => { ativo = false; };
  }, [tentativa]);

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
      Alert.alert('Erro', erro.message || 'Não foi possível selecionar a imagem.');
    } finally {
      setSelecionandoImagem(false);
    }
  }

  function validar() {
    const novosErros = {};
    if (nome.trim().length < 3 || !contemLetras(nome.trim())) {
      novosErros.nome = 'Informe um nome válido com pelo menos 3 caracteres.';
    }
    if (descricao.trim().length < 10 || !contemLetras(descricao.trim())) {
      novosErros.descricao = 'A descrição deve ter pelo menos 10 caracteres.';
    }
    if (!categoriaSelecionada) novosErros.categoria = 'Selecione uma categoria.';

    const alterouHorario = !valoresIniciais || data !== valoresIniciais.dataOriginal || hora !== valoresIniciais.horario;
    if (!dataValida(data)) novosErros.data = 'Informe uma data válida.';
    if (!horaValida(hora)) novosErros.hora = 'Informe um horário entre 00:00 e 23:59.';
    if (alterouHorario && !novosErros.data && !novosErros.hora) {
      if (!dataFuturaValida(data)) {
        novosErros.data = 'Informe uma data a partir de hoje e com no máximo 5 anos no futuro.';
      } else if (!dataHoraFuturaValida(data, hora)) {
        novosErros.hora = 'A data e o horário devem estar no futuro.';
      }
    }
    if (local.trim().length < 3 || !contemLetras(local.trim())) {
      novosErros.local = 'Informe um local válido.';
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
        <Text style={estilos.aviso}>Esta atividade está encerrada. Altere a data e o horário para disponibilizá-la novamente.</Text>
      )}
      <SeletorImagem uri={imagemUri} aoCapturar={() => selecionarImagem('camera')}
        aoEscolher={() => selecionarImagem('galeria')} aoRemover={() => setImagem(null)} desabilitado={ocupado} />
      <FormField rotulo="Nome" placeholder="Ex: Piquenique no Ecoparque" value={nome}
        onChangeText={setNome} maxLength={60} editable={!ocupado} erro={erros.nome} margemInferior={espacamentos.md} />
      <FormField rotulo="Descrição" placeholder="Descreva a atividade" value={descricao}
        onChangeText={setDescricao} multiline numberOfLines={3} textAlignVertical="top" maxLength={300}
        editable={!ocupado} erro={erros.descricao} margemInferior={espacamentos.md} />
      {erroCategorias ? (
        <FormField rotulo="Categoria" erro={erroCategorias} margemInferior={espacamentos.md}>
          <Button titulo="Tentar novamente" variante="contorno" aoPressionar={() => setTentativa(atual => atual + 1)} desabilitado={ocupado} />
        </FormField>
      ) : (
        <>
          <CampoSelecao rotulo="Categoria" opcoes={carregandoCategorias || ocupado ? [] : categorias.map(item => item.nome)}
            valor={carregandoCategorias ? 'Carregando categorias...' : categoriaSelecionada?.nome ?? 'Selecione uma categoria'}
            aoMudar={selecionarCategoria} margemInferior={espacamentos.md} />
          {!!erros.categoria && <Text style={estilos.erroCategoria}>{erros.categoria}</Text>}
        </>
      )}
      <FormField rotulo="Data" placeholder="DD/MM/AAAA" value={data}
        onChangeText={texto => setData(mascaraData(texto))} keyboardType="number-pad" maxLength={10}
        editable={!ocupado} erro={erros.data} margemInferior={espacamentos.md} />
      <FormField rotulo="Hora" placeholder="13:00" value={hora}
        onChangeText={texto => setHora(mascaraHora(texto))} keyboardType="number-pad" maxLength={5}
        editable={!ocupado} erro={erros.hora} margemInferior={espacamentos.md} />
      <FormField rotulo="Local" placeholder="Ecoparque Chapecó" value={local} onChangeText={setLocal}
        maxLength={80} editable={!ocupado} erro={erros.local} margemInferior={espacamentos.md} />
      {!!erroGeral && <Text style={estilos.erroGeral}>{erroGeral}</Text>}
      <View style={aoExcluir ? estilos.linhaBotoes : estilos.areaBotao}>
        <View style={aoExcluir ? estilos.botao : undefined}>
          <Button titulo={rotuloEnviar} variante="escuro" aoPressionar={enviar} carregando={carregando}
            desabilitado={ocupado || carregandoCategorias || !!erroCategorias} />
        </View>
        {aoExcluir && (
          <View style={estilos.botao}>
            <Button titulo="Excluir" variante="secundario" aoPressionar={aoExcluir}
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
