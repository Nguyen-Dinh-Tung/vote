import { HttpStatus } from '@nestjs/common';
import { Response } from 'express';
export const appResSuccess = (
  data: any,
  message: string,
  status: HttpStatus,
  res: Response,
) => {
  return res.status(status).json({
    message: message,
    data: data,
  });
};
 