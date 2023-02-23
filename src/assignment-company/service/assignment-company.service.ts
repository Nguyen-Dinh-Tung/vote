import { ContestEntity } from 'src/contest/entities/contest.entity';
import { COMPANY_ERROR } from './../../contest/contants/contants';
import { CompanyService } from './../../company/services/company.service';
import { ContestService } from 'src/contest/services/contest.service';
import { AssmCompanyEntity } from './../entities/assignment-company.entity';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateAssignmentCompanyDto } from '../dto/create-assignment-company.dto';
import { UpdateAssignmentCompanyDto } from '../dto/update-assignment-company.dto';
import { Repository } from 'typeorm';
import { Response } from 'express'
import { ADD_NEW_ASSIGNMENT_SUCCESS, COMPANY_NOT_ACTIVE, COMPANY_NOT_EXIST, CONFLIT_ASSIGNMENT, CONTEST_NOT_ACTIVE, CONTEST_NOT_FOUND } from '../contants/contant';
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

  findAll() {
    return `This action returns all assignmentCompany`;
  }

  findOne(id: number) {
    return `This action returns a #${id} assignmentCompany`;
  }

  update(id: number, updateAssignmentCompanyDto: UpdateAssignmentCompanyDto) {
    return `This action updates a #${id} assignmentCompany`;
  }

  remove(id: number) {
    return `This action removes a #${id} assignmentCompany`;
  }
}
