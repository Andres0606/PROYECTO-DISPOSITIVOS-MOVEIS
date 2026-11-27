/* grupo5.1 */
import { formatarDataCompleta } from '../../utils/formatacao';
import { rotuloCatalogo3 } from '../../i18n/catalogosGrupo3';
import { usePreferencias } from '../../contexts/PreferenciasContext';
// ORGANISM — DetalheAtividade

import { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Button } from '../atoms/Button';
import { FotoLocal } from '../atoms/FotoLocal';
import { Etiqueta } from '../atoms/Etiqueta';
import { espacamentos, raios, tipografia } from '../../theme';
import { useTema } from '../../theme/useTema';

export function DetalheAtividade({
  atividade, ordenacao = 'recentes', salvandoInteresse = false,
  salvandoFavorito = false, aoAlternarInteresse, aoAlternarGuardado, aoEditar,
}) {
  const { t, idioma } = usePreferencias();
  const { cores } = useTema();
  const estilos = useMemo(() => criarEstilos(cores), [cores]);
  const ocupado = salvandoInteresse || salvandoFavorito;
  const tituloInteresse = atividade.interessado
    ? (atividade.vencida ? t('grupo3.g113') : t('grupo3.g114'))
    : (atividade.vencida ? t('grupo3.g115') : t('grupo3.g116'));

  return (
    <View>
      {(!atividade.vencida || ordenacao === 'minhas') && (
        <View style={estilos.segmentado}>
          {[
            { titulo: t('grupo3.g052'), valor: 'recentes' },
            { titulo: t('grupo3.g023'), valor: 'populares' },
            { titulo: t('grupo3.g053'), valor: 'minhas' },
          ].map((opcao) => (
            <View
              key={opcao.valor}
              style={[
                estilos.segmento,
                ordenacao === opcao.valor && estilos.segmentoAtivo,
              ]}
            >
              <Text
                style={estilos.segmentoTexto}
                numberOfLines={1}
                adjustsFontSizeToFit
                minimumFontScale={0.75}
              >
                {opcao.titulo}
              </Text>
            </View>
          ))}
        </View>
      )}
      <FotoLocal imagem={atividade.imagem ? { uri: atividade.imagem } : undefined} style={estilos.imagem} />
      <Text style={estilos.titulo}>{atividade.titulo}</Text>
      <View style={estilos.categoria}><Etiqueta titulo={rotuloCatalogo3(atividade.categoria, t)} /></View>
      {atividade.vencida && (
        <View style={estilos.estado}><Etiqueta titulo={t('grupo3.g117')} /></View>
      )}
      <Text style={estilos.informacao}>{formatarDataCompleta(atividade.dataAtividade, idioma)}{' · '}{atividade.horario}</Text>
      <Text style={estilos.informacao}>{atividade.local}</Text>
      <Text style={estilos.interessados}>
        {atividade.interessados}{' '}{atividade.interessados === 1 ? t('grupo3.g118') : t('grupo3.g119')}
      </Text>
      <View style={estilos.descricaoBox}><Text style={estilos.descricao}>{atividade.descricao}</Text></View>
      <View style={estilos.botoes}>
        <View style={estilos.botao}>
          <Button titulo={tituloInteresse}
            variante={atividade.interessado || atividade.vencida ? 'secundario' : 'escuro'}
            aoPressionar={aoAlternarInteresse} carregando={salvandoInteresse}
            desabilitado={salvandoFavorito || (atividade.vencida && !atividade.interessado)} />
        </View>
        <View style={estilos.botao}>
          <Button titulo={atividade.guardado ? t('grupo3.g120') : t('grupo3.g121')}
            variante={atividade.guardado ? 'secundario' : 'contorno'}
            aoPressionar={aoAlternarGuardado} carregando={salvandoFavorito}
            desabilitado={salvandoInteresse} />
        </View>
      </View>
      {atividade.minhaAtividade && (
        <View style={estilos.areaEditar}>
          <Button titulo={t('grupo3.g085')} variante="secundario" aoPressionar={aoEditar} desabilitado={ocupado} />
        </View>
      )}
    </View>
  );
}

function criarEstilos(cores) {
  return StyleSheet.create({
    segmentado: {
      height: 38, flexDirection: 'row', borderWidth: 1, borderColor: cores.segmentoBorda,
      borderRadius: raios.pill, overflow: 'hidden', marginBottom: espacamentos.lg
    },
    segmento: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 4, },
    segmentoAtivo: { backgroundColor: cores.segmentoSelecionado },
    segmentoTexto: { fontSize: tipografia.legenda, color: cores.texto, textAlign: 'center', },
    imagem: { width: '100%', height: 180, borderRadius: raios.md },
    titulo: { marginTop: espacamentos.md, marginBottom: espacamentos.sm, fontSize: 19, fontWeight: '700', color: cores.texto },
    categoria: { alignSelf: 'flex-start', marginBottom: espacamentos.md },
    estado: { alignSelf: 'flex-start', marginBottom: espacamentos.md },
    informacao: { marginBottom: espacamentos.sm, fontSize: tipografia.corpo, color: cores.textoSecundario },
    interessados: { marginTop: espacamentos.xs, marginBottom: espacamentos.sm, fontSize: tipografia.corpo, fontWeight: '700', color: cores.texto },
    descricaoBox: {
      minHeight: 90, borderWidth: 1, borderColor: cores.borda, borderRadius: raios.sm,
      padding: espacamentos.md, backgroundColor: cores.superficie, marginBottom: espacamentos.md
    },
    descricao: { fontSize: tipografia.legenda, lineHeight: 20, color: cores.texto },
    botoes: { flexDirection: 'row', gap: espacamentos.md, marginTop: espacamentos.sm },
    botao: { flex: 1 },
    areaEditar: { marginTop: espacamentos.md },
  });
}
