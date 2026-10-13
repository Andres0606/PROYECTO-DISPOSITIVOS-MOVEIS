// SERVICE — Locais
// ETAPA FRONT: dados estáticos. Depois, o corpo desta função será trocado
// por uma chamada HTTP real, sem alterar a screen.

const LOCAIS = [
  { id: 'unochapeco', nome: 'Unochapecó', categoria: 'Universidade', distanciaKm: 1.2 },
  { id: 'ecoparque', nome: 'Ecoparque Chapecó', categoria: 'Lazer', distanciaKm: 2.4 },
  { id: 'shopping-patio', nome: 'Shopping Pátio Chapecó', categoria: 'Shopping', distanciaKm: 3.1 },
  // Exemplos adicionais para que os filtros Mercados/Restaurantes funcionem
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