import { usePreferencias } from '../contexts/PreferenciasContext';
// SCREEN — Novo gasto

import { useRef, useState } from 'react';
import { ScreenTemplate } from '../components/templates/ScreenTemplate';
import { FormularioGasto } from '../components/organisms/FormularioGasto';
import { criarGasto } from '../services/gastos';

export function ExpenseCreateScreen({ navigation, route }) {
  const { t } = usePreferencias();
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState('');
  const bloqueio = useRef(false);

  async function registrar(dados) {
    if (bloqueio.current) return;

    bloqueio.current = true;
    setErro('');
    setSalvando(true);

    try {
      await criarGasto(dados);

      if (navigation.isFocused()) navigation.goBack();
    } catch (e) {
      setErro(e.message || t('grupo2.g034'));
    } finally {
      bloqueio.current = false;
      setSalvando(false);
    }
  }

  return (
    <ScreenTemplate titulo={t('grupo2.g035')}
      aoVoltar={() => { if (!bloqueio.current) navigation.goBack(); }}>

      <FormularioGasto
        dataInicial={route.params?.dataInicial}
        rotuloEnviar={t('grupo2.g036')}
        aoEnviar={registrar}
        carregando={salvando}
        erroGeral={erro}
      />
    </ScreenTemplate>
  );
}