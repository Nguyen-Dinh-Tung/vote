import { CONTEST_NOT_FOUND } from './../../assignment-company/contants/contant';
import { ContestEntity } from './../../contest/entities/contest.entity';
import { NotFoundError } from 'rxjs';
import { CandidateEntity } from './../entities/candidate.entity';
import { Injectable, HttpStatus } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { Validate } from 'src/common/class/validate.entity';
import { Repository } from 'typeorm';
import { CreateCandidateDto } from '../dto/create-candidate.dto';
import { UpdateCandidateDto } from '../dto/update-candidate.dto';
import { AssmContestEntity } from 'src/assignment-contest/entities/assignment-contest.entity';
import  * as fs from 'fs'
import * as dotenv from 'dotenv' 
import { Response } from 'express';
import { ADD_CANDIDATE_SUCCESS, CANDIDATE_EXIST } from '../contants/message';
import { TicketEntity } from 'src/ticket/entities/ticket.entity';
dotenv.config()


@Injectable()
export class CandidateService {


  constructor(
  @InjectRepository(CandidateEntity)private readonly cadidateEntity : Repository<CandidateEntity> ,
  @InjectRepository(ContestEntity)private readonly contestEntity : Repository<ContestEntity> ,
  @InjectRepository(AssmContestEntity)private readonly AssmContestEntity : Repository<AssmContestEntity> ,
  @InjectRepository(TicketEntity)private readonly ticketEntity : Repository<TicketEntity> ,
  
  ){}


  async create(createCandidateDto: CreateCandidateDto , userByToken : string , res : Response , file? : Express.Multer.File) {

    let checkCandidate = await this.cadidateEntity.findOne({
      where : [
        {idno : createCandidateDto.idContest},
        {email : createCandidateDto.email}
      ]
    })
    if(checkCandidate)
    return res.status(HttpStatus.CONFLICT).json({
      message : CANDIDATE_EXIST
    })

    let newData = {}
    Object.keys(createCandidateDto).some(key =>{
      if(key !== 'idContest'){
        newData[key] = createCandidateDto[key]
      }
    })
    let newCandidate = await this.cadidateEntity.save(newData)

    if(createCandidateDto.idContest){
      let checkContest = await this.contestEntity.findOne({
        where : {
          id : createCandidateDto.idContest
        }
      })

      if(!checkContest)
      return res.status(HttpStatus.NOT_FOUND).json({
        message : CONTEST_NOT_FOUND
      })
      let newTick = {
        candidate : newCandidate ,
      }
      let newTicket = await this.ticketEntity.save(newTick)

      

    }{

      return res.status(HttpStatus.CREATED).json({
        message : ADD_CANDIDATE_SUCCESS ,
        candidate : newCandidate
      })

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
