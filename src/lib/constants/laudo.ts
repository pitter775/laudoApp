export const laudoWizardSteps = [
  {
    id: "cliente",
    title: "Cliente",
    description: "Cadastro e contato do cliente.",
  },
  {
    id: "peca",
    title: "Peça",
    description: "Item analisado e identificação.",
  },
  {
    id: "avaliacao",
    title: "Avaliação",
    description: "Checklist técnico dinâmico.",
  },
  {
    id: "fotos",
    title: "Fotos",
    description: "Upload e preview dos anexos.",
  },
  {
    id: "confirmacao",
    title: "Confirmação",
    description: "Resumo e emissão do PDF.",
  },
] as const;

export const laudoStatus = [
  "APROVADO",
  "REPARAR",
  "REPROVADO",
] as const;
