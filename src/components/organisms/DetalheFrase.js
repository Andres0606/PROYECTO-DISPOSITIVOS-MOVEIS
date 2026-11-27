// ORGANISM — DetalheFrase

import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { Card } from '../atoms/Card';
import { Etiqueta } from '../atoms/Etiqueta';
import { BotaoIcone } from '../atoms/BotaoIcone';
import { Button } from '../atoms/Button';

import { espacamentos, tipografia } from '../../theme';
import { useTema } from '../../theme/useTema';

import { rotuloCatalogo3 } from '../../i18n/catalogosGrupo3';
import { usePreferencias } from '../../contexts/PreferenciasContext';

import {
  obterTraducaoFrase,
  obterContextoFrase,
} from '../../utils/frases';

export function DetalheFrase({
  frase,
  favorita,
  ocupado,
  falando,
  aoAlternarFavorita,
  aoPronunciar,
}) {
  const { t, idioma } = usePreferencias();
  const { cores } = useTema();

  // CONTEÚDO CONFORME O IDIOMA

  const traducao = obterTraducaoFrase(frase, idioma);

  const contexto = obterContextoFrase(frase, idioma);

  const rotuloTraducao =
    idioma === 'en' ? 'English' : t('grupo3.g081');

  return (
    <View style={estilos.tela}>

      <View style={estilos.cabecalho}>
        <Etiqueta
          titulo={
            rotuloCatalogo3(frase.categoria?.nome, t)
            ?? t('grupo3.g078')
          }
        />

        <BotaoIcone
          nome={favorita ? 'star' : 'star-outline'}
          tamanho={24}
          rotulo={
            favorita
              ? t('grupo3.g079')
              : t('grupo3.g080')
          }
          aoPressionar={
            ocupado ? undefined : aoAlternarFavorita
          }
        />
      </View>

      <Card>

        {/* FRASE ORIGINAL EM PORTUGUÊS */}

        <Text style={[
          estilos.idioma,
          { color: cores.textoSecundario },
        ]}>
          {t('grupo3.g078')}
        </Text>

        <Text style={[
          estilos.frase,
          { color: cores.texto },
        ]}>
          {frase.portugues}
        </Text>

        <View style={[
          estilos.divisor,
          { backgroundColor: cores.borda },
        ]} />

        {/* TRADUÇÃO CONFORME O IDIOMA */}

        <Text style={[
          estilos.idioma,
          { color: cores.textoSecundario },
        ]}>
          {rotuloTraducao}
        </Text>

        <Text style={[
          estilos.traducao,
          { color: cores.texto },
        ]}>
          {traducao}
        </Text>

      </Card>

      {/* PRONÚNCIA EM PORTUGUÊS */}

      <Button
        titulo={
          falando
            ? t('grupo3.g082')
            : t('grupo3.g083')
        }
        variante="secundario"
        aoPressionar={aoPronunciar}
        icone={
          <Ionicons
            name={
              falando
                ? 'stop-circle-outline'
                : 'volume-high-outline'
            }
            size={22}
            color={cores.texto}
          />
        }
      />

      {/* CONTEXTO DE USO TRADUZIDO */}

      {!!contexto && (
        <Card>

          <Text style={[
            estilos.titulo,
            { color: cores.texto },
          ]}>
            {t('grupo3.g084')}
          </Text>

          <Text style={[
            estilos.explicacao,
            { color: cores.textoSecundario },
          ]}>
            {contexto}
          </Text>

        </Card>
      )}

    </View>
  );
}

// ESTILOS

const estilos = StyleSheet.create({
  tela: {
    gap: espacamentos.lg,
  },

  cabecalho: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  idioma: {
    fontSize: tipografia.legenda,
    marginBottom: espacamentos.xs,
  },

  frase: {
    fontSize: tipografia.subtitulo,
    fontWeight: '700',
  },

  traducao: {
    fontSize: tipografia.subtitulo,
  },

  divisor: {
    height: StyleSheet.hairlineWidth,
    marginVertical: espacamentos.md,
  },

  titulo: {
    fontSize: tipografia.corpo,
    fontWeight: '600',
    marginBottom: espacamentos.sm,
  },

  explicacao: {
    fontSize: tipografia.corpo,
    lineHeight: 22,
  },
});