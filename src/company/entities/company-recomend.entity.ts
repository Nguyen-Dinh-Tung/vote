import { Column, Entity, OneToOne, PrimaryGeneratedColumn, OneToMany, JoinColumn } from 'typeorm';
import { InheriTance } from "src/common/class/inheritance";
import { TicketEntity } from 'src/ticket/entities/ticket.entity';
import { CompanyEntity } from './company.entity';
@Entity({
    name : 'companyrem',
})
export class CompanyRecomend{
    @PrimaryGeneratedColumn('uuid')
    id : string ;
    @Column({
        default : true
    })

    @Column()
    slogan : string ;
    @Column()
    desc : string ;
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

    @Column({
        default : 'defaul'
    })
    @OneToOne(() => CompanyEntity , (company) => company.id)
    @JoinColumn()
    idCompany : string ;
}