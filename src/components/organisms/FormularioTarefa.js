// ORGANISM — FormularioTarefa (campos, validação e botões)
// Usado em Criar tarefa e Editar tarefa.
// - valoresIniciais (opcional): { titulo, descricao, etapa, prioridade, prazo (ISO) }
// - aoEnviar(dados): dados = { titulo, descricao, etapa, prioridade, prazo (ISO ou null) }
// - aoExcluir (opcional): se existir, mostra o botão "Excluir" ao lado (modo edição)
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Button } from '../atoms/Button';
import { CampoSelecao } from '../molecules/CampoSelecao';
import { FormField } from '../molecules/FormField';
import {
  ETAPAS,
  ETAPA_PADRAO,
  PRIORIDADES,
  PRIORIDADE_PADRAO,
} from '../../constants/tarefas';
import { campoObrigatorio } from '../../utils/validacao';
import { brParaIso, dataValida, isoParaBr, mascaraData } from '../../utils/datas';
import { cores, espacamentos, tipografia } from '../../theme';

export function FormularioTarefa({
  valoresIniciais,
  rotuloEnviar,
  aoEnviar,
  aoExcluir,
  carregando = false,
  excluindo = false,
  erroGeral = '',
}) {
  const [titulo, setTitulo] = useState(valoresIniciais?.titulo ?? '');
  const [descricao, setDescricao] = useState(valoresIniciais?.descricao ?? '');
  const [etapa, setEtapa] = useState(valoresIniciais?.etapa ?? ETAPA_PADRAO);
  const [prioridade, setPrioridade] = useState(
    valoresIniciais?.prioridade ?? PRIORIDADE_PADRAO
  );
  const [prazo, setPrazo] = useState(isoParaBr(valoresIniciais?.prazo));
  const [erros, setErros] = useState({});

  function validar() {
    const novosErros = {};

    if (!campoObrigatorio(titulo)) {
      novosErros.titulo = 'Informe o título da tarefa.';
    }
    if (prazo && !dataValida(prazo)) {
      novosErros.prazo = 'Informe uma data válida (dd/mm/aaaa).';
    }

    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  }

  function enviar() {
    if (!validar()) return;

    aoEnviar({
      titulo: titulo.trim(),
      descricao: descricao.trim(),
      etapa,
      prioridade,
      prazo: prazo ? brParaIso(prazo) : null,
    });
  }

  return (
    <View>
      <FormField
        rotulo="Título"
        placeholder="Ex: Solicitar CPF"
        value={titulo}
        onChangeText={setTitulo}
        autoCapitalize="sentences"
        erro={erros.titulo}
        margemInferior={espacamentos.md}
      />

      <FormField
        rotulo="Descrição"
        value={descricao}
        onChangeText={setDescricao}
        multiline
        autoCapitalize="sentences"
        margemInferior={espacamentos.md}
      />

      <CampoSelecao
        rotulo="Etapa"
        opcoes={ETAPAS}
        valor={etapa}
        aoMudar={setEtapa}
        margemInferior={espacamentos.md}
      />

      <CampoSelecao
        rotulo="Prioridade"
        opcoes={PRIORIDADES}
        valor={prioridade}
        aoMudar={setPrioridade}
        margemInferior={espacamentos.md}
      />

      <FormField
        rotulo="Prazo"
        placeholder="dd/mm/aaaa"
        value={prazo}
        onChangeText={(texto) => setPrazo(mascaraData(texto))}
        keyboardType="number-pad"
        maxLength={10}
        erro={erros.prazo}
        margemInferior={espacamentos.md}
      />

      {!!erroGeral && <Text style={estilos.erroGeral}>{erroGeral}</Text>}

      {aoExcluir ? (
        <View style={estilos.linhaBotoes}>
          <View style={estilos.botao}>
            <Button
              titulo={rotuloEnviar}
              variante="escuro"
              aoPressionar={enviar}
              carregando={carregando}
              desabilitado={excluindo}
            />
          </View>
          <View style={estilos.botao}>
            <Button
              titulo="Excluir"
              variante="contorno"
              aoPressionar={aoExcluir}
              carregando={excluindo}
              desabilitado={carregando}
            />
          </View>
        </View>
      ) : (
        <Button
          titulo={rotuloEnviar}
          variante="escuro"
          aoPressionar={enviar}
          carregando={carregando}
        />
      )}
    </View>
  );
}

const estilos = StyleSheet.create({
  erroGeral: {
    marginBottom: espacamentos.sm,
    fontSize: tipografia.legenda,
    textAlign: 'center',
    color: cores.perigo,
  },
  linhaBotoes: {
    flexDirection: 'row',
    gap: espacamentos.sm,
  },
  botao: { flex: 1 },
});