import { Module, forwardRef } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { AuthController } from './controller/auth.controller';
import { UsersModule } from 'src/users/users.module';
import { PassportModule } from '@nestjs/passport/dist';
import { LocalStrategy } from './strategy/local.strategy';
import { JwtModule } from '@nestjs/jwt';
import { JwtSelect } from 'src/common/secret/secrect.jwt';
import { MulterModule } from '@nestjs/platform-express';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/users/entities/user.entity';
import { TokenService } from 'src/token/services/token.service';
import { TokenEntity } from 'src/token/entities/token.entity';
import { TokenModule } from 'src/token/token.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, TokenEntity]),
    forwardRef(() => UsersModule),
    PassportModule,
    JwtModule.register({
      secret: JwtSelect.secrect,
      signOptions: { expiresIn: '30d' },
    }),
    MulterModule.register({
      dest: './files/images',
    }),
    TokenModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, TokenService],
  exports: [JwtModule],
})
export class AuthModule {}
