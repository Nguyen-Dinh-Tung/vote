import { IoEntity } from './io.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { RoomEntity } from './rooms.io.entity';

@Entity('cns')
export class ConnectIoEntity{
    @PrimaryGeneratedColumn('uuid')
    id : string ;
    
    @ManyToOne(() => IoEntity , (io) => io.id)
    @JoinColumn()
    io : IoEntity ;

    @ManyToOne(() => RoomEntity , (room) => room.id)
    @JoinColumn()
    room : RoomEntity
    
    @Column({
        default : true
    })
    isActive : boolean
}