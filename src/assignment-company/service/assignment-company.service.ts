import { SEARCH_KEY_NOT_FOUNT } from './../../candidate/contants/message';
import { ContestEntity } from 'src/contest/entities/contest.entity';
import { COMPANY_ERROR, GET_LIST_CONTEST_SUCCESS, NOT_DATA } from './../../contest/contants/contants';
import { CompanyService } from './../../company/services/company.service';
import { ContestService } from 'src/contest/services/contest.service';
import { AssmCompanyEntity } from './../entities/assignment-company.entity';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateAssignmentCompanyDto } from '../dto/create-assignment-company.dto';
import { UpdateAssignmentCompanyDto } from '../dto/update-assignment-company.dto';
import { Repository } from 'typeorm';
import { Response } from 'express'
import { ADD_NEW_ASSIGNMENT_SUCCESS, ASSM_CP_NOT_FOUND, COMPANY_NOT_ACTIVE, COMPANY_NOT_EXIST, CONFLIT_ASSIGNMENT, CONTEST_NOT_ACTIVE, CONTEST_NOT_FOUND, UPDATE_ASSM_COMPANY } from '../contants/contant';
import { CompanyEntity } from 'src/company/entities/company.entity';

@Injectable()
export class AssignmentCompanyService {
  constructor(
    @InjectRepository(AssmCompanyEntity) private readonly assigmCompany : Repository<AssmCompanyEntity>,
    @InjectRepository(ContestEntity) private readonly contestEntity : Repository <ContestEntity> ,
    @InjectRepository(CompanyEntity) private readonly companyEntity : Repository <CompanyEntity> ,
  
  ){

  }
  async create(createAssignmentCompanyDto: CreateAssignmentCompanyDto , res : Response) {

    

    let checkContest = await this.contestEntity.findOneBy({id : createAssignmentCompanyDto.idContest})
    let checkCompany = await this.companyEntity.findOneBy({id : createAssignmentCompanyDto.idCompany})

    if(!checkContest)
    return res.status(HttpStatus.NOT_FOUND).json({
      message : CONTEST_NOT_FOUND
    })

    if(!checkContest.isActive)
    return res.status(HttpStatus.NOT_FOUND).json({
      message : CONTEST_NOT_ACTIVE
    })

    if(!checkCompany )
    return res.status(HttpStatus.NOT_FOUND).json({
      message : COMPANY_NOT_EXIST
    })

    if(!checkCompany.isActive)
    return res.status(HttpStatus.NOT_FOUND).json({
      message : COMPANY_NOT_ACTIVE
    })

    // let checkAssignment = await this.assigmCompany.findOneBy({
    //   idContest : createAssignmentCompanyDto.idContest,
    //   idCompany : createAssignmentCompanyDto.idCompany
    // })

    // if(!checkAssignment){

    //   let newAssignment = await this.assigmCompany.save(createAssignmentCompanyDto)


    //   res.status(HttpStatus.CREATED).json({
    //     message : ADD_NEW_ASSIGNMENT_SUCCESS , 
    //     newAssignment : newAssignment
    //   })

    // }else{

    //   res.status(HttpStatus.CONFLICT).json({
    //     message : CONFLIT_ASSIGNMENT
    //   })

    // }

  }

  async findAll(res : Response , page : number , id : string , isActive? : boolean , search? : string) {
    
    if(search !== undefined){
      let listAssContest = 
      await this.assigmCompany
      .createQueryBuilder('ascp')
      .leftJoin('ascp.contest' , 'co')
      .leftJoin('ascp.company' , 'cp')
      .where('co.name =:name' ,{name : search})
      .andWhere('ascp.isActive = true')
      .select([
      'co.id as id' ,
      'co.name as name' ,
      'co.address as address' ,
      'co.email as email' ,
      'co.isActive as isActive' ,
      'cp.name as company'
      ])
      .getRawMany()

      if(listAssContest.length > 0){
        return res.status(HttpStatus.NOT_FOUND).json({
          message : GET_LIST_CONTEST_SUCCESS ,
          listContest : listAssContest,
          total : listAssContest.length
        })
      }
      return res.status(HttpStatus.OK).json({
        message : SEARCH_KEY_NOT_FOUNT ,
      })
      
    }

    if(isActive !== undefined){
      let listAssContest = 
    await this.assigmCompany
    .createQueryBuilder('ascp')
    .leftJoin('ascp.contest' , 'co')
    .leftJoin('ascp.company' , 'cp')
    .where('cp.id =:id' ,{id : id})
    .andWhere('ascp.isActive = true')
    .select([
    'co.id as id' ,
    'co.name as name' ,
    'co.address as address' ,
    'co.email as email' ,
    'co.isActive as isActive' ,
    'cp.name as company'
    ])
    .getRawMany()
    if(listAssContest.length > 0){
      return res.status(HttpStatus.OK).json({
        message : GET_LIST_CONTEST_SUCCESS ,
        listContest : listAssContest,
        total : listAssContest.length
      })
    }

    return res.status(HttpStatus.NOT_FOUND).json({
      message : NOT_DATA ,
    })
    }

    let listAssContest = 
    await this.assigmCompany
    .createQueryBuilder('ascp')
    .leftJoin('ascp.contest' , 'co')
    .leftJoin('ascp.company' , 'cp')
    .where('cp.id =:id' ,{id : id})
    .andWhere('ascp.isActive = true')
    .select([
    'co.id as id' ,
    'co.name as name' ,
    'co.address as address' ,
    'co.email as email' ,
    'co.isActive as isActive' ,
    'cp.name as company'
    ])
    .getRawMany()
    return res.status(HttpStatus.OK).json({
      message : GET_LIST_CONTEST_SUCCESS ,
      listContest : listAssContest,
      total : listAssContest.length
    })
  }

  findOne(id: number) {
    return `This action returns a #${id} assignmentCompany`;
  }

  async update(id: string, updateAssignmentCompanyDto: UpdateAssignmentCompanyDto , res : Response) {

    let checkAssmCp = await this.assigmCompany.findOne({
      where : {
        id : id
      }
    })

    if(!checkAssmCp)
    return res.status(HttpStatus.NOT_FOUND).json({
      message : ASSM_CP_NOT_FOUND 
    })

    if(updateAssignmentCompanyDto.isActive)
    checkAssmCp.isActive = updateAssignmentCompanyDto.isActive

    if(updateAssignmentCompanyDto.idCompany){
      let idCompany = updateAssignmentCompanyDto.idCompany
      let checkCompany = await this.companyEntity.findOne({
       where : {
        id : idCompany
       }
      }) ;

      if(!checkCompany)
      return res.status(HttpStatus.NOT_FOUND).json({
        message : COMPANY_NOT_EXIST
      })
      checkAssmCp.company = checkCompany
    }

    await this.assigmCompany.save(checkAssmCp)

    return res.status(HttpStatus.OK).json({
      message : UPDATE_ASSM_COMPANY
    })
  }

  remove(id: number) {
    return `This action removes a #${id} assignmentCompany`;
  }
}
