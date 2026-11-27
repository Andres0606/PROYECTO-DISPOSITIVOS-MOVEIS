
// ORGANISM — FormularioGasto

import { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { Button } from '../atoms/Button';
import { CampoSelecao } from '../molecules/CampoSelecao';
import { FormField } from '../molecules/FormField';
import { obterCategoriasGasto } from '../../services/gastos';
import { campoObrigatorio } from '../../utils/validacao';
import {
  brParaIso, dataValida, agoraChapeco, isoParaBr, mascaraData,
} from '../../utils/datas';
import {
  limparValor, numeroParaValor, valorParaNumero, valorMonetarioValido,
} from '../../utils/moeda';
import { espacamentos, tipografia } from '../../theme';
import { useTema } from '../../theme/useTema';

export function FormularioGasto({
  valoresIniciais, dataInicial, rotuloEnviar, aoEnviar, aoExcluir,
  carregando = false, excluindo = false, erroGeral = '',
}) {
  const { cores } = useTema();

  const [conceito, setConceito] = useState(valoresIniciais?.conceito ?? '');
  const [valor, setValor] = useState(
    valoresIniciais ? numeroParaValor(valoresIniciais.valor) : ''
  );
  const [categoriaId, setCategoriaId] = useState(
    valoresIniciais?.categoriaId ?? ''
  );
  const [data, setData] = useState(isoParaBr(
    valoresIniciais?.data ?? dataInicial ?? agoraChapeco().data
  ));
  const [descricao, setDescricao] = useState(valoresIniciais?.descricao ?? '');
  const [categorias, setCategorias] = useState([]);
  const [carregandoCategorias, setCarregandoCategorias] = useState(true);
  const [erroCategorias, setErroCategorias] = useState('');
  const [erros, setErros] = useState({});

  const consultaAtual = useRef(0);
  const ocupado = carregando || excluindo;

  const carregarCategorias = useCallback(async () => {
    const consulta = ++consultaAtual.current;
    setCarregandoCategorias(true);
    setErroCategorias('');

    try {
      const lista = await obterCategoriasGasto();

      if (consulta !== consultaAtual.current) return;

      setCategorias(lista);
      setCategoriaId(atual =>
        lista.some(item => item.id === atual) ? atual : ''
      );
    } catch {
      if (consulta === consultaAtual.current) {
        setErroCategorias('Não foi possível carregar as categorias.');
      }
    } finally {
      if (consulta === consultaAtual.current) {
        setCarregandoCategorias(false);
      }
    }
  }, []);

  useEffect(() => {
    carregarCategorias();
    return () => { consultaAtual.current += 1; };
  }, [carregarCategorias]);

  function validar() {
    const novosErros = {};

    if (!campoObrigatorio(conceito) || conceito.trim().length > 150) {
      novosErros.conceito = 'Informe um conceito de até 150 caracteres.';
    }

    if (!valorMonetarioValido(valor)) {
      novosErros.valor = 'Informe um valor válido e maior que zero.';
    }

    if (!categorias.some(item => item.id === categoriaId)) {
      novosErros.categoria = 'Selecione uma categoria.';
    }

    if (!dataValida(data)) {
      novosErros.data = 'Informe uma data válida (dd/mm/aaaa).';
    }

    if (descricao.trim().length > 3000) {
      novosErros.descricao = 'A descrição deve ter até 3000 caracteres.';
    }

    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  }

  function enviar() {
    if (ocupado || carregandoCategorias || erroCategorias || !validar()) return;

    aoEnviar({
      descricao: conceito.trim(),
      valor: valorParaNumero(valor),
      categoriaId,
      dataGasto: brParaIso(data),
      observacao: descricao.trim() || null,
    });
  }

  if (carregandoCategorias) {
    return <ActivityIndicator color={cores.primaria} />;
  }

  if (erroCategorias) {
    return (
      <View style={estilos.estado}>
        <Text style={[estilos.erro, { color: cores.perigo }]}>
          {erroCategorias}
        </Text>
        <Button titulo="Tentar novamente" variante="secundario"
          aoPressionar={carregarCategorias} />
      </View>
    );
  }

  return (
    <View>
      <FormField rotulo="Conceito" placeholder="Ex: Mercado da semana"
        value={conceito} onChangeText={setConceito}
        maxLength={150} editable={!ocupado}
        erro={erros.conceito} margemInferior={espacamentos.md} />

      <FormField rotulo="Valor" placeholder="R$ 85,00"
        value={valor} onChangeText={texto => setValor(limparValor(texto))}
        keyboardType="decimal-pad" editable={!ocupado}
        erro={erros.valor} margemInferior={espacamentos.md} />

      <CampoSelecao rotulo="Categoria"
        opcoes={categorias.map(item => item.nome)}
        valor={categorias.find(item => item.id === categoriaId)?.nome ?? 'Selecione'}
        aoMudar={nome => setCategoriaId(
          categorias.find(item => item.nome === nome)?.id ?? ''
        )}
        desabilitado={ocupado} margemInferior={espacamentos.md} />

      {!!erros.categoria && (
        <Text style={[estilos.erro, { color: cores.perigo }]}>
          {erros.categoria}
        </Text>
      )}

      <FormField rotulo="Data" placeholder="dd/mm/aaaa"
        value={data} onChangeText={texto => setData(mascaraData(texto))}
        keyboardType="number-pad" maxLength={10} editable={!ocupado}
        erro={erros.data} margemInferior={espacamentos.md} />

      <FormField rotulo="Descrição" value={descricao}
        onChangeText={setDescricao} multiline numberOfLines={3}
        maxLength={3000} editable={!ocupado}
        erro={erros.descricao} margemInferior={espacamentos.md} />

      {!!erroGeral && (
        <Text style={[estilos.erro, { color: cores.perigo }]}>
          {erroGeral}
        </Text>
      )}

      <View style={estilos.linhaBotoes}>
        <View style={estilos.botao}>
          <Button titulo={rotuloEnviar} variante="escuro"
            aoPressionar={enviar} carregando={carregando}
            desabilitado={ocupado} />
        </View>

        {aoExcluir && (
          <View style={estilos.botao}>
            <Button titulo="Excluir" variante="contorno"
              aoPressionar={aoExcluir} carregando={excluindo}
              desabilitado={ocupado} />
          </View>
        )}
      </View>
    </View>
  );
}

const estilos = StyleSheet.create({
  estado: { gap: espacamentos.md },
  erro: {
    marginBottom: espacamentos.sm,
    fontSize: tipografia.legenda,
    textAlign: 'center',
  },
  linhaBotoes: { flexDirection: 'row', gap: espacamentos.sm },
  botao: { flex: 1 },
});
