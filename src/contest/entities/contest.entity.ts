import {  AssmCompanyEntity } from './../../assignment-company/entities/assignment-company.entity';
import { InheriTance } from "src/common/class/inheritance";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne } from "typeorm";
import { AssmContestEntity } from 'src/assignment-contest/entities/assignment-contest.entity';

@Entity({
    name : 'contest',
})
export class ContestEntity  extends InheriTance{

    @Column({default : 'defaul slogan'})
    slogan : string ;

    @OneToOne(() => AssmCompanyEntity , (assignmentCompany) => assignmentCompany.idContest)
    @JoinColumn()
    idAssmCp : string ;

    @OneToOne(() => AssmContestEntity , (assignment) => assignment.id)
    @JoinColumn()
    idAssmCo : string ;

    @Column({
        default : 0
    })
    totalCadidate  : number ;


}