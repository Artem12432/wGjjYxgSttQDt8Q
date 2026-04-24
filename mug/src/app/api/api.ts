const BASE_URL = "http://localhost:3301";

export interface User {
  id: number;
  login: string;
  email: string;
  name: string;
  posts?: Post[];
}

export interface Tag {
  id: number;
  name: string;
}

export interface PostTag {
  tag: Tag;
}

export interface Post {
  id: number;
  title?: string;
  content?: string;
  imageUrl?: string;
  userId: number;
  user?: User;
  tags?: PostTag[];
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
  getAccess: () => localStorage.getItem("accessToken"),
  getRefresh: () => localStorage.getItem("refreshToken"),

  save: (tokens: AuthTokens) => {
    localStorage.setItem("accessToken", tokens.accessToken);
    localStorage.setItem("refreshToken", tokens.refreshToken);
  },

  saveAccess: (token: string) => {
    localStorage.setItem("accessToken", token);
  },

  clear: () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  },
};

let isRefreshing = false;
let queue: Array<(token: string) => void> = [];

function resolveQueue(token: string) {
  queue.forEach((cb) => cb(token));
  queue = [];
}

async function refreshAccessToken(): Promise<string> {
  const refreshToken = TokenStorage.getRefresh();

  if (!refreshToken) {
    throw new Error("No refresh token");
  }

  const res = await fetch(`${BASE_URL}/auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken }),
  });

  if (!res.ok) {
    TokenStorage.clear();
    throw new Error("Session expired");
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
  const token = TokenStorage.getAccess();

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers,
  });

  if (res.status === 401 && !isRetry) {
    if (isRefreshing) {
      const newToken = await new Promise<string>((resolve) => {
        queue.push(resolve);
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
    const err = await res.json().catch(() => null);
    throw new Error(err?.error || `HTTP ${res.status}`);
  }

  const text = await res.text();
  return text ? JSON.parse(text) : ({} as T);
}

export const authApi = {
  register: (body: RegisterBody) =>
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

  logout: async () => {
    const refreshToken = TokenStorage.getRefresh();

    if (refreshToken) {
      await request("/auth/logout", {
        method: "POST",
        body: JSON.stringify({ refreshToken }),
      }).catch(() => {});
    }

    TokenStorage.clear();
  },

  me: (): Promise<User> => request<User>("/auth/me"),

  isLoggedIn: () => !!TokenStorage.getAccess(),
};

export const usersApi = {
  getAll: (): Promise<User[]> => request<User[]>("/users"),

  getById: (id: number): Promise<User> =>
    request<User>(`/users/${id}`),

  getByName: (name: string): Promise<User> =>
    request<User>(`/users/by-name/${encodeURIComponent(name)}`),

  delete: (id: number): Promise<void> =>
    request<void>(`/users/${id}`, { method: "DELETE" }),
};

export const postsApi = {
  getAll: (): Promise<Post[]> => request<Post[]>("/posts"),

  getById: (id: number): Promise<Post> =>
    request<Post>(`/posts/${id}`),

  create: (data: {
    title?: string;
    content?: string;
    imageUrl?: string;
  }): Promise<Post> =>
    request<Post>("/posts", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  delete: (id: number): Promise<void> =>
    request<void>(`/posts/${id}`, {
      method: "DELETE",
    }),
};

export const api = {
  auth: authApi,
  users: usersApi,
  posts: postsApi,
};
