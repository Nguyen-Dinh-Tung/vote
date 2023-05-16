import { UserEntity } from '../../users/entities/user.entity';
import { RoomEntity } from '../../rooms/entities/rooms.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('rda')
export class RoomsDataEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    default: 'any',
  })
  message: string;

  @ManyToOne(() => RoomEntity, (room) => room.id)
  @JoinColumn()
  room: RoomEntity;

  @ManyToOne(() => UserEntity, (user) => user.id)
  @JoinColumn()
  user: UserEntity;

  @Column({
    default: true,
  })
  isActive: boolean;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  timeAt: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  timeChange: Date;
}
