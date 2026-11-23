const API_URL = 'http://10.0.2.2:3000';

export async function obterRoles() {
  try {
    const resposta = await fetch(`${API_URL}/roles`);

    if (!resposta.ok) {
      throw new Error('Erro ao buscar roles.');
    }

    const dados = await resposta.json();

    return dados;
  } catch (erro) {
    console.log('Erro na API:', erro);

    throw erro;
  }
}