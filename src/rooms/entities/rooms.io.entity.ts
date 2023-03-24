import { IoEntity } from '../../uio/entities/io.entity';
import { Entity, JoinColumn, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({
    name : 'rooms'
})
export class RoomEntity {
    @PrimaryGeneratedColumn('uuid')
    id : string ;
}