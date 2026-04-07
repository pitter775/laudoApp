export type InternalAuthUser = {
  id: string;
  nome: string;
  email: string;
};

export type InternalAuthSession = {
  user: InternalAuthUser;
};

export type InternalLoginPayload = {
  email: string;
  password: string;
};
