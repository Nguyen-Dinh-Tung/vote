import { NotFoundError } from 'rxjs';
import { CandidateEntity } from './../entities/candidate.entity';
import { Injectable } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { Validate } from 'src/common/class/validate.entity';
import { Repository } from 'typeorm';
import { CreateCandidateDto } from '../dto/create-candidate.dto';
import { UpdateCandidateDto } from '../dto/update-candidate.dto';

import  * as fs from 'fs'
import * as dotenv from 'dotenv' 
dotenv.config()


@Injectable()
export class CandidateService {


  constructor(@InjectRepository(CandidateEntity)
  private readonly cadidateEntity : Repository<CandidateEntity>){}


  async create(createCandidateDto: CreateCandidateDto , userByToken : string , file? : Express.Multer.File) {

    try{

    let checkCadidate = await this.validateCadidate({idno : createCandidateDto.idno})
      
    if(!checkCadidate){

      if(file){
        createCandidateDto.background = await this.uploadImages(file)
      }

      createCandidateDto.historyCreate = userByToken ;
      let newCadidate = await this.cadidateEntity.save(createCandidateDto)
      return newCadidate ;

    }else{

      return "Candidate existing"

    }

    }catch(e){

      if(e) console.log(e);
      
    }

  }


  async findAll() {
    let listCadidate = await this.cadidateEntity.find() ;
    return listCadidate
  }


  async findOne(id: string) {

    let checkCaDidate = await this.validateCadidate({id : id}) ;

    if(checkCaDidate){

      return checkCaDidate

    }else{

      this.NotFoundError()

    }
  }

  
  async update(id: string, updateCandidateDto: UpdateCandidateDto , userChange) {

    try{
      let checkCadidate = await this.validateCadidate({id:id})

    if(!checkCadidate) this.NotFoundError() ;

    else {

      checkCadidate = { ... checkCadidate , ...updateCandidateDto , historyChange : userChange}
      this.cadidateEntity.save(checkCadidate)

      return checkCadidate
    }


    }catch(e) {

      if(e) console.log(e);
      
    }
  }


  async remove(id: string , userChange : string ) {

    try{

      let checkCaDidate = await this.validateCadidate({id:id})

      if(!checkCaDidate) this.NotFoundError()

      else{

        checkCaDidate.isActive = false 
        checkCaDidate.historyChange = userChange
        this.cadidateEntity.save(checkCaDidate)

        return checkCaDidate

      }

    }catch(e){

      if(e) console.log(e);
      
    }

  }


  async validateCadidate(data : Validate): Promise <any>{

    let checkCadidate = await this.cadidateEntity.findOneBy(data)
    return checkCadidate

  }
  async NotFoundError(){

    return new NotFoundError('Cadidate not found')

  }

  async uploadImages(bg : Express.Multer.File){

    let mimeType = bg.mimetype.split('/')[1] ;
    console.log(bg);
    let filename = bg.filename ;
    let path = bg.path
    let bufferFile = fs.readFileSync(path)
    let fileSave = `${filename + Date.now()}.${mimeType}`
    fs.writeFileSync(process.env.STATICIMG + fileSave ,bufferFile) ;
    let hostImage = process.env.HOST + fileSave
    return hostImage    

  }
}
