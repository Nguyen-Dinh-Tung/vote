import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/users/entities/user.entity';
import { In, Repository } from 'typeorm';
import { TokenEntity } from '../entities/token.entity';
import { CreateTokenDto } from '../dto/create-token.dto';
import { Response } from 'express';
import { USER_NOT_FOUND } from 'src/users/contants/message';
import makeTokenEmail from 'src/common/func/token-email';
import nodeMailerMain from 'src/common/middleware/node-mailer';
import {
  CHANGE_PASSWORD_SUCCESS,
  REPASSWORD_ERROR,
  TOKEN_EXPIRED,
  TOKEN_INCORRECT,
  TOKEN_NOT_FOUND,
  TOKEN_WAS_SENT,
  newPasswordToMail,
} from 'src/common/constant/message';
import * as bcrypt from 'bcrypt';
import { TYPE_OTP } from '../enum/enum';
import { ChangePasswordDto } from 'src/auth/dto/change-password.dto';
import {
  checkDate,
  checkTimeTakesPlaceWithNow,
} from 'src/common/func/check-date';
import { randomPassword } from 'src/common/func/random-password';
@Injectable()
export class TokenService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userEntity: Repository<UserEntity>,
    @InjectRepository(TokenEntity)
    private readonly tokenEntity: Repository<TokenEntity>,
  ) {}
  async createEmailToken(data: CreateTokenDto, res: Response) {
    const checkUser = await this.userEntity.findOne({
      where: {
        username: data.username,
      },
    });
    if (!checkUser)
      return res.status(HttpStatus.NOT_FOUND).json({
        message: USER_NOT_FOUND,
      });
    const checkToken = await this.tokenEntity.find({
      where: {
        user: checkUser,
        type: TYPE_OTP.EMAIL,
      },
    });
    if (checkToken.length > 0) {
      await this.tokenEntity.update(
        {
          id: In(
            checkToken.map((e) => {
              return e.id;
            }),
          ),
        },
        {
          isActive: false,
        },
      );
    }
    const token = makeTokenEmail(6);
    const timeExpired = Date.now() + Number(process.env.EXPIRED_TOKEN_EMAIL);
    const expired = new Date(timeExpired).toISOString();
    const code = bcrypt.hashSync(token, Number(process.env.HASHKEY));
    await this.tokenEntity.save({
      user: checkUser,
      code: code,
      expired: expired,
      type: TYPE_OTP.EMAIL,
    });
    const message: string = `Mã thay đổi mật khẩu của bạn là : ${token}`;
    nodeMailerMain(checkUser.email, message);
    return res.status(HttpStatus.OK).json({
      message: TOKEN_WAS_SENT,
    });
  }
  async checkEmailToken(data: ChangePasswordDto, res: Response) {
    const checkUser = await this.userEntity.findOne({
      where: {
        username: data.username,
      },
    });
    if (!checkUser)
      return res.status(HttpStatus.NOT_FOUND).json({
        message: USER_NOT_FOUND,
      });
    if (data.password !== data.rePassword)
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: REPASSWORD_ERROR,
      });
    const checkToken = await this.tokenEntity.findOne({
      where: {
        isActive: true,
        user: checkUser,
        type: TYPE_OTP.EMAIL,
      },
    });
    if (!checkToken)
      return res.status(HttpStatus.NOT_FOUND).json({
        message: TOKEN_NOT_FOUND,
      });

    if (checkTimeTakesPlaceWithNow(checkToken.expired) === false)
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: TOKEN_EXPIRED,
      });

    if (bcrypt.compareSync(data.code, checkToken.code) === false)
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: TOKEN_INCORRECT,
      });
    checkUser.password = bcrypt.hashSync(
      data.password,
      Number(process.env.HASHKEY),
    );
    await this.userEntity.save(checkUser);
    checkToken.isActive = false;
    await this.tokenEntity.save(checkToken);
    return res.status(HttpStatus.OK).json({
      message: CHANGE_PASSWORD_SUCCESS,
    });
  }
}
