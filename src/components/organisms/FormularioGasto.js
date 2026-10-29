// ORGANISM — FormularioGasto (campos, validação e botões)
// Usado em Registrar gasto e Editar gasto.
// - valoresIniciais (opcional): { conceito, valor (número), categoria, data (ISO), descricao }
// - aoEnviar(dados): { conceito, valor (número), categoria, data (ISO), descricao }
// - aoExcluir (opcional): se existir, mostra o botão "Excluir" ao lado (modo edição)
// - semDescricao (opcional): esconde o campo Descrição (Editar gasto, como no Figma);
//   a descrição que o gasto já tinha é mantida ao salvar.
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Button } from '../atoms/Button';
import { CampoSelecao } from '../molecules/CampoSelecao';
import { FormField } from '../molecules/FormField';
import {
  CATEGORIAS_GASTO,
  CATEGORIA_GASTO_PADRAO,
} from '../../constants/gastos';
import { campoObrigatorio } from '../../utils/validacao';
import {
  brParaIso,
  dataValida,
  hojeBr,
  isoParaBr,
  mascaraData,
} from '../../utils/datas';
import {
  limparValor,
  numeroParaValor,
  valorParaNumero,
} from '../../utils/moeda';
import { cores, espacamentos, tipografia } from '../../theme';

export function FormularioGasto({
  valoresIniciais,
  rotuloEnviar,
  aoEnviar,
  aoExcluir,
  semDescricao = false,
  carregando = false,
  excluindo = false,
  erroGeral = '',
}) {
  const [conceito, setConceito] = useState(valoresIniciais?.conceito ?? '');
  const [valor, setValor] = useState(
    valoresIniciais ? numeroParaValor(valoresIniciais.valor) : ''
  );
  const [categoria, setCategoria] = useState(
    valoresIniciais?.categoria ?? CATEGORIA_GASTO_PADRAO
  );
  const [data, setData] = useState(
    valoresIniciais ? isoParaBr(valoresIniciais.data) : hojeBr()
  );
  const [descricao, setDescricao] = useState(valoresIniciais?.descricao ?? '');
  const [erros, setErros] = useState({});

  function validar() {
    const novosErros = {};

    if (!campoObrigatorio(conceito)) {
      novosErros.conceito = 'Informe o conceito do gasto.';
    }
    if (!(valorParaNumero(valor) > 0)) {
      novosErros.valor = 'Informe um valor maior que zero.';
    }
    if (!dataValida(data)) {
      novosErros.data = 'Informe uma data válida (dd/mm/aaaa).';
    }

    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  }

  function enviar() {
    if (!validar()) return;

    aoEnviar({
      conceito: conceito.trim(),
      valor: valorParaNumero(valor),
      categoria,
      data: brParaIso(data),
      descricao: semDescricao
        ? valoresIniciais?.descricao ?? ''
        : descricao.trim(),
    });
  }

  return (
    <View>
      <FormField
        rotulo="Conceito"
        placeholder="Ex: Mercado da semana"
        value={conceito}
        onChangeText={setConceito}
        autoCapitalize="sentences"
        erro={erros.conceito}
        margemInferior={espacamentos.md}
      />

      <FormField
        rotulo="Valor"
        placeholder="R$ 85,00"
        value={valor}
        onChangeText={(texto) => setValor(limparValor(texto))}
        keyboardType="decimal-pad"
        erro={erros.valor}
        margemInferior={espacamentos.md}
      />

      <CampoSelecao
        rotulo="Categoria"
        opcoes={CATEGORIAS_GASTO}
        valor={categoria}
        aoMudar={setCategoria}
        margemInferior={espacamentos.md}
      />

      <FormField
        rotulo="Data"
        placeholder="dd/mm/aaaa"
        value={data}
        onChangeText={(texto) => setData(mascaraData(texto))}
        keyboardType="number-pad"
        maxLength={10}
        erro={erros.data}
        margemInferior={espacamentos.md}
      />

      {!semDescricao && (
        <FormField
          rotulo="Descrição"
          value={descricao}
          onChangeText={setDescricao}
          multiline
          numberOfLines={3}
          autoCapitalize="sentences"
          margemInferior={espacamentos.md}
        />
      )}

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