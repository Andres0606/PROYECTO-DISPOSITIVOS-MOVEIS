// SCREEN — Novo gasto
import { useState } from 'react';
import { ScreenTemplate } from '../components/templates/ScreenTemplate';
import { FormularioGasto } from '../components/organisms/FormularioGasto';
import { criarGasto } from '../services/gastos';

export function ExpenseCreateScreen({ navigation }) {
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState('');

  async function registrar(dados) {
    setErro('');
    setSalvando(true);

    try {
      await criarGasto(dados);

      // Volta ao resumo, que se atualiza sozinho ao ganhar foco.
      navigation.goBack();
    } catch (e) {
      setErro('Não foi possível registrar o gasto. Tente novamente.');
      setSalvando(false);
    }
  }

  return (
    <ScreenTemplate titulo="Novo gasto" aoVoltar={() => navigation.goBack()}>
      <FormularioGasto
        rotuloEnviar="Registrar gasto"
        aoEnviar={registrar}
        carregando={salvando}
        erroGeral={erro}
      />
    </ScreenTemplate>
  );
}