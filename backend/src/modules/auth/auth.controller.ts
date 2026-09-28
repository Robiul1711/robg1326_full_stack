import { Request, Response } from "express";
import * as authService from "./auth.service";

export const register = (req: Request, res: Response) => authService.register(req, res);
export const login = (req: Request, res: Response) => authService.login(req, res);
export const forgotPassword = (req: Request, res: Response) => authService.forgotPassword(req, res);
export const setNewPassword = (req: Request, res: Response) => authService.setNewPassword(req, res);
export const changePassword = (req: Request, res: Response) => authService.changePassword(req, res);
export const getMe = (req: Request, res: Response) => authService.getMe(req, res);
export const logout = (req: Request, res: Response) => authService.logout(req, res);
export const getAllUsers = (req: Request, res: Response) => authService.getAllUsers(req, res);
export const updateUserStatus = (req: Request, res: Response) => authService.updateUserStatus(req, res);
export const deleteUser = (req: Request, res: Response) => authService.deleteUser(req, res);
export const getAdminStats = (req: Request, res: Response) => authService.getAdminStats(req, res);
