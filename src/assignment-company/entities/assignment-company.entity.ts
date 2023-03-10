import { JoinColumn, ManyToOne } from 'typeorm';
import { CompanyEntity } from './../../company/entities/company.entity';
import { ContestEntity } from './../../contest/entities/contest.entity';
import { InjectModel } from '@nestjs/mongoose';
import { TicketEntity } from 'src/ticket/entities/ticket.entity';
import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
@Entity({
    name : 'ascp',
})
export class AssmCompanyEntity {

    @PrimaryGeneratedColumn('uuid')
    id : string ;

    @ManyToOne(() => CompanyEntity , (cp) => cp.id)
    @JoinColumn()
    company : CompanyEntity;
 
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
