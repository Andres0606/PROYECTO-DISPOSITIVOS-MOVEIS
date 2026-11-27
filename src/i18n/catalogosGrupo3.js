const CHAVES = {
  "Compras": "grupo3.g144",
  "Cotidiano": "grupo3.g145",
  "Emergência": "grupo3.g146",
  "Restaurante": "grupo3.g147",
  "Saudações": "grupo3.g148",
  "Transporte": "grupo3.g149",
  "Universidade": "grupo3.g150",
  "Adaptação": "grupo3.g151",
  "Alimentação": "grupo3.g152",
  "Clima": "grupo3.g153",
  "Documentos": "grupo3.g154",
  "Moradia": "grupo3.g155",
  "Vida social": "grupo3.g156",
  "Acadêmica": "grupo3.g157",
  "Cultural": "grupo3.g158",
  "Esporte": "grupo3.g159",
  "Lazer": "grupo3.g160",
  "Social": "grupo3.g161",
  "Turismo": "grupo3.g162"
};
export function rotuloCatalogo3(valor, t) { return Object.prototype.hasOwnProperty.call(CHAVES, valor) ? t(CHAVES[valor]) : valor; }
