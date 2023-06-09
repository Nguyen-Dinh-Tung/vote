import { ROLE_UCP } from './../../user-cp/contants/role.enum';
import { USER_NOT_FOUND } from './../../users/contants/message';
import { NOT_DATA } from './../../contest/contants/contants';
import { COMPANY_NOT_EXIST } from './../../assignment-company/contants/contant';
import { amount } from './../../users/contants/amount.in.page';
import { CompanyRecomend } from './../entities/company-recomend.entity';
import { plainToClass } from 'class-transformer';
import { Injectable, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Validate } from 'src/common/class/validate.entity';
import { Repository } from 'typeorm';
import { CreateCompanyDto } from '../dto/create-company.dto';
import { UpdateCompanyDto } from '../dto/update-company.dto';
import { CompanyEntity } from '../entities/company.entity';
import { Response, json } from 'express';
import {
  ADD_COMPANY_SUCCESS,
  COMPANY_BY_USER_NOT_EXIST,
  COMPANY_REM_EXIST,
  CONFLIT_COMPANY,
  GET_DETAILS_COMPANY_SUCCESS,
  GET_LIST_COMPANY_SUCCESS,
  UPDATE_COMPANY_SUCCESS,
} from '../contants/message';
import * as fs from 'fs';
import { AssmCompanyEntity } from 'src/assignment-company/entities/assignment-company.entity';
import { SEARCH_KEY_NOT_FOUNT } from 'src/candidate/contants/message';
import { UserCpService } from 'src/user-cp/services/user-cp.service';
import { SERVE_ERROR } from 'src/common/constant/message';
import { UserEntity } from 'src/users/entities/user.entity';
import { UserCp } from 'src/user-cp/entities/user-cp.entity';
import { Roles } from 'src/common/enum/role.enum';
import { Transactional, runOnTransactionRollback } from 'typeorm-transactional';
@Injectable()
export class CompanyService {
  constructor(
    @InjectRepository(CompanyEntity)
    private readonly companayEntity: Repository<CompanyEntity>,
    @InjectRepository(CompanyRecomend)
    private readonly cpRemEntity: Repository<CompanyRecomend>,
    @InjectRepository(UserEntity)
    private readonly userEntity: Repository<UserEntity>,
    @InjectRepository(UserCp) private readonly ucpEntity: Repository<UserCp>,
    private readonly userCpService: UserCpService,
  ) {}

