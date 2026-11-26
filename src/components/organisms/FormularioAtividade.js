
// ORGANISM — FormularioAtividade

import {
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { Button } from '../atoms/Button';

import { FormField } from '../molecules/FormField';

import { CampoSelecao } from '../molecules/CampoSelecao';

import {
  obterCategoriasAtividade,
} from '../../services/atividades';

import {
  mascaraData,
  mascaraHora,
  dataFuturaValida,
  horaValida,
} from '../../utils/datas';

import {
  contemLetras,
} from '../../utils/validacao';

import {
  espacamentos,
  tipografia,
} from '../../theme';

import {
  useTema,
} from '../../theme/useTema';

export function FormularioAtividade({
  valoresIniciais,
  rotuloEnviar = 'Criar atividade',
  aoEnviar,
  aoExcluir,
  carregando = false,
  excluindo = false,
  erroGeral = '',
}) {
  const { cores } = useTema();

  const estilos = useMemo(
    () => criarEstilos(cores),
    [cores]
  );

  // ==========================================================
  // ESTADOS DO FORMULÁRIO
  // ==========================================================

  const [nome, setNome] = useState(
    valoresIniciais?.titulo ?? ''
  );

  const [descricao, setDescricao] = useState(
    valoresIniciais?.descricao ?? ''
  );

  const [categoriaId, setCategoriaId] = useState(
    valoresIniciais?.categoriaId ?? ''
  );

  const [data, setData] = useState(
    valoresIniciais?.dataOriginal ?? ''
  );

  const [hora, setHora] = useState(
    valoresIniciais?.horario ?? ''
  );

  const [local, setLocal] = useState(
    valoresIniciais?.local ?? ''
  );

  const [erros, setErros] = useState({});

  const ocupado = carregando || excluindo;

  // ==========================================================
  // ESTADOS DAS CATEGORIAS
  // ==========================================================

  const [categorias, setCategorias] = useState([]);

  const [
    carregandoCategorias,
    setCarregandoCategorias,
  ] = useState(true);

  const [
    erroCategorias,
    setErroCategorias,
  ] = useState('');

  const [
    tentativa,
    setTentativa,
  ] = useState(0);

  // ==========================================================
  // CARREGAR CATEGORIAS
  // ==========================================================

  useEffect(() => {
    let ativo = true;

    async function carregarCategorias() {
      setCarregandoCategorias(true);
      setErroCategorias('');

      try {
        const resultado =
          await obterCategoriasAtividade();

        if (!ativo) return;

        setCategorias(resultado);

        setCategoriaId((atual) =>
          resultado.some(
            (item) => item.id === atual
          )
            ? atual
            : ''
        );

        if (resultado.length === 0) {
          setErroCategorias(
            'Nenhuma categoria disponível.'
          );
        }

      } catch (erro) {
        if (!ativo) return;

        setCategorias([]);

        setErroCategorias(
          'Não foi possível carregar as categorias.'
        );

      } finally {
        if (ativo) {
          setCarregandoCategorias(false);
        }
      }
    }

    carregarCategorias();

    return () => {
      ativo = false;
    };

  }, [tentativa]);

  function tentarNovamente() {
    setTentativa(
      (atual) => atual + 1
    );
  }

  // ==========================================================
  // SELECIONAR CATEGORIA
  // ==========================================================

  const categoriaSelecionada =
    categorias.find(
      (item) => item.id === categoriaId
    );

  function selecionarCategoria(nomeCategoria) {
    if (ocupado || carregandoCategorias) {
      return;
    }

    const categoria = categorias.find(
      (item) => item.nome === nomeCategoria
    );

    if (categoria) {
      setCategoriaId(categoria.id);
    }
  }

  // ==========================================================
  // VALIDAR FORMULÁRIO
  // ==========================================================

  function validar() {
    const novosErros = {};

    if (
      nome.trim().length < 3 ||
      !contemLetras(nome.trim())
    ) {
      novosErros.nome =
        'Informe um nome válido com pelo menos 3 caracteres.';
    }

    if (
      descricao.trim().length < 10 ||
      !contemLetras(descricao.trim())
    ) {
      novosErros.descricao =
        'A descrição deve ter pelo menos 10 caracteres.';
    }

    if (!categoriaSelecionada) {
      novosErros.categoria =
        'Selecione uma categoria.';
    }

    if (!dataFuturaValida(data)) {
      novosErros.data =
        'Informe uma data válida a partir de hoje e com no máximo 5 anos no futuro.';
    }

    if (!horaValida(hora)) {
      novosErros.hora =
        'Informe um horário entre 00:00 e 23:59.';
    }

    if (
      local.trim().length < 3 ||
      !contemLetras(local.trim())
    ) {
      novosErros.local =
        'Informe um local válido.';
    }

    setErros(novosErros);

    return Object.keys(novosErros).length === 0;
  }

  // ==========================================================
  // ENVIAR FORMULÁRIO
  // ==========================================================

  function enviar() {
    if (
      ocupado ||
      carregandoCategorias ||
      erroCategorias
    ) {
      return;
    }

    if (!validar()) return;

    aoEnviar({
      nome: nome.trim(),

      descricao: descricao.trim(),

      categoriaId,

      data: data.trim(),

      hora: hora.trim(),

      local: local.trim(),
    });
  }

  // ==========================================================
  // INTERFACE
  // ==========================================================

  return (
    <View style={estilos.formulario}>

      {/* Nome */}

      <FormField
        rotulo="Nome"
        placeholder="Ex: Piquenique no Ecoparque"
        value={nome}
        onChangeText={setNome}
        maxLength={60}
        editable={!ocupado}
        erro={erros.nome}
        margemInferior={espacamentos.md}
      />

      {/* Descrição */}

      <FormField
        rotulo="Descrição"
        placeholder="Descreva a atividade"
        value={descricao}
        onChangeText={setDescricao}
        multiline
        numberOfLines={3}
        textAlignVertical="top"
        maxLength={300}
        editable={!ocupado}
        erro={erros.descricao}
        margemInferior={espacamentos.md}
      />

      {/* Categoria */}

      {erroCategorias ? (

        <FormField
          rotulo="Categoria"
          erro={erroCategorias}
          margemInferior={espacamentos.md}
        >
          <Button
            titulo="Tentar novamente"
            variante="contorno"
            aoPressionar={tentarNovamente}
            desabilitado={ocupado}
          />
        </FormField>

      ) : (

        <>

          <CampoSelecao
            rotulo="Categoria"

            opcoes={
              carregandoCategorias || ocupado
                ? []
                : categorias.map(
                    (item) => item.nome
                  )
            }

            valor={
              carregandoCategorias
                ? 'Carregando categorias...'
                : categoriaSelecionada?.nome ??
                  'Selecione uma categoria'
            }

            aoMudar={selecionarCategoria}

            margemInferior={espacamentos.md}
          />

          {!!erros.categoria && (
            <Text style={estilos.erroCategoria}>
              {erros.categoria}
            </Text>
          )}

        </>

      )}

      {/* Data */}

      <FormField
        rotulo="Data"
        placeholder="DD/MM/AAAA"
        value={data}
        onChangeText={(texto) =>
          setData(mascaraData(texto))
        }
        keyboardType="number-pad"
        maxLength={10}
        editable={!ocupado}
        erro={erros.data}
        margemInferior={espacamentos.md}
      />

      {/* Hora */}

      <FormField
        rotulo="Hora"
        placeholder="13:00"
        value={hora}
        onChangeText={(texto) =>
          setHora(mascaraHora(texto))
        }
        keyboardType="number-pad"
        maxLength={5}
        editable={!ocupado}
        erro={erros.hora}
        margemInferior={espacamentos.md}
      />

      {/* Local */}

      <FormField
        rotulo="Local"
        placeholder="Ecoparque Chapecó"
        value={local}
        onChangeText={setLocal}
        maxLength={80}
        editable={!ocupado}
        erro={erros.local}
        margemInferior={espacamentos.md}
      />

      {/* Erro geral */}

      {!!erroGeral && (
        <Text style={estilos.erroGeral}>
          {erroGeral}
        </Text>
      )}

      {/* Botões */}

      {aoExcluir ? (

        <View style={estilos.linhaBotoes}>

          <View style={estilos.botao}>

            <Button
              titulo={rotuloEnviar}
              variante="escuro"
              aoPressionar={enviar}
              carregando={carregando}
              desabilitado={
                excluindo ||
                carregandoCategorias ||
                !!erroCategorias
              }
            />

          </View>

          <View style={estilos.botao}>

            <Button
              titulo="Excluir"
              variante="secundario"
              aoPressionar={aoExcluir}
              carregando={excluindo}
              desabilitado={carregando}
            />

          </View>

        </View>

      ) : (

        <View style={estilos.areaBotao}>

          <Button
            titulo={rotuloEnviar}
            variante="escuro"
            aoPressionar={enviar}
            carregando={carregando}
            desabilitado={
              carregandoCategorias ||
              !!erroCategorias
            }
          />

        </View>

      )}

    </View>
  );
}

// ============================================================
// ESTILOS
// ============================================================

function criarEstilos(cores) {
  return StyleSheet.create({

    formulario: {
      marginTop: espacamentos.lg,
    },

    erroCategoria: {
      marginTop: -espacamentos.sm,
      marginBottom: espacamentos.sm,
      fontSize: tipografia.legenda,
      color: cores.perigo,
    },

    erroGeral: {
      marginBottom: espacamentos.md,
      fontSize: tipografia.legenda,
      textAlign: 'center',
      color: cores.perigo,
    },

    areaBotao: {
      marginTop: espacamentos.md,
      marginBottom: espacamentos.md,
    },

    linhaBotoes: {
      flexDirection: 'row',
      gap: espacamentos.md,
      marginTop: espacamentos.md,
      marginBottom: espacamentos.md,
    },

    botao: {
      flex: 1,
    },

  });
}
