import { CompanyEntity } from './../../company/entities/company.entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { UserEntity } from 'src/users/entities/user.entity';
@Entity({
    name : 'ucp'
})
export class UserCp {
    @PrimaryGeneratedColumn('uuid')
    id : string ;
 
    @ManyToOne(() => CompanyEntity , (ca) => ca.id)
    @JoinColumn()
    company : CompanyEntity;
    

    @ManyToOne(() => UserEntity , (user) => user.id)
    @JoinColumn()
    user : UserEntity;
    
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