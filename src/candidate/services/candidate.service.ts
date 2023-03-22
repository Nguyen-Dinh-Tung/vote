import { SEARCH_KEY_NOT_FOUNT, FILTER_FAIL } from './../contants/message';
import { amount } from './../../users/contants/amount.in.page';
import { UserCa } from './../../user-ca/entities/user-ca.entity';
import { NOT_DATA } from './../../contest/contants/contants';
import { ContestEntity } from './../../contest/entities/contest.entity';
import { NotFoundError } from 'rxjs';
import { CandidateEntity } from './../entities/candidate.entity';
import { Injectable, HttpStatus } from '@nestjs/common';
import {  InjectRepository } from '@nestjs/typeorm';
import { Validate } from 'src/common/class/validate.entity';
import { Repository,Like } from 'typeorm';
import { CreateCandidateDto } from '../dto/create-candidate.dto';
import { UpdateCandidateDto } from '../dto/update-candidate.dto';
import { AssmContestEntity } from 'src/assignment-contest/entities/assignment-contest.entity';
import  * as fs from 'fs'
import * as dotenv from 'dotenv' 
import { Response } from 'express';
import { ADD_CANDIDATE_SUCCESS, CANDIDATE_EXIST, CANDIDATE_NOT_EXIST, GET_DETAIL_CANDIDATE_SUCCESS, GET_LIST_CANDIDATE_SUCCESS, UPDATE_CANDIDATE_SUCCESS } from '../contants/message';
import { CandidateRecomendEntity } from '../entities/candidate-recomend.entity';
import { AssignmentContestService } from 'src/assignment-contest/services/assignment-contest.service';
import { UserCaService } from 'src/user-ca/services/user-ca.service';
import { Roles } from 'src/common/enum/role.enum';
dotenv.config()


@Injectable()
export class CandidateService {


  constructor(
  @InjectRepository(CandidateEntity)private readonly candidateEntity : Repository<CandidateEntity> ,
  @InjectRepository(ContestEntity)private readonly contestEntity : Repository<ContestEntity> ,
  @InjectRepository(AssmContestEntity)private readonly AssmContestEntity : Repository<AssmContestEntity> ,
  @InjectRepository(CandidateRecomendEntity)private readonly candidateRemEntity : Repository<CandidateRecomendEntity> ,
  private readonly ascoService : AssignmentContestService ,
  private readonly ucaSerivce : UserCaService
  ){}


