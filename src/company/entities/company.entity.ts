import { AssmCompanyEntity } from './../../assignment-company/entities/assignment-company.entity';
import { ContestEntity } from 'src/contest/entities/contest.entity';
import { InheriTance } from 'src/common/class/inheritance';
import { Column, Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { CompanyRecomend } from './company-recomend.entity';
@Entity({
    name : 'cp',
})
export class CompanyEntity extends InheriTance {
    @Column({
        default : 'Default'
    })
    historyChange  : string ;
    @Column({
        default : 'Default'
    })
    historyCreate  : string ;
    
    @OneToOne(() => CompanyRecomend , (rem) => rem.id )
    @JoinColumn()
    cpRem : CompanyRecomend  ;
}