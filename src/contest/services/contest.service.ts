import { CompanyEntity } from 'src/company/entities/company.entity';
import { plainToClass } from 'class-transformer';
import { ContestEntity } from './../entities/contest.entity';
import { Injectable, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateContestDto } from '../dto/create-contest.dto';
import { UpdateContestDto } from '../dto/update-contest.dto';
import { Repository } from 'typeorm';
import { Validate } from 'src/common/class/validate.entity';
import { CompanyService } from 'src/company/services/company.service';
import * as fs from 'fs';
import { Response } from 'express';
import { ADD_CONTEST_SUCCES, COMPANY_ERROR, CONTEST_EXISTING } from '../contants/contants';

@Injectable()
export class ContestService {
  constructor(@InjectRepository(ContestEntity) private readonly contentEntity : Repository<ContestEntity> ,
  private readonly companyService : CompanyService ,
  ){

  }
  async create(createContestDto: CreateContestDto , file : Express.Multer.File , userCreate : string, res : Response) {

    try{

      let checkContest = await this.contentEntity.find({
        where : [
          { email : createContestDto.email,} ,
          {name : createContestDto.name}
        ]
      })
      let checkCompany = await this.companyService.findOne(createContestDto.idCompany)

      if(!checkCompany || checkCompany.isActive === false){
        res.status(HttpStatus.BAD_REQUEST).json({
          message : COMPANY_ERROR
        })
      }

      if(checkContest.length > 0) 
      return res.status(HttpStatus.BAD_REQUEST).json({
        message : CONTEST_EXISTING
      })

      else{


        if(file){
          createContestDto.background = this.saveImage(file)
        }

        createContestDto.historyCreate = userCreate ;
        let newContest = await this.contentEntity.save({... createContestDto })
        return res.status(HttpStatus.CREATED).json({
          message : ADD_CONTEST_SUCCES ,
          newContest : newContest
        })


      }

    }catch(e){

      if(e) console.log(e);
      
    }
    
  }

  async findAll() {

    try{

      let listContest = await this.contentEntity.find()
      return listContest

    }catch(e){

      if(e) console.log(e);
      
    }

  }

  async findOne(id: string) {

      let checkContest = await this.validateContest({id : id})

      return checkContest


  }

  async update(id: string, updateContestDto: UpdateContestDto , userChange) {

    try{

      let checkContest = await this.validateContest({id : id})

      if(!checkContest) return "Contest not existing"

      else{

        updateContestDto.historyCreate = userChange
        checkContest = {...checkContest , ... updateContestDto}
        this.contentEntity.save(checkContest) 
        return checkContest

      }

    }catch(e){

      if(e) console.log(e);
      
    }

  }


  async remove(id: string , userRemove : string) {

    try{

      let checkContest = await this.validateContest({id:id})

      if(!checkContest) return "Contest not existing" 
      else{
        
        if(checkContest.isActive == false) return "Contest was stop"

        else{
          checkContest.userhistoryChange = userRemove
          checkContest.isActive = false
          this.contentEntity.save(checkContest)
          return checkContest

        }
      }
    }catch(e){

      if(e) console.log(e);
      
    }
  }

  async getContestByIdCompany(id : string ){

    try{

      let listContest = await this.contentEntity.find({
        relations : {
        }
      })
      
      return listContest

    }catch(e){
      
      if(e) console.log(e);
      
    }
  }


  async validateContest (data : Validate) : Promise <any>{
    let checkContest = await this.contentEntity.findOneBy(data)
    return checkContest
  } 

  async save(data : ContestEntity){

    try{

      this.contentEntity.save(data)

    }catch(e){

      if(e) console.log(e);
      
    }

  }

  async createNewContest(data , file){
    
    try{

    let filename = file.filename
    let path = file.path
    let type = file.mimetype.split('/').pop().toLowerCase();
    let fileSave = `${filename}${Date.now()}.${type}`;
    let buffer = fs.readFileSync(file.path)
    fs.writeFileSync(`./data/${fileSave}` , buffer)
    fs.unlinkSync(path)
    let newData = {
      ...data ,
      background : fileSave
    }    
    console.log(newData);
    
    let checkContest = await this.validateContest({email : newData.email})

    if(checkContest) return 'Contest existing'

    else{

      let newContest = await this.contentEntity.save(newData)
      return newContest
    }


    }catch(e){

      if(e)  console.log(e);
      
    }
  }


  private saveImage(file: Express.Multer.File) {
    let filename = file.filename;
    let path = file.path;
    let type = file.mimetype.split('/').pop().toLowerCase();
    let fileSave = `${process.env.STATICIMG + filename}${Date.now()}.${type}`;
    let buffer = fs.readFileSync(file.path);
    fs.writeFileSync(`.${fileSave}`, buffer);
    fs.unlinkSync(path);
    return fileSave;
  }

}
