// ORGANISM — RegisterForm

import {
  useEffect,
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
  campoObrigatorio,
  emailValido,
  senhaValida,
} from '../../utils/validacao';

import {
  obterPaises,
  obterUniversidadesPorPais,
  obterUniversidadesChapeco,
} from '../../services/api';

import {
  cores,
  espacamentos,
  tipografia,
} from '../../theme';

export function RegisterForm({
  aoEnviar,
  carregando = false,
  erroGeral = '',
}) {
  const [nome, setNome] =
    useState('');

  const [email, setEmail] =
    useState('');

  const [senha, setSenha] =
    useState('');

  const [paises, setPaises] =
    useState([]);

  const [
    universidadesOrigem,
    setUniversidadesOrigem,
  ] = useState([]);

  const [
    universidadesDestino,
    setUniversidadesDestino,
  ] = useState([]);

  const [
    paisSelecionado,
    setPaisSelecionado,
  ] = useState(null);

  const [
    universidadeOrigemSelecionada,
    setUniversidadeOrigemSelecionada,
  ] = useState(null);

  const [
    universidadeDestinoSelecionada,
    setUniversidadeDestinoSelecionada,
  ] = useState(null);

  const [erros, setErros] =
    useState({});

  const [
    erroDados,
    setErroDados,
  ] = useState('');

  const [
    carregandoDados,
    setCarregandoDados,
  ] = useState(true);

  // ==========================================================
  // CARREGAR PAÍSES E UNIVERSIDADES DE CHAPECÓ
  // ==========================================================

  useEffect(() => {
    async function carregarDados() {
      try {
        setErroDados('');

        const [
          listaPaises,
          listaUniversidadesDestino,
        ] = await Promise.all([
          obterPaises(),
          obterUniversidadesChapeco(),
        ]);

        setPaises(
          listaPaises
        );

        setUniversidadesDestino(
          listaUniversidadesDestino
        );
      } catch (erro) {
        setErroDados(
          erro.message
        );
      } finally {
        setCarregandoDados(
          false
        );
      }
    }

    carregarDados();
  }, []);

  // ==========================================================
  // SELECIONAR PAÍS
  // ==========================================================

  async function selecionarPais(
    nomePais
  ) {
    const pais =
      paises.find(
        (item) =>
          item.nome === nomePais
      );

    if (!pais) {
      return;
    }

    setPaisSelecionado(
      pais
    );

    setUniversidadeOrigemSelecionada(
      null
    );

    setUniversidadesOrigem(
      []
    );

    try {
      const universidades =
        await obterUniversidadesPorPais(
          pais.id
        );

      setUniversidadesOrigem(
        universidades
      );
    } catch (erro) {
      setErroDados(
        erro.message
      );
    }
  }

  // ==========================================================
  // SELECIONAR UNIVERSIDADE DE ORIGEM
  // ==========================================================

  function selecionarUniversidadeOrigem(
    nomeUniversidade
  ) {
    const universidade =
      universidadesOrigem.find(
        (item) =>
          item.nome ===
          nomeUniversidade
      );

    if (!universidade) {
      return;
    }

    setUniversidadeOrigemSelecionada(
      universidade
    );
  }

  // ==========================================================
  // SELECIONAR UNIVERSIDADE DE DESTINO
  // ==========================================================

  function selecionarUniversidadeDestino(
    nomeUniversidade
  ) {
    const universidade =
      universidadesDestino.find(
        (item) =>
          item.nome ===
          nomeUniversidade
      );

    if (!universidade) {
      return;
    }

    setUniversidadeDestinoSelecionada(
      universidade
    );
  }

  // ==========================================================
  // VALIDAR
  // ==========================================================

  function validar() {
    const novosErros = {};

    if (!campoObrigatorio(nome)) {
      novosErros.nome =
        'Informe seu nome.';
    }

    if (!paisSelecionado) {
      novosErros.pais =
        'Selecione seu país de origem.';
    }

    if (
      !universidadeOrigemSelecionada
    ) {
      novosErros.universidadeOrigem =
        'Selecione sua universidade de origem.';
    }

    if (
      !universidadeDestinoSelecionada
    ) {
      novosErros.universidadeDestino =
        'Selecione sua universidade em Chapecó.';
    }

    if (!emailValido(email)) {
      novosErros.email =
        'Informe um e-mail válido.';
    }

    if (!senhaValida(senha)) {
      novosErros.senha =
        'A senha deve ter pelo menos 6 caracteres.';
    }

    setErros(
      novosErros
    );

    return (
      Object.keys(
        novosErros
      ).length === 0
    );
  }

  // ==========================================================
  // ENVIAR
  // ==========================================================

  function enviar() {
    if (!validar()) {
      return;
    }

    aoEnviar({
      nome:
        nome.trim(),

      paisOrigemId:
        paisSelecionado.id,

      universidadeOrigemId:
        universidadeOrigemSelecionada.id,

      universidadeDestinoId:
        universidadeDestinoSelecionada.id,

      email:
        email.trim(),

      senha,
    });
  }

  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <View>
      <FormField
        rotulo="Nome completo"
        placeholder="Laura Gomez"
        value={nome}
        onChangeText={setNome}
        autoCapitalize="words"
        erro={erros.nome}
        margemInferior={
          espacamentos.md
        }
      />

      <CampoSelecao
        rotulo="País de origem"
        opcoes={
          paises.map(
            (pais) => pais.nome
          )
        }
        valor={
          paisSelecionado?.nome ||
          (
            carregandoDados
              ? 'Carregando...'
              : 'Selecione seu país'
          )
        }
        aoMudar={
          selecionarPais
        }
        margemInferior={
          espacamentos.md
        }
      />

      {!!erros.pais && (
        <Text style={estilos.erroCampo}>
          {erros.pais}
        </Text>
      )}

      <CampoSelecao
        rotulo="Universidade de origem"
        opcoes={
          universidadesOrigem.map(
            (universidade) =>
              universidade.nome
          )
        }
        valor={
          universidadeOrigemSelecionada
            ?.nome ||
          (
            paisSelecionado
              ? 'Selecione sua universidade'
              : 'Selecione primeiro o país'
          )
        }
        aoMudar={
          selecionarUniversidadeOrigem
        }
        margemInferior={
          espacamentos.md
        }
      />

      {!!erros.universidadeOrigem && (
        <Text style={estilos.erroCampo}>
          {
            erros.universidadeOrigem
          }
        </Text>
      )}

      <CampoSelecao
        rotulo="Universidade em Chapecó"
        opcoes={
          universidadesDestino.map(
            (universidade) =>
              universidade.nome
          )
        }
        valor={
          universidadeDestinoSelecionada
            ?.nome ||
          (
            carregandoDados
              ? 'Carregando...'
              : 'Selecione a universidade'
          )
        }
        aoMudar={
          selecionarUniversidadeDestino
        }
        margemInferior={
          espacamentos.md
        }
      />

      {!!erros.universidadeDestino && (
        <Text style={estilos.erroCampo}>
          {
            erros.universidadeDestino
          }
        </Text>
      )}

      <FormField
        rotulo="E-mail"
        placeholder="laura@email.com"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        erro={erros.email}
        margemInferior={
          espacamentos.md
        }
      />

      <FormField
        rotulo="Senha"
        placeholder="•••••••"
        value={senha}
        onChangeText={setSenha}
        secureTextEntry
        autoCapitalize="none"
        erro={erros.senha}
        margemInferior={
          espacamentos.md
        }
      />

      {!!erroDados && (
        <Text
          style={estilos.erroGeral}
        >
          {erroDados}
        </Text>
      )}

      {!!erroGeral && (
        <Text
          style={estilos.erroGeral}
        >
          {erroGeral}
        </Text>
      )}

      <View
        style={estilos.espaco}
      />

      <Button
        titulo="Criar conta"
        aoPressionar={enviar}
        carregando={carregando}
        grande
      />

      <Text style={estilos.termos}>
        Ao clicar em Criar conta,
        você aceita nossos Termos
        de Serviço e nossa Política
        de Privacidade.
      </Text>
    </View>
  );
}

const estilos =
  StyleSheet.create({
    erroCampo: {
      marginTop:
        -espacamentos.sm,

      marginBottom:
        espacamentos.sm,

      fontSize:
        tipografia.legenda,

      color:
        cores.perigo,
    },

    erroGeral: {
      marginBottom:
        espacamentos.sm,

      fontSize:
        tipografia.legenda,

      color:
        cores.perigo,

      textAlign:
        'center',
    },

    espaco: {
      height:
        espacamentos.sm,
    },

    termos: {
      marginTop:
        espacamentos.sm,

      marginHorizontal:
        -espacamentos.sm,

      fontSize:
        tipografia.legenda,

      lineHeight: 18,

      color:
        cores.textoSecundario,

      textAlign:
        'center',
    },
  });