  async create(
    createCandidateDto: CreateCandidateDto , 
    idUser : string ,
    res : Response,
    userCreate : string,
    file? : Express.Multer.File
    ) {

    let checkCandidate = await this.candidateEntity.findOne({
      where : [
        {idno : createCandidateDto.idno},
        {email : createCandidateDto.email}
      ]
    })
    if(checkCandidate)
    return {
      message : CANDIDATE_EXIST ,
      status : HttpStatus.CONFLICT ,
      data : undefined , 
      failList : createCandidateDto 
    }

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

      }
  
    }
    let admin = await this.ucaSerivce.addAminUca({
      idCandidate : newCandidate.id ,
      idUser : idUser ,
      role : Roles.ucp_admin
    })

    let share = createCandidateDto.share
    let listAsco : AssmContestEntity [] ;
    let listFail : any;
    console.log(share.listIdContest);
    
    if(share.listIdContest){
      let InfoAsco = {
        idCandidates : [newCandidate.id] ,
        listIdContest : share.listIdContest
      }
      
      let resAsco = await this.ascoService.create({
        share : InfoAsco
      })
      listAsco = resAsco.data
      listFail = resAsco.failList
    }

    let listUca  : UserCa [] ;
    let listFailUca : any ;
    if(share.listIdUsers.length > 0){
      let infoUcaNew = {
        listIdUsers : share.listIdUsers ,
        idCandidates : [newCandidate.id]
      }
      let resUca = await this.ucaSerivce.create({
        share : infoUcaNew
      })
      listUca = resUca.data
      listFailUca = resUca.failList
    }

    return {
      data : newCandidate ,
      share : {
        listAsco : listAsco ,
        listUca : listUca
      },
      failList : {
        listFail : listFail ,
        listFailUca : listFailUca
      },
      status : HttpStatus.CREATED ,
      message : ADD_CANDIDATE_SUCCESS ,
      admin : admin
    }
  }

  async findAll( res : Response,page : number  , isActive : boolean , search : string) {
    
    let offset = page * amount - amount ;
    let total = await this.candidateEntity.count()
    
    if(search){

      let listCandidate = await this.candidateEntity
      .find({
        where : [
        {name : Like(`%${search}%`)},
        {email : Like(`%${search}%`)},
        ],
        take : amount ,
        skip : offset ,
      })

      let count = await this.candidateEntity.count({
        where :[
          {name : Like(`%${search}%`)},
          {email : Like(`%${search}%`)},
          ], 
      })
      if(listCandidate.length <1)
      return res.status(HttpStatus.NOT_FOUND).json({
        message : SEARCH_KEY_NOT_FOUNT
      })
      return res.status(HttpStatus.OK).json({
        message :GET_LIST_CANDIDATE_SUCCESS , 
        listCandidate : listCandidate,
        total : count
      })
    }
    
    if(isActive !== undefined){
      let listCandidate = await this.candidateEntity.find({
        where : {
          isActive : isActive
        } ,
        take : amount ,
        skip : offset ,
      })
      let count = await this.candidateEntity.count({
        where : {
          isActive : isActive
        } ,
      })

      
      if(listCandidate.length <1)
      return res.status(HttpStatus.NOT_FOUND).json({
        message : FILTER_FAIL
      })
      return res.status(HttpStatus.OK).json({
        message : GET_LIST_CANDIDATE_SUCCESS  ,
        listCandidate : listCandidate ,
        total : count
      })
    }
    if(!search && !isActive){

      let listCandidate = await this.candidateEntity.find({
        skip : offset ,
        take : amount
      })
      let count = await this.candidateEntity.count()
      return res.status(HttpStatus.OK).json({
        message : GET_LIST_CANDIDATE_SUCCESS,
        listCandidate : listCandidate , 
        total : count
      })
    }
      
  }

  async findOne(id: string , res : Response) {
    let candidate : CandidateEntity = await this.candidateEntity.createQueryBuilder('ca')
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
    
    let flagCaUp = false ;
    let checkCandidate = await this.candidateEntity.findOne({
      where : {
        id : id
      } ,
    })

    if(!checkCandidate)
    return res.status(HttpStatus.NOT_FOUND).json({
      message : CANDIDATE_NOT_EXIST
    })

    if(!updateCandidateDto && !file)
    return res.status(HttpStatus.NOT_FOUND).json({
      message : NOT_DATA
    })

    if(updateCandidateDto.descs || updateCandidateDto.slogan){
      let newCarem = {}
      if(updateCandidateDto.descs)
      newCarem['descs'] = updateCandidateDto.descs
      if(updateCandidateDto.slogan)
      newCarem['slogan'] = updateCandidateDto.slogan

      let carem : CandidateRecomendEntity;
      await this.candidateEntity.findOne({
        where : {
          id : id
        },
        relations : {
          carem : true
        } ,
      }).then(res =>{
        carem = res.carem
        return 
      })

      carem = {
        ...carem ,
        ...newCarem
      }
      checkCandidate.userhistoryChange = userChange
      await this.candidateEntity.save(checkCandidate)
      await this.candidateRemEntity.save(carem)
      
    }

    Object.keys(updateCandidateDto).some(key =>{

      if(key)
      if(key !== "descs" && key !== "slogan")
      checkCandidate[key] = updateCandidateDto[key]


      flagCaUp = true
    })

    if(file){
      checkCandidate['background'] = this.saveImage(file)
      flagCaUp = true
    }

    if(flagCaUp){
      
      checkCandidate.userhistoryChange = userChange
      await this.candidateEntity.save(checkCandidate)

    }


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
