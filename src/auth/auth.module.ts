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

@Module({
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy],
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    forwardRef(() => UsersModule),
    PassportModule,
    JwtModule.register({
      secret: JwtSelect.secrect,
      signOptions: { expiresIn: '30d' },
    }),
    MulterModule.register({
      dest: './files/images',
    }),
  ],
  exports: [JwtModule],
})
export class AuthModule {}
