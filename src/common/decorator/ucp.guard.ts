import { COMPANY_NOT_EXIST } from './../../assignment-company/contants/contant';
import { CompanyEntity } from './../../company/entities/company.entity';
import { UserCp } from './../../user-cp/entities/user-cp.entity';
import { USER_NOT_FOUND } from './../../users/contants/message';
import { HttpException, HttpStatus } from '@nestjs/common';
import jwt_decode from 'jwt-decode';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Roles } from '../enum/role.enum';
import { Request } from 'express';
import { UserEntity } from 'src/users/entities/user.entity';
import {
  NOT_PERMISSION_SHARE,
  USER_FORBIDEN_COMPANY,
} from '../constant/message';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class PemissionGuard implements CanActivate {
  constructor(
    private reflector: Reflector,

    @InjectRepository(UserEntity)
    private readonly userEntity: Repository<UserEntity>,
    @InjectRepository(UserCp) private readonly ucpEntity: Repository<UserCp>,
    @InjectRepository(CompanyEntity)
    private readonly cpEntity: Repository<CompanyEntity>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles: Roles[] = this.reflector.get<Roles[]>(
      'roles',
      context.getHandler(),
    );

    const request: Request = context.switchToHttp().getRequest();

    if (!request.headers.authorization) return false;

    const token: any = jwt_decode(request.headers.authorization);
    const idUser: string = token.idUser;
    let idCompany: string;

    if (request.params.id) idCompany = request.params.id;

    const userCheck = await this.userEntity.findOne({
      where: {
        id: idUser,
      },
    });

    if (!userCheck)
      throw new HttpException(USER_NOT_FOUND, HttpStatus.NOT_FOUND);

    const checkCompany = await this.cpEntity.findOne({
      where: {
        id: idCompany,
      },
    });

    if (!checkCompany)
      throw new HttpException(COMPANY_NOT_EXIST, HttpStatus.NOT_FOUND);

    if (userCheck.role === Roles.admin) return true;

    const ucp: UserCp = await this.ucpEntity
      .createQueryBuilder('ucp')
      .leftJoin('ucp.company', 'cp')
      .leftJoin('ucp.user', 'user')
      .where('ucp.companyId =:id', { id: checkCompany.id })
      .where('ucp.userId =:id', { id: userCheck.id })
      .select('ucp')
      .getOne();

    if (!ucp)
      throw new HttpException(USER_FORBIDEN_COMPANY, HttpStatus.FORBIDDEN);

    if (!roles.includes(ucp.role))
      throw new HttpException(NOT_PERMISSION_SHARE, HttpStatus.FORBIDDEN);
    return true;
  }
}
