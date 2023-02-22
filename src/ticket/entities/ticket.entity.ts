import { JoinColumn } from 'typeorm';
import { AssmContestEntity } from 'src/assignment-contest/entities/assignment-contest.entity';
import { ManyToOne } from 'typeorm';
import { CandidateEntity } from './../../candidate/entities/candidate.entity';
import { ContestEntity } from './../../contest/entities/contest.entity';
import { PrimaryGeneratedColumn, Entity, CreateDateColumn, OneToOne } from 'typeorm';
import { Column } from 'typeorm';
import * as dayjs from 'dayjs'


@Entity({
    name : 'ticket',
})
export class TicketEntity {
    @PrimaryGeneratedColumn('uuid')
    id : string ;
    @Column()
    namecontest : string

    @Column()
    @OneToOne(() => AssmContestEntity , (assignmentContest) => assignmentContest.id)
    @JoinColumn()
    idAssigmentContest : string ;

    @Column()
    @OneToOne(() => CandidateEntity , (candidate) => candidate.id)
    @JoinColumn()
    idcadidate : string ;

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
