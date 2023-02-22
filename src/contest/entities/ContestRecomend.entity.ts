import { Column, Entity, OneToOne, PrimaryGeneratedColumn, OneToMany, JoinColumn } from 'typeorm';
import { InheriTance } from "src/common/class/inheritance";
import { TicketEntity } from 'src/ticket/entities/ticket.entity';
import { ContestEntity } from './contest.entity';
@Entity({
    name : 'contestrem',
})
export class ContestRecomendEntity{
    @PrimaryGeneratedColumn('uuid')
    id : string ;
    @Column({
        default : true
    })
    isActive : boolean ;
    @Column({
        type : 'datetime' ,
        default :() => 'CURRENT_TIMESTAMP'
    })
    @Column()
    slogan : string ;
    @Column()
    desc : string ;
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

    @Column({
        default : 'defaul'
    })
    @OneToOne(() => ContestEntity , (contest) => contest.id)
    @JoinColumn()
    idContest : string ;
}