  @Transactional({ connectionName: 'missgrand' })
  async create(
    createCompanyDto: CreateCompanyDto,
    idUser: string,
    res: Response,
    file?: Express.Multer.File,
  ): Promise<Response> {
    const checkCompany = await this.companayEntity.findOne({
      where : 
      [{email : createCompanyDto.email} ,
      {name : createCompanyDto.name}]
    })
    });

    const checkUserInit = await this.userEntity.findOne({
      where : {
        id : idUser
      }
    })

    if (!checkUserInit)
      return res.status(HttpStatus.NOT_FOUND).json({
        message: USER_NOT_FOUND,
      });

    const listShareFail = [] ;
    const listShareSuccess = []

    if (checkCompany) {
      return res.status(HttpStatus.CONFLICT).json({
        message: CONFLIT_COMPANY,
      });
    }

    const infoCreateCp = {
      name : createCompanyDto.name ,
      email : createCompanyDto.email ,
      address : createCompanyDto.address,
      historyCreate : checkUserInit.username
    }

    if (file) {
      infoCreateCp['background'] = this.saveImage(file);
    }
    const cpRem = {
      slogan : createCompanyDto.slogan ,
      bss : createCompanyDto.bss ,
      descs : createCompanyDto.bss
    }

    const newCompany = await this.companayEntity.save(infoCreateCp)


    if (newCompany) {
      const newCpRem = await this.cpRemEntity.save(cpRem)

      if (cpRem) {
        const permissionCp = {
          company : newCompany ,
          user : checkUserInit
        }

        let permissionInit = await this.userCpService.addAdminCp(permissionCp);

        newCompany.cpRem = newCpRem;

        if (!permissionInit)
          return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            message: SERVE_ERROR,
          });

        if (permissionInit) await this.companayEntity.save(newCompany);
      }

      if (
        createCompanyDto.listIdCompany &&
        createCompanyDto.listIdCompany.length > 0
      )
        for (let e of createCompanyDto.listIdCompany) {
          let checkUser = await this.userEntity.findOne({
            where: {
              id: e,
            },
          });
          if (!checkUser || checkUser.isActive === false) {
            listShareFail.push(e);
          }
          let newInfoUcp = {
            company: newCompany,
            user: checkUser,
            role: Roles.ucp_user,
          };

          let newUcp = await this.ucpEntity.save(newInfoUcp);
          listShareSuccess.push(checkUser);
        }
    }
    runOnTransactionRollback((e) => e);
    return res.status(HttpStatus.CREATED).json({
      message: ADD_COMPANY_SUCCESS,
      newCompany: newCompany,
      listShareFail: listShareFail,
      listShareSuccess: listShareSuccess,
    });
  }

  async findAll(
    page: number,
    isActive: boolean,
    search: string,
    ucp: boolean,
    res: Response,
    idUser: string,
  ) {
    const offset = page * amount - amount;
    let listCompany: CompanyEntity[];
    const total = await this.companayEntity.count()
    if (isActive !== undefined) {
      listCompany = await this.companayEntity
        .createQueryBuilder('cp')
        .leftJoin('cp.cpRem', 'cprem')
        .where(`cp.isActive = ${isActive}`)
        .select([
          'cp.id as id',
          'cp.name as name',
          'cp.address as address',
          'cp.email as email',
          'cp.background as background',
          'cprem.descs as descs',
          'cprem.slogan as slogan',
          'cprem.bss as bss',
          'cp.isActive as isActive',
        ])
        .limit(amount)
        .offset(offset)
        .getRawMany();

      if (listCompany.length < 1) {
        return res.status(HttpStatus.NOT_FOUND).json({
          message: NOT_DATA,
          listCompany: listCompany,
          total: total,
        });
      }
      return res.status(HttpStatus.OK).json({
        message: GET_LIST_COMPANY_SUCCESS,
        listCompany: listCompany,
        total: total,
      });
    }
    if (search) {
      listCompany = await this.companayEntity
        .createQueryBuilder('cp')
        .leftJoin('cp.cpRem', 'cprem')
        .where(`cp.name like "%${search}%"`)
        .select([
          'cp.id as id',
          'cp.name as name',
          'cp.address as address',
          'cp.email as email',
          'cp.background as background',
          'cprem.descs as descs',
          'cprem.slogan as slogan',
          'cprem.bss as bss',
          'cp.isActive as isActive',
        ])
        .limit(amount)
        .offset(offset)
        .getRawMany();

      if (listCompany.length < 1) {
        return res.status(HttpStatus.NOT_FOUND).json({
          message: SEARCH_KEY_NOT_FOUNT,
          listCompany: listCompany,
          total: total,
        });
      }
      return res.status(HttpStatus.OK).json({
        message: GET_LIST_COMPANY_SUCCESS,
        listCompany: listCompany,
        total: total,
      });
    }

    if (ucp) {
      const checkUser = await this.userEntity.findOne({
        where : {
          id : idUser
        }
      })

      if (!checkUser)
        return res.status(HttpStatus.NOT_FOUND).json({
          message: USER_NOT_FOUND,
        });

      const listUserCompany = await this.ucpEntity.createQueryBuilder('ucp')
      .leftJoin('ucp.user' , 'user')
      .leftJoin('ucp.company' , 'cp')
      .leftJoin('cp.cpRem' , 'cprem')
      .where(`user.id = "${idUser}"` )
      .select([ 
        'cp.id as id',
        'cp.name as name',
        'cp.address as address',
        'cp.email as email',
        'cp.background as background',
        'cprem.descs as descs',
        'cprem.slogan as slogan',
        'cprem.bss as bss',
        "cp.isActive as isActive"
      ])
      .limit(amount) 
      .offset(offset)
      .getRawMany()

      if (listUserCompany.length < 1)
        return res.status(HttpStatus.NOT_FOUND).json({
          message: COMPANY_BY_USER_NOT_EXIST,
        });

      return res.status(HttpStatus.OK).json({
        message: GET_LIST_COMPANY_SUCCESS,
        listCompany: listUserCompany,
      });
    }

    if (!search && isActive === undefined) {
      listCompany = await this.companayEntity
        .createQueryBuilder('cp')
        .leftJoin('cp.cpRem', 'cprem')
        .select([
          'cp.id as id',
          'cp.name as name',
          'cp.address as address',
          'cp.email as email',
          'cp.background as background',
          'cprem.descs as descs',
          'cprem.slogan as slogan',
          'cprem.bss as bss',
          'cp.isActive as isActive',
        ])
        .limit(amount)
        .offset(offset)
        .getRawMany();
      return res.status(HttpStatus.OK).json({
        message: GET_LIST_COMPANY_SUCCESS,
        listCompany: listCompany,
        total: total,
      });
    }
  }

  async findOne(id: string, res: Response) {
    const checkCompany = await this.companayEntity.createQueryBuilder('cp')
    .leftJoin('cp.cpRem' , 'cprem')
    .select([
      'cp.id as id',
      'cp.name as name',
      'cp.address as address',
      'cp.email as email',
      'cp.background as background',
      'cprem.descs as descs',
      'cprem.slogan as slogan',
      'cprem.bss as bss',
      "cp.isActive as isActive"
    ])
    .where({
      id : id
    })
    .getRawOne()

    if (!checkCompany) {
      return res.status(HttpStatus.NOT_FOUND).json({
        message: COMPANY_NOT_EXIST,
      });
    }
    return res.status(HttpStatus.OK).json({
      message: GET_DETAILS_COMPANY_SUCCESS,
      company: checkCompany,
    });
  }
  async update(
    id: string,
    updateCompanyDto: UpdateCompanyDto,
    userChange: string,
    res: Response,
    file?: Express.Multer.File,
  ) {
    let checkCompany = await this.companayEntity.findOne({
      where: {
        id: id,
      },
      relations: {
        cpRem: true,
      },
    });

    if (!checkCompany)
      return res.status(HttpStatus.NOT_FOUND).json({
        message: COMPANY_NOT_EXIST,
      });

    if (
      updateCompanyDto.bss ||
      updateCompanyDto.descs ||
      updateCompanyDto.slogan
    ) {
      const cpRem  = checkCompany.cpRem

      if (!cpRem)
        return res.status(HttpStatus.NOT_FOUND).json({
          message: COMPANY_NOT_EXIST,
        });

      if (updateCompanyDto.bss !== undefined)
        cpRem['bss'] = updateCompanyDto.bss;

      if (updateCompanyDto.descs !== undefined)
        cpRem['descs'] = updateCompanyDto.descs;

      if (updateCompanyDto.slogan !== undefined)
        cpRem['slogan'] = updateCompanyDto.slogan;

      await this.cpRemEntity.save(cpRem);
    }

    const updateInfo = {

    }

    if (updateCompanyDto.address !== undefined)
      updateInfo['address'] = updateCompanyDto.address;

    if (updateCompanyDto.name !== undefined)
      updateInfo['name'] = updateCompanyDto.name;

    if (updateCompanyDto.email !== undefined)
      updateInfo['email'] = updateCompanyDto.email;

    if (updateCompanyDto.email !== undefined)
      updateInfo['email'] = updateCompanyDto.email;

    if (updateCompanyDto.isActive !== undefined)
      updateInfo['isActive'] = updateCompanyDto.isActive;

    if (file) updateInfo['background'] = this.saveImage(file);

    checkCompany = {
      ...checkCompany,
      ...updateInfo,
    };

    await this.companayEntity.save(checkCompany);

    return res.status(HttpStatus.OK).json({
      message: UPDATE_COMPANY_SUCCESS,
    });
  }

  async remove(id: string, userRemove: string) {
    try {
      const checkCompany = await this.validateCompany({id : id})

      if (!checkCompany) return 'Company not existing';
      else {
        checkCompany.isActive = false;
        checkCompany.historyChange = userRemove;
        this.companayEntity.save(checkCompany);
        return checkCompany;
      }
    } catch (e) {
      if (e) console.log(e);
    }
  }

  async validateCompany(data: Validate): Promise<any> {
    const checkCompay = await this.companayEntity.findOneBy(data)
    return checkCompay;
  }
  private saveImage(file: Express.Multer.File) {
    const filename = file.filename;
    const path = file.path;
    const type = file.mimetype.split('/').pop().toLowerCase();
    const fileSave = `${process.env.STATICIMG + filename}${Date.now()}.${type}`;
    const buffer = fs.readFileSync(file.path);
    fs.writeFileSync(`.${fileSave}`, buffer);
    fs.unlinkSync(path);
    return fileSave;
  }
  async getAll(res: Response): Promise<Response<CompanyEntity>> {
    const listCompany = await this.companayEntity.find()
    return res.status(HttpStatus.OK).json({
      message: GET_LIST_COMPANY_SUCCESS,
      list: listCompany,
    });
  }
}
