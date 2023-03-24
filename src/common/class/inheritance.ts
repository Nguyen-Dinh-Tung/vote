
import { Column ,PrimaryGeneratedColumn ,Unique } from "typeorm";

export abstract class InheriTance{
    @PrimaryGeneratedColumn('uuid')
    id : string ;
    @Column()
    name : string ;
    @Column()
    address : string ;
    @Column({unique : true})
    email : string ;
    @Column({
        default : ''
    })
    background : string ;
    @Column({
        type : 'timestamp',
        default :() => 'CURRENT_TIMESTAMP'
    })
    timeAt : Date ;
    @Column({
        type : 'timestamp',
        default : () => 'CURRENT_TIMESTAMP'
    })
    timeOut : Date ;
    @Column({
        default : true
    })
    isActive : boolean;
    @Column({
        default : 'default'
    })
    historyCreate : string ;
    
    @Column({
        default : 'done'
    })
    userhistoryChange : string ;
    
}