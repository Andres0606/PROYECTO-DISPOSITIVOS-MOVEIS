
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
      setErroCampo('O comentário não pode estar vazio.');
      return;
    }

    if (conteudo.trim().length > 1000) {
      setErroCampo('O comentário deve ter no máximo 1000 caracteres.');
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
        Comentários
      </Text>

      {carregando ? (
        <ActivityIndicator color={cores.primaria} />
      ) : erro ? (
        <View style={estilos.estado}>
          <Text style={[estilos.mensagem, { color: cores.perigo }]}>
            {erro}
          </Text>

          <Button titulo="Tentar novamente" variante="contorno"
            aoPressionar={aoRecarregar} desabilitado={ocupado} />
        </View>
      ) : comentarios.length === 0 ? (
        <Text style={[estilos.mensagem, { color: cores.textoSecundario }]}>
          Ainda não há comentários. Seja o primeiro a comentar!
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
        rotulo={editandoId ? 'Editar comentário' : 'Novo comentário'}
        placeholder="Escreva seu comentário..."
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
        titulo={editandoId ? 'Guardar alterações' : 'Publicar comentário'}
        variante="escuro"
        aoPressionar={enviar}
        desabilitado={desabilitado}
      />

      {editandoId && (
        <Button titulo="Cancelar edição" variante="contorno"
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
