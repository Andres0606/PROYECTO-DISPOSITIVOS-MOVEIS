import { rotuloCatalogo } from '../../i18n/catalogosGrupo2';
import { usePreferencias } from '../../contexts/PreferenciasContext';

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
  const { t } = usePreferencias();
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
        setErroCategorias(t('grupo2.g118'));
      }
    } finally {
      if (consulta === consultaAtual.current) {
        setCarregandoCategorias(false);
      }
    }
  }, [t]);

  useEffect(() => {
    carregarCategorias();
    return () => { consultaAtual.current += 1; };
  }, [carregarCategorias]);

  function validar() {
    const novosErros = {};

    if (!campoObrigatorio(conceito) || conceito.trim().length > 150) {
      novosErros.conceito = t('grupo2.g119');
    }

    if (!valorMonetarioValido(valor)) {
      novosErros.valor = t('grupo2.g120');
    }

    if (!categorias.some(item => item.id === categoriaId)) {
      novosErros.categoria = t('grupo2.g121');
    }

    if (!dataValida(data)) {
      novosErros.data = t('grupo2.g084');
    }

    if (descricao.trim().length > 3000) {
      novosErros.descricao = t('grupo2.g122');
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
        <Button titulo={t('grupo2.g006')} variante="secundario"
          aoPressionar={carregarCategorias} />
      </View>
    );
  }

  return (
    <View>
      <FormField rotulo={t('grupo2.g123')} placeholder={t('grupo2.g124')}
        value={conceito} onChangeText={setConceito}
        maxLength={150} editable={!ocupado}
        erro={erros.conceito} margemInferior={espacamentos.md} />

      <FormField rotulo={t('grupo2.g125')} placeholder="R$ 85,00"
        value={valor} onChangeText={texto => setValor(limparValor(texto))}
        keyboardType="decimal-pad" editable={!ocupado}
        erro={erros.valor} margemInferior={espacamentos.md} />

      <CampoSelecao formatarOpcao={valor => rotuloCatalogo(valor, t)} rotulo={t('grupo2.g113')}
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

      <FormField rotulo={t('grupo2.g126')} placeholder="dd/mm/aaaa"
        value={data} onChangeText={texto => setData(mascaraData(texto))}
        keyboardType="number-pad" maxLength={10} editable={!ocupado}
        erro={erros.data} margemInferior={espacamentos.md} />

      <FormField rotulo={t('grupo2.g087')} value={descricao}
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
            <Button titulo={t('grupo2.g024')} variante="contorno"
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
