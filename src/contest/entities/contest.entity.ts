import {  AssmCompanyEntity } from './../../assignment-company/entities/assignment-company.entity';
import { InheriTance } from "src/common/class/inheritance";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne } from "typeorm";
import { AssmContestEntity } from 'src/assignment-contest/entities/assignment-contest.entity';
import { ContestRecomendEntity } from './ContestRecomend.entity';

@Entity({
    name : 'co',
})
export class ContestEntity  extends InheriTance{

    @Column({default : 'defaul slogan'})
    slogan : string ;


    @Column({
        default : 0
    })
    totalCadidate  : number ;

    @OneToOne(() => ContestRecomendEntity , (rem) => rem.id)
    @JoinColumn()
    contestRem : ContestRecomendEntity
}