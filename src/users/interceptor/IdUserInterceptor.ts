import  jwt_decode  from 'jwt-decode';
import { async } from '@firebase/util';
import { createParamDecorator, ExecutionContext, HttpException, HttpStatus } from '@nestjs/common';

export const IdUserInterceptor = createParamDecorator(
    async (data : unknown ,ctx : ExecutionContext) =>{
        const req = ctx.switchToHttp().getRequest()
        if(!req.headers.authorization)   
        throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
        let token : any = jwt_decode(req.headers.authorization)
        return token.idUser

    }
)