import { JoinColumn, ManyToOne } from 'typeorm';
import { ContestEntity } from './../../contest/entities/contest.entity';
import { TicketEntity } from 'src/ticket/entities/ticket.entity';
import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
@Entity({
    name : 'asco',
})
export class AssmContestEntity {

    @PrimaryGeneratedColumn('uuid')
    id : string ;

    @OneToOne(() => TicketEntity , (tc) => tc.id)
    @JoinColumn()

    ticket : TicketEntity;
    @ManyToOne(() => ContestEntity , (co) => co.id)
    @JoinColumn()
    contest : ContestEntity;
    
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