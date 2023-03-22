import { IoEntity } from './io.entity';
import { Entity, JoinColumn, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('rooms')
export class RoomEntity {
    @PrimaryGeneratedColumn('uuid')
    id : string ;
}