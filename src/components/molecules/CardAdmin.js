
// MOLECULE — CardAdmin

import { StyleSheet, Text, View } from 'react-native';
import { Card } from '../atoms/Card';
import { Button } from '../atoms/Button';
import { FotoLocal } from '../atoms/FotoLocal';
import { useTema } from '../../theme/useTema';
import { espacamentos, tipografia } from '../../theme';

export function CardAdmin({
  titulo, subtitulo, descricao, imagemUrl, ativo,
  acoes = [], children,
}) {
  const { cores } = useTema();

  return (
    <Card style={estilos.cartao}>
      {!!imagemUrl && (
        <FotoLocal imagem={{ uri: imagemUrl }}
          style={estilos.imagem} />
      )}

      <View style={estilos.cabecalho}>
        <Text style={[estilos.titulo, { color: cores.texto }]}>
          {titulo}
        </Text>

        {typeof ativo === 'boolean' && (
          <View style={[estilos.estado, {
            backgroundColor: cores.superficie,
            borderColor: ativo ? '#27834D' : cores.perigo,
          }]}>
            <Text style={{
              color: ativo ? '#27834D' : cores.perigo,
              fontSize: tipografia.legenda,
              fontWeight: '600',
            }}>
              {ativo ? 'Ativo' : 'Inativo'}
            </Text>
          </View>
        )}
      </View>

      {!!subtitulo && (
        <Text style={[estilos.subtitulo, { color: cores.textoSecundario }]}>
          {subtitulo}
        </Text>
      )}

      {!!descricao && (
        <Text style={[estilos.descricao, { color: cores.texto }]}>
          {descricao}
        </Text>
      )}

      {children}

      {acoes.length > 0 && (
        <View style={estilos.acoes}>
          {acoes.map(acao => (
            <View key={acao.titulo} style={estilos.botao}>
              <Button titulo={acao.titulo}
                variante={acao.variante || 'contorno'}
                aoPressionar={acao.aoPressionar}
                desabilitado={acao.desabilitado || !acao.aoPressionar} />
            </View>
          ))}
        </View>
      )}
    </Card>
  );
}

const estilos = StyleSheet.create({
  cartao: { gap: espacamentos.sm },
  cabecalho: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  titulo: { flex: 1, fontSize: tipografia.corpo, fontWeight: '700' },
  subtitulo: { fontSize: tipografia.legenda },
  descricao: { fontSize: tipografia.corpo, lineHeight: 21 },
  estado: {
    borderWidth: 1, borderRadius: 12,
    paddingHorizontal: 9, paddingVertical: 4,
  },
  imagem: { width: '100%', height: 140, borderRadius: 8 },
  acoes: { flexDirection: 'row', flexWrap: 'wrap', gap: espacamentos.sm },
  botao: { flex: 1, minWidth: 110 },
});
