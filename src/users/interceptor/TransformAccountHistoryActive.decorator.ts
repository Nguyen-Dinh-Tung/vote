import { createParamDecorator } from '@nestjs/common';
import { SetMetadata, UseGuards, UnauthorizedException } from '@nestjs/common';
import  jwt_decode  from 'jwt-decode';
import { CanActivate, ExecutionContext, Injectable , HttpException  , HttpStatus} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UsersService } from 'src/users/services/users.service';
import { applyDecorators } from '@nestjs/common/decorators';
import { Request } from 'express';
import { UserEntity } from 'src/users/entities/user.entity';

export const UserByToken = createParamDecorator(
    async(data : unknown , ctx : ExecutionContext) =>{
        const req = ctx.switchToHttp().getRequest()
        if(!req.headers.authorization)   throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);

        let token : any = jwt_decode(req.headers.authorization) ;
        
        return token.username
        
    }
)