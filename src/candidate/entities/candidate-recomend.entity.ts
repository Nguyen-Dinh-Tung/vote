import { Column, Entity, OneToOne, PrimaryGeneratedColumn, OneToMany, JoinColumn } from 'typeorm';
import { InheriTance } from "src/common/class/inheritance";
import { TicketEntity } from 'src/ticket/entities/ticket.entity';
import { CandidateEntity } from './candidate.entity';
@Entity({
    name : 'carem',
})
export class CandidateRecomendEntity{
    @PrimaryGeneratedColumn('uuid')
    id : string ;

    @Column()
    slogan : string ;
    @Column()
    descs : string ;
    @Column({
        default : true
    })
    isActive : boolean ;
    @Column({
        type : 'datetime' ,
        default :() => 'CURRENT_TIMESTAMP'
    })
    timeAt : Date ;
    @Column({
        type : 'timestamp' ,
        default :() => 'CURRENT_TIMESTAMP'
    })
    timeOut : string ;
    @Column({
        default : 'Default'
    })
    historyCreate  : string ;
    @Column({
        default : 'This is active'
    })
    historyChange : string ;


}