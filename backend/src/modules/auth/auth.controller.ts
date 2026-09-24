import { Request, Response } from "express";
import * as authService from "./auth.service";

export const register = async (req: Request, res: Response) => {
  await authService.register(req, res);
};

export const login = async (req: Request, res: Response) => {
  await authService.login(req, res);
};

export const forgotPassword = async (req: Request, res: Response) => {
  await authService.forgotPassword(req, res);
};

export const verifyEmail = async (req: Request, res: Response) => {
  await authService.verifyEmail(req, res);
};

export const setNewPassword = async (req: Request, res: Response) => {
  await authService.setNewPassword(req, res);
};

export const getMe = async (req: Request, res: Response) => {
  await authService.getMe(req, res);
};

export const logout = async (req: Request, res: Response) => {
  await authService.logout(req, res);
};

export const getAllUsers = async (req: Request, res: Response) => {
  await authService.getAllUsers(req, res);
};
