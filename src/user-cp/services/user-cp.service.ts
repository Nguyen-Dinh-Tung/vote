import { CheckShareDto } from './../dto/check-share.dto';
import { Roles } from 'src/common/enum/role.enum';
import { USER_FORBIDEN_COMPANY } from './../../common/constant/message';
import { CreateUserCpDto } from './../dto/create-user-cp.dto';
import {
  USER_NOT_ACTIVE,
  USER_NOT_FOUND,
} from './../../users/contants/message';
import {
  COMPANY_NOT_EXIST,
  COMPANY_NOT_ACTIVE,
  LIST_COMPANY_CHECK_FAIL,
  LIST_USER_FAILT,
  UCP_EXISTING,
} from './../../assignment-company/contants/contant';
import { HttpStatus } from '@nestjs/common';
import { CompanyEntity } from './../../company/entities/company.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Response } from 'express';
import { In, Repository } from 'typeorm';
import { UpdateUserCpDto } from '../dto/update-user-cp.dto';
import { UserCp } from '../entities/user-cp.entity';
import { UserEntity } from 'src/users/entities/user.entity';
import {
  ADD_NEW_UCP_SUCCESS,
  FORBIDDEN,
  USER_FORBIDEN,
} from 'src/common/constant/message';
import { ROLE_UCP } from '../contants/role.enum';
import { InitUcp } from '../dto/Init-ucp.dt';
import { USER_FORBIDEN_COMPANY_SHARE } from '../contants/message';
import {
  CheckShareInterface,
  NextCheckShare,
} from 'src/common/interfaces/Check-share.interface';

@Injectable()
export class UserCpService {
  constructor(
    @InjectRepository(UserCp) private readonly userCpEntity: Repository<UserCp>,
    @InjectRepository(CompanyEntity)
    private readonly companyEntity: Repository<CompanyEntity>,
    @InjectRepository(UserEntity)
    private readonly userEntity: Repository<UserEntity>,
  ) {}

  async create(
    createUserCpDto: CreateUserCpDto,
    userCreate: string,
    res: Response,
    idUser: string,
  ) {
    const listCompanyShare = await this.companyEntity.find({
      where: {
        id: In(createUserCpDto.idCompany),
      },
    });

    if (!listCompanyShare)
      return res.status(HttpStatus.NOT_FOUND).json({
        message: COMPANY_NOT_EXIST,
      });

    const checkUser = await this.userEntity.findOne({
      where: {
        id: idUser,
      },
    });

    if (!checkUser)
      return res.status(HttpStatus.NOT_FOUND).json({
        message: USER_NOT_FOUND,
      });

    const checkUcp = await this.userCpEntity
      .createQueryBuilder('ucp')
      .leftJoin('ucp.company', 'cp')
      .leftJoin('ucp.user', 'user')
      .where('user.id =:id', { id: checkUser.id })
      .select('ucp')
      .getOne();

    if (!checkUcp)
      return res.status(HttpStatus.FORBIDDEN).json({
        message: USER_FORBIDEN_COMPANY_SHARE,
      });

    if (!checkUser.isActive)
      return res.status(HttpStatus.NOT_FOUND).json({
        message: USER_NOT_ACTIVE,
      });
    const listCompanyShareFail = [];

    if (listCompanyShare.length !== createUserCpDto.idCompany.length) {
      for (const e of listCompanyShare) {
        Object.keys(e).some((key) => {
          if (key === 'id')
            if (!createUserCpDto.idCompany.includes(e[key]))
              listCompanyShareFail.push(e[key]);

          if (key === 'isActive')
            if ((e[key] = false)) listCompanyShareFail.push(e['name']);
        });
      }

      if (listCompanyShareFail.length > 0)
        return res.status(HttpStatus.BAD_REQUEST).json({
          message: LIST_COMPANY_CHECK_FAIL,
          listFail: listCompanyShareFail,
        });
    }

    const listUserShare = await this.userEntity.find({
      where: {
        id: In(createUserCpDto.idUser),
      },
    });

    const listUserFail = [];

    if (listUserShare.length !== createUserCpDto.idUser.length) {
      for (const e of listUserShare) {
        Object.keys(listUserShare).some((key) => {
          if (key === 'id')
            if (!createUserCpDto.idUser.includes(e['key']))
              listUserFail.push(e['name']);

          if (key === 'isActive')
            if (e['isActive'] === false) listUserFail.push(e['name']);
        });

        if (listUserFail.length > 0)
          return res.status(HttpStatus.BAD_REQUEST).json({
            message: LIST_USER_FAILT,
          });
      }
    }

    const listUcpNew = [];
    const listExistUcp = [];
    for (const e of listUserShare) {
      for (const element of listCompanyShare) {
        const ucpExist = await this.userCpEntity.findOne({
          where: {
            company: element,
            user: e,
          },
        });

        if (ucpExist) {
          listExistUcp.push(e);
          continue;
        } else {
          const newInfoUcp = {
            user: e,
            company: element,
            role: Roles.ucp_user,
          };

          await this.userCpEntity.save(newInfoUcp);
          listUcpNew.push(newInfoUcp);
        }
      }
    }
    if (listUcpNew.length > 0)
      return res.status(HttpStatus.CREATED).json({
        message: ADD_NEW_UCP_SUCCESS,
        listSuccess: listUcpNew,
        listUserShareExist: listExistUcp,
      });

    return res.status(HttpStatus.BAD_REQUEST).json({
      message: UCP_EXISTING,
    });
  }

  findAll() {
    return `This action returns all userCp`;
  }

  findOne(id: number) {
    return `This action returns a #${id} userCp`;
  }

  update(id: number, updateUserCpDto: UpdateUserCpDto) {
    return `This action updates a #${id} userCp`;
  }

  remove(id: number) {
    return `This action removes a #${id} userCp`;
  }

  async addAdminCp(createUserCpDto: InitUcp) {
    createUserCpDto.role = Roles.ucp_admin;
    const newUcp = await this.userCpEntity.save(createUserCpDto);
    return newUcp;
  }

  async checkShare(checkShareDto: CheckShareDto): Promise<CheckShareInterface> {
    const checkUser = await this.userEntity.findOne({
      where: {
        id: checkShareDto.idUser,
      },
    });

    if (!checkUser)
      return {
        next: NextCheckShare.NOT,
        message: USER_NOT_FOUND,
      };
    const checkCompany = await this.companyEntity.findOne({
      where: {
        id: checkShareDto.idCompany,
      },
    });

    if (!checkCompany)
      return {
        next: NextCheckShare.NOT,
        message: COMPANY_NOT_EXIST,
      };

    const ucp = await this.userCpEntity.findOne({
      where: {
        company: checkCompany,
        user: checkUser,
      },
    });
    if (!ucp || ucp.role !== 'admin')
      return {
        next: NextCheckShare.NOT,
        message: USER_FORBIDEN,
      };

    return {
      next: NextCheckShare.CAN,
      message: undefined,
    };
  }
}
