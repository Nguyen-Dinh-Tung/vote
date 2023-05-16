import { Roles } from './../../common/enum/role.enum';
import { JoinColumn } from 'typeorm';
import { ManyToOne } from 'typeorm';
import { CandidateEntity } from './../../candidate/entities/candidate.entity';
import { PrimaryGeneratedColumn, Entity } from 'typeorm';
import { Column } from 'typeorm';
import { UserEntity } from 'src/users/entities/user.entity';

@Entity({
  name: 'uca',
})
export class UserCa {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => CandidateEntity, (ca) => ca.id)
  @JoinColumn()
  candidate: CandidateEntity;

  @ManyToOne(() => UserEntity, (user) => user.id)
  @JoinColumn()
  user: UserEntity;

  @Column({
    default: Roles.ucp_user,
  })
  role: Roles;

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
