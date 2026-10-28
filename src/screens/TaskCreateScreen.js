// SCREEN — Nova tarefa
import { useState } from 'react';
import { ScreenTemplate } from '../components/templates/ScreenTemplate';
import { FormularioTarefa } from '../components/organisms/FormularioTarefa';
import { criarTarefa } from '../services/tarefas';

export function TaskCreateScreen({ navigation }) {
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState('');

  async function criar(dados) {
    setErro('');
    setSalvando(true);

    try {
      const nova = await criarTarefa(dados);

      // Volta para a lista já na etapa da tarefa criada.
      navigation.navigate('TarefasLista', { etapa: nova.etapa });
    } catch (e) {
      setErro('Não foi possível criar a tarefa. Tente novamente.');
      setSalvando(false);
    }
  }

  return (
    <ScreenTemplate titulo="Nova tarefa" aoVoltar={() => navigation.goBack()}>
      <FormularioTarefa
        rotuloEnviar="Criar tarefa"
        aoEnviar={criar}
        carregando={salvando}
        erroGeral={erro}
      />
    </ScreenTemplate>
  );
}