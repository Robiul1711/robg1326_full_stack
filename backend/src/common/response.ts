import { Response } from "express";

export const successResponse = <T>(
  res: Response,
  data: T,
  statusCode: number = 200,
  message: string = "Success"
) => {
  res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

export const errorResponse = (
  res: Response,
  message: string = "Error",
  statusCode: number = 500
) => {
  res.status(statusCode).json({
    success: false,
    message,
  });
};
