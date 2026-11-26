
// ORGANISM — DetalheAtividade

import { useMemo } from 'react';

import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { Button } from '../atoms/Button';
import { FotoLocal } from '../atoms/FotoLocal';
import { Etiqueta } from '../atoms/Etiqueta';

import {
  espacamentos,
  raios,
  tipografia,
} from '../../theme';

import {
  useTema,
} from '../../theme/useTema';

export function DetalheAtividade({
  atividade,
  ordenacao = 'recentes',
  salvandoInteresse = false,
  salvandoFavorito = false,
  aoAlternarInteresse,
  aoAlternarGuardado,
  aoEditar,
}) {
  const { cores } = useTema();

  const estilos = useMemo(
    () => criarEstilos(cores),
    [cores]
  );

  const ocupado =
    salvandoInteresse || salvandoFavorito;

  return (
    <View>

      {/* ORDENAÇÃO */}

      <View style={estilos.segmentado}>

        <View
          style={[
            estilos.segmento,

            ordenacao === 'recentes' &&
              estilos.segmentoAtivo,
          ]}
        >
          <Text style={estilos.segmentoTexto}>
            Próximas
          </Text>
        </View>

        <View
          style={[
            estilos.segmento,

            ordenacao === 'populares' &&
              estilos.segmentoAtivo,
          ]}
        >
          <Text style={estilos.segmentoTexto}>
            Populares
          </Text>
        </View>

      </View>

      {/* IMAGEM */}

      <FotoLocal
        imagem={
          atividade.imagem
            ? { uri: atividade.imagem }
            : undefined
        }

        style={estilos.imagem}
      />

      {/* TÍTULO */}

      <Text style={estilos.titulo}>
        {atividade.titulo}
      </Text>

      {/* CATEGORIA */}

      <View style={estilos.categoria}>
        <Etiqueta
          titulo={atividade.categoria}
        />
      </View>

      {/* DATA E HORÁRIO */}

      <Text style={estilos.informacao}>
        {atividade.dataCompleta ?? atividade.data}
        {' · '}
        {atividade.horario}
      </Text>

      {/* LOCAL */}

      <Text style={estilos.informacao}>
        {atividade.local}
      </Text>

      {/* INTERESSADOS */}

      <Text style={estilos.interessados}>
        {atividade.interessados}
        {' '}
        {atividade.interessados === 1
          ? 'pessoa interessada'
          : 'pessoas interessadas'}
      </Text>

      {/* DESCRIÇÃO */}

      <View style={estilos.descricaoBox}>
        <Text style={estilos.descricao}>
          {atividade.descricao}
        </Text>
      </View>

      {/* AÇÕES */}

      <View style={estilos.botoes}>

        <View style={estilos.botao}>

          <Button
            titulo={
              atividade.interessado
                ? 'Interessado'
                : 'Me interessa'
            }

            variante={
              atividade.interessado
                ? 'secundario'
                : 'escuro'
            }

            aoPressionar={aoAlternarInteresse}

            carregando={salvandoInteresse}

            desabilitado={salvandoFavorito}
          />

        </View>

        <View style={estilos.botao}>

          <Button
            titulo={
              atividade.guardado
                ? 'Guardado'
                : 'Guardar'
            }

            variante={
              atividade.guardado
                ? 'secundario'
                : 'contorno'
            }

            aoPressionar={aoAlternarGuardado}

            carregando={salvandoFavorito}

            desabilitado={salvandoInteresse}
          />

        </View>

      </View>

      {/* EDITAR — SOMENTE O CRIADOR */}

      {atividade.minhaAtividade && (

        <View style={estilos.areaEditar}>

          <Button
            titulo="Editar"

            variante="secundario"

            aoPressionar={aoEditar}

            desabilitado={ocupado}
          />

        </View>

      )}

    </View>
  );
}

// ============================================================
// ESTILOS
// ============================================================

function criarEstilos(cores) {
  return StyleSheet.create({

    segmentado: {
      height: 38,
      flexDirection: 'row',
      borderWidth: 1,
      borderColor: cores.segmentoBorda,
      borderRadius: raios.pill,
      overflow: 'hidden',
      marginBottom: espacamentos.lg,
    },

    segmento: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },

    segmentoAtivo: {
      backgroundColor:
        cores.segmentoSelecionado,
    },

    segmentoTexto: {
      fontSize: tipografia.legenda,
      color: cores.texto,
    },

    imagem: {
      width: '100%',
      height: 180,
      borderRadius: raios.md,
    },

    titulo: {
      marginTop: espacamentos.md,
      marginBottom: espacamentos.sm,
      fontSize: 19,
      fontWeight: '700',
      color: cores.texto,
    },

    categoria: {
      alignSelf: 'flex-start',
      marginBottom: espacamentos.md,
    },

    informacao: {
      marginBottom: espacamentos.sm,
      fontSize: tipografia.corpo,
      color: cores.textoSecundario,
    },

    interessados: {
      marginTop: espacamentos.xs,
      marginBottom: espacamentos.sm,
      fontSize: tipografia.corpo,
      fontWeight: '700',
      color: cores.texto,
    },

    descricaoBox: {
      minHeight: 90,
      borderWidth: 1,
      borderColor: cores.borda,
      borderRadius: raios.sm,
      padding: espacamentos.md,
      backgroundColor: cores.superficie,
      marginBottom: espacamentos.md,
    },

    descricao: {
      fontSize: tipografia.legenda,
      lineHeight: 20,
      color: cores.textoSecundario,
    },

    botoes: {
      flexDirection: 'row',
      gap: espacamentos.md,
      marginTop: espacamentos.sm,
    },

    botao: {
      flex: 1,
    },

    areaEditar: {
      marginTop: espacamentos.md,
    },

  });
}
