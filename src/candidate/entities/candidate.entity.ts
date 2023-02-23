import { Column, Entity, OneToOne, PrimaryGeneratedColumn, OneToMany, JoinColumn } from 'typeorm';
import { InheriTance } from "src/common/class/inheritance";
import { TicketEntity } from 'src/ticket/entities/ticket.entity';
import { candidateRecomendEntity } from './candidate-recomend.entity';
@Entity({
    name : 'ca',
})
export class CandidateEntity extends InheriTance{
    
    @Column({
        default : "Default"
    }) 
    idno : string ;

    @OneToOne(() => candidateRecomendEntity , (rem) => rem.id)
    @JoinColumn()
    candidateRem : candidateRecomendEntity ;
}