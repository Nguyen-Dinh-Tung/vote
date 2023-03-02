import { USER_NOT_ACTIVE, USER_NOT_FOUND } from './../../users/contants/message';
import { COMPANY_NOT_EXIST, COMPANY_NOT_ACTIVE } from './../../assignment-company/contants/contant';
import { HttpStatus } from '@nestjs/common';
import { CompanyEntity } from './../../company/entities/company.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Response } from 'express';
import { Repository } from 'typeorm';
import { CreateUserCpDto } from '../dto/create-user-cp.dto';
import { UpdateUserCpDto } from '../dto/update-user-cp.dto';
import { UserCp } from '../entities/user-cp.entity';
import { UserEntity } from 'src/users/entities/user.entity';
import { ADD_NEW_UCP_SUCCESS, FORBIDDEN, USER_FORBIDEN } from 'src/common/constant/message';

@Injectable()
export class UserCpService {
  constructor(
    @InjectRepository(UserCp) private readonly userCpEntity : Repository<UserCp> ,
    @InjectRepository(CompanyEntity) private readonly companyEntity : Repository<CompanyEntity> ,
    @InjectRepository(UserEntity) private readonly userEntity : Repository<UserEntity> ,
    ){

  }

  async create(createUserCpDto: CreateUserCpDto , userCreate : string , res : Response) {
    let checkCompany = await this.companyEntity.findOne({
      where : {
        id : createUserCpDto.idCompany
      }
    })

    if(!checkCompany)
    return res.status(HttpStatus.NOT_FOUND).json({
      message : COMPANY_NOT_EXIST
    })

    if(!checkCompany.isActive)
    return res.status(HttpStatus.NOT_FOUND).json({
      message : COMPANY_NOT_ACTIVE
    })

    let checkUser = await this.userEntity.findOne({
      where : {
        username : userCreate 
      }
    })

    if(!checkUser)
    return res.status(HttpStatus.NOT_FOUND).json({
      message : USER_NOT_FOUND
    })
    if(!checkUser.isActive)
    return res.status(HttpStatus.NOT_FOUND).json({
      message : USER_NOT_ACTIVE
    })


    if(userCreate !== checkCompany.userhistoryChange)
    return res.status(HttpStatus.FORBIDDEN).json({
      message : USER_FORBIDEN
    })

    createUserCpDto.user = checkUser 
    let newUcp = await this.userCpEntity.save(createUserCpDto)

    if(newUcp)
    return res.status(HttpStatus.OK).json({
      message : ADD_NEW_UCP_SUCCESS ,
      ucp : newUcp
    })
    
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
}
