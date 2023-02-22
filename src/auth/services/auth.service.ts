import { LoginUserDto } from './../dto/login-auth.dto';
import { HttpStatus, Injectable, UseGuards } from '@nestjs/common';
import { UsersService } from 'src/users/services/users.service';
import { UserEntity } from 'src/users/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { MessageLogin } from 'src/common/constant/message';
import { Response } from 'express';

@Injectable()
export class AuthService {

  constructor(private readonly userService : UsersService ,

      private readonly jwtService : JwtService

    ){

  }


  async login(loginUserDto : LoginUserDto , res : Response ) {
    
      try{

      let checkUser = await this.userService.validateUser({username : loginUserDto.username})
        
        if(checkUser){
          
          if(checkUser.isActive == true){

            let compePassword = bcrypt.compareSync(loginUserDto.password , checkUser.password)
            
            if(!compePassword) return res.status(HttpStatus.NOT_FOUND).json({
              message : MessageLogin.PASSWORD_NOT_FOUND
            })

            let token = await this.createToken({idUser : checkUser.id , username : loginUserDto.username , role : checkUser.role})

            return res.status(HttpStatus.OK).json(
              {
                message : MessageLogin.LOGIN_SUCCESS ,
                token ,
              }
            )

          }else{

            return res.status(HttpStatus.NOT_FOUND).json(
              {
                message : MessageLogin.USER_NOT_ACTIVE ,
              }
            )
          
          }

        }else{

        return res.status(HttpStatus.NOT_FOUND).json(
          {
            message : MessageLogin.USER_NOT_EXISTING,
          }
        )

        }

      }catch(e){
        
        if(e) console.log(e);
        
      }
  }


  async register(createDto , file? , userCreate? , res?){
   return await this.userService.create(createDto , userCreate , file , res)
  }



  async createToken(data : any) : Promise <any>{

    let token =  this.jwtService.signAsync(data)

    return token
    
  } 
}