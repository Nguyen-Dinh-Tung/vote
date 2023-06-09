import { PrimaryGeneratedColumn, Entity } from 'typeorm';
import { Column } from 'typeorm';

@Entity({
  name: 'rtoken',
})
export class RtokenEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column()
  idUser: string;
  @Column()
  jwt: string;
  @Column()
  expiredTime: string;
  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  timeAt: string;
}
