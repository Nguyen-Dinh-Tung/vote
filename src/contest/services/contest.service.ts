import { SERVE_ERROR } from './../../common/constant/message';
import { FIELD_NOT_HOLLOW } from './../../users/contants/message';
import { CONTEST_NOT_FOUND, COMPANY_NOT_EXIST } from './../../assignment-company/contants/contant';
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
import { ADD_CONTEST_SUCCES, ADM_MESSAGE, COMPANY_ERROR, CONTEST_EXISTING, GET_DETAILS_SUCESS, GET_LIST_CONTEST_SUCCESS, NOT_DATA, UPDATE_SUCCESS } from '../contants/contants';
import { ContestRecomendEntity } from '../entities/ContestRecomend.entity';
import { AssmCompanyEntity } from 'src/assignment-company/entities/assignment-company.entity';

@Injectable()
export class ContestService {
  constructor(
  @InjectRepository(ContestEntity) private readonly contentEntity : Repository<ContestEntity> ,
  @InjectRepository(ContestRecomendEntity) private readonly contestRemEntity : Repository<ContestRecomendEntity> ,
  @InjectRepository(AssmCompanyEntity) private readonly assmCompanyEntity : Repository<AssmCompanyEntity> ,
  @InjectRepository(CompanyEntity) private readonly companyEntity : Repository<CompanyEntity> ,
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
            
            newContest.coRem = newCoRem
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

    let listContest = await this.contentEntity.createQueryBuilder('co')
    .leftJoin('co.coRem' , 'corem')
    .leftJoin(AssmCompanyEntity , 'ascp' , 'co.id = ascp.contestId')
    .leftJoin('ascp.company' , 'cp')
    .select([ 
    'co.id as id','co.name as name' , 
    'co.address as address' , 'co.email as email' 
    , 'co.background as background' , 'descs' , 'slogan' 
    , 'co.isActive as isActive' ,
      'cp.name as company'
  ])
    .getRawMany()
    
    return res.status(HttpStatus.OK).json({
      message : GET_LIST_CONTEST_SUCCESS ,
      listContest : listContest
    })


  }

  async findOne(id: string) {

      let checkContest = await this.validateContest({id : id})

      return checkContest


  }

  async update(id: string, updateContestDto: UpdateContestDto , userChange : string , res :Response, file? :Express.Multer.File) {
    
    let checkContest = await this.contentEntity.findOneBy({
      id : id
    })
    let flag = true
    if(!checkContest)
    return res.status(HttpStatus.NOT_FOUND).json({
      message : CONTEST_NOT_FOUND
    })

    if(!updateContestDto)
    return res.status(HttpStatus.BAD_REQUEST).json({
      message : NOT_DATA
    })
    Object.values(updateContestDto).some(val =>{

      if(val === ''){
        flag = false
      }

    })

    if(!flag)
    return res.status(HttpStatus.BAD_REQUEST).json({
      message : FIELD_NOT_HOLLOW
    })

  

    if(updateContestDto.descs || updateContestDto.slogan){

      let coRem = await this.contentEntity.createQueryBuilder('co').leftJoin('co.coRem' , 'coRem').select('coRem.id').execute()
      let coRemId : string;
      if(coRem.length > 0){
        coRemId = coRem[0].coRem_id
      }
      let data = {

      }
      if(updateContestDto.descs){
        data['descs'] = updateContestDto.descs
      }
      if(updateContestDto.slogan){
        data['slogan'] = updateContestDto.slogan
      }
        
      await this.contestRemEntity.update(coRemId , data)
    }


    if(updateContestDto.idCompany){
      
      let assmCp = await this.assmCompanyEntity.findOne({
        where :{
          contest : checkContest
        }
      })

      if(assmCp){
        let updateCp = await this.companyEntity.findOne({
          where : {
            id : updateContestDto.idCompany
          }
        })
        if(!updateCp)
        return res.status(HttpStatus.NOT_FOUND).json({
          message : COMPANY_NOT_EXIST
        })


        assmCp.company = updateCp
        await this.assmCompanyEntity.save(assmCp)
      }else{
        return res.status(HttpStatus.BAD_GATEWAY).json({
          message : SERVE_ERROR
        })
      }
    }

    let data = {

    }
    

    Object.keys(updateContestDto).some(key =>{

      if(key !== 'descs' &&  key != "slogan" &&  key != "idCompany"){
        data[key] = updateContestDto[key]
      }

    })
    if(file){
      data['background'] = this.saveImage(file)
    }
    


    await this.contentEntity.update(id , data)

    return res.status(HttpStatus.OK).json({
      message : UPDATE_SUCCESS
    })
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


  async getDetailsContest (id : string , res : Response){ 

    let contest = 
    await this.contentEntity.createQueryBuilder('co')
    .leftJoin('co.coRem' , 'corem')
    .select([ 'name', 'co.isActive as isActive','address' , 'email' , 'background','slogan' , 'descs'])
    .where({
      id : id
    }).execute()
    console.log(contest);
    
    if(!contest)
    return res.status(HttpStatus.NOT_FOUND).json({
      message : CONTEST_NOT_FOUND
    })

    return res.status(HttpStatus.OK).json({
      contest : contest[0]
    })
    
    
  } 
}
