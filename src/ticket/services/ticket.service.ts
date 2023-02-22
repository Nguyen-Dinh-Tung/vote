import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CandidateService } from 'src/candidate/services/candidate.service';
import { ContestEntity } from 'src/contest/entities/contest.entity';
import { ContestService } from 'src/contest/services/contest.service';
import { Repository } from 'typeorm';
import { CreateTicketDto } from '../dto/create-ticket.dto';
import { DataFindByAny } from '../dto/Find-Ticket.dto';
import { UpdateTicketDto } from '../dto/update-ticket.dto';
import { TicketEntity } from '../entities/ticket.entity';


@Injectable()
export class TicketService {
  constructor(@InjectRepository(TicketEntity) private readonly ticketEntity : Repository<TicketEntity> ,
  private readonly contestService : ContestService, 
  private readonly candidateService : CandidateService
  ){

  }


  // async create(createTicketDto: CreateTicketDto , userCreate : string
  //   ) {

  //     createTicketDto.historyCreate = userCreate
  //     let checkTicket = await this.ticketEntity.findOneBy({
  //       idcadidate : createTicketDto.idcadidate ,
  //       idcontest : createTicketDto.idcontest
  //     })

  //     let contest = await this.contestService.findOne(createTicketDto.idcontest)
  //     let cadidate = await this.candidateService.findOne(createTicketDto.idcadidate)

  //     if(!contest) return "Contest not existing"
  //     if(!contest.isActive) return "Contest not active"

  //     console.log(contest);
      
  //     if(!cadidate) return "Cadidate not existing"
  //     if(!cadidate.isActive) return "Cadidate not active"

  //     else{

  //       createTicketDto.namecontest = contest.name
  //       contest.totalCadidate++
        
  //     }

  //     if(checkTicket){

  //       return "Ticket existing"

  //     }else{

  //       let newTicket = await this.ticketEntity.save(createTicketDto)
  //       this.contestService.save(contest)
  //       return newTicket

  //     }
  // }


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
