import { FeatureModule } from './../feature/feature.module';
import { NestModule } from '@nestjs/common/interfaces';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  Module,
  forwardRef,
  OnModuleInit,
  RequestMethod,
} from '@nestjs/common';
import { Feature } from 'src/common/enum/feature.enum';
import { FetureCode, Roles } from 'src/common/enum/role.enum';
import { FeatureService } from 'src/feature/services.ts/feature.service';
import { UsersService } from 'src/users/services/users.service';
import { UsersModule } from 'src/users/users.module';
import { UserEntity } from 'src/users/entities/user.entity';
import { FeatureEntity } from 'src/feature/entities/feature.entity';

@Module({
  imports: [
    UsersModule,
    FeatureModule,
    TypeOrmModule.forFeature([UserEntity, FeatureEntity]),
  ],
  exports: [],
  providers: [],
})
export class InitModule {
  constructor(
    private readonly userService: UsersService,
    private readonly featureService: FeatureService,
  ) {}

  async onModuleInit() {
    const startInit = await this.userService.createAdminUser({
      name: 'admin',
      email: 'admin@gmail.com',
      role: Roles.admin,
      password: '123123',
      address: 'Ha Noi',
      code: 'adm',
      username: 'admin',
      historyCreate: 'Initial admin account',
    });
    if (startInit === false) return;
    await this.featureService.create({
      code: FetureCode.admin,
      feature: Feature.admin,
    });
    await this.featureService.create({
      code: FetureCode.content,
      feature: Feature.content,
    });
    await this.featureService.create({
      code: FetureCode.default,
      feature: Feature.default,
    });
    await this.featureService.create({
      code: FetureCode.marketing,
      feature: Feature.marketing,
    });
  }
}
