import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { TYPE_OTP } from '../enum/enum';
import { UserEntity } from 'src/users/entities/user.entity';

@Entity('token')
export class TokenEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  timeAt: Date;
  @Column({
    type: 'timestamp',
  })
  expired: Date;
  @Column({
    type: String,
  })
  code: string;
  @Column({
    type: Boolean,
    default: true,
  })
  isActive: boolean;
  @Column({
    enum: TYPE_OTP,
    type: 'enum',
  })
  type: TYPE_OTP;
  @ManyToOne(() => UserEntity, (user) => user.id)
  @JoinColumn()
  user: UserEntity;
}
