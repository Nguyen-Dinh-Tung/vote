import { Column, Entity, OneToOne, PrimaryGeneratedColumn, OneToMany, JoinColumn } from 'typeorm';
import { InheriTance } from "src/common/class/inheritance";
import { TicketEntity } from 'src/ticket/entities/ticket.entity';
@Entity({
    name : 'candidate',
})
export class CandidateEntity extends InheriTance{
    
    @Column({
        default : "Default"
    }) 
    idno : string ;

    @Column({
        default : 'defaul'
    })
    @OneToOne(() => TicketEntity , (ticket) => ticket.idcadidate)
    @JoinColumn()
    idTicket : string ;
}