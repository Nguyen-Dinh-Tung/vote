import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserEntity } from './user.entity';

@Entity('otp')
export class OtpEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ type: String })
  token: string;
  @OneToOne(() => UserEntity, (user) => user.id)
  user: UserEntity;
  @Column({
    type: 'timestamp',
  })
  timeAt: Date;
}
