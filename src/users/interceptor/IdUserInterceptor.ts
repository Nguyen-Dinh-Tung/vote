import jwt_decode from 'jwt-decode';
import {
  createParamDecorator,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

export const IdUserInterceptor = createParamDecorator(
  async (data: unknown, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();
    if (!req.headers.authorization)
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    const token: any = jwt_decode(req.headers.authorization);
    return token.idUser;
  },
);
