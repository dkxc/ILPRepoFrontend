const apiClient = async <T>(
  endpoint: string,
  options?: RequestInit,
): Promise<T> => {
  const baseUrl = import.meta.env.VITE_API_PREFIX || "";
  const url = `${baseUrl}${endpoint}`;

  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  return response.json() as Promise<T>;
};

export default apiClient;
