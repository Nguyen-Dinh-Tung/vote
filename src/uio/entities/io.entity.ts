import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";


@Entity('io')

export class IoEntity{

    @PrimaryGeneratedColumn('uuid')
    id : string ;

    @Column({
        default : '-1'
    })
    ioId : string ;
        
    @Column({
        default : true
    })
    isActive : boolean

    @Column({
        default : false
    })
    isOnline : boolean ;

}