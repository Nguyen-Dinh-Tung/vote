import { SERVE_ERROR } from './../../common/constant/message';
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
import { ADD_CANDIDATE_SUCCESS, CANDIDATE_EXIST, CANDIDATE_NOT_EXIST, GET_DETAIL_CANDIDATE_SUCCESS, GET_LIST_CANDIDATE_SUCCESS, UPDATE_CANDIDATE_SUCCESS } from '../contants/message';
import { TicketEntity } from 'src/ticket/entities/ticket.entity';
import { CandidateRecomendEntity } from '../entities/candidate-recomend.entity';
import { ADM_MESSAGE } from 'src/contest/contants/contants';
dotenv.config()


@Injectable()
export class CandidateService {


  constructor(
  @InjectRepository(CandidateEntity)private readonly candidateEntity : Repository<CandidateEntity> ,
  @InjectRepository(ContestEntity)private readonly contestEntity : Repository<ContestEntity> ,
  @InjectRepository(AssmContestEntity)private readonly AssmContestEntity : Repository<AssmContestEntity> ,
  @InjectRepository(TicketEntity)private readonly ticketEntity : Repository<TicketEntity> ,
  @InjectRepository(CandidateRecomendEntity)private readonly candidateRemEntity : Repository<CandidateRecomendEntity> ,
  
  ){}


  async create(createCandidateDto: CreateCandidateDto , userCreate : string , res : Response , file? : Express.Multer.File) {

    let checkCandidate = await this.candidateEntity.findOne({
      where : [
        {idno : createCandidateDto.idContest},
        {email : createCandidateDto.email}
      ]
    })
    if(checkCandidate)
    return res.status(HttpStatus.CONFLICT).json({
      message : CANDIDATE_EXIST
    })

    let newData = {
      name : createCandidateDto.name ,
      address : createCandidateDto.address , 
      email : createCandidateDto.email ,
      weight : createCandidateDto.weight ,
      measure : createCandidateDto.measure , 
      idno : createCandidateDto.idno , 
      height : createCandidateDto.height ,
      historyCreate : userCreate ,
    }

    if(file){
      newData['background'] = this.saveImage(file)
    }
    let newCandidate = await this.candidateEntity.save(newData)

    if(newCandidate){
      let carem = {
        slogan : createCandidateDto.slogan , 
        descs : createCandidateDto.descs
      }
  
      let newCarem = await this.candidateRemEntity.save(carem)
  
      if(newCarem){

        newCandidate.carem = newCarem
        await this.candidateEntity.save(newCandidate)

      }else{
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          message : ADM_MESSAGE
        })
      }
  
    }

    

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
      let infoTicket = {
        candidate : newCandidate ,
      }
      let newTicket = await this.ticketEntity.save(infoTicket)
      
      if(!newTicket){
        return res.status(HttpStatus.BAD_GATEWAY).json({
          message : SERVE_ERROR
        })
      }

      let ascoInfo = await this.AssmContestEntity.save({
        contest : checkContest ,
        ticket : newTicket
      })

      if(ascoInfo){
        return res.status(HttpStatus.CREATED).json({
          message : ADD_CANDIDATE_SUCCESS ,
          newCandidate  : newCandidate ,
          ticket : checkContest.name
        })
      }else{
        return res.status(HttpStatus.BAD_GATEWAY).json({
          message : SERVE_ERROR
        })
      }

    }{

      return res.status(HttpStatus.CREATED).json({
        message : ADD_CANDIDATE_SUCCESS ,
        candidate : newCandidate
      })

    }
  }

  async findAll(res : Response) {
    let listCandidate = await this.candidateEntity.createQueryBuilder('ca')
    .leftJoin('ca.carem' , 'carem')
    .leftJoin(TicketEntity , 'tc' , 'tc.candidateId = ca.id')
    .leftJoin(AssmContestEntity , 'asco' , 'tc.id = asco.ticketId')
    .leftJoin('asco.contest' , 'co')
    .select(
      [
        'ca.id as id' , 
        'ca.idno as idno' , 
        'ca.name as name ' , 
        'ca.email as email',
        'ca.address as address' ,
        'ca.background as background' ,
        'ca.height as height' ,
        'ca.weight as weight' ,
        'ca.measure as measure' ,
        'ca.isActive as isActive' ,
        'carem.slogan as slogan',
        'carem.descs as descs' ,
        'co.name as contest'
      ])
    .getRawMany()

      return res.status(HttpStatus.OK).json({
        message : GET_LIST_CANDIDATE_SUCCESS , 
        listCandidate : listCandidate
      })
  }


  async findOne(id: string , res : Response) {
    
    let candidate = await this.candidateEntity.createQueryBuilder('ca')
    .leftJoin('ca.carem' , 'carem')
    .select([
      'ca.id as id' , 
      'ca.idno as idno' , 
      'ca.name as name ' , 
      'ca.email as email',
      'ca.address as address' ,
      'ca.background as background' ,
      'ca.height as height' ,
      'ca.weight as weight' ,
      'ca.measure as measure' ,
      'ca.isActive as isActive' ,
      'carem.slogan as slogan',
      'carem.descs as descs' ,
    ]).where({
      id: id
    }).getRawOne()   
    
    if(!candidate)
    return res.status(HttpStatus.NOT_FOUND).json({
      message : CANDIDATE_NOT_EXIST
    })

    return res.status(HttpStatus.OK).json({
      message : GET_DETAIL_CANDIDATE_SUCCESS ,
      candidate : candidate
    })
  }

  
  async update(
    id: string, 
    updateCandidateDto: UpdateCandidateDto , 
    userChange : string , 
    res : Response , 
    file? : Express.Multer.File) {

    let checkCandidate = await this.candidateEntity.findOne({
      where : {
        id : id
      }
    })

    if(!checkCandidate)
    return res.status(HttpStatus.NOT_FOUND).json({
      message : CANDIDATE_NOT_EXIST
    })

    return res.status(HttpStatus.OK).json({
      message : UPDATE_CANDIDATE_SUCCESS ,
      candidate : checkCandidate
    })

  }


  async remove(id: string , userChange : string ) {

    try{

      let checkCaDidate = await this.validateCadidate({id:id})

      if(!checkCaDidate) this.NotFoundError()

      else{

        checkCaDidate.isActive = false 
        checkCaDidate.historyChange = userChange
        this.candidateEntity.save(checkCaDidate)

        return checkCaDidate

      }

    }catch(e){

      if(e) console.log(e);
      
    }

  }


  async validateCadidate(data : Validate): Promise <any>{

    let checkCadidate = await this.candidateEntity.findOneBy(data)
    return checkCadidate

  }
  async NotFoundError(){

    return new NotFoundError('Cadidate not found')

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
