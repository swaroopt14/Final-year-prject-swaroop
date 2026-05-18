import type { RequestHandler } from "express";
import { ok } from "../../utils/response.wrapper.js";
import { authService } from "./auth.service.js";

const login: RequestHandler = async (req, res, next) => {
  try {
    const { email, password } = req.body as { email: string; password: string };
    const result = await authService.login(email, password);
    res.cookie("sc_token", result.token, authService.cookieOptions());
    res.json(ok({ token: result.token, user: result.user }));
  } catch (e) {
    next(e);
  }
};

const logout: RequestHandler = (_req, res) => {
  res.clearCookie("sc_token", { path: "/", httpOnly: true, sameSite: "lax" });
  res.json(ok({ loggedOut: true }));
};

const me: RequestHandler = async (req, res, next) => {
  try {
    if (!req.user?.sub) {
      return next();
    }
    const user = await authService.getUserById(req.user.sub);
    res.json(ok(user));
  } catch (e) {
    next(e);
  }
};

export const authController = { login, logout, me };
