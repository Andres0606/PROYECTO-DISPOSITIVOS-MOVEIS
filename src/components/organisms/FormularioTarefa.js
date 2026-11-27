
// ORGANISM — FormularioTarefa

import { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { Button } from '../atoms/Button';
import { CampoSelecao } from '../molecules/CampoSelecao';
import { FormField } from '../molecules/FormField';
import {
  obterEtapasTarefa, obterPrioridadesTarefa,
} from '../../services/tarefas';
import { campoObrigatorio } from '../../utils/validacao';
import {
  brParaIso, dataValida, isoParaBr, mascaraData,
} from '../../utils/datas';
import { espacamentos, tipografia } from '../../theme';
import { useTema } from '../../theme/useTema';

export function FormularioTarefa({
  valoresIniciais, rotuloEnviar, aoEnviar, aoExcluir,
  carregando = false, excluindo = false, erroGeral = '',
}) {
  const { cores } = useTema();
  const [titulo, setTitulo] = useState(valoresIniciais?.titulo ?? '');
  const [descricao, setDescricao] = useState(valoresIniciais?.descricao ?? '');
  const [etapaId, setEtapaId] = useState(valoresIniciais?.etapaId ?? '');
  const [prioridadeId, setPrioridadeId] = useState(
    valoresIniciais?.prioridadeId ?? null
  );
  const [prazo, setPrazo] = useState(isoParaBr(valoresIniciais?.prazo));
  const [etapas, setEtapas] = useState([]);
  const [prioridades, setPrioridades] = useState([]);
  const [carregandoCatalogos, setCarregandoCatalogos] = useState(true);
  const [erroCatalogos, setErroCatalogos] = useState('');
  const [erros, setErros] = useState({});

  const consultaAtual = useRef(0);
  const ocupado = carregando || excluindo;
  const novaTarefa = !valoresIniciais;

  const carregarCatalogos = useCallback(async () => {
    const consulta = ++consultaAtual.current;

    setCarregandoCatalogos(true);
    setErroCatalogos('');

    try {
      const [listaEtapas, listaPrioridades] = await Promise.all([
        obterEtapasTarefa(),
        obterPrioridadesTarefa(),
      ]);

      if (consulta !== consultaAtual.current) return;

      setEtapas(listaEtapas);
      setPrioridades(listaPrioridades);

      setEtapaId(atual => atual ||
        listaEtapas.find(item => item.nome === 'Chegada')?.id ||
        listaEtapas[0]?.id || ''
      );

      if (novaTarefa) {
        setPrioridadeId(atual => atual ??
          listaPrioridades.find(item => item.nome === 'Alta')?.id ?? null
        );
      }
    } catch {
      if (consulta === consultaAtual.current) {
        setErroCatalogos('Não foi possível carregar as opções.');
      }
    } finally {
      if (consulta === consultaAtual.current) {
        setCarregandoCatalogos(false);
      }
    }
  }, [novaTarefa]);

  useEffect(() => {
    carregarCatalogos();
    return () => { consultaAtual.current += 1; };
  }, [carregarCatalogos]);

  function validar() {
    const novosErros = {};

    if (!campoObrigatorio(titulo)) {
      novosErros.titulo = 'Informe o título da tarefa.';
    } else if (titulo.trim().length > 150) {
      novosErros.titulo = 'O título deve ter no máximo 150 caracteres.';
    }

    if (descricao.trim().length > 3000) {
      novosErros.descricao = 'A descrição deve ter no máximo 3000 caracteres.';
    }

    if (!etapas.some(item => item.id === etapaId)) {
      novosErros.etapa = 'Selecione uma etapa válida.';
    }

    if (prioridadeId && !prioridades.some(item => item.id === prioridadeId)) {
      novosErros.prioridade = 'Selecione uma prioridade válida.';
    }

    if (prazo && !dataValida(prazo)) {
      novosErros.prazo = 'Informe uma data válida (dd/mm/aaaa).';
    }

    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  }

  function enviar() {
    if (ocupado || carregandoCatalogos || erroCatalogos || !validar()) return;

    aoEnviar({
      titulo: titulo.trim(),
      descricao: descricao.trim() || null,
      etapaId,
      prioridadeId,
      dataLimite: prazo ? brParaIso(prazo) : null,
    });
  }

  if (carregandoCatalogos) {
    return <ActivityIndicator color={cores.primaria} />;
  }

  if (erroCatalogos) {
    return (
      <View style={estilos.estado}>
        <Text style={[estilos.erro, { color: cores.perigo }]}>
          {erroCatalogos}
        </Text>
        <Button titulo="Tentar novamente" variante="contorno"
          aoPressionar={carregarCatalogos} />
      </View>
    );
  }

  return (
    <View>
      <FormField rotulo="Título" placeholder="Ex: Solicitar CPF"
        value={titulo} onChangeText={setTitulo} maxLength={150}
        autoCapitalize="sentences" editable={!ocupado}
        erro={erros.titulo} margemInferior={espacamentos.md} />

      <FormField rotulo="Descrição" value={descricao}
        onChangeText={setDescricao} multiline maxLength={3000}
        autoCapitalize="sentences" editable={!ocupado}
        erro={erros.descricao} margemInferior={espacamentos.md} />

      <CampoSelecao rotulo="Etapa"
        opcoes={etapas.map(item => item.nome)}
        valor={etapas.find(item => item.id === etapaId)?.nome ?? 'Selecione'}
        aoMudar={nome => setEtapaId(etapas.find(item => item.nome === nome)?.id)}
        desabilitado={ocupado} margemInferior={espacamentos.md} />

      {!!erros.etapa && (
        <Text style={[estilos.erro, { color: cores.perigo }]}>{erros.etapa}</Text>
      )}

      <CampoSelecao rotulo="Prioridade"
        opcoes={['Sem prioridade', ...prioridades.map(item => item.nome)]}
        valor={prioridades.find(item => item.id === prioridadeId)?.nome ?? 'Sem prioridade'}
        aoMudar={nome => setPrioridadeId(
          prioridades.find(item => item.nome === nome)?.id ?? null
        )}
        desabilitado={ocupado} margemInferior={espacamentos.md} />

      {!!erros.prioridade && (
        <Text style={[estilos.erro, { color: cores.perigo }]}>{erros.prioridade}</Text>
      )}

      <FormField rotulo="Prazo" placeholder="dd/mm/aaaa"
        value={prazo} onChangeText={texto => setPrazo(mascaraData(texto))}
        keyboardType="number-pad" maxLength={10} editable={!ocupado}
        erro={erros.prazo} margemInferior={espacamentos.md} />

      {!!erroGeral && (
        <Text style={[estilos.erro, { color: cores.perigo }]}>{erroGeral}</Text>
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
