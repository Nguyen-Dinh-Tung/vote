import { Column, Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { InheriTance } from 'src/common/class/inheritance';
import { Roles, FetureCode } from 'src/common/enum/role.enum';
import { IoEntity } from 'src/io/entities/io.entity';
@Entity({
  name: 'user',
})
export class UserEntity extends InheriTance {
  @Column({
    type: 'enum',
    enum: Roles,
    default: 'default',
  })
  role: Roles;

  @Column({
    type: 'enum',
    enum: FetureCode,
    default: 'def',
  })
  code: string;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @Column({
    default: 'Default',
  })
  historyChange: string;

  @OneToOne(() => IoEntity, (io) => io.id)
  @JoinColumn()
  io: IoEntity;
}
