import { usePreferencias } from '../contexts/PreferenciasContext';

// SCREEN — Nova tarefa

import { useRef, useState } from 'react';
import { ScreenTemplate } from '../components/templates/ScreenTemplate';
import { FormularioTarefa } from '../components/organisms/FormularioTarefa';
import { criarTarefa } from '../services/tarefas';

export function TaskCreateScreen({ navigation }) {
  const { t } = usePreferencias();
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState('');
  const bloqueio = useRef(false);

  async function criar(dados) {
    if (bloqueio.current) return;

    bloqueio.current = true;
    setErro('');
    setSalvando(true);

    try {
      const nova = await criarTarefa(dados);

      if (navigation.isFocused()) {
        navigation.navigate('TarefasLista', { etapa: nova.etapa });
      }
    } catch (e) {
      setErro(t('mensagens.servidor', { mensagem: e.message, opcional: true }) || t('grupo2.g007'));
    } finally {
      bloqueio.current = false;
      setSalvando(false);
    }
  }

  return (
    <ScreenTemplate titulo={t('grupo2.g002')}
      aoVoltar={() => { if (!bloqueio.current) navigation.goBack(); }}>

      <FormularioTarefa rotuloEnviar={t('grupo2.g008')}
        aoEnviar={criar} carregando={salvando} erroGeral={erro} />
    </ScreenTemplate>
  );
}
