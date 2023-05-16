import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { UsersService } from 'src/users/services/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userService: UsersService) {
    super();
  }
  async validate(username: string, password: string): Promise<any> {
    const checkUser = await this.userService.validateUser({
      username: username,
    });
    if (!checkUser) {
      throw new UnauthorizedException();
    } else {
      const compePassword = bcrypt.compareSync(password, checkUser.password);
      if (compePassword) {
        return checkUser;
      } else {
        throw new UnauthorizedException('Password fail');
      }
    }
  }
}
