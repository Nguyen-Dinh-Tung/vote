import { ADD_NEW_ASCO_FAIL, ADD_NEW_UCO_SUCCESS, ADD_TICKET_SUCCESS } from 'src/common/constant/message';
import { FindList } from 'src/common/interfaces/res.interfaces';
import { ContestEntity } from 'src/contest/entities/contest.entity';
import { CandidateEntity } from './../../candidate/entities/candidate.entity';
import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { CreateAssignmentContestDto } from '../dto/create-assignment-contest.dto';
import { UpdateAssignmentContestDto } from '../dto/update-assignment-contest.dto';
import { AssmContestEntity } from '../entities/assignment-contest.entity';

@Injectable()
export class AssignmentContestService {

  constructor(
    @InjectRepository(AssmContestEntity) private readonly ascoEntity : Repository<AssmContestEntity> ,
    @InjectRepository(CandidateEntity) private readonly candidateEntity : Repository <CandidateEntity> ,
    @InjectRepository(ContestEntity) private readonly contestEntity : Repository <ContestEntity> 
  ){

  }
  async create(
    createAssignmentContestDto: CreateAssignmentContestDto
    ) : Promise<FindList<AssmContestEntity & any>> {
    

    let failCandidate  = [] ;
    let failContest  = [] ;

    let share = createAssignmentContestDto.share ;
    let checkCandidates : CandidateEntity [] ;
    let checkContests : ContestEntity [] ;
    
    if(share.idCandidates.length > 0){
      checkCandidates = await this.candidateEntity.find({
        where : {
          id : In(share.idCandidates)
        }
      })

      if(checkCandidates.length !== share.idCandidates.length){

        for(let e of share.idCandidates){
          let flag = false
          for(let element of checkCandidates){
            if(e === element.id){
              flag = true
            }
          }
          if(flag = false){
            failCandidate.push(e)
          }
        }
      }
    }

    console.log(share.listIdContest , ' share.listIdContest');
    
    
    if(share.listIdContest.length > 0){
      
      checkContests = await this.contestEntity.find({
        where : {
          id : In(share.listIdContest)
        }
      })
      console.log( checkContests , 'checkContests');
      if(checkContests.length !== share.listIdContest.length){

        for(let e of share.listIdContest){
          let flag = false
          for(let element of checkContests){
            if(e === element.id){
              flag = true
            }
          }
          if(flag = false){
            failContest.push(e)
          }
        }
      }
      console.log( checkContests , 'checkContests');

    }

    if(checkCandidates.length < 1 || checkContests.length < 1)
    return{
      message : ADD_NEW_ASCO_FAIL ,
      data : undefined , 
      total : undefined ,
      status : HttpStatus.NOT_FOUND , 
      failList : {
        failCandidate , failContest
      }
    }

    let listUco : AssmContestEntity []  = [];
      for(let e of checkCandidates){
        for(let element of checkContests){
          let infoAsco ={
            contest : element ,
            candidate : e
          }
          let newAsco = await this.ascoEntity.save(infoAsco)
          console.log(newAsco , 'newAsco');
          
          if(newAsco)
          listUco.push(newAsco)
        }
    }

   
    return {
      data : listUco ,
      status : HttpStatus.CREATED ,
      total : listUco.length ,
      message : ADD_TICKET_SUCCESS , 
      failList : {
        failCandidate : failCandidate , 
        failContest : failContest
      }
    }

  }

  findAll() {
    return `This action returns all assignmentContest`;
  }

  findOne(id: number) {
    return `This action returns a #${id} assignmentContest`;
  }

  update(id: number, updateAssignmentContestDto: UpdateAssignmentContestDto) {
    return `This action updates a #${id} assignmentContest`;
  }

  remove(id: number) {
    return `This action removes a #${id} assignmentContest`;
  }
}
