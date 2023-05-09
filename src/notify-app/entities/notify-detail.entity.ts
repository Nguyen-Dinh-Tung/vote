import { UserEntity } from 'src/users/entities/user.entity';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { NotifyAppEntity } from './notify-app.entity';
import { NotifiTypes } from 'src/common/enum/type.notify';

@Entity('dnf')
export class DetailNotifyEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => UserEntity, (user) => user.id)
  @JoinColumn()
  reveice: UserEntity;

  @ManyToOne(() => NotifyAppEntity, (notify) => notify.id)
  @JoinColumn()
  notify: NotifyAppEntity;

  @Column({
    type: 'enum',
    enum: NotifiTypes,
    default: NotifiTypes.SERVER,
  })
  typeNotify: NotifiTypes;
  @Column({
    default: 'Hai',
  })
  content: string;
  @Column({
    default: false,
  })
  read: boolean;
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
