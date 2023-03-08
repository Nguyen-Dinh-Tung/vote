import { CANDIDATE_NOT_EXIST } from './../../candidate/contants/message';
import { CandidateEntity } from './../../candidate/entities/candidate.entity';
import { CONTEST_NOT_FOUND } from './../../assignment-company/contants/contant';
import { ContestEntity } from 'src/contest/entities/contest.entity';
import { Injectable, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CandidateService } from 'src/candidate/services/candidate.service';
import { ContestService } from 'src/contest/services/contest.service';
import { In, Repository } from 'typeorm';
import { CreateTicketDto } from '../dto/create-ticket.dto';
import { DataFindByAny } from '../dto/Find-Ticket.dto';
import { UpdateTicketDto } from '../dto/update-ticket.dto';
import { TicketEntity } from '../entities/ticket.entity';
import { FindList } from 'src/common/interfaces/res.interfaces';
import { ADD_TICKET_SUCCESS } from 'src/common/constant/message';


@Injectable()
export class TicketService {
  constructor(@InjectRepository(TicketEntity) private readonly ticketEntity : Repository<TicketEntity> ,
  @InjectRepository(ContestEntity) private readonly contestEntity : Repository<ContestEntity> ,
  @InjectRepository(CandidateEntity) private readonly candidateEntity : Repository<CandidateEntity> ,
  ){

  }


  async create(
    createTicketDto: CreateTicketDto ,
     userCreate : string
    ) : Promise<FindList<TicketEntity>> {

      let checkContest = await this.contestEntity.findOne({
          where : {
            id : createTicketDto.idcontest
          }
      })

      if(!checkContest)
      return {
        status : HttpStatus.NOT_FOUND ,
        message : CONTEST_NOT_FOUND ,
        data : undefined ,
        total : undefined
      }

      let listCandidate = await this.candidateEntity.find({
        where : {
          id : In(createTicketDto.idcandidates)
        }
      })


      if(!listCandidate || listCandidate.length < 1)
      return {
        status : HttpStatus.NOT_FOUND ,
        message : CANDIDATE_NOT_EXIST ,
        data : undefined ,
        total : undefined
      }
      let listNewTicket = []
      for(let e of listCandidate){

        let newInfoTicket = {
          contest : checkContest , 
          candidate : e
        }

        let newTicket = await this.ticketEntity.save(newInfoTicket)

        if(newTicket)
        listNewTicket.push(newTicket)

      }
      
      return {
        status : HttpStatus.OK ,
        message : ADD_TICKET_SUCCESS ,
        data : listNewTicket ,
        total : listNewTicket.length
      }

  }


  async findAll() {

    try{

      let listTicket = await this.ticketEntity.find() ;
      return listTicket

    }catch(e){

      if(e) console.log(e);

    }
  }


  async findOne(id: string) {

    try{

      let checkTicket = await this.ticketEntity.findOneBy({
        id : id
      })

      if(checkTicket){

        return checkTicket

      }else{

        return "Ticket not existing"
      }

    }catch(e){

      if(e) console.log(e);
      
    }
  }


  async update(id: number, updateTicketDto: UpdateTicketDto) {
    return `This action updates a #${id} ticket`;
  }


  // async remove(id: string , userRemove : string ) {

  //   try{

  //     let checkTicket = await this.ticketEntity.findOneBy({
  //       id : id
  //     })

  //     if(!checkTicket) return "Ticket not existing"
  //     if(!checkTicket.isActive) return "Ticket not active"


  //     else{
        
  //       let contest = await this.contestService.findOne(checkTicket.idcontest)
  //       contest.totalCadidate--
  //       this.contestService.save(contest)

  //       checkTicket.historyChange = userRemove
  //       checkTicket.isActive = false
  //       this.ticketEntity.save(checkTicket)
  //       return checkTicket

  //     }

  //   }catch(e){

  //     if(e) console.log(e);
      
  //   }

  // }

  // async findOneByAny(data : DataFindByAny){

  //   try{

  //     if(data.idcadidate){

  //       let checkTicket = await this.ticketEntity.findOneBy({
  //         idcadidate : data.idcadidate
  //       })

  //       if(checkTicket){

  //         return checkTicket

  //       }else{

  //         return "Ticket not existing"

  //       }
  //     }else if(data.idcontest){

  //       let checkTicket = await this.ticketEntity.findOneBy({
  //         idcontest : data.idcontest
  //       })

  //       if(checkTicket){

  //         return checkTicket

  //       }else{

  //         return "Ticket not existing"
  //       }

  //     }else{

  //       return "Please send your idcontest or idcadidate"

  //     }

  //   }catch(e){

  //     if(e) console.log(e);
      
  //   }

  // }
}
