
// Traduz apenas a apresentação dos valores conhecidos, sem alterar IDs ou nomes da API.
const CHAVES_CATALOGO = {
  "Antes": "grupo2.g133",
  "Chegada": "grupo2.g134",
  "Durante": "grupo2.g135",
  "Retorno": "grupo2.g136",
  "A Fazer": "grupo2.g137",
  "Concluído": "grupo2.g138",
  "Em Andamento": "grupo2.g139",
  "Alta": "grupo2.g140",
  "Média": "grupo2.g141",
  "Baixa": "grupo2.g142",
  "Alimentação": "grupo2.g143",
  "Compras": "grupo2.g144",
  "Educação": "grupo2.g145",
  "Lazer": "grupo2.g146",
  "Moradia": "grupo2.g147",
  "Outros": "grupo2.g148",
  "Saúde": "grupo2.g149",
  "Transporte": "grupo2.g150",
  "Selecione": "grupo2.g090",
  "Sem prioridade": "grupo2.g091"
};
export function rotuloCatalogo(valor, t) {
  return Object.prototype.hasOwnProperty.call(CHAVES_CATALOGO, valor) ? t(CHAVES_CATALOGO[valor]) : valor;
}
