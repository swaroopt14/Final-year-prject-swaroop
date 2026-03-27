import { vi } from "vitest";

type JsonBody = unknown;

export function createMockRes() {
  const state: { statusCode: number; body: JsonBody } = {
    statusCode: 200,
    body: undefined
  };

  const res = {
    status: vi.fn((code: number) => {
      state.statusCode = code;
      return res;
    }),
    json: vi.fn((payload: JsonBody) => {
      state.body = payload;
      return res;
    })
  };

  return { res, state };
}

export function createNext() {
  return vi.fn();
}
