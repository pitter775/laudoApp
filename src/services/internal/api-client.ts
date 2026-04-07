type ApiSuccess<T> = {
  success: true;
  data: T;
};

type ApiError = {
  success: false;
  error: string;
};

type ApiResponse<T> = ApiSuccess<T> | ApiError;

async function parseResponse<T>(response: Response) {
  const body = (await response.json()) as ApiResponse<T>;

  if (!response.ok || body.success === false) {
    throw new Error(body.success === false ? body.error : "Erro na API interna.");
  }

  return body.data;
}

export const internalApiClient = {
  async get<T>(path: string) {
    const response = await fetch(path, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    return parseResponse<T>(response);
  },
  async post<T>(path: string, body?: unknown) {
    const response = await fetch(path, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: body === undefined ? undefined : JSON.stringify(body),
    });

    return parseResponse<T>(response);
  },
};
