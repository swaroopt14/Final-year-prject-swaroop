const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:3000";

class ApiClient {
  private token: string | null = null;

  setToken(token: string | null) {
    this.token = token;
  }

  async get<T>(path: string): Promise<T> {
    const res = await fetch(`${baseUrl}${path}`, {
      headers: this.token ? { Authorization: `Bearer ${this.token}` } : undefined
    });
    if (!res.ok) throw new Error(await res.text());
    return (await res.json()) as T;
  }

  async post<T>(path: string, body: unknown): Promise<T> {
    const res = await fetch(`${baseUrl}${path}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(this.token ? { Authorization: `Bearer ${this.token}` } : {})
      },
      body: JSON.stringify(body)
    });
    if (!res.ok) throw new Error(await res.text());
    return (await res.json()) as T;
  }
}

export const api = new ApiClient();

