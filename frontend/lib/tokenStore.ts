const KEY = "smart_hospital_token";

export const tokenStore = {
  get(): string {
    if (typeof window === "undefined") return "";
    return window.localStorage.getItem(KEY) ?? "";
  },
  set(token: string) {
    window.localStorage.setItem(KEY, token);
  },
  clear() {
    window.localStorage.removeItem(KEY);
  }
};

