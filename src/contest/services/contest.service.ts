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
import { ADD_CONTEST_SUCCES, ADM_MESSAGE, COMPANY_ERROR, CONTEST_EXISTING, GET_LIST_CONTEST_SUCCESS } from '../contants/contants';
import { ContestRecomendEntity } from '../entities/ContestRecomend.entity';
import { AssmCompanyEntity } from 'src/assignment-company/entities/assignment-company.entity';

@Injectable()
export class ContestService {
  constructor(
  @InjectRepository(ContestEntity) private readonly contentEntity : Repository<ContestEntity> ,
  @InjectRepository(ContestRecomendEntity) private readonly contestRemEntity : Repository<ContestRecomendEntity> ,
  @InjectRepository(AssmCompanyEntity) private readonly assmCompanyEntity : Repository<AssmCompanyEntity> ,
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

        let newInfoCo = {
          name : createContestDto.name,
          address : createContestDto.address,
          email : createContestDto.email,
          historyCreate : userCreate
        }


        if(file){
          newInfoCo['background'] = this.saveImage(file)
        }


        newInfoCo['historyCreate'] = userCreate ;
        let newContest = await this.contentEntity.save({... newInfoCo })


        if(newContest){

          let infoRem = {
            desc :createContestDto.description ,
            slogan : createContestDto.slogan
          }
          let newCoRem = await this.contestRemEntity.save(infoRem)
          if(newCoRem){
            
            newContest.contestRem = newCoRem
            await this.contentEntity.save(newContest)

          }else{

            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
              message : ADM_MESSAGE
            })

          }

          let infoAssmCompany = {
            company : checkCompany ,
            contest : newContest
          }

          let newAssmCompany = await this.assmCompanyEntity.save(infoAssmCompany)

          if(newAssmCompany){

            return res.status(HttpStatus.CREATED).json({
              message : ADD_CONTEST_SUCCES ,
              newContest : newContest
            })

          }else{
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
              message : ADM_MESSAGE
            })
          }

        }else{
          return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            message : ADM_MESSAGE
          })
        }


      }

    }catch(e){

      if(e) console.log(e);
      
    }
    
  }

  async findAll(res : Response) {

    let listContest = await this.contentEntity.find()
    
    let listRes = []

    for(let e of listContest){
      let assmCp = await this.assmCompanyEntity.findOne({
        where : {
          contest : e
        } ,
        relations : {
          company : true
        }
      })

      e['company'] = assmCp.company.name
      listRes.push(e)
    }

    
    return res.status(HttpStatus.OK).json({
      message : GET_LIST_CONTEST_SUCCESS ,
      listContest : listRes
    })


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
