// SERVICE — Locais
// ETAPA FRONT: dados estáticos. Depois, o corpo destas funções será trocado
// por chamadas HTTP reais, sem alterar as screens.
// Só o Unochapecó tem endereço e horário (vêm do Figma); os demais campos
// opcionais ficam vazios até o backend/CRUD de Locais existir.

const LOCAIS = [
  {
    id: 'unochapeco',
    nome: 'Unochapecó',
    categoria: 'Universidade',
    distanciaKm: 1.2,
    horario: 'Aberto até 22:00',
    endereco: 'Rua Senador Attílio Fontana, 591E',
    bairro: 'Bairro Efapi · Chapecó, SC',
  },
  { id: 'ecoparque', nome: 'Ecoparque Chapecó', categoria: 'Lazer', distanciaKm: 2.4 },
  { id: 'shopping-patio', nome: 'Shopping Pátio Chapecó', categoria: 'Shopping', distanciaKm: 3.1 },
  { id: 'mercado-sao-jose', nome: 'Mercado São José', categoria: 'Mercados', distanciaKm: 3.4 },
  { id: 'restaurante-sabor', nome: 'Restaurante Sabor', categoria: 'Restaurantes', distanciaKm: 3.8 },
];

function esperar(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function obterLocais() {
  await esperar(400); // simula o tempo de uma requisição
  return LOCAIS;
}

export async function obterLocal(id) {
  await esperar(300);

  const local = LOCAIS.find((item) => item.id === id);
  if (!local) {
    throw new Error('Local não encontrado.');
  }
  return local;
}