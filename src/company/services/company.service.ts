import { plainToClass } from 'class-transformer';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Validate } from 'src/common/class/validate.entity';
import { Repository } from 'typeorm';
import { CreateCompanyDto } from '../dto/create-company.dto';
import { UpdateCompanyDto } from '../dto/update-company.dto';
import { CompanyEntity } from '../entities/company.entity';

@Injectable()
export class CompanyService {
  constructor(@InjectRepository(CompanyEntity) private readonly companayEntity : Repository<CompanyEntity>){

  }
  async create(createCompanyDto: CreateCompanyDto , userCreate : string) {

    try{

      let checkCompay = await this.validateCompany({
        email: createCompanyDto.email
      })
  
      if(!checkCompay){
        
        createCompanyDto.historyCreate  = userCreate
  
        let newCompany = await this.companayEntity.save(createCompanyDto)
        return newCompany
  
      }else{
  
        return "Company existing"
  
      }
    }catch(e){

      if(e) console.log(e);
      
    }
  }

  async findAll() {
    let listCompany = await this.companayEntity.find() ;
    return listCompany
  }

  async findOne(id: string) {
    let checkCompany = await this.companayEntity.findOneBy({id : id})
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
