import { UserEntity } from 'src/users/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({
  name: 'notify',
})
export class NotifyAppEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => UserEntity, (user) => user.id)
  @JoinColumn()
  author: UserEntity;

  @Column({
    default: true,
  })
  isActive: boolean;

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
    default: 'This is active',
  })
  historyChange: string;
}
