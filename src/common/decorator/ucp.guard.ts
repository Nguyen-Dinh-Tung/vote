import { COMPANY_NOT_EXIST } from './../../assignment-company/contants/contant';
import { CompanyEntity } from './../../company/entities/company.entity';
import { UserCp } from './../../user-cp/entities/user-cp.entity';
import { USER_NOT_FOUND } from './../../users/contants/message';
import { SetMetadata, UseGuards, UnauthorizedException, HttpException, HttpStatus } from '@nestjs/common';
import  jwt_decode  from 'jwt-decode';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Roles } from '../enum/role.enum';
import { UsersService } from 'src/users/services/users.service';
import { applyDecorators } from '@nestjs/common/decorators';
import { Request } from 'express';
import { UserEntity } from 'src/users/entities/user.entity';
import { FORBIDDEN, USER_FORBIDEN_COMPANY } from '../constant/message';
import { ROLE_UCP } from 'src/user-cp/contants/role.enum';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class RolesGuards implements CanActivate{
    constructor(

        private reflector : Reflector ,

        @InjectRepository(UserEntity) private readonly userEntity : Repository<UserEntity> ,
        @InjectRepository(UserCp) private readonly ucpEntity : Repository<UserCp> ,
        @InjectRepository(CompanyEntity) private readonly cpEntity : Repository<CompanyEntity> ,
        ){}


    async canActivate(context: ExecutionContext): Promise<boolean>{

        const roles : ROLE_UCP []= this.reflector.get<ROLE_UCP[]>('roles', context.getHandler());
        
        const request : Request = context.switchToHttp().getRequest() ;
        if(!request.headers.authorization) return false
        let token : any = jwt_decode(request.headers.authorization) ;
        let idUser : string = token.idUser ;
        let idCompany : string  ;
        if(request.params.id )
        idCompany  = request.params.id ;
        let userCheck   = await this.userEntity.findOne({
            where : {
                id : idUser
            }
        })
        let checkCompany = await this.cpEntity.findOne({
            where : {
                id : idCompany
            }
        })
        let ucp = await this.ucpEntity.createQueryBuilder('ucp')
        .leftJoin('ucp.company' , 'cp')
        .leftJoin('ucp.user' , 'user')
        .where("ucp.companyId =:id" ,{id : checkCompany.id})
        .where("ucp.userId =:id" ,{id : userCheck.id})
        .select('ucp')
        .getOne()

        if(!userCheck)
        throw new HttpException(USER_NOT_FOUND , HttpStatus.NOT_FOUND)
        if(!checkCompany)
        throw new HttpException(COMPANY_NOT_EXIST , HttpStatus.NOT_FOUND)
        if(!ucp)
        throw new HttpException(USER_FORBIDEN_COMPANY , HttpStatus.FORBIDDEN)
        return true
        
    }
}


export function UcpCheck(roles : ROLE_UCP[]){

    return applyDecorators(

        SetMetadata('roles' , roles),
        UseGuards(RolesGuards)

    )
    
}