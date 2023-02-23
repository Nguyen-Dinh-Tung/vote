import { CompanyRecomend } from './../entities/company-recomend.entity';
import { plainToClass } from 'class-transformer';
import { Injectable, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Validate } from 'src/common/class/validate.entity';
import { Repository } from 'typeorm';
import { CreateCompanyDto } from '../dto/create-company.dto';
import { UpdateCompanyDto } from '../dto/update-company.dto';
import { CompanyEntity } from '../entities/company.entity';
import { Response } from 'express';
import { ADD_COMPANY_SUCCESS, COMPANY_REM_EXIST, CONFLIT_COMPANY } from '../contants/message';

@Injectable()
export class CompanyService {
  constructor(
    @InjectRepository(CompanyEntity) private readonly companayEntity : Repository<CompanyEntity>,
    @InjectRepository(CompanyRecomend) private readonly cpRemEntity : Repository<CompanyRecomend>
    
    ){

  }
  async create(createCompanyDto: CreateCompanyDto , userCreate : string, res : Response) {

    let checkCompany = await this.companayEntity.findOneBy({
      email : createCompanyDto.email ,
      name : createCompanyDto.name
    })

    if(checkCompany){

      return res.status(HttpStatus.CONFLICT).json({
        message : CONFLIT_COMPANY
      })

    }

    let infoCreateCp = {
      name : createCompanyDto.name ,
      email : createCompanyDto.email ,
      address : createCompanyDto.address,
      historyCreate : createCompanyDto.historyCreate
    }

    let cpRem = {
      slogan : createCompanyDto.slogan ,
      business_segment : createCompanyDto.business_segment ,
    }

    let newCompany = await this.companayEntity.save(infoCreateCp)

    let REM_EXIST = '' ;


    if(newCompany){

      this.companayEntity.findOne({
        where : {
          id : newCompany.id
        } ,
        relations : {
          companyrem : true
        }
      })
      .then(async response =>{
        if(!response.companyrem){

          let newCpRem = await this.cpRemEntity.save(cpRem)
          
          if(newCpRem){
            
            await this.companayEntity.save({...newCompany  , companyrem : newCpRem})

          }
      
        }else{

          REM_EXIST = COMPANY_REM_EXIST

        }

      })
      .catch(e =>{
        
        if(e) console.log(e);
        
      })

      if(REM_EXIST){

        return res.status(HttpStatus.CREATED).json({
          message : ADD_COMPANY_SUCCESS ,
          newCompany : newCompany , 
          rem : REM_EXIST
        })

      }
    
    }


    return res.status(HttpStatus.CREATED).json({
      message : ADD_COMPANY_SUCCESS ,
      newCompany : newCompany , 
    })



  }

  async findAll() {
    let listCompany = await this.companayEntity.find() ;
    return listCompany
  }

  async findOne(id: string) {
    let checkCompany = await this.companayEntity.findOne(
      {
        where : {
          id : id
        },
        relations : {
          companyrem : true ,
        }
      } 
    )
    return checkCompany

  }


  async update(id: string, updateCompanyDto: UpdateCompanyDto , userChange) {
    
    try{
      
      let checkCompay = await this.validateCompany({id : id})

      if(!checkCompay) return "Company not existing"

      else{

        checkCompay.historyChange = userChange
        checkCompay = {...checkCompay , ...updateCompanyDto}
        this.companayEntity.save(checkCompay)
        return checkCompay

      }

    }catch(e){

      if(e) console.log(e);
      
    }

  }


  async remove(id: string , userRemove) {

    try{

      let checkCompany = await this.validateCompany({id : id})

      if(!checkCompany) return "Company not existing"

      else{

        checkCompany.isActive = false ; 
        checkCompany.historyChange = userRemove
        this.companayEntity.save(checkCompany)
        return checkCompany

      }

    }catch(e){

      if(e) console.log(e);
      
    }

  }


  async validateCompany (data : Validate) : Promise <any>{
    let checkCompay = await this.companayEntity.findOneBy(data)
    return checkCompay
  } 
}
