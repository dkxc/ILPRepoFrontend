// This file provides utility functions to work with your AuthContext
const AUTH_STORAGE_KEY = "auth_data";

interface AuthData {
  accessToken: string;
  userId: number;
  roleName: number;
}

export const getAuthToken = (): string | null => {
  const storedAuth = sessionStorage.getItem(AUTH_STORAGE_KEY);

  if (!storedAuth) {
    return null;
  }

  try {
    const parsed: AuthData = JSON.parse(storedAuth);
    return parsed.accessToken || null;
  } catch (error) {
    console.error("Error parsing auth data:", error);
    return null;
  }
};

export const getAuthData = (): AuthData | null => {
  const storedAuth = localStorage.getItem(AUTH_STORAGE_KEY);

  if (!storedAuth) {
    return null;
  }

  try {
    return JSON.parse(storedAuth);
  } catch (error) {
    console.error("Error parsing auth data:", error);
    return null;
  }
};

export const setAuthToken = (
  token: string,
  userId: number,
  roleName: number,
) => {
  const authData: AuthData = {
    accessToken: token,
    userId,
    roleName,
  };
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authData));
};

export const removeAuthToken = () => {
  localStorage.removeItem(AUTH_STORAGE_KEY);
};

export const getAuthHeaders = () => {
  const token = getAuthToken();
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

export const isAuthenticated = (): boolean => {
  return !!getAuthToken();
};
