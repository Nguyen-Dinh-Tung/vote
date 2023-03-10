import jwt_decode  from 'jwt-decode';
import { HttpException, HttpStatus, Injectable, NestMiddleware, Next } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Request } from "express";
import { CompanyEntity } from "src/company/entities/company.entity";
import { UserCp } from "src/user-cp/entities/user-cp.entity";
import { UserEntity } from "src/users/entities/user.entity";
import { Repository } from "typeorm";
import { USER_NOT_FOUND } from 'src/users/contants/message';
import { COMPANY_NOT_EXIST } from 'src/assignment-company/contants/contant';
import { Roles } from '../enum/role.enum';
import { NOT_PERMISSION_SHARE, USER_FORBIDEN_COMPANY } from '../constant/message';
import { UserCpService } from 'src/user-cp/services/user-cp.service';
import { NextCheckShare } from '../interfaces/Check-share.interface';



@Injectable()
export class ShareCompanyMiddleWare implements NestMiddleware{
    constructor(
        private readonly ucpService : UserCpService
    ){

    }

    async use(req : Request ){
        let token : any = jwt_decode(req.headers.authorization) ;
        let idUser : string = token.idUser ;
        let idCompany : string  ;

        if(req.params.id )
        idCompany  = req.params.id ;

        let checkRole = await this.ucpService.checkShare({
            idCompany : idCompany , 
            idUser : idUser
        })
        if(checkRole.next === NextCheckShare.NOT)
        throw new HttpException(checkRole.message , HttpStatus.FORBIDDEN)
        
        Next()
    }
}