export type MercadoLivreContract = {
  id: string;
  userId: string;
  storeName: string;
  sellerId: string;
  appId: string;
  connectedAt: string;
};

export type MercadoLivreConnectionPayload = {
  userId: string;
  storeName: string;
  sellerId: string;
  appId: string;
};
