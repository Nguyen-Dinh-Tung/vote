import { RoomTypes } from 'src/common/enum/io.room';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({
  name: 'rooms',
})
export class RoomEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    enum: RoomTypes,
    default: RoomTypes.single,
    type: 'enum',
  })
  type: RoomTypes;
  @Column({
    type: 'datetime',
    default: () => 'CURRENT_TIMESTAMP',
  })
  timeAt: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  timeOut: string;

  @Column({
    default: 'Default',
  })
  historyCreate: string;

  @Column({
    default: true,
  })
  isActive: boolean;

  @Column({
    default: 'single-room',
  })
  name: string;
}
