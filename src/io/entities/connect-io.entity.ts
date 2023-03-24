import { IoEntity } from './io.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { RoomEntity } from '../../rooms/entities/rooms.entity';
import { ChatTypes } from 'src/common/enum/io.room';

@Entity('cns')
export class ConnectIoEntity{
    @PrimaryGeneratedColumn('uuid')
    id : string ;
    
    @ManyToOne(() => IoEntity , (io) => io.id)
    @JoinColumn()
    io : IoEntity ;
    @Column({
        enum : ChatTypes ,
        default : ChatTypes.single ,
        type : 'enum'
    })
    type : ChatTypes
    @ManyToOne(() => RoomEntity , (room) => room.id)
    @JoinColumn()
    room : RoomEntity
    
    @Column({
        default : true
    })
    isActive : boolean
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
}