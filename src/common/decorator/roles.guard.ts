import { USER_NOT_FOUND } from './../../users/contants/message';
import { SetMetadata, UseGuards, HttpException, HttpStatus } from '@nestjs/common';
import  jwt_decode  from 'jwt-decode';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Roles } from '../enum/role.enum';
import { UsersService } from 'src/users/services/users.service';
import { applyDecorators } from '@nestjs/common/decorators';
import { Request } from 'express';
import { FORBIDDEN } from '../constant/message';
import { PemissionGuard } from './ucp.guard';

@Injectable()
export class RolesGuards implements CanActivate{
    constructor(

        private reflector : Reflector ,
        private readonly usersService : UsersService

        ){}


    async canActivate(context: ExecutionContext): Promise<boolean>{

        const roles : Roles []= this.reflector.get<Roles[]>('roles', context.getHandler());
        const request : Request = context.switchToHttp().getRequest() ;
        
        if(!request.headers.authorization) return false
        let token : any = jwt_decode(request.headers.authorization) ;
        let idUser : string = token.idUser ;
        
        let userCheck   = await this.usersService.validateUser({id : idUser})
        
        if(userCheck){  

            if(roles.includes(userCheck.role)) {
                
                if(userCheck.isActive == true){

                    return true

                }else{
                    
                    throw new HttpException(USER_NOT_FOUND , HttpStatus.NOT_FOUND)

                }

            }else{
                throw new HttpException(FORBIDDEN , HttpStatus.FORBIDDEN)


            }

        }else{

            throw new HttpException(USER_NOT_FOUND , HttpStatus.NOT_FOUND)


        }

    }
}


export function RolesCheck(roles : Roles []){

    return applyDecorators(

        SetMetadata('roles' , roles),
        UseGuards(RolesGuards , PemissionGuard)

    )
    
}