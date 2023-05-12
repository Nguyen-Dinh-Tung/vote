import { HttpStatus } from '@nestjs/common';
import { Response } from 'express';

export const appErrorResponse = (
  status: HttpStatus,
  message: string,
  res: Response,
) => {
  return res.status(status).json({
    message,
  });
};
