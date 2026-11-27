import { traduzirCategoriaLocal } from '../../i18n/catalogosLocais';
import { rotuloAdmin, rotuloCategoriaAdmin } from '../../i18n/catalogosGrupo4';
import { usePreferencias } from '../../contexts/PreferenciasContext';
// ORGANISM — Formulário administrativo

import { useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';

import { FormField } from '../molecules/FormField';
import { CampoSelecao } from '../molecules/CampoSelecao';
import { SeletorImagem } from '../molecules/SeletorImagem';
import { BotaoSegmentado } from '../molecules/BotaoSegmentado';
import { Button } from '../atoms/Button';

import { capturarFoto, escolherImagem } from '../../services/nativos';
import { espacamentos } from '../../theme';

const CAMPOS = {
  lugares: [
    ['nome', 'Nome do lugar', 150, true],
    ['descricao', 'Descrição', 5000, false, true],
    ['endereco', 'Endereço', 250],
    ['cidade', 'Cidade', 100, true],
    ['estado', 'Estado', 100, true],
    ['telefone', 'Telefone', 30],
    ['horario', 'Horário de funcionamento', 2000, false, true],
    ['siteUrl', 'Site', 2048],
    ['latitude', 'Latitude', 30],
    ['longitude', 'Longitude', 30],
  ],

  frases: [
    ['frasePortugues', 'Frase em português', 300, true, true],
    ['traducaoEspanhol', 'Tradução em espanhol', 300, true, true],
    ['traducaoIngles', 'Tradução em inglês', 300, true, true],
    ['explicacaoPortugues', 'Contexto de uso em português', 3000, true, true],
    ['explicacao', 'Contexto de uso em espanhol', 3000, true, true],
    ['explicacaoIngles', 'Contexto de uso em inglês', 3000, true, true],
  ],

  categorias: [
    ['nome', 'Nome da categoria', 60, true],
  ],
};

const ESTADOS = [
  { titulo: 'Ativo', valor: true },
  { titulo: 'Inativo', valor: false },
];

export function FormularioAdmin({
  tipo,
  registro,
  categorias = [],
  aoSalvar,
  aoCancelar,
}) {
  const { t, idioma } = usePreferencias();
  const campos = CAMPOS[tipo].map(([campo, rotulo, ...resto]) => [campo, rotuloAdmin(rotulo, t), ...resto]);

  const [dados, setDados] = useState(() => ({
    ...(tipo === 'lugares' ? {
      cidade: 'Chapecó',
      estado: 'SC',
    } : {}),
    ...registro,
    ativo: registro?.ativo ?? true,
    categoriaId: registro?.categoriaId ?? null,
  }));

  const [imagem, setImagem] = useState(null);
  const [removerImagem, setRemoverImagem] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [erros, setErros] = useState({});

  // Atualizar campos

  function alterar(campo, valor) {
    setDados(atual => ({
      ...atual,
      [campo]: valor,
    }));

    setErros(atual => ({
      ...atual,
      [campo]: '',
    }));
  }

  // Selecionar fotografia

  async function selecionarImagem(acao) {
    try {
      const resultado = await acao();

      if (resultado) {
        setImagem(resultado);
        setRemoverImagem(false);
      }
    } catch (erro) {
      Alert.alert(t('grupo4.g027'), t('mensagens.servidor', { mensagem: erro.message }));
    }
  }

  // Validar e salvar

  async function salvar() {
    if (salvando || !aoSalvar) return;

    const falhas = {};
    const valores = {};

    campos.forEach(([campo, rotulo, limite, obrigatorio]) => {
      const valor = String(dados[campo] ?? '').trim();

      if (obrigatorio && !valor) {
        falhas[campo] = t('grupo4.g113', { rotulo });
      }

      if (valor.length > limite) {
        falhas[campo] = t('grupo4.g114', { limite });
      }

      valores[campo] = valor || null;
    });

    if (tipo !== 'categorias') {
      valores.ativo = dados.ativo;
      valores.categoriaId = dados.categoriaId;
    }

    if (tipo === 'frases' && !dados.categoriaId) {
      falhas.categoriaId = t('grupo4.g095');
    }

    if (tipo === 'lugares') {
      const lat = valores.latitude;
      const lon = valores.longitude;

      if ((lat === null) !== (lon === null)) {
        falhas.latitude = t('grupo4.g096');
      }

      for (const [campo, limite] of [
        ['latitude', 90],
        ['longitude', 180],
      ]) {
        if (valores[campo] !== null) {
          const numero = Number(
            valores[campo].replace(',', '.')
          );

          if (!Number.isFinite(numero) || Math.abs(numero) > limite) {
            falhas[campo] = t('grupo4.g097');
          } else {
            valores[campo] = numero;
          }
        }
      }

      if (valores.siteUrl && !/^https?:\/\/\S+$/i.test(valores.siteUrl)) {
        falhas.siteUrl = t('grupo4.g098');
      }
    }

    setErros(falhas);

    if (Object.keys(falhas).length) return;

    setSalvando(true);

    try {
      await aoSalvar(valores, {
        imagem,
        removerImagem,
      });
    } catch (erro) {
      Alert.alert(
        t('grupo4.g027'),
        t('mensagens.servidor', { mensagem: erro.message, opcional: true }) || t('grupo4.g099')
      );
    } finally {
      setSalvando(false);
    }
  }

  const opcoes = categorias.map(item => item.nome);

  return (
    <View style={estilos.container}>

      {tipo === 'lugares' && (
        <SeletorImagem
          rotulo={t('grupo4.g100')}
          uri={
            imagem?.uri ||
            (!removerImagem ? registro?.imagemUrl : null)
          }
          aoCapturar={() => selecionarImagem(capturarFoto)}
          aoEscolher={() => selecionarImagem(escolherImagem)}
          aoRemover={() => {
            setImagem(null);
            setRemoverImagem(true);
          }}
          desabilitado={salvando}
        />
      )}

      {campos.map(([
        campo,
        rotulo,
        limite,
        obrigatorio,
        multiline,
      ]) => (
        <FormField
          key={campo}
          rotulo={`${rotulo}${obrigatorio ? ' *' : ''}`}
          value={String(dados[campo] ?? '')}
          onChangeText={valor => alterar(campo, valor)}
          maxLength={limite}
          multiline={!!multiline}
          numberOfLines={multiline ? 4 : 1}
          editable={!salvando}
          erro={erros[campo]}
        />
      ))}

      {tipo !== 'categorias' && (
        <>
          <CampoSelecao
            rotulo={t('grupo4.g101')}
            formatarOpcao={valor =>
              tipo === 'lugares'
                ? rotuloAdmin(traduzirCategoriaLocal(valor, idioma), t)
                : rotuloCategoriaAdmin(rotuloAdmin(valor, t), t)
            } valor={
              categorias.find(item =>
                item.id === dados.categoriaId
              )?.nome ??
              (tipo === 'lugares' ? 'Sem categoria' : 'Selecione')
            }
            opcoes={
              tipo === 'lugares'
                ? ['Sem categoria', ...opcoes]
                : opcoes
            }
            aoMudar={nome => alterar(
              'categoriaId',
              categorias.find(item =>
                item.nome === nome
              )?.id ?? null
            )}
            erro={erros.categoriaId}
            desabilitado={salvando}
          />

          <BotaoSegmentado
            opcoes={ESTADOS.map(item => ({ ...item, titulo: rotuloAdmin(item.titulo, t) }))}
            valor={dados.ativo}
            aoMudar={valor => {
              if (!salvando) {
                alterar('ativo', valor);
              }
            }}
          />
        </>
      )}

      <Button
        titulo={t('grupo4.g104')}
        variante="escuro"
        aoPressionar={salvar}
        carregando={salvando}
        desabilitado={salvando || !aoSalvar}
      />

      <Button
        titulo={t('grupo4.g033')}
        variante="contorno"
        aoPressionar={aoCancelar}
        desabilitado={salvando}
      />

    </View>
  );
}

const estilos = StyleSheet.create({
  container: {
    gap: espacamentos.sm,
  },
});