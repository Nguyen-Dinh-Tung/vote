import { Roles } from "src/common/enum/role.enum";
import { CompanyEntity } from "src/company/entities/company.entity";
import { ContestEntity } from "src/contest/entities/contest.entity";
import { UserEntity } from "src/users/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({
    name : 'uco'
})
export class UserCo {
    @PrimaryGeneratedColumn('uuid')
    id : string ;
 
    @ManyToOne(() => ContestEntity , (co) => co.id)
    @JoinColumn()
    contest : ContestEntity;
    

    @ManyToOne(() => UserEntity , (user) => user.id)
    @JoinColumn()
    user : UserEntity;
    
    @Column({
        type : 'enum',
        default : Roles.ucp_user,
        enum : Roles
    })
    role : Roles ;
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
