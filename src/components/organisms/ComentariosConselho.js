import { usePreferencias } from '../../contexts/PreferenciasContext';

// ORGANISM — ComentariosConselho

import { useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { Button } from '../atoms/Button';
import { FormField } from '../molecules/FormField';
import { ItemComentario } from '../molecules/ItemComentario';
import { campoObrigatorio } from '../../utils/validacao';
import { espacamentos, tipografia } from '../../theme';
import { useTema } from '../../theme/useTema';

export function ComentariosConselho({
  comentarios, carregando, erro, erroAcao,
  ocupado, aoRecarregar, aoPublicar, aoAtualizar, aoExcluir,
}) {
  const { t } = usePreferencias();
  const { cores } = useTema();
  const [conteudo, setConteudo] = useState('');
  const [editandoId, setEditandoId] = useState(null);
  const [erroCampo, setErroCampo] = useState('');

  const desabilitado = ocupado || carregando || !!erro;

  function alterarConteudo(texto) {
    setConteudo(texto);
    setErroCampo('');
  }

  function iniciarEdicao(comentario) {
    if (desabilitado || !comentario.meuComentario) return;

    setEditandoId(comentario.id);
    setConteudo(comentario.conteudo);
    setErroCampo('');
  }

  function limparFormulario() {
    setConteudo('');
    setEditandoId(null);
    setErroCampo('');
  }

  async function enviar() {
    if (desabilitado) return;

    if (!campoObrigatorio(conteudo)) {
      setErroCampo(t('grupo3.g090'));
      return;
    }

    if (conteudo.trim().length > 1000) {
      setErroCampo(t('grupo3.g091'));
      return;
    }

    const sucesso = editandoId
      ? await aoAtualizar(editandoId, conteudo.trim())
      : await aoPublicar(conteudo.trim());

    if (sucesso) limparFormulario();
  }

  return (
    <View style={estilos.container}>
      <Text style={[estilos.titulo, { color: cores.texto }]}>
        {t('grupo3.g089')}
      </Text>

      {carregando ? (
        <ActivityIndicator color={cores.primaria} />
      ) : erro ? (
        <View style={estilos.estado}>
          <Text style={[estilos.mensagem, { color: cores.perigo }]}>
            {erro}
          </Text>

          <Button titulo={t('grupo3.g002')} variante="contorno"
            aoPressionar={aoRecarregar} desabilitado={ocupado} />
        </View>
      ) : comentarios.length === 0 ? (
        <Text style={[estilos.mensagem, { color: cores.textoSecundario }]}>
          {t('grupo3.g092')}
        </Text>
      ) : (
        <View style={estilos.lista}>
          {comentarios.map(comentario => (
            <ItemComentario
              key={comentario.id}
              comentario={comentario}
              ocupado={desabilitado || !!editandoId}
              aoEditar={() => iniciarEdicao(comentario)}
              aoExcluir={() => aoExcluir(comentario)}
            />
          ))}
        </View>
      )}

      <FormField
        rotulo={editandoId ? t('grupo3.g093') : t('grupo3.g094')}
        placeholder={t('grupo3.g095')}
        value={conteudo}
        onChangeText={alterarConteudo}
        multiline
        numberOfLines={3}
        textAlignVertical="top"
        maxLength={1000}
        editable={!desabilitado}
        erro={erroCampo}
      />

      <Text style={[estilos.contador, { color: cores.textoSecundario }]}>
        {conteudo.length}/1000
      </Text>

      {!!erroAcao && (
        <Text style={[estilos.mensagem, { color: cores.perigo }]}>
          {erroAcao}
        </Text>
      )}

      <Button
        titulo={editandoId ? t('grupo3.g051') : t('grupo3.g096')}
        variante="escuro"
        aoPressionar={enviar}
        desabilitado={desabilitado}
      />

      {editandoId && (
        <Button titulo={t('grupo3.g097')} variante="contorno"
          aoPressionar={limparFormulario} desabilitado={ocupado} />
      )}
    </View>
  );
}

const estilos = StyleSheet.create({
  container: { gap: espacamentos.sm, marginTop: espacamentos.md },
  titulo: {
    fontSize: tipografia.subtitulo,
    fontWeight: '700',
    marginBottom: espacamentos.sm,
  },
  lista: { gap: espacamentos.sm, marginBottom: espacamentos.md },
  estado: { gap: espacamentos.sm, marginBottom: espacamentos.md },
  mensagem: { fontSize: tipografia.legenda, textAlign: 'center' },
  contador: { fontSize: tipografia.legenda, textAlign: 'right' },
});
