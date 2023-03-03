// import { COMPANY_NOT_EXIST } from './../../assignment-company/contants/contant';
// import { HttpStatus } from '@nestjs/common';
// import { USER_NOT_EXISTING_SYSTEM } from './../../users/contants/message';
// import { createParamDecorator, ExecutionContext, HttpException } from '@nestjs/common';
// import jwtDecode from 'jwt-decode';


// export const UcpInterceptor = createParamDecorator(
//     async(data : unknown , ctx : ExecutionContext) =>{
//         let req = ctx.switchToHttp().getRequest()   
//         let token : any =  jwtDecode(req.headers.authorization) ;
//         let idCompany = req.params.id
//         let idUser : string = (token).idUser

//         if(!idCompany)
//         throw new HttpException(COMPANY_NOT_EXIST , HttpStatus.NOT_FOUND)
//         if(!idUser)
//         throw new HttpException(USER_NOT_EXISTING_SYSTEM , HttpStatus.NOT_FOUND)

//         let permissionCp = await this.

//     }
// )