import { JoinColumn } from 'typeorm';
import { ContestEntity } from './../../contest/entities/contest.entity';
import { TicketEntity } from 'src/ticket/entities/ticket.entity';
import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
@Entity({
    name : 'assmcontest',
})
export class AssmContestEntity {

    @PrimaryGeneratedColumn('uuid')
    id : string ;

    @Column()
    @OneToOne(() => TicketEntity , (ticket) => ticket.id)
    @JoinColumn()
    idTicket : string;
    @Column()
    @OneToOne(() => ContestEntity , (contest) => contest.id)
    @JoinColumn()
    idContest : string;
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