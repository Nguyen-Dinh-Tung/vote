import {
  Column,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
  OneToMany,
  JoinColumn,
} from 'typeorm';
@Entity({
  name: 'corem',
})
export class ContestRecomendEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    default: true,
  })
  isActive: boolean;

  @Column({
    type: 'datetime',
    default: () => 'CURRENT_TIMESTAMP',
  })
  @Column({
    default: 'default',
  })
  slogan: string;

  @Column({
    default: 'default',
  })
  descs: string;

  @Column({
    type: 'timestamp',
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
