import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";


@Entity('uio')

export class UioEntity{

    @PrimaryGeneratedColumn('uuid')
    id : string ;

    @Column({
        default : 'default'
    })
    ioId : string ;
        
    @Column({
        default : true
    })
    isActive : boolean
}