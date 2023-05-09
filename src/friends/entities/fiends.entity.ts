import { BaseEntity } from 'src/common/class/base.entity';
import { UserEntity } from 'src/users/entities/user.entity';
import { Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity('fri')
export class FriendsEntity extends BaseEntity {
  @ManyToOne(() => UserEntity, (user) => user.id)
  @JoinColumn()
  author: UserEntity;
  @ManyToOne(() => UserEntity, (user) => user.id)
  @JoinColumn()
  reveice: UserEntity;
}
