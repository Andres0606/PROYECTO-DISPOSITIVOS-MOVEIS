import { rotuloCatalogo3 } from '../../i18n/catalogosGrupo3';
import { usePreferencias } from '../../contexts/PreferenciasContext';

// ORGANISM — FormularioConselho

import { useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { Button } from '../atoms/Button';
import { FormField } from '../molecules/FormField';
import { CampoSelecao } from '../molecules/CampoSelecao';
import { SeletorImagem } from '../molecules/SeletorImagem';
import { obterCategoriasConselho } from '../../services/conselhos';
import { capturarFoto, escolherImagem } from '../../services/nativos';
import { campoObrigatorio } from '../../utils/validacao';
import { espacamentos, tipografia } from '../../theme';
import { useTema } from '../../theme/useTema';

export function FormularioConselho({
  valoresIniciais, rotuloEnviar,
  aoEnviar, aoExcluir, carregando = false,
  excluindo = false, erroGeral = '',
}) {
  const { t } = usePreferencias();
  const { cores } = useTema();
  const [titulo, setTitulo] = useState(valoresIniciais?.texto ?? '');
  const [conteudo, setConteudo] = useState(valoresIniciais?.descricao ?? '');
  const [categoriaId, setCategoriaId] = useState(valoresIniciais?.categoriaId ?? '');
  const [categorias, setCategorias] = useState([]);
  const [carregandoCategorias, setCarregandoCategorias] = useState(true);
  const [erroCategorias, setErroCategorias] = useState('');
  const [tentativa, setTentativa] = useState(0);
  const [erros, setErros] = useState({});
  const [imagem, setImagem] = useState(undefined);
  const [selecionandoImagem, setSelecionandoImagem] = useState(false);

  const ocupado = carregando || excluindo || selecionandoImagem;
  const categoriaSelecionada = categorias.find(item => item.id === categoriaId);
  const imagemUri = imagem === undefined ? valoresIniciais?.imagem : imagem?.uri;

  useEffect(() => {
    let ativo = true;

    async function carregarCategorias() {
      setCarregandoCategorias(true);
      setErroCategorias('');

      try {
        const resultado = await obterCategoriasConselho();
        if (!ativo) return;

        setCategorias(resultado);
        setCategoriaId(atual => resultado.some(item => item.id === atual) ? atual : '');

        if (!resultado.length) {
          setErroCategorias(t('grupo3.g077'));
        }
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

  function selecionarCategoria(nome) {
    if (ocupado || carregandoCategorias) return;

    const categoria = categorias.find(item => item.nome === nome);

    if (categoria) {
      setCategoriaId(categoria.id);
      setErros(atual => ({ ...atual, categoria: '' }));
    }
  }

  async function selecionarImagem(origem) {
    if (ocupado) return;

    setSelecionandoImagem(true);
    try {
      const resultado = origem === 'camera'
        ? await capturarFoto()
        : await escolherImagem();

      if (resultado?.uri) setImagem(resultado);
    } catch (erro) {
      Alert.alert(t('grupo3.g025'), erro.message || t('grupo3.g099'));
    } finally {
      setSelecionandoImagem(false);
    }
  }

  function validar() {
    const novosErros = {};

    if (!campoObrigatorio(titulo)) {
      novosErros.titulo = t('grupo3.g100');
    } else if (titulo.trim().length > 150) {
      novosErros.titulo = t('grupo3.g101');
    }

    if (!categoriaSelecionada) {
      novosErros.categoria = t('grupo3.g102');
    }

    if (!campoObrigatorio(conteudo)) {
      novosErros.conteudo = t('grupo3.g103');
    } else if (conteudo.trim().length > 5000) {
      novosErros.conteudo = t('grupo3.g104');
    }

    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  }

  function enviar() {
    if (ocupado || carregandoCategorias || erroCategorias || !validar()) return;

    aoEnviar({
      titulo: titulo.trim(),
      categoriaId,
      conteudo: conteudo.trim(),
      imagem,
    });
  }

  return (
    <View style={estilos.formulario}>
      <FormField rotulo={t('grupo3.g105')} placeholder={t('grupo3.g106')}
        value={titulo} onChangeText={setTitulo} maxLength={150}
        editable={!ocupado} erro={erros.titulo}
        margemInferior={espacamentos.md} />

      {erroCategorias ? (
        <FormField rotulo={t('grupo3.g107')} erro={erroCategorias}
          margemInferior={espacamentos.md}>
          <Button titulo={t('grupo3.g002')} variante="contorno"
            aoPressionar={() => setTentativa(atual => atual + 1)}
            desabilitado={ocupado} />
        </FormField>
      ) : (
        <>
          <CampoSelecao formatarOpcao={valor => rotuloCatalogo3(valor, t)} rotulo={t('grupo3.g107')}
            opcoes={carregandoCategorias || ocupado ? [] : categorias.map(item => item.nome)}
            valor={carregandoCategorias ? t('grupo3.g108') : categoriaSelecionada?.nome ?? t('grupo3.g109')}
            aoMudar={selecionarCategoria}
            margemInferior={espacamentos.md} />

          {!!erros.categoria && (
            <Text style={[estilos.erroCategoria, { color: cores.perigo }]}>
              {erros.categoria}
            </Text>
          )}
        </>
      )}

      <FormField rotulo={t('grupo3.g110')} placeholder={t('grupo3.g111')}
        value={conteudo} onChangeText={setConteudo}
        multiline numberOfLines={5} textAlignVertical="top"
        maxLength={5000} editable={!ocupado}
        erro={erros.conteudo} margemInferior={espacamentos.md} />

      <SeletorImagem rotulo={t('grupo3.g112')}
        uri={imagemUri}
        aoCapturar={() => selecionarImagem('camera')}
        aoEscolher={() => selecionarImagem('galeria')}
        aoRemover={() => setImagem(null)}
        desabilitado={ocupado} />

      {!!erroGeral && (
        <Text style={[estilos.erroGeral, { color: cores.perigo }]}>
          {erroGeral}
        </Text>
      )}

      <View style={aoExcluir ? estilos.linhaBotoes : estilos.areaBotao}>
        <View style={aoExcluir ? estilos.botao : undefined}>
          <Button titulo={rotuloEnviar ?? t('grupo3.g021')} variante="escuro"
            aoPressionar={enviar} carregando={carregando}
            desabilitado={ocupado || carregandoCategorias || !!erroCategorias} />
        </View>

        {aoExcluir && (
          <View style={estilos.botao}>
            <Button titulo={t('grupo3.g041')} variante="secundario"
              aoPressionar={aoExcluir} carregando={excluindo}
              desabilitado={ocupado} />
          </View>
        )}
      </View>
    </View>
  );
}

const estilos = StyleSheet.create({
  formulario: { marginTop: espacamentos.lg },
  erroCategoria: { marginTop: -espacamentos.sm, marginBottom: espacamentos.sm, fontSize: tipografia.legenda },
  erroGeral: { marginBottom: espacamentos.md, fontSize: tipografia.legenda, textAlign: 'center' },
  areaBotao: { marginTop: espacamentos.md, marginBottom: espacamentos.md },
  linhaBotoes: { flexDirection: 'row', gap: espacamentos.md, marginTop: espacamentos.md, marginBottom: espacamentos.md },
  botao: { flex: 1 },
});
