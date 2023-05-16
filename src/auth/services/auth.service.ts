import { LoginUserDto } from './../dto/login-auth.dto';
import { HttpStatus, Injectable, UseGuards } from '@nestjs/common';
import { UsersService } from 'src/users/services/users.service';
import { UserEntity } from 'src/users/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { MessageLogin, TOKEN_WAS_SENT } from 'src/common/constant/message';
import { Response } from 'express';
import { ForgotPasswordDto } from '../dto/forgot-password.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { USER_NOT_FOUND } from 'src/users/contants/message';
import nodeMailerMain from 'src/common/middleware/node-mailer';
import makeTokenEmail from '../../common/func/token-email';
import { ApiOperation } from '@nestjs/swagger';
import { ChangePasswordDto } from '../dto/change-password.dto';
import { TokenService } from 'src/token/services/token.service';
@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
    private readonly tokenService: TokenService,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async login(loginUserDto: LoginUserDto, res: Response) {
    try {
      const checkUser = await this.userService.validateUser({
        username: loginUserDto.username,
      });

      if (checkUser) {
        if (checkUser.isActive == true) {
          const compePassword = bcrypt.compareSync(
            loginUserDto.password,
            checkUser.password,
          );

          if (!compePassword)
            return res.status(HttpStatus.NOT_FOUND).json({
              message: MessageLogin.PASSWORD_NOT_FOUND,
            });

          const token = await this.createToken({
            idUser: checkUser.id,
          });

          return res.status(HttpStatus.OK).json({
            message: MessageLogin.LOGIN_SUCCESS,
            token,
          });
        } else {
          return res.status(HttpStatus.NOT_FOUND).json({
            message: MessageLogin.USER_NOT_ACTIVE,
          });
        }
      } else {
        return res.status(HttpStatus.NOT_FOUND).json({
          message: MessageLogin.USER_NOT_EXISTING,
        });
      }
    } catch (e) {
      if (e) console.log(e);
    }
  }

  async register(createDto, file?, userCreate?, res?) {
    return await this.userService.create(createDto, userCreate, file, res);
  }

  async createToken(data: any): Promise<any> {
    const token = this.jwtService.signAsync(data, { expiresIn: '7d' });
    return token;
  }
  async forgotPassword(data: ForgotPasswordDto, res: Response) {
    return await this.tokenService.createEmailToken(data, res);
  }
  async changPassword(data: ChangePasswordDto, res: Response) {
    const checkEmailToken = await this.tokenService.checkEmailToken(data, res);
  }
}
