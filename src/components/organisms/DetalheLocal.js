// ORGANISM — DetalheLocal (foto, nome, endereço, mapa e ações)
import { StyleSheet, Text, View } from 'react-native';
import { Card } from '../atoms/Card';
import { Chip } from '../atoms/Chip';
import { FotoLocal } from '../atoms/FotoLocal';
import { imagensLocais } from '../../constants/locais';
import { mapasLocais } from '../../constants/mapasLocais';
import { cores, espacamentos, raios, tipografia } from '../../theme';

export function DetalheLocal({
  local,
  guardado,
  aoAlternarGuardado,
  aoVerMapa,
}) {
  const subtitulo = [local.categoria, local.horario].filter(Boolean).join(' · ');
  const temEndereco = !!(local.endereco || local.bairro);

  return (
    <View>
      <FotoLocal imagem={imagensLocais[local.id]} style={estilos.foto} />

      <Text style={estilos.nome}>{local.nome}</Text>
      <Text style={estilos.subtitulo}>{subtitulo}</Text>

      {temEndereco && (
        <Card style={estilos.endereco}>
          {!!local.endereco && (
            <Text style={estilos.rua}>{local.endereco}</Text>
          )}
          {!!local.bairro && <Text style={estilos.bairro}>{local.bairro}</Text>}
        </Card>
      )}

      <FotoLocal
        imagem={mapasLocais[local.id]}
        icone="map-outline"
        style={estilos.mapa}
      />

      <View style={estilos.acoes}>
        <Chip titulo="Ver no mapa" aoPressionar={aoVerMapa} />
        <Chip
          titulo={guardado ? 'Guardado' : 'Guardar'}
          variante={guardado ? 'selecionado' : 'suave'}
          aoPressionar={aoAlternarGuardado}
        />
      </View>
    </View>
  );
}

const estilos = StyleSheet.create({
  foto: {
    width: '100%',
    height: 183,
    borderRadius: 16,
  },
  nome: {
    marginTop: espacamentos.md - 4,
    fontSize: tipografia.titulo,
    lineHeight: 34,
    fontWeight: '600',
    color: cores.texto,
  },
  subtitulo: {
    marginTop: espacamentos.xs,
    fontSize: tipografia.corpo,
    fontWeight: '600',
    color: cores.textoSecundario,
  },
  endereco: {
    marginTop: espacamentos.lg - 4,
    justifyContent: 'center',
    gap: espacamentos.xs,
    borderColor: cores.bordaForte,
  },
  rua: {
    fontSize: tipografia.subtitulo,
    color: cores.texto,
  },
  bairro: {
    fontSize: tipografia.corpo,
    color: cores.textoSecundario,
  },
  mapa: {
    width: '100%',
    height: 134,
    marginTop: espacamentos.md,
    borderRadius: raios.sm,
  },
  acoes: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: espacamentos.lg,
    marginTop: espacamentos.lg,
  },
});