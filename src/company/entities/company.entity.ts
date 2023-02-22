import { AssmCompanyEntity } from './../../assignment-company/entities/assignment-company.entity';
import { ContestEntity } from 'src/contest/entities/contest.entity';
import { InheriTance } from 'src/common/class/inheritance';
import { Column, Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';
@Entity({
    name : 'company',
})
export class CompanyEntity extends InheriTance {
    @Column()
    slogan : string ;
    @Column()
    business_segment : string ;
    @Column({
        default : 'Default'
    })
    historyChange  : string ;
    @Column({
        default : 'Default'
    })
    historyCreate  : string ;
    @Column()
    @OneToOne(() => AssmCompanyEntity , (assignmentCompany) => assignmentCompany.id)
    @JoinColumn()
    idAssmCp : string  ;

}