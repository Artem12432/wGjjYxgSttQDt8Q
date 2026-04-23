const BASE_URL = "http://localhost:3301";

export interface User {
  id: number;
  login: string;
  email: string;
  name: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface RegisterBody {
  login: string;
  email: string;
  password: string;
  name: string;
}

export interface LoginBody {
  login: string;
  password: string;
}

const TokenStorage = {
  getAccess: (): string | null => localStorage.getItem("accessToken"),
  getRefresh: (): string | null => localStorage.getItem("refreshToken"),

  save: (tokens: AuthTokens): void => {
    localStorage.setItem("accessToken", tokens.accessToken);
    localStorage.setItem("refreshToken", tokens.refreshToken);
  },

  saveAccess: (token: string): void => {
    localStorage.setItem("accessToken", token);
  },

  clear: (): void => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  },
};

let isRefreshing = false;
let refreshQueue: Array<(token: string) => void> = [];

function resolveQueue(token: string) {
  refreshQueue.forEach((resolve) => resolve(token));
  refreshQueue = [];
}

async function refreshAccessToken(): Promise<string> {
  const refreshToken = TokenStorage.getRefresh();
  if (!refreshToken) throw new Error("No refresh token");

  const res = await fetch(`${BASE_URL}/auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken }),
  });

  if (!res.ok) {
    TokenStorage.clear();
    throw new Error("Session expired. Please log in again.");
  }

  const data: { accessToken: string } = await res.json();
  TokenStorage.saveAccess(data.accessToken);
  return data.accessToken;
}

async function request<T>(
  path: string,
  options: RequestInit = {},
  isRetry = false
): Promise<T> {
  const accessToken = TokenStorage.getAccess();

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (accessToken) {
    headers["Authorization"] = `Bearer ${accessToken}`;
  }

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });

  if (res.status === 401 && !isRetry) {
    if (isRefreshing) {
      const newToken = await new Promise<string>((resolve) => {
        refreshQueue.push(resolve);
      });
      return request<T>(path, options, true);
    }

    isRefreshing = true;
    try {
      const newToken = await refreshAccessToken();
      resolveQueue(newToken);
      return request<T>(path, options, true);
    } finally {
      isRefreshing = false;
    }
  }

  if (!res.ok) {
    let message = `HTTP ${res.status}`;
    try {
      const err = await res.json();
      message = err.error ?? message;
    } catch {}
    throw new Error(message);
  }

  const text = await res.text();
  return text ? JSON.parse(text) : ({} as T);
}
export const authApi = {
  register: (body: RegisterBody): Promise<User> =>
    request<User>("/auth/register", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  login: async (body: LoginBody): Promise<AuthTokens> => {
    const tokens = await request<AuthTokens>("/auth/login", {
      method: "POST",
      body: JSON.stringify(body),
    });
    TokenStorage.save(tokens);
    return tokens;
  },

  logout: async (): Promise<void> => {
    const refreshToken = TokenStorage.getRefresh();
    if (refreshToken) {
      await request<void>("/auth/logout", {
        method: "POST",
        body: JSON.stringify({ refreshToken }),
      }).catch(() => {
 
      });
    }
    TokenStorage.clear();
  },

  isLoggedIn: (): boolean => !!TokenStorage.getAccess(),
};

export const usersApi = {
  //Get all users. Requires auth.

  getAll: (): Promise<User[]> => request<User[]>("/users"),

  //Get a single user by ID.
  
  getById: (id: number): Promise<User> => request<User>(`/users/${id}`),
  
  //Get a single user by name.

  getByName: (name: string): Promise<User> =>
    request<User>(`/users/by-name/${encodeURIComponent(name)}`),

  //Delete a user by ID.

  delete: (id: number): Promise<void> =>
    request<void>(`/users/${id}`, { method: "DELETE" }),
};


export const api = {
  auth: authApi,
  users: usersApi,
};
