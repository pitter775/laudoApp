export type DadosCliente = {
  razaoSocial: string;
  cnpj: string;
  email: string;
  telefone: string;
};

export type DadosPeca = {
  pecaId: string;
  modelo: string;
  identificacao: string;
  observacao: string;
};

export type AvaliacaoStatus = "APROVADO" | "REPARAR" | "REPROVADO";

export type Peca = {
  id: string;
  nome: string;
  created_at?: string;
};

export type PecaAnalise = {
  id: string;
  peca_id: string;
  nome: string;
  created_at?: string;
};

export type LaudoItemDraft = {
  analiseId: string;
  nome: string;
  status: AvaliacaoStatus | "";
};

export type FotoUpload = {
  id: string;
  nome: string;
  imagemBase64: string;
};

export type LaudoResumoStatus = "APROVADO" | "REPROVADO";

export type UsuarioSessao = {
  id: string;
  nome: string;
  email: string;
};

export type LaudoWizardDraft = {
  cliente: DadosCliente;
  peca: DadosPeca;
  itens: LaudoItemDraft[];
  fotos: string[];
};

export type EmitirLaudoPayload = {
  userId: string;
  dadosCliente: DadosCliente;
  dadosPeca: DadosPeca;
  pecaId: string;
  status: LaudoResumoStatus;
  itens: Array<{
    analiseId: string;
    status: AvaliacaoStatus;
  }>;
  anexos: Array<{
    imagemBase64: string;
  }>;
};

export type LaudoItemPersistido = {
  id: string;
  analiseId: string;
  nome: string;
  status: AvaliacaoStatus;
};

export type LaudoAnexoPersistido = {
  id: string;
  imagemBase64: string;
};

export type LaudoDetalhe = {
  id: string;
  pecaId: string;
  pecaNome: string;
  dadosCliente: DadosCliente;
  dadosPeca: DadosPeca;
  status: LaudoResumoStatus;
  createdAt: string;
  itens: LaudoItemPersistido[];
  anexos: LaudoAnexoPersistido[];
};

export type LaudoListItem = {
  id: string;
  clienteNome: string;
  pecaNome: string;
  status: LaudoResumoStatus;
  createdAt: string;
